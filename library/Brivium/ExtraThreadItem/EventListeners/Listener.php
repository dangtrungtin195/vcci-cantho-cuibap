<?php

class Brivium_ExtraThreadItem_EventListeners_Listener extends Brivium_BriviumLibrary_EventListeners
{
	public static function loadClassController($class, &$extend)
	{
		switch($class){
			case 'XenForo_ControllerPublic_Thread':
				$extend[] = 'Brivium_ExtraThreadItem_ControllerPublic_Thread';
				break;
		}
	}
		
	public static function loadClassModel($class, &$extend)
	{
		switch($class){
			case 'XenForo_Model_Thread':
				$extend[] = 'Brivium_ExtraThreadItem_Model_Thread';
				break;
			case 'XenForo_Model_Node':
				$extend[] = 'Brivium_ExtraThreadItem_Model_Node';
				break;
			case 'XenForo_Model_Forum':
				$extend[] = 'Brivium_ExtraThreadItem_Model_Forum';
				break;
		}
	}
		
	public static function loadClassDataWriter($class, &$extend)
	{/* 
		switch($class){
			case 'XenForo_DataWriter_Discussion_Thread':
				$extend[] = 'Brivium_ExtraThreadItem_DataWriter_Discussion_Thread';
				break;
		} */
	}
	
	public static function templateCreate($templateName, array &$params, XenForo_Template_Abstract $template)
	{
		if ($template instanceof XenForo_Template_Admin)
		{
		}else{
			switch ($templateName) {
				case 'thread_view':
					$template->preloadTemplate('BRETI_message_below');
					break;
			}
		}
	}
	
	public static function templateHook($hookName, &$contents, array $hookParams, XenForo_Template_Abstract $template)
    {
		switch ($hookName) {
			case 'message_below':
				$newTemplate = $template->create('BRETI_' . $hookName, $template->getParams());
				$newTemplate->setParams($hookParams);
				$contents .= $newTemplate->render();
				break;
		}
		self::_templateHook($hookName, $contents, $hookParams, $template);
    }
	
	
}