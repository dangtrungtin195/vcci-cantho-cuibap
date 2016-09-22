<?php
/***
@Add-on name: Social Locker Intergrate
@Author: Nessien
@Version: 1.0
@Website: http://nessien.com
 ***/
class Nessien_SocialLockerIntergrate_Listener_Install
{
    public static function installer($installedAddon)
    {
        if (XenForo_Application::$versionId < 1020031)
        {
            // note: this can't be phrased
            throw new XenForo_Exception('This add-on requires XenForo 1.2.0 or higher.', true);
        }
    }

} // end class