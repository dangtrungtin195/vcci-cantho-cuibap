<?php

/**
 * Nightly rebuild of the sitemap for the site
 */
class XfAddOns_Sitemap_CronEntry_RebuildSitemap
{

	/**
	 * Static method called by the Cron Engine
	 */
	public static function run()
	{
		// disable limits if possible
		@set_time_limit(0);

		// start running
		if (!class_exists('DomDocument'))
		{
			throw new Exception('You don\'t seem to have the DOM module installed. Cannot continue');
		}

		$sitemap = new XfAddOns_Sitemap_Index();
		if (!$sitemap->isDirectoryWritable())
		{
			$directory = $sitemap->getBaseDirectory();
			throw new Exception('The path ' . $directory . ' is not writable. Maybe you need to chmod 777');
		}

		$sitemap->generate();
	}


}