<?php
class Brivium_ExtraThreadItem_ControllerPublic_Thread extends XFCP_Brivium_ExtraThreadItem_ControllerPublic_Thread
{
	protected function _getDefaultViewParams(array $forum, array $thread, array $posts, $page = 1, array $viewParams = array())
	{
		$viewParams = parent::_getDefaultViewParams($forum, $thread, $posts, $page, $viewParams);
		$extraThreadItems = array();
		if($this->_getThreadModel()->canViewExtraThreads($thread, $forum)){
			$extraThreadItems = $this->_getExtraThreadItemModel()->getExtraThreadItemForThread($thread);
		}
		return array(
			'extraThreadItems' => $extraThreadItems,
		) + $viewParams;
	}

	
	
	protected function _getExtraThreadItemModel()
	{
		return $this->getModelFromCache('Brivium_ExtraThreadItem_Model_ExtraThreadItem');
	}
}