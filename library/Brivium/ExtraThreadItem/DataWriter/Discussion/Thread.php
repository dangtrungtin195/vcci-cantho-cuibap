<?php

/**
* Data writer for threads.
*
* @package XenForo_Discussion
*/
class Brivium_ExtraThreadItem_DataWriter_Discussion_Thread extends XFCP_Brivium_ExtraThreadItem_DataWriter_Discussion_Thread
{
	protected function _getFields()
	{
		$fields = parent::_getFields();
		$fields['xf_thread']['breti_extra_cache'] 	= array('type' => self::TYPE_SERIALIZED, 'default' => '');
		return $fields;
	}
	public function save() {
		$save = parent::save();
		$GLOBALS['BRETI_ControllerPublic_Forum_actionAddThread'] = $this->get('thread_id');
		return $save;
	}
	
}