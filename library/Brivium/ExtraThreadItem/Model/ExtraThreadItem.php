<?php
class Brivium_ExtraThreadItem_Model_ExtraThreadItem extends XenForo_Model
{
	public function getExtraThreadItemForThread($thread)
	{
		if(empty($thread['thread_id'])) return array();
		
		$options = XenForo_Application::get('options');
		
		//$userId = XenForo_Visitor::getUserId();
		$userId = 0;
		$threadId = $thread['thread_id'];
		
		$GLOBALS['BRETI_ExtraThreadItem'] = true;
		$isUpdate = false;
		$extraRecord = $this->getExtraCache($threadId,$userId);
		$data = array();
		if(!empty($extraRecord['extra_cache'])){
			$isUpdate = true;
			$data = @unserialize($extraRecord['extra_cache']);
		}
		$update = false;
		
		$forceRebuild = false;
		$minuteRebuildCutoff = $options->BRETI_minuteRebuildCutoff;
		if(empty($data) ||empty($extraRecord['date_update']) || (!empty($extraRecord['date_update']) && $extraRecord['date_update'] < (XenForo_Application::$time - ($minuteRebuildCutoff * 60)))){
			$forceRebuild = true;
		}
		$olderOptions = $options->BRETI_olderThread;
		if(!empty($olderOptions['enable'])){
			if(!isset($data['olderThreads']) || $forceRebuild){
				$update = true;
				$data['olderThreads'] = $this->getExtraThreadItems($thread, 'olderThreads', $olderOptions);
			}
		}else{
			$data['olderThreads'] = array();
		}
		
		$newerOptions = $options->BRETI_newerThread;
		if(!empty($newerOptions['enable'])){
			if(!isset($data['newerThreads']) || $forceRebuild){
				$update = true;
				$data['newerThreads'] = $this->getExtraThreadItems($thread, 'newerThreads', $newerOptions);
			}
		}else{
			$data['newerThreads'] = array();
		}
		
		$latestOptions = $options->BRETI_latestThread;
		if(!empty($latestOptions['enable'])){
			if(!isset($data['latestThreads']) || $forceRebuild){
				$update = true;
				$data['latestThreads'] = $this->getExtraThreadItems($thread, 'latestThreads', $latestOptions);
			}
		}else{
			$data['latestThreads'] = array();
		}
		
		if($update){
			if(!$isUpdate){
				$this->insertExtraCache($threadId, $userId, XenForo_Application::$time, serialize($data));
			}else{
				$this->updateExtraCache($threadId, $userId, XenForo_Application::$time, serialize($data));
			}
		}
		
		$relatedOptions = $options->BRETI_relatedThread;
		if(!empty($relatedOptions['enable'])){
			if(!isset($data['relatedThreads']) || $forceRebuild){
				$update = true;
				$data['relatedThreads'] = $this->getRelatedThreads($thread, $relatedOptions);
			}
		}else{
			$data['relatedThreads'] = array();
		}
		$suggestedOptions = $options->BRETI_suggestedThread;
		if(!empty($suggestedOptions['enable'])){
			$data['suggestedThreads'] = $this->getExtraThreadItems($thread, 'suggestedThreads', $suggestedOptions);
		}
		return $data;
	}
	
   	protected function _getThreadFetchElements($thread, $extraOptions){
		$fetchOptions = array(
			'order' => 'post_date',
			'orderDirection' => 'desc',
			
		);
		$conditions = array(
			'BRETI_not_thread_id'	=>	$thread['thread_id'],
			'discussion_state'		=>	'visible',
			'not_discussion_type'		=>	'redirect',
		);
		$forumType = !empty($extraOptions['forum_type'])?$extraOptions['forum_type']:'parent';
		
		/* 
		$unviewableNodes = $this->_getUnviewableNode();
		$unviewableNodeIds = array_keys($unviewableNodes);
		 */
		if($forumType=='parent'){
			$conditions['node_id'] = $thread['node_id'];
		}
		else{
			//$conditions['BRETI_not_node_id'] = $unviewableNodeIds;
		} 
		
		$fetchOptions['limit'] = !empty($extraOptions['limit'])&&$extraOptions['limit']>0?$extraOptions['limit']:5;
		return array(
			'conditions' => $conditions,
			'options' => $fetchOptions
		);
		
	}
   
	public function getExtraThreadItems($thread, $type, $extraOptions)
	{
		$fetchElements = $this->_getThreadFetchElements($thread, $extraOptions);
		$conditions = $fetchElements['conditions'];
		$fetchOptions = $fetchElements['options'];
		
   	    $threadModel = $this->_getThreadModel();
		
		switch ($type)
		{
			case 'olderThreads':
				$conditions['post_date'] = array('<',$thread['post_date']);
				break;
			case 'newerThreads':
				$conditions['post_date'] = array('>',$thread['post_date']);
				$fetchOptions['orderDirection'] = 'asc';
				break;
			case 'latestThreads':
				//$fetchOptions['post_date'] = array('>',$thread['post_date']);
				break;
			case 'suggestedThreads':
				$fetchOptions['BRETI_orderRand'] = true;
				$fetchOptions['join'] = XenForo_Model_Thread::FETCH_USER;
				$threadIds = $threadModel->getRandomThreadIds($conditions, $fetchOptions);
				$conditions['BRETI_thread_id'] = $threadIds;
				$conditions['BRETI_not_thread_id'] = 0;
				break;
			default:
				return array();
		}
		
		$threads = $threadModel->getThreads($conditions, $fetchOptions);
		$threads = $this->prepareThreads($threads);
        return $threads;
   	}
	
	protected static  $_unviewableNode = null;
	
	protected function _getUnviewableNode()
	{
		if (!isset(self::$_unviewableNode)) {
			self::$_unviewableNode = $this->_getNodeModel()->getUnviewableNodeList();
		}
		return self::$_unviewableNode;
	}

	
	public function prepareThreads($threads) {
		if(!$threads)return array();
		$threadModel = $this->_getThreadModel();
		foreach($threads AS &$thread){
			$thread = $threadModel->bretiPrepareThread($thread);
		}
		return $threads;
	}
	
	
	
    public function getRelatedThreads($thread, $extraOptions)
	{
		$fetchElements = $this->_getThreadFetchElements($thread, $extraOptions);
		$conditions = $fetchElements['conditions'];
		$fetchOptions = $fetchElements['options'];
		
   	    $threadModel = $this->_getThreadModel();
		$threads = $threadModel->getRelatedThreads($conditions, $fetchOptions, $thread['title']);
		$threads = $this->prepareThreads($threads);
		
		return $threads;
	}
	
	
	
	public function insertExtraCache($threadId, $userId, $dateUpdate, $cacheData)
	{
		$this->_getDb()->query('
			INSERT INTO xf_brivium_extra_thread_item
				(thread_id, date_update, extra_cache, user_id)
			VALUES
				(?,?,?,?)
		', array($threadId, $dateUpdate, $cacheData, $userId));
		return true;
	}
	
	public function updateExtraCache($threadId, $userId, $dateUpdate, $cacheData)
	{
		$db = $this->_getDb();
		$condition = 'thread_id = ' . $db->quote($threadId) . ' AND user_id = ' . $db->quote($userId);
		$db->update('xf_brivium_extra_thread_item',
			array(
				'date_update' => $dateUpdate,
				'extra_cache' => $cacheData,
			),$condition
		);
		return true;
	}
	
	public function getExtraCache($threadId,$userId){
		return $this->_getDb()->fetchRow('
			SELECT *
			FROM xf_brivium_extra_thread_item
			WHERE  thread_id = ? AND user_id = ?
		', array($threadId, $userId));
	}
	
	
	protected function _getNodeModel()
	{
		return $this->getModelFromCache('XenForo_Model_Node');
	}
	protected function _getThreadModel()
	{
		return $this->getModelFromCache('XenForo_Model_Thread');
	}
    
}