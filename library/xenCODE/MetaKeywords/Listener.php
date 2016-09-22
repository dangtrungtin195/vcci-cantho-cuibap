<?php
class xenCODE_MetaKeywords_Listener {
	public static function template_create($templateName, array &$params, XenForo_Template_Abstract $template) {
		switch ($templateName) {
			case 'PAGE_CONTAINER':
			$template->preloadTemplate('xenCODE_Meta_Keywords');
			break;
		}
	}
	public static function template_render($name, &$contents, $params, XenForo_Template_Abstract $template) {
		if ($name == 'page_container_head') {
			$addtemplate = $template->create('xenCODE_Meta_Keywords', $template->getParams());
			$rendered = $addtemplate->render();
			
			$needle = '<meta name="description"';
			
			$contents = str_replace($needle, $rendered.'	'.$needle, $contents);
			return $contents;
		}
	}
}