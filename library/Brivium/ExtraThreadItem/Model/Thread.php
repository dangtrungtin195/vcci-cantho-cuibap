<?php
class Brivium_ExtraThreadItem_Model_Thread extends XFCP_Brivium_ExtraThreadItem_Model_Thread
{
	public function bretiPrepareThread(array $thread, array $nodePermissions = null, array $viewingUser = null) 
	{
		$forum = array(
			'node_id' => $thread['node_id'],
		);
		if (isset($thread['node_title']))
		{
			$forum['title'] = $thread['node_title'];
			$thread['forum'] = $forum;
		}

		$thread['title'] 			= XenForo_Helper_String::censorString($thread['title']);
		$thread['titleCensored'] 	= true;

		$options = XenForo_Application::get('options');
		if($options->BRETI_showPreview){
			$thread['hasPreview'] = $this->hasPreview($thread, $forum, $nodePermissions, $viewingUser);
		}
		return $thread;
	}
	
	public function prepareThreadConditions(array $conditions, array &$fetchOptions) 
	{
		$result = parent::prepareThreadConditions($conditions, $fetchOptions);
		
		$sqlConditions = array($result);
		$db = $this->_getDb();
		
		if (!empty($conditions['BRETI_thread_id']))
		{
			if (is_array($conditions['BRETI_thread_id']))
			{
				$sqlConditions[] = 'thread.thread_id IN (' . $db->quote($conditions['BRETI_thread_id']) . ')';
			}
			else
			{
				$sqlConditions[] = 'thread.thread_id = ' . $db->quote($conditions['BRETI_thread_id']);
			}
		}
		
		if (!empty($conditions['BRETI_not_thread_id']))
		{
			if (is_array($conditions['BRETI_not_thread_id']))
			{
				$sqlConditions[] = 'thread.thread_id NOT IN (' . $db->quote($conditions['BRETI_not_thread_id']) . ')';
			}
			else
			{
				$sqlConditions[] = 'thread.thread_id <> ' . $db->quote($conditions['BRETI_not_thread_id']);
			}
		}
		
		if (!empty($conditions['BRETI_not_node_id']))
		{
			if (is_array($conditions['node_id']))
			{
				$sqlConditions[] = 'thread.node_id NOT IN (' . $db->quote($conditions['BRETI_not_node_id']) . ')';
			}
			else
			{
				$sqlConditions[] = 'thread.node_id <> ' . $db->quote($conditions['BRETI_not_node_id']);
			}
		}
		if (count($sqlConditions) > 1) {
			return $this->getConditionsForClause($sqlConditions);
		} else {
			return $result;
		}
	}
	
	public function getRandomThreadIds(array $conditions, array $fetchOptions = array())
	{
		$fetchOptionsInner = array();
		$whereConditions = $this->prepareThreadConditions($conditions, $fetchOptionsInner);
		$sqlClauses = $this->prepareThreadFetchOptions($fetchOptionsInner);
		$limitOptions = $this->prepareLimitFetchOptions($fetchOptions);

		return $this->_getDb()->fetchCol($this->limitQueryResults(
			'
				SELECT thread.thread_id
				FROM xf_thread AS thread
				' . $sqlClauses['joinTables'] . '
				WHERE ' . $whereConditions . '
				ORDER BY RAND()
			', $limitOptions['limit'], $limitOptions['offset']
		));
	}
	
	public function prepareThreadFetchOptions(array $fetchOptions) 
	{
		$result = parent::prepareThreadFetchOptions($fetchOptions);
		extract($result);
		
		/* if (!empty($fetchOptions['BRETI_orderRand']))
		{
			$orderClause = 'ORDER BY rand()';
		} */
		return compact('selectFields' , 'joinTables', 'orderClause');
	}
	
	public function getRelatedThreads(array $conditions, array $fetchOptions = array(), $threadTitle)
	{
		$whereConditions = $this->prepareThreadConditions($conditions, $fetchOptions);

		$sqlClauses = $this->prepareThreadFetchOptions($fetchOptions);
		$limitOptions = $this->prepareLimitFetchOptions($fetchOptions);

		$db = $this->_getDb();
		
		$searchEffective = XenForo_Application::get('options')->BRETI_searchEffective;
		if($searchEffective){
			$query = $this->tokenizeQuery($threadTitle);
			if($query){
				$searchQuery = $this->parseTokenizedQuery($query);
			}else{
				$searchQuery = $threadTitle;
			}
			return $this->fetchAllKeyed($this->limitQueryResults(
				'
					SELECT thread.*
						' . $sqlClauses['selectFields'] . '
					FROM xf_search_index AS search_index
						LEFT JOIN xf_thread AS thread ON (thread.thread_id=search_index.content_id)
						' . $sqlClauses['joinTables'] . '
					WHERE ' . $whereConditions . '
					AND MATCH(search_index.title) AGAINST (? IN BOOLEAN MODE)
					AND search_index.content_type='.$db->quote('thread').'
					ORDER BY NULL
				', $limitOptions['limit'], $limitOptions['offset']
			),'thread_id', $searchQuery);
		}else{
			return $this->fetchAllKeyed($this->limitQueryResults(
			'
				SELECT thread.*
					' . $sqlClauses['selectFields'] . ',
				MATCH(search_index.title) AGAINST ('.$db->quote($threadTitle).' IN BOOLEAN MODE) AS similar_score
				FROM xf_search_index AS search_index
					LEFT JOIN xf_thread AS thread ON (thread.thread_id=search_index.content_id)
					' . $sqlClauses['joinTables'] . '
				WHERE ' . $whereConditions . '
				AND MATCH(search_index.title) AGAINST ('.$db->quote($threadTitle).' IN BOOLEAN MODE)
				AND search_index.content_type='.$db->quote('thread').'
				HAVING similar_score >= 1
				ORDER BY similar_score
			', $limitOptions['limit'], $limitOptions['offset']
		), 'thread_id');
		}
		
	}
	public function tokenizeQuery($query)
	{
		$query = str_replace(array('(', ')'), '', trim($query)); // don't support grouping yet

		preg_match_all('/
			(?<=[' . XenForo_Search_SourceHandler_MySqlFt::SPLIT_CHAR_RANGES .'\-\+\|]|^)
			(?P<modifier>\-|\+|\||)
			[' . XenForo_Search_SourceHandler_MySqlFt::SPLIT_CHAR_RANGES .']*
			(?P<term>"(?P<quoteTerm>[^"]+)"|[^' . XenForo_Search_SourceHandler_MySqlFt::SPLIT_CHAR_RANGES .'\-\+\|]+)
		/ix', $query, $matches, PREG_SET_ORDER);

		$output = array();
		$i = 0;

		$haveWords = false;
		$invalidWords = array();
		
		foreach ($matches AS $match)
		{
			$iStart = $i;

			if ($match['modifier'] == '|' && $i > 0 && $output[$i - 1][0] == '')
			{
				$output[$i - 1][0] = '|';
			}
			else if ($match['modifier'] == '|' && $i == 0)
			{
				$match['modifier'] = '';
			}

			$output[$i] = array($match['modifier'], $match['term']);

			if (!empty($match['quoteTerm']))
			{
				$words = $this->splitWords($match['quoteTerm']);
			}
			else
			{
				$words = $this->splitWords($match['term']);
			}

			foreach ($words AS $word)
			{
				if ($word === '')
				{
					continue;
				}

				if (utf8_strlen($word) < 4)
				{
					$invalidWords[] = $word;
				}
				else if (in_array($word, XenForo_Search_SourceHandler_MySqlFt::$stopWords))
				{
					$invalidWords[] = $word;
				}
				else
				{
					$haveWords = true;
				}
			}

			$i++;
		}

		if (!$haveWords)
		{
			return array();
		}

		return $output;
	}

	public function parseTokenizedQuery(array $query)
	{
		$output = '';
		foreach ($query AS $part)
		{
			if ($part[0] == '')
			{
				$part[0] = '+';
			}
			else if ($part[0] == '|')
			{
				$part[0] = ''; // default in mysql
			}

			$output .= ' ' . $part[0] . $part[1];
		}

		return trim($output);
	}
	
	public function splitWords($words)
	{
		// delimiters: 0 - 38, 40, 41, 43 - 47, 58 - 64, 91 - 94, 96, 123 - 127
		return preg_split('/[' . XenForo_Search_SourceHandler_MySqlFt::SPLIT_CHAR_RANGES . ']/', $words, -1, PREG_SPLIT_NO_EMPTY);
	}
	
	public function canViewExtraThreads(array $thread, array $forum, &$errorPhraseKey = '', array $nodePermissions = null, array $viewingUser = null)
	{
		$this->standardizeViewingUserReferenceForNode($thread['node_id'], $viewingUser, $nodePermissions);
		if (!XenForo_Permission::hasContentPermission($nodePermissions, 'BRETI_viewExtraThreads'))
		{
			return false;
		}
		
		return true;
	}

}