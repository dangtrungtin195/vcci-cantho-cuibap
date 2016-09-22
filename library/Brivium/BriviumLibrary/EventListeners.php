<?php

/**
 * Helper Brivium Addon for copyright.
 *
 * @package Brivium_BriviumLibrary
 */
class Brivium_BriviumLibrary_EventListeners
{
	protected static $_copyrightNotice = '';
	protected static $_setCopyright = null;
	
	protected static function _setCopyrightNotice($copyrightNotice = ''){
		if($copyrightNotice){
			self::$_copyrightNotice = (string) $copyrightNotice;
		}
	}
	protected static function _setCopyrightAddonList($copyrightNotice = ''){
		if($copyrightNotice){
			self::$_copyrightNotice = (string) $copyrightNotice;
		}
	}
	protected static function _templateHook($hookName, &$contents, array $hookParams, XenForo_Template_Abstract $template)
    {
		self::$_copyrightNotice = '';
		switch ($hookName) {
			case 'page_container_breadcrumb_bottom':
				if(self::$_copyrightNotice && self::$_setCopyright===null){
					$contents = $contents.self::$_copyrightNotice;
					self::$_setCopyright = true;
				}
				break;
		}
    }
	
}