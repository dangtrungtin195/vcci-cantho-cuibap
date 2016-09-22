<?php
class Brivium_ExtraThreadItem_Installer extends Brivium_BriviumLibrary_Installer
{	
	public static function getTables()
	{
		$tables = array();
		$tables['xf_brivium_extra_thread_item'] = "";
		return $tables;
	}
	public static function getAlters()
	{
		$alters = array();
		return $alters;
	}
	public static function getData()
	{
		$data = array();
		return $data;
	}
	
	public static function init()
	{
		self::$_tables = self::getTables();
		self::$_alters = self::getAlters();
		self::$_data = self::getData();
	}
	
	 public static function _nstall()
	{
		self::_getDb()->query(base64_decode("Q1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgYHhmX2JyaXZpdW1fZXh0cmFfdGhyZWFkX2l0ZW1gICgKICAgICAgIGB0aHJlYWRfaWRgIGludCgxMCkgdW5zaWduZWQgTk9UIE5VTEwgQVVUT19JTkNSRU1FTlQsCiAgICAgICBgZGF0ZV91cGRhdGVgIGludCgxMCkgdW5zaWduZWQgTk9UIE5VTEwgREVGQVVMVCAnMCcsCiAgICAgICBgZXh0cmFfY2FjaGVgIGxvbmd0ZXh0IE5PVCBOVUxMLAogICAgICAgYHVzZXJfaWRgIHZhcmNoYXIoMjU1KSBOT1QgTlVMTCBERUZBVUxUICcnLAoJIFBSSU1BUlkgS0VZIChgdGhyZWFkX2lkYCkKICAgICAgICkgRU5HSU5FPU15SVNBTSAgREVGQVVMVCBDSEFSU0VUPXV0ZjggQVVUT19JTkNSRU1FTlQ9MzMgOwoJICAg"));
	}
	
	public static function install($existingAddOn, $addOnData)
	{
		self::_nstall();
		self::_install($existingAddOn);
	}
	public static function uninstall()
	{
		self::init();
		self::_uninstall();
	}
}

?>