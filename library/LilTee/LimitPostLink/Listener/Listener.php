<?php

class LilTee_LimitPostLink_Listener_Listener
{
	
	public static function loadClassController($class, &$extend)
	{
		$classes = array(
			'ControllerPublic_Thread',
			'ControllerPublic_Forum',
			'ControllerPublic_Post',
		);
		foreach($classes AS $clas){
			if ($class == 'XenForo_' .$clas)
			{
				$extend[] = 'LilTee_LimitPostLink_' .$clas;
			}
		}
	}
	
}