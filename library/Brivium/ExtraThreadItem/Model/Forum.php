<?php

class Brivium_ExtraThreadItem_Model_Forum extends XFCP_Brivium_ExtraThreadItem_Model_Forum
{
	public function canViewForum(array $forum, &$errorPhraseKey = '', array $nodePermissions = null, array $viewingUser = null)
	{
		$canView = parent::canViewForum($forum, $errorPhraseKey, $nodePermissions, $viewingUser);
		if($canView && isset($GLOBALS['BRETI_ExtraThreadItem'])){
			$this->standardizeViewingUserReferenceForNode($forum['node_id'], $viewingUser, $nodePermissions);
			$canView = XenForo_Permission::hasContentPermission($nodePermissions, 'viewOthers');
		}
		return $canView;
	}

}