<?php

class LilTee_LimitPostLink_ControllerPublic_Thread extends XFCP_LilTee_LimitPostLink_ControllerPublic_Thread
{
    public function actionAddReply()
    {
		$this->_assertPostOnly();
		$input['message'] = $this->getHelper('Editor')->getMessageText('message', $this->_input);
		$input['message'] = XenForo_Helper_String::autoLinkBbCode($input['message']);
		
		//Lọc link diễn đàn
		$paths = XenForo_Application::get('requestPaths');
		$url = $paths['host'];
		$Homelink = array();
		$NotHomelink = array();
		preg_match_all('/\[url.*?\[\/url\]/i', $input['message'], $result);
		for ($i = 0; $i < count($result[0]); $i++)
		{
			if (substr_count($result[0][$i], $url) > 0)
			{
				$Homelink[] = $result[0][$i];
			}
			else
			{
				$NotHomelink[] = $result[0][$i];
			}
		}
		//Hết lọc link diễn đàn
		
		$countNotHomelink = count($NotHomelink);
		if ($countNotHomelink > 0)
		{
			$visitor = XenForo_Visitor::getInstance();
			$postLimit = XenForo_Permission::hasPermission($visitor['permissions'], 'general', 'LilTee_post_count');
			$linkLimit = XenForo_Permission::hasPermission($visitor['permissions'], 'general', 'LilTee_link_count');

			if ($postLimit && $postLimit > $visitor['message_count'])
			{
				if ($postLimit != '-1')
				{
					return $this->responseError(new XenForo_Phrase('LilTee_your_post_count_not_enough_to_post_link', array('post_limit'=>$postLimit)));
				}
			}
			
			if($linkLimit && $countNotHomelink > $linkLimit)
			{
				if ($linkLimit != '-1')
				{
					return $this->responseError(new XenForo_Phrase('LilTee_you_can_post_only_x_link', array('link_limit'=>$linkLimit)));
				}
			}
		}
		$response = parent::actionAddReply();
		
		return $response;
    }
	
}