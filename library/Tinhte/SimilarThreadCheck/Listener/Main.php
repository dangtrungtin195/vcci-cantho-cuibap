<?php

/**
 * Tinhte_SimilarThreadCheck Listener
 * @author dihuta
 * http://www.tinhte.vn
 */
 
class Tinhte_SimilarThreadCheck_Listener_Main
{
	public static function templateCreate(&$templateName, array &$params, XenForo_Template_Abstract $template)
	{
		switch ($templateName)
		{
			case "page_container_js_body":
			{
				$template->preloadTemplate('Tinhte_SimilarThreadCheck_thread.js');
				break;
			}
			case "page_container_head":
			{
				$template->preloadTemplate('Tinhte_SimilarThreadCheck_add_js_file');
				break;
			}
		}
	
	}
	
	public static function templateHook($name, &$contents, array $params, XenForo_Template_Abstract $template)
	{	
		switch ($name)
		{
			case "thread_create":
			{				
				//$content = str_replace('data-previewUrl', 'id="Tinhte_SimilarThreadCheck_div" data-previewUrl', $content);
				$contents = str_replace('<dl class="ctrlUnit fullWidth">', '<dl id="Tinhte_SimilarThreadCheck_div" class="ctrlUnit" style="width:90%"></dl><dl class="ctrlUnit fullWidth">', $contents);	
				break;
			}
			case "page_container_js_body":
			{
				$options = XenForo_Application::get('options');
				$uniqueID = $options->Tinhte_SimilarThreadCheck_GCSUniqueID;
				$outTemplate = $template->create('Tinhte_SimilarThreadCheck_thread.js', $params);
				$outTemplate->setParam('uniqueID', $uniqueID);
				$contents .= $outTemplate->render();
				break;
			}
			case "page_container_head":
			{
				$contents .= $template->create('Tinhte_SimilarThreadCheck_add_js_file', $params);
				break;
			}
		}
	}
}
