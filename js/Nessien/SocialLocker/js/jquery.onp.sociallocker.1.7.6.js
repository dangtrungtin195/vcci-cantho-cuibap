/*!
 * Social Locker - v1.7.6, 2014-09-11 
 * for jQuery: http://onepress-media.com/plugin/social-locker-for-jquery/get 
 * for Wordpress: http://onepress-media.com/plugin/social-locker-for-wordpress/get 
 * 
 * Copyright 2014, OnePress, http://byonepress.com 
 * Help Desk: http://support.onepress-media.com/ 
*/

/*!
 * Preset resources for Social Locker.
 */

(function ($) {

    /**
    * Text resources.
    */

    if (!$.onepress) $.onepress = {};
    if (!$.onepress.sociallocker) $.onepress.sociallocker = {};
    if (!$.onepress.sociallocker.lang) $.onepress.sociallocker.lang = {};
    
    $.onepress.sociallocker.lang = {
        defaultHeader:          "This content is locked!",
        defaultMessage:         "Please support us, use one of the buttons below to unlock the content.",
        orWait:                 'or wait',
        seconds:                's',   
        close:                  'Close',
        error:                  'error',  
        unableToLoadSDK:        'Unable to load SDK script for {0}. Please make sure that nothing blocks loading of social scripts in your browser. Some browser extentions (Avast, PrivDog, AdBlock etc.) can cause this issue. Turn them off and try again.',     
        unableToCreateButton:   'Unable to create the button ({0}). Please make sure that nothing blocks loading of social scripts in your browser. Some browser extentions (Avast, PrivDog, AdBlock etc.) can cause this issue. Turn them off and try again.',     
        
        emptyVKAppIdError:          'Please set your VKontakte App ID.',
        emptyVKGroupIdError:        'Please set your VKontakte Group ID that users should subscribe to.',
        invalidVKGroupIdError:      'Please check your VKontakte Group ID. It seems the given group does not exist.',
        emptyFBAppIdError:          'Please set your Facebook App ID.',
        emptyTwitterFollowUrlError: 'Please set an URL of your Twitter profile.', 
        
        // default button labels
        facebook_like:      'like us',
        facebook_share:     'share',
        twitter_tweet:      'tweet',  
        twitter_follow:     'follow us on twitter',  
        google_plus:        '+1 us', 
        google_share:       'share',
        linkedin_share:     'share'          
    };  
    
    
    /**
    * Presets options for styles.
    * You can add some options that will be applied when a specified theme is used.
    */

    if (!$.onepress.sociallocker.presets) $.onepress.sociallocker.presets = {};
    
    /* starter theme */

    $.onepress.sociallocker.presets['starter'] = {
        
        buttons: {
            layout: 'horizontal',
            counter: true
        },
        effects: {
            flip: false
        }
    };
    
    /* secrets theme */
    
    $.onepress.sociallocker.presets['secrets'] = {

        buttons: {
            layout: 'horizontal',
            counter: true
        },
        effects: {
            flip: true
        }
    };
    
    /* dandyish theme */
    
    $.onepress.sociallocker.presets['dandyish'] = {

        buttons: {
            layout: 'vertical',
            counter: true,
            unsupported: ['twitter-follow']
        },
        effects: {
            flip: false
        }
    };
    
    /* glass theme */
    
    $.onepress.sociallocker.presets['glass'] = {
        _iPhoneBug: false,
        
        buttons: {
            layout: 'horizontal',
            counter: true
        },
        effects: {
            flip: false
        }
    };
    
    /* secrets theme */
    
    $.onepress.sociallocker.presets['flat'] = {

        buttons: {
            layout: 'horizontal',
            counter: true
        },
        effects: {
            flip: true
        }
    };

})(jQuery);;
/*!
 * Facebook SDK Connector
 * Copyright 2014, OnePress, http://byonepress.com
*/
(function ($) {
    'use strict';

    if (!$.onepress) $.onepress = {};
    if (!$.onepress.sdk) $.onepress.sdk = {};

    $.onepress.sdk.facebook = $.onepress.sdk.facebook || {
        
        // a name of a social network
        name: 'facebook',
        
        // a script to load (v1.0)
        url1: '//connect.facebook.net/{lang}/all.js',
        
        // a script to load (v2.0)
        url2: '//connect.facebook.net/{lang}/sdk.js',    
        
        // a script id to set
        scriptId: 'facebook-jssdk',

        // a timeout to load
        timeout: 10000,
        
        /**
         * Returns true if an sdk is currently loaded.
         * 
         * @since 1.5.5
         * @returns boolean
         */
        isLoaded: function () {
            return (typeof (window.FB) === "object");
        },
        
        /**
         * Creates fb-root element before calling a Facebook sdk.
         * 
         * @since 1.5.5
         * @returns void
         */
        prepare: function () {

            // root for facebook sdk
            $("#fb-root").length === 0 && $("<div id='fb-root'></div>").appendTo($("body"));

            // sets sdk language
            var lang = (this.options && this.options.lang) || "en_US";
            
            this.url1 = this.url1.replace("{lang}", lang);
            this.url2 = this.url2.replace("{lang}", lang);
            
            this.url = this.options.version === 'v1.0' ? this.url1 : this.url2;
        },
        
        /**
         * Creates subscribers for Facebook evetns.
         * 
         * @returns void
         */
        createEvents: function () {
            var self = this;
            var isLoaded = this.isLoaded();
            
            var load = function () {

                window.FB.init({
                    appId: (self.options && self.options.appId) || null,
                    status: true,
                    cookie: true,
                    xfbml: true,
                    version: self.options.version
                });

                window.FB.Event.subscribe('edge.create', function (response) {
                    $(document).trigger('onp-sl-facebook-like', [response]);
                });

                // the initialization is executed only one time.
                // any others attempts will call an empty function.
                window.FB.init = function () { };
                $(document).trigger(self.name + '-init');
            };

            if (isLoaded) { load(); return; }

            if (window.fbAsyncInit) var predefined = window.fbAsyncInit;
            window.fbAsyncInit = function () {
                load(); predefined && predefined();
                window.fbAsyncInit = function () { };
            };
        }
    };

})(jQuery);;
/*!
 * Twitter SDK Connector
 * Copyright 2014, OnePress, http://byonepress.com
*/
(function ($) {
    'use strict';

    if (!$.onepress) $.onepress = {};
    if (!$.onepress.sdk) $.onepress.sdk = {};

    $.onepress.sdk.twitter = $.onepress.sdk.twitter || {
        
        // a name of a social network
        name: 'twitter',
        // a script to load
        url: '//platform.twitter.com/widgets.js',
        // a script id to set
        scriptId: 'twitter-wjs',
        // a timeout to load
        timeout: 10000,
        
        /**
         * Returns true if an sdk is currently loaded.
         * 
         * @since 1.5.5
         * @returns boolean
         */
        isLoaded: function () {
            return (typeof (window.__twttrlr) !== "undefined");
        },

        /**
         * Creates subscribers for Twitter events.
         * 
         * @returns void
         */
        createEvents: function () {
            var self = this;
            var isLoaded = this.isLoaded();
            
            var load = function () {
                
                /* The old workground for ie10+
                if ( $.onepress.browser.msie && ( $.onepress.browser.version === 11 || $.onepress.browser.version === 10 ) ) { 
                    window.twttr.events.bind('click', function (event) {
                        $(document).trigger('onp-sl-twitter-tweet', [event]);
                        $(document).trigger('onp-sl-twitter-follow', [event]);
                    });  
                } */
                
                window.twttr.events.bind('tweet', function (event) {
                    $(document).trigger('onp-sl-twitter-tweet', [event]);
                });

                window.twttr.events.bind('follow', function (event) {
                    $(document).trigger('onp-sl-twitter-follow', [event]);
                });

                $(document).trigger(self.name + '-init');
            };

            if (isLoaded) { load(); return; }

            if (!window.twttr) window.twttr = {};
            if (!window.twttr.ready) window.twttr = $.extend(window.twttr, { _e: [], ready: function (f) { this._e.push(f); } });
            
            twttr.ready(function (twttr) { load(); });
        }
    };

})(jQuery);;
/*!
 * Google SDK Connector
 * Copyright 2014, OnePress, http://byonepress.com
*/
(function ($) {
    'use strict';

    if (!$.onepress) $.onepress = {};
    if (!$.onepress.sdk) $.onepress.sdk = {};

    $.onepress.sdk.google = $.onepress.sdk.google || {
        
        // a name of a social network
        name: 'google',
        // a script to load
        url: '//apis.google.com/js/plusone.js',
        // a script id to set
        scriptId: 'google-jssdk',
        // a timeout to load
        timeout: 10000,
        
        /**
         * Returns true if an sdk is currently loaded.
         * 
         * @since 1.5.5
         * @returns boolean
         */
        isLoaded: function () {
            return (typeof (window.gapi) === "object");
        },

        /**
         * Creates a function for Google callbacks.
         * 
         * @since 1.5.5
         * @returns void
         */
        prepare: function () {
            
            // sets sdk language
            var lang = (this.options && this.options.lang) || "en";
            window.___gcfg = window.___gcfg || { lang: lang };

            window.onepressPlusOneCallback = function (data) {
                if (data.state === "on") $(document).trigger('onp-sl-google-plus', [data.href]);
            };
            
            window.onepressGoogleShareCallback = function (data) {
                $(document).trigger('onp-sl-google-share', [data.id]);
            };
        }
    };

})(jQuery);;
/*!
 * LinkedIn SDK Connector
 * Copyright 2014, OnePress, http://byonepress.com
*/
(function ($) {
    'use strict';

    if (!$.onepress) $.onepress = {};
    if (!$.onepress.sdk) $.onepress.sdk = {};

    $.onepress.sdk.linkedin = $.onepress.sdk.linkedin || {
        
        // a name of a social network
        name: 'linkedin',
        // a script to load
        url: '//platform.linkedin.com/in.js',
        // a script id to set
        scriptId: 'linkedin-jssdk',
        // a timeout to load
        timeout: 10000,
        
        /**
         * Returns true if an sdk is currently loaded.
         * 
         * @since 1.5.5
         * @returns boolean
         */
        isLoaded: function () {
            return (typeof (window.IN) === "object");
        },

        /**
         * Creates callback for linkedin.
         * 
         * @since 1.5.5
         * @returns void
         */
        prepare: function () {

            window.onepressLinkedInShareCallback = function (data) {
                $(document).trigger('onp-sl-linkedin-share', [data]);
            };

            // #SLJQ-26: A fix for the LinkedIn button.
            // Saves a link to the current share windlow.
            
            /**
            var funcOpen = window.open;
            window.open = function(url,name,params){
                
                var winref = funcOpen(url,name,params);
                if ( !winref ) return winref;
                
                var windowName = name || winref.name;
                if ( !windowName ) return winref;
                if ( windowName.substring(0,10) !== "easyXDM_IN" ) return winref;
                
                $.onepress.sdk.linkedin._activePopup = winref;
            }
            */
        }
    };

})(jQuery);;
/*!
 * Facebook Like Button
 * Copyright 2014, OnePress, http://byonepress.com
*/
(function ($) {
    'use strict';
    
    if ( !$.onepress.sociallocker.facebook ) $.onepress.sociallocker.facebook = {};
    $.onepress.sociallocker.facebook.like = {

        /**
         * Creats the Like button.
         */
        create: function( $where, options ) {

            var $button = {

                _defaults: {

                    // URL to like/share
                    url: null,

                    // App Id used to get extended contol tools (optionly).
                    // You can create your own app here: https://developers.facebook.com/apps	
                    appId: 0,               
                    // Language of the button labels. By default en_US.
                    lang: 'en_US',
                    // Button layout, available: standart, button_count, box_count. By default 'standart'.
                    layout: 'standart',
                    // Button container width in px, by default 450.
                    width: 'auto',
                    // The verb to display in the button. Only 'like' and 'recommend' are supported. By default 'like'.
                    verbToDisplay: "like",
                    // The color scheme of the plugin. By default 'light'.
                    colorScheme: "light",
                    // The font of the button. By default 'tahoma'.
                    font: 'tahoma',
                    // A label for tracking referrals.
                    ref: null,
                    // set to 'none' to hide the count box
                    count: 'standart',

                    // unlock event
                    unlock: null
                },

                getUrlToLike: function() {
                    return this.url;
                },

                _create: function () {
                    var self = this;

                    this._prepareOptions();
                    this._setupEvents();

                    this._createButton();

                    $.onepress.connector.connect("facebook", this.options, function () {

                        self.wrap.find('.fake-fb-like').addClass('fb-like');  
                        self.wrap.find('.fake-fb-share').addClass('fb-share-button');  
                        window.FB.XFBML.parse(self.wrap[0]);
                    });
                    
                    return true;
                },

                _prepareOptions: function () {

                    var values = $.extend({}, this._defaults);
                    this.options = $.extend(values, this.options);
                    this.url = this.options.url;
                },

                _setupEvents: function () {
                    var self = this;

                    $(document).bind('onp-sl-facebook-like', function (e, url) {
                        if (self.options.unlock && self.url === URL.normalize( url ) ) {
                            self.options.unlock("button");
                        }
                    });
                },

                /**
                * Generates an html code for the button using specified options.
                */
                _createButton: function () {
                    var self = this;

                    this.button = $("<div class='fake-fb-like' data-show-faces='false'></div>");

                    this.wrap = $("<div class='onp-social-button onp-facebook-button onp-facebook-like-button'></div>")
                                .appendTo(this.element)
                                .append(this.button);

                    if (this.options.count === 'none') {
                        this.wrap.addClass('onp-facebook-like-count-none');
                    }

                    this.wrap.addClass('onp-facebook-like-' + this.options.lang);

                    this.button.data('facebook-widget', this);
                    this.button.attr("data-show-faces", false);
                    this.button.attr("data-send", false); 

                    if (this.options.url) this.button.attr("data-href", this.options.url);
                    if (this.options.font) this.button.attr("data-font", this.options.font);
                    if (this.options.colorScheme) this.button.attr("data-colorscheme", this.options.colorScheme);
                    if (this.options.ref) this.button.attr("data-ref", this.options.ref);
                    if (this.options.width) this.button.attr("data-width", this.options.width);
                    if (this.options.layout) this.button.attr("data-layout", this.options.layout);
                    if (this.options.verbToDisplay) this.button.attr("data-action", this.options.verbToDisplay);  

                    this.button.data('url-to-verify', this.url);
                }
            };
            
            $button.element = $where;
            $button.options = options;
                    
            var result = $button._create();
            if ( !result ) return false;
            
            return $button;
        }
    };
    
})(jQuery);;
/*!
 * Facebook Share Button
 * Copyright 2014, OnePress, http://byonepress.com
*/
(function ($) {
    'use strict';
    
    if ( !$.onepress.sociallocker.facebook ) $.onepress.sociallocker.facebook = {};
    $.onepress.sociallocker.facebook.share = {
        
        /**
         * Creats the Share button.
         */
        create: function( $where, options, api ) {

            var $button = {

                _defaults: {

                    // URL to share
                    url: null,

                    // App Id used to get extended contol tools (optionly).
                    // You can create your own app here: https://developers.facebook.com/apps	
                    appId: 0,               
                    // button_count, button, box_count
                    layout: 'button',
                    // set to 'none' to hide the count box
                    count: 'standart',
                    // Language of the button labels. By default en_US.
                    lang: 'en_US',
                    // Button container width in px, by default 450.
                    width: 'auto',

                    // data to share
                    name: null,
                    caption: null,
                    description: null,
                    image: null,

                    // unlock event
                    unlock: null
                },

                _create: function () {
                    var self = this;

                    this._prepareOptions();
                    
                    if( !this.options.appId ) {
                        api.setButtonError( this.element, $.onepress.sociallocker.lang.emptyFBAppIdError );
                        return false;
                    }
                    
                    this._setupEvents();
                    this._createButton();

                    $.onepress.connector.connect("facebook", this.options, function () {

                        self.wrap.find('.fake-fb-like').addClass('fb-like');  
                        self.wrap.find('.fake-fb-share').addClass('fb-share-button');  
                        window.FB.XFBML.parse(self.wrap[0]);
                    });
                    
                    return true;
                },

                _prepareOptions: function () {

                    var values = $.extend({}, this._defaults);
                    this.options = $.extend(values, this.options);
                    this.url = URL.normalize( this.options.url || window.location.href );
                },

                _setupEvents: function () {
                    var self = this;

                    $(document).bind('onp-sl-facebook-share', function (e, url) {
                        if (self.options.unlock && self.url === URL.normalize( url ) ) {
                            self.options.unlock("button");
                        }
                    });
                },

                /**
                * Generates an html code for the button using specified options.
                */
                _createButton: function () {
                    var count = 0;
                    var self = this;

                    var self = this;

                    this.button = $("<div class='fake-fb-share' data-show-faces='false'></div>");

                    this.wrap = $("<div class='onp-social-button onp-facebook-button onp-facebook-share-button'></div>")
                                .appendTo(this.element)
                                .append(this.button);

                    if (this.options.count === 'none') {
                        this.wrap.addClass('onp-facebook-share-count-none');
                    }

                    this.wrap.addClass('onp-facebook-share-' + this.options.lang);

                    this.button.data('facebook-widget', this);

                    if (this.options.url) this.button.attr("data-href", this.options.url);
                    if (this.options.width) this.button.attr("data-width", this.options.width);
                    if (this.options.layout) { 
                        this.button.attr("data-layout", this.options.layout); 
                        this.button.attr("data-type", this.options.layout); 
                    }

                    var overlay = $("<div class='onp-facebook-share-button-overlay'></div>").appendTo(this.wrap);

                    overlay.click(function(){
                        FB.ui(
                        {
                             method: 'feed',
                             name: self.options.name,
                             link: self.url,
                             picture: self.options.image,
                             caption: self.options.caption,
                             description: self.options.description
                        },
                        function(response) {
                            if (response && response.post_id) {
                               $(document).trigger('onp-sl-facebook-share', [self.url]);
                            }
                        }
                        );                
                        return false;
                    });
                }
            };
            
            $button.element = $where;
            $button.options = options;
                    
            var result = $button._create();
            if ( !result ) return false;
            
            return $button;
        }
    };
  
})(jQuery);;
/*!
 * Twitter Button widget for jQuery
 * Copyright 2013, OnePress, http://byonepress.com
*/

(function ($) {
    'use strict';
    
    if ( !$.onepress.sociallocker.twitter ) $.onepress.sociallocker.twitter = {};
    $.onepress.sociallocker.twitter.button = {
        
        /**
         * Creats the Like button.
         */
        create: function( $where, options, api ) {

            var $button = {
                
                _defaults: {

                    // URL of the page to share.
                    url: null,
                    // tweet or follow button
                    type: null,

                    // Default Tweet text
                    // [tweet]
                    text: null,
                    // Screen name of the user to attribute the Tweet to
                    // [tweet]
                    via: null,
                    // The user's screen name shows up by default, but you can opt not to 
                    // show the screen name in the button. 
                    // [follow]
                    showScreenName: false,
                    // Related accounts
                    // [tweet]
                    related: null,
                    // Count box position (none, horizontal, vertical)
                    // [tweet]
                    count: 'horizontal',
                    // Followers count display
                    // [follow]
                    showCount: true,
                    // The language for the Tweet Button
                    // [tweet][follow]
                    lang: 'en',
                    // URL to which your shared URL resolves
                    // [tweet]
                    counturl: null,
                    // The size of the rendered button (medium, large)
                    size: 'large',

                    // unlock event
                    unlock: null
                },

                _create: function () {
                    var self = this;

                    this._prepareOptions();
                    
                    if ( this.options.type === 'follow' ) {
                        if ( !this.options.url || this.options.url.indexOf("twitter") === -1 ) {
                            api.setButtonError( this.element, $.onepress.sociallocker.lang.emptyTwitterFollowUrlError );
                            return false;
                        }
                    }
                    
                    this._setupEvents();
                    this._createButton();

                    $.onepress.connector.connect("twitter", this.options, function () {

                        var $html = self.wrap;
                        var attemptCounter = 5;

                        // Chrome fix
                        // If there is SDK script on the same page that is loading now when a tweet button will not appear.
                        // Setup special timeout function what will check 5 times when we can render the twitter button.
                        var timoutFunction = function () {
                            if ($html.find('iframe').length > 0) return;

                            if (window.twttr.widgets && window.twttr.widgets.load) {
                                window.twttr.widgets.load($html[0]);
                                self.element.trigger('tw-render');
                            } else {
                                if (attemptCounter <= 0) return;
                                attemptCounter--;

                                setTimeout(function () {
                                    timoutFunction();
                                }, 1000);
                            }
                        };

                        timoutFunction();
                    });
                    
                    return true;
                },

                _prepareOptions: function () {

                    var values = $.extend({}, this._defaults);

                    for (var prop in this._defaults) {
                        if (this.element.data(prop) !== undefined) values[prop] = this.element.data(prop);
                    }

                    this.options = $.extend(values, this.options);

                    if (!this.options.url && $("link[rel='canonical']").length > 0)
                        this.options.url = $("link[rel='canonical']").attr('href');

                    this.url = URL.normalize( this.options.url || window.location.href );

                },

                _setupEvents: function () {
                    var self = this;

                    $(document).bind('onp-sl-twitter-tweet', function (e, data) {
                        if ( !data || !data.target ) return;
                        if (self.options.type !== 'tweet') return;

                        var url = URL.normalize( $(data.target).parents(".onp-social-button").attr('data-url-to-compare') );
                        if (self.url === url && self.options.unlock) self.options.unlock && self.options.unlock("button");
                    });

                    $(document).bind('onp-sl-twitter-follow', function (e, data) {
                        if ( !data || !data.target ) return;
                        if (self.options.type !== 'follow') return;

                        var url = URL.normalize( $(data.target).parents(".onp-social-button").attr('data-url-to-compare') );
                        if (self.url === url && self.options.unlock) self.options.unlock && self.options.unlock("button");
                    });   
                },

                /**
                * Generates an html code for the button using specified options.
                */
                _createButton: function () {

                    // What will title be used?
                    var title = '';

                    this.button = $("<a href='https://twitter.com/share'>" + title + "</a>");
                    this.button.data('twitter-widget', this);

                    this.wrap = $("<div class='onp-social-button onp-twitter-button'></div>")
                                .appendTo(this.element);

                    if (this.options.type === 'tweet') {
                        this.wrap.addClass('onp-twitter-tweet');
                        this.button.addClass('twitter-share-button');
                    }
                    if (this.options.type === 'follow') {
                        this.wrap.addClass('onp-twitter-follow');
                        this.button.addClass('twitter-follow-button');
                    }

                    if (this.options.type === 'follow') this.button.attr('href', this.url);
                    else this.button.attr("data-url", this.url);

                    this.button.attr("data-show-count", this.options.showCount);
                    if (this.options.via) this.button.attr("data-via", this.options.via);
                    if (this.options.text) this.button.attr("data-text", this.options.text);
                    if (this.options.related) this.button.attr("data-related", this.options.related);
                    if (this.options.count) this.button.attr("data-count", this.options.count);
                    if (this.options.showCount) this.button.attr("data-show-count", this.options.showCount); 
                    if (this.options.lang) this.button.attr("data-lang", this.options.lang);
                    if (this.options.counturl) this.button.attr("data-counturl", this.options.counturl);
                    if (this.options.hashtags) this.button.attr("data-hashtags", this.options.hashtags);
                    if (this.options.alignment) this.button.attr("data-alignment", this.options.alignment);
                    if (this.options.size) this.button.attr("data-size", this.options.size);
                    if (this.options.dnt) this.button.attr("data-dnt", this.options.dnt);
                    if (this.options.showScreenName) this.button.attr("data-show-screen-name", this.options.showScreenName);

                    this.wrap.attr('data-url-to-compare', this.url);
                    this.wrap.append(this.button);
                }
            };
            
            $button.element = $where;
            $button.options = options;
                    
            var result = $button._create();
            if ( !result ) return false;
            
            return $button;
        }
    };
    
    $.onepress.sociallocker.twitter.tweet = $.extend({}, $.onepress.sociallocker.twitter.button);
    $.onepress.sociallocker.twitter.tweet.create = function ( $where, options, api ){
        options.type = 'tweet';
        return $.onepress.sociallocker.twitter.button.create( $where, options, api );  
    };
    
    $.onepress.sociallocker.twitter.follow = $.extend({}, $.onepress.sociallocker.twitter.button);
    $.onepress.sociallocker.twitter.follow.create = function ( $where, options, api ){
        options.type = 'follow';
        return $.onepress.sociallocker.twitter.button.create( $where, options, api );  
    };

})(jQuery);;
/*!
 * Google Plus One
 * Copyright 2013, OnePress, http://byonepress.com
*/
(function ($) {
    'use strict';
    
    if ( !$.onepress.sociallocker.google ) $.onepress.sociallocker.google = {};
    $.onepress.sociallocker.google.button = {
        
        /**
         * Creats the Like button.
         */
        create: function( $where, options ) {

            var $button =  {

                _defaults: {

                    // URL to plus one
                    url: null,
                    // plus or share
                    type: null,

                    // Language of the button labels. By default en-US.
                    // https://developers.google.com/+/plugins/+1button/#available-languages
                    lang: 'en-US',
                    // small, medium, standard, tall (https://developers.google.com/+/plugins/+1button/#button-sizes)
                    size: null,
                    // Sets the annotation to display next to the button.
                    annotation: null,
                    // Button container width in px, by default 450.
                    width: null,
                    // Sets the horizontal alignment of the button assets within its frame.
                    align: "left",
                    // Sets the preferred positions to display hover and confirmation bubbles, which are relative to the button.
                    // comma-separated list of top, right, bottom, left
                    expandTo: "",
                    // To disable showing recommendations within the +1 hover bubble, set recommendations to false.    
                    recommendations: true,
                    // Events
                    unlock: null
                },

                _create: function () {
                    var self = this;

                    this._prepareOptions();
                    this._setupEvents();

                    this._createButton();

                    $.onepress.connector.connect("google", this.options, function () {

                        setTimeout(function () {
                            var $html = self.wrap;

                            var plusone = $html.find('.fake-g-plusone');
                            if ( plusone.length > 0 ) {
                                self._addCallbackToControl($html);
                                plusone.addClass('g-plusone');
                                window.gapi.plusone.go($html[0]);
                                return;
                            }

                            var share = $html.find('.fake-g-share');
                            if ( share.length > 0 ) {
                                share.attr("data-onendinteraction", "onepressGoogleShareCallback");
                                share.addClass('g-plus').attr('data-action', 'share');

                                window.gapi.plus.go($html[0]);
                                return;
                            }

                        }, 100);
                    });
                    
                    return true;
                },

                _prepareOptions: function () {

                    var values = $.extend({}, this._defaults);
                    this.options = $.extend(values, this.options);
                    this.url = URL.normalize( this.options.url || window.location.href );
                },

                _setupEvents: function () {
                    var self = this;

                    if ( this.options.type === 'plus' ) {

                        $(document).bind('onp-sl-google-plus', function (e, url) {
                            $(".gc-bubbleDefault").hide();
                            if (self.options.unlock && (self.url == URL.normalize( url ) )) {
                                self.options.unlock("button");
                            }
                        });
                    }

                    if ( this.options.type === 'share' ) {
                        $(document).bind('onp-sl-google-share', function (e, url) {
                            $(".gc-bubbleDefault").hide();
                            if (self.options.unlock && (self.url == URL.normalize( url ) )) {
                                self.options.unlock("button");
                            }
                        });  
                    }     
                },

                /**
                * Generates an html code for the button using specified options.
                */
                _createButton: function () {

                    this.button = ( this.options.type == 'plus' )
                                        ? $("<div class='fake-g-plusone'></div>")
                                        : $("<div class='fake-g-share'></div>");

                    this.wrap = $("<div class='onp-social-button onp-google-button'></div>")
                                .appendTo(this.element)
                                .append(this.button);

                    this.button.data('google-widget', this);

                    if (this.options.url) this.button.attr("data-href", this.options.url);
                    if (this.options.size) this.button.attr("data-size", this.options.size);
                    if (this.options.annotation) this.button.attr("data-annotation", this.options.annotation);
                    if (this.options.align) this.button.attr("data-align", this.options.align);
                    if (this.options.expandTo) this.button.attr("data-expandTo", this.options.expandTo);
                    if (this.options.recommendations) this.button.attr("data-recommendations", this.options.recommendations);
                },

                _addCallbackToControl: function ($control) {

                    var $elm = (!$control.is(".g-plusone")) ? $control.find(".fake-g-plusone") : $control;

                    var callback = $elm.attr("data-callback");
                    if (callback && callback !== "onepressPlusOneCallback") {
                        var newCallback = "__plusone_" + callback;
                        window[newCallback] = function (data) {
                            window[callback](data);
                            window.onepressPlusOneCallback(data);
                        };
                        $elm.attr("data-callback", newCallback);
                    } else {
                        $elm.attr("data-callback", "onepressPlusOneCallback");
                    }
                }
            };
            
            $button.element = $where;
            $button.options = options;
                    
            var result = $button._create();
            if ( !result ) return false;
            
            return $button;
        }
    };
    
    $.onepress.sociallocker.google.plus = $.extend({}, $.onepress.sociallocker.google.button);
    $.onepress.sociallocker.google.plus.create = function ( $where, options ){
        options.type = 'plus';
        return $.onepress.sociallocker.google.button.create( $where, options );  
    };
    
    $.onepress.sociallocker.google.share = $.extend({}, $.onepress.sociallocker.google.button);
    $.onepress.sociallocker.google.share.create = function ( $where, options ){
        options.type = 'share';
        return $.onepress.sociallocker.google.button.create( $where, options );
    };

})(jQuery);;
/*!
 * LinkedIn Share Button widget for jQuery
 * Copyright 2013, OnePress, http://byonepress.com
*/

(function ($) {
    'use strict';
    
    if ( !$.onepress.sociallocker.linkedin ) $.onepress.sociallocker.linkedin = {};
    $.onepress.sociallocker.linkedin.share = {
          
        /**
         * Returns verification data to check whether the button is created.
         */
        getVerificationData: function( options ) {
            return {
                container: '.IN-widget',
                timeout: 5000
            };
        },
        
        /**
         * Creats the Like button.
         */
        create: function( $where, options ) {

            var $button = {

                _defaults: {

                    // URL of the page to share.
                    url: null,

                    // Count box position (none, horizontal, vertical)
                    // [tweet]
                    counter: 'right',

                    // unlock event
                    unlock: null
                },

                _create: function () {
                    var self = this;

                    this._prepareOptions();
                    this._setupEvents();
                    this._createButton();

                    $.onepress.connector.connect("linkedin", this.options, function () { 
                       IN.init();
                       if ( IN.parse ) IN.parse(self.element[0]);
                    });
                    
                    return true;
                },

                _prepareOptions: function () {

                    var values = $.extend({}, this._defaults);

                    for (var prop in this._defaults) {
                        if (this.element.data(prop) !== undefined) values[prop] = this.element.data(prop);
                    }

                    this.options = $.extend(values, this.options);
                    this.url = URL.normalize( this.options.url || window.location.href );

                },

                _setupEvents: function () {
                    var self = this;

                    // #SLJQ-26: A fix for the LinkedIn button.
                    // We unlock content after closing the share dialog.

                    /**
                    this.element.bind('onp-sl-button-created', function(){
                        self.wrap.find(".IN-widget").click(function(){
                            setTimeout(function(){

                                if ( !$.onepress.sdk.linkedin._activePopup ) return;
                                var winref = $.onepress.sdk.linkedin._activePopup;
                                $.onepress.sdk.linkedin._activePopup = false;

                                // waiting until the window is closed
                                var pollTimer = setInterval(function() {
                                    if ( !winref || winref.closed !== false ) {
                                        clearInterval(pollTimer);
                                        $(document).trigger('onp-sl-linkedin-share', [self.url]);
                                    }
                                }, 200);
                            }, 200);
                        });
                    });
                    */

                    $(document).bind('onp-sl-linkedin-share', function (e, url) {
                        console.log('onp-sl-linkedin-share');
                        if (self.url === URL.normalize( url ) && self.options.unlock) 
                            self.options.unlock && self.options.unlock("button");
                    });
                },

                /**
                * Generates an html code for the button using specified options.
                */
                _createButton: function () {
                    var self = this;

                    this.button = $('<script type="IN/Share" data-onsuccess="onepressLinkedInShareCallback" data-success="onepressLinkedInShareCallback" data-onSuccess="onepressLinkedInShareCallback"></script>');
                    if (this.options.counter) this.button.attr("data-counter", this.options.counter);
                    if (this.options.url) this.button.attr("data-url", this.url);

                    this.wrap = $("<div class='onp-social-button onp-linkedin-button'></div>")
                                .appendTo(this.element)
                                .append(this.button);

                }
            };
            
            $button.element = $where;
            $button.options = options;
                    
            var result = $button._create();
            if ( !result ) return false;
            
            return $button;
        }
    };
})(jQuery);
;
/*!
 * API Functions for Social Locker.
 */

(function ($) {

    if (!$.onepress.sociallocker) $.onepress.sociallocker = {};

    /**
     * Registers a new button available to use.
     */
    $.onepress.sociallocker.registerButton = $.onepress.sociallocker.registerButton || function( sourceName, title ) {
        if ( !title ) return;
        
        var parts = sourceName.split('-');
        var networkName = parts.length === 2 ? parts[0] : null;
        var buttonName = parts.length === 2 ? parts[1] : parts[0];
        
        if ( networkName ) $.onepress.sociallocker.lang[networkName + "_" + buttonName] = title;
        else $.onepress.sociallocker.lang[buttonName] = title;
    };

})(jQuery);;
/*!
 * Helper Tools.
 * Copyright 2013, OnePress, http://byonepress.com
 */

(function ($) {
    'use strict';

    if (!$.onepress) $.onepress = {};
    if (!$.onepress.tools) $.onepress.tools = {};

    /*
    * Cookie's function.
    * Allows to set or get cookie.
    *
    * Based on the plugin jQuery Cookie Plugin
    * https://github.com/carhartl/jquery-cookie
    *
    * Copyright 2011, Klaus Hartl
    * Dual licensed under the MIT or GPL Version 2 licenses.
    * http://www.opensource.org/licenses/mit-license.php
    * http://www.opensource.org/licenses/GPL-2.0
    */
    $.onepress.tools.cookie = $.onepress.tools.cookie || function (key, value, options) {

        // Sets cookie
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '',
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // Gets cookie.
        options = value || {};
        var decode = options.raw ? function (s) { return s; } : decodeURIComponent;

        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key) return decode(pair[1] || '');
        }
        return null;
    };

    /*
    * jQuery MD5 Plugin 1.2.1
    * https://github.com/blueimp/jQuery-MD5
    *
    * Copyright 2010, Sebastian Tschan
    * https://blueimp.net
    *
    * Licensed under the MIT license:
    * http://creativecommons.org/licenses/MIT/
    * 
    * Based on
    * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
    * Digest Algorithm, as defined in RFC 1321.
    * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
    * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
    * Distributed under the BSD License
    * See http://pajhome.org.uk/crypt/md5 for more info.
    */
    $.onepress.tools.hash = $.onepress.tools.hash || function (str) {

        var hash = 0;
        if (!str || str.length === 0) return hash;
        for (var i = 0; i < str.length; i++) {
            var charCode = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + charCode;
            hash = hash & hash;
        }
        hash = hash.toString(16);
        hash = hash.replace("-", "0");

        return hash;
    };

    /**
    * Checks does a browers support 3D transitions:
    * https://gist.github.com/3794226
    */
    $.onepress.tools.has3d = $.onepress.tools.has3d || function () {

        var el = document.createElement('p'),
            has3d,
            transforms = {
                'WebkitTransform': '-webkit-transform',
                'OTransform': '-o-transform',
                'MSTransform': '-ms-transform',
                'MozTransform': '-moz-transform',
                'Transform': 'transform'
            };

        // Add it to the body to get the computed style
        document.body.insertBefore(el, null);

        for (var t in transforms) {
            if (el.style[t] !== undefined) {
                el.style[t] = 'translate3d(1px,1px,1px)';
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }

        document.body.removeChild(el);
        return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
    };
    

    /**
    * Checks does a brower support Blur filter.
    */
    $.onepress.tools.canBlur = $.onepress.tools.canBlur || function () {
        
        var el = document.createElement('div');
        el.style.cssText = _browserPrefixes.join('filter' + ':blur(2px); ');
        var result = !!el.style.length && ((document.documentMode === undefined || document.documentMode > 9));
        if ( result ) return true;
        
        try {
          result = typeof SVGFEColorMatrixElement !== undefined &&
            SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE == 2;
        } catch (e) {}
        
        return result;
    };

    /**
    * Returns true if a current user use a touch device
    * http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
    */
    $.onepress.isTouch = $.onepress.isTouch || function () {

        return !!('ontouchstart' in window) // works on most browsers 
            || !!('onmsgesturechange' in window); // works on ie10
    };

    /**
    * OnePress Widget Factory.
    * Supports:
    * - creating a jquery widget via the standart jquery way
    * - call of public methods.
    */
    $.onepress.widget = function (pluginName, pluginObject) {

        var factory = {

            createWidget: function (element, options) {
                var widget = $.extend(true, {}, pluginObject);

                widget.element = $(element);
                widget.options = $.extend(true, widget.options, options);

                if (widget._init) widget._init();
                if (widget._create) widget._create();

                $.data(element, 'plugin_' + pluginName, widget);
            },

            callMethod: function (widget, methodName) {
                return widget[methodName] && widget[methodName]();
            }
        };

        $.fn[pluginName] = function () {
            var args = arguments;
            var argsCount = arguments.length;

            var toReturn = this;

            this.each(function () {

                var widget = $.data(this, 'plugin_' + pluginName);

                // a widget is not created yet
                if (!widget && argsCount <= 1) {
                    factory.createWidget(this, argsCount ? args[0] : false);

                    // a widget is created, the public method with no args is being called
                } else if (argsCount == 1) {
                    toReturn = factory.callMethod(widget, args[0]);
                }
            });
            
            return toReturn;
        };
    };
    
    $.onepress.detectBrowser = $.onepress.detectBrowser || function(){
        
        var uaMatch = jQuery.uaMatch || function( ua ) {
            ua = ua.toLowerCase();

            var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
                    /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
                    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
                    /(msie) ([\w.]+)/.exec( ua ) ||
                    ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
                    [];

            return {
                    browser: match[ 1 ] || "",
                    version: match[ 2 ] || "0"
            };
        };

	var matched = uaMatch( navigator.userAgent );
	$.onepress.browser = {};
        
 	if ( matched.browser ) {
            $.onepress.browser[ matched.browser ] = true;
            $.onepress.browser.version = matched.version;
	}
        
        function getInternetExplorerVersion()
        {
            var rv = -1;
            if (navigator.appName == 'Microsoft Internet Explorer')
            {
                var ua = navigator.userAgent;
                var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) != null) rv = parseFloat( RegExp.$1 );
            }
            else if (navigator.appName == 'Netscape')
            {
                var ua = navigator.userAgent;
                var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) != null) rv = parseFloat( RegExp.$1 );
            }
            return rv;
        }
        
        var ieVersion = getInternetExplorerVersion();
        if ( ieVersion > 0 ) {
            $.onepress.browser.msie = true;
            $.onepress.browser.version = ieVersion;
        }

	// Chrome is Webkit, but Webkit is also Safari.
	if ( $.onepress.browser.chrome ) {
            $.onepress.browser.webkit = true;
	} else if ( $.onepress.browser.webkit ) {
            $.onepress.browser.safari = true;
	}
    }
    
    $.onepress.detectBrowser();

})(jQuery);;
/*!
 * URL.js
 * Copyright 2011 Eric Ferraiuolo
 * https://github.com/ericf/urljs
 */

/**
 * URL constructor and utility.
 * Provides support for validating whether something is a URL,
 * formats and cleans up URL-like inputs into something nice and pretty,
 * ability to resolve one URL against another and returned the formatted result,
 * and is a convenient API for working with URL Objects and the various parts of URLs.
 *
 * @constructor URL
 * @param       {String | URL}  url - the URL String to parse or URL instance to copy
 * @return      {URL}           url - instance of a URL all nice and parsed
 */
var URL = function () {

    var u = this;

    if ( ! (u && u.hasOwnProperty && (u instanceof URL))) {
        u = new URL();
    }

    return u._init.apply(u, arguments);
};

(function(){

var ABSOLUTE            = 'absolute',
    RELATIVE            = 'relative',

    HTTP                = 'http',
    HTTPS               = 'https',
    COLON               = ':',
    SLASH_SLASH         = '//',
    AT                  = '@',
    DOT                 = '.',
    SLASH               = '/',
    DOT_DOT             = '..',
    DOT_DOT_SLASH       = '../',
    QUESTION            = '?',
    EQUALS              = '=',
    AMP                 = '&',
    HASH                = '#',
    EMPTY_STRING        = '',

    TYPE                = 'type',
    SCHEME              = 'scheme',
    USER_INFO           = 'userInfo',
    HOST                = 'host',
    PORT                = 'port',
    PATH                = 'path',
    QUERY               = 'query',
    FRAGMENT            = 'fragment',

    URL_TYPE_REGEX      = /^(?:(https?:\/\/|\/\/)|(\/|\?|#)|[^;:@=\.\s])/i,
    URL_ABSOLUTE_REGEX  = /^(?:(https?):\/\/|\/\/)(?:([^:@\s]+:?[^:@\s]+?)@)?((?:[^;:@=\/\?\.\s]+\.)+[A-Za-z0-9\-]{2,})(?::(\d+))?(?=\/|\?|#|$)([^\?#]+)?(?:\?([^#]+))?(?:#(.+))?/i,
    URL_RELATIVE_REGEX  = /^([^\?#]+)?(?:\?([^#]+))?(?:#(.+))?/i,

    OBJECT              = 'object',
    STRING              = 'string',
    TRIM_REGEX          = /^\s+|\s+$/g,

    trim, isObject, isString;


// *** Utilities *** //

trim = String.prototype.trim ? function (s) {
    return ( s && s.trim ? s.trim() : s );
} : function (s) {
    try {
        return s.replace(TRIM_REGEX, EMPTY_STRING);
    } catch (e) { return s; }
};

isObject = function (o) {
    return ( o && typeof o === OBJECT );
};

isString = function (o) {
    return typeof o === STRING;
};


// *** Static *** //

/**
 *
 */
URL.ABSOLUTE = ABSOLUTE;

/**
 *
 */
URL.RELATIVE = RELATIVE;

/**
 *
 */
URL.normalize = function (url) {
    return new URL(url).toString();
};

/**
 * Returns a resolved URL String using the baseUrl to resolve the url against.
 * This attempts to resolve URLs like a browser would on a web page.
 *
 * @static
 * @method  resolve
 * @param   {String | URL}  baseUrl     - the URL String, or URL instance as the resolving base
 * @param   {String | URL}  url         - the URL String, or URL instance to resolve
 * @return  {String}        resolvedUrl - a resolved URL String
 */
URL.resolve = function (baseUrl, url) {
    return new URL(baseUrl).resolve(url).toString();
};


// *** Prototype *** //

URL.prototype = {

    // *** Lifecycle Methods *** //

    /**
     * Initializes a new URL instance, or re-initializes an existing one.
     * The URL constructor delegates to this method to do the initializing,
     * and the mutator instance methods call this to re-initialize when something changes.
     *
     * @protected
     * @method  _init
     * @param   {String | URL}  url - the URL String, or URL instance
     * @return  {URL}           url - instance of a URL all nice and parsed/re-parsed
     */
    _init : function (url) {

        this.constructor = URL;

        url = isString(url) ? url : url instanceof URL ? url.toString() : null;

        this._original  = url;
        this._url       = {};
        this._isValid   = this._parse(url);

        return this;
    },

    // *** Object Methods *** //

    /**
     * Returns the formatted URL String.
     * Overridden Object toString method to do something useful.
     *
     * @public
     * @method  toString
     * @return  {String}    url - formatted URL string
     */
    toString : function () {

        var url         = this._url,
            urlParts    = [],
            type        = url[TYPE],
            scheme      = url[SCHEME],
            path        = url[PATH],
            query       = url[QUERY],
            fragment    = url[FRAGMENT];

        if (type === ABSOLUTE) {
            urlParts.push(
                scheme ? (scheme + COLON + SLASH_SLASH) : SLASH_SLASH,
                this.authority()
            );
            if (path && path.indexOf(SLASH) !== 0) {    // this should maybe go in _set
                path = SLASH + path;
            }
        }

        urlParts.push(
            path,
            query ? (QUESTION + this.queryString()) : EMPTY_STRING,
            fragment ? (HASH + fragment) : EMPTY_STRING
        );

        return urlParts.join(EMPTY_STRING);
    },

    // *** Accessor/Mutator Methods *** //

    original : function () {
        return this._original;
    },

    /**
     * Whether parsing from initialization or re-initialization produced something valid.
     *
     * @public
     * @method  isValid
     * @return  {Boolean}   valid   - whether the URL is valid
     */
    isValid : function () {
        return this._isValid;
    },

    /**
     * URL is absolute if it has a scheme or is scheme-relative (//).
     *
     * @public
     * @method  isAbsolute
     * @return  {Boolean}   absolute    - whether the URL is absolute
     */
    isAbsolute : function () {
        return this._url[TYPE] === ABSOLUTE;
    },

    /**
     * URL is relative if it host or path relative, i.e. doesn't contain a host.
     *
     * @public
     * @method  isRelative
     * @return  {Boolean}   relative    - whether the URL is relative
     */
    isRelative : function () {
        return this._url[TYPE] === RELATIVE;
    },

    /**
     * URL is host relative if it's relative and the path begins with '/'.
     *
     * @public
     * @method  isHostRelative
     * @return  {Boolean}   hostRelative    - whether the URL is host-relative
     */
     isHostRelative : function () {
        var path = this._url[PATH];
        return ( this.isRelative() && path && path.indexOf(SLASH) === 0 );
     },

    /**
     * Returns the type of the URL, either: URL.ABSOLUTE or URL.RELATIVE.
     *
     * @public
     * @method  type
     * @return  {String}    type    - the type of the URL: URL.ABSOLUTE or URL.RELATIVE
     */
    type : function () {
        return this._url[TYPE];
    },

    /**
     * Returns or sets the scheme of the URL.
     * If URL is determined to be absolute (i.e. contains a host) and no scheme is provided,
     * the scheme will default to http.
     *
     * @public
     * @method  scheme
     * @param   {String}        scheme  - Optional scheme to set on the URL
     * @return  {String | URL}  the URL scheme or the URL instance
     */
    scheme : function (scheme) {
        return ( arguments.length ? this._set(SCHEME, scheme) : this._url[SCHEME] );
    },

    /**
     * Returns or set the user info of the URL.
     * The user info can optionally contain a password and is only valid for absolute URLs.
     *
     * @public
     * @method  userInfo
     * @param   {String}        userInfo    - Optional userInfo to set on the URL
     * @return  {String | URL}  the URL userInfo or the URL instance
     */
    userInfo : function (userInfo) {
        return ( arguments.length ? this._set(USER_INFO, userInfo) : this._url[USER_INFO] );
    },

    /**
     * Returns or sets the host of the URL.
     * The host name, if set, must be something valid otherwise the URL will become invalid.
     *
     * @public
     * @method  host
     * @param   {String}        host    - Optional host to set on the URL
     * @return  {String | URL}  the URL host or the URL instance
     */
    host : function (host) {
        return ( arguments.length ? this._set(HOST, host) : this._url[HOST] );
    },

    /**
     * Returns the URL's domain, where the domain is the TLD and SLD of the host.
     * e.g. foo.example.com -> example.com
     *
     * @public
     * @method  domain
     * @return  {String}    domain  - the URL domain
     */
    domain : function () {
        var host = this._url[HOST];
        return ( host ? host.split(DOT).slice(-2).join(DOT) : undefined );
    },

    /**
     * Returns or sets the port of the URL.
     *
     * @public
     * @method  port
     * @param   {Number}        port    - Optional port to set on the URL
     * @return  {Number | URL}  the URL port or the URL instance
     */
    port : function (port) {
        return ( arguments.length ? this._set(PORT, port) : this._url[PORT] );
    },

    /**
     * Returns the URL's authority which is the userInfo, host, and port combined.
     * This only makes sense for absolute URLs
     *
     * @public
     * @method  authority
     * @return  {String}    authority   - the URL's authority (userInfo, host, and port)
     */
    authority : function () {

        var url         = this._url,
            userInfo    = url[USER_INFO],
            host        = url[HOST],
            port        = url[PORT];

        return [

            userInfo ? (userInfo + AT) : EMPTY_STRING,
            host,
            port ? (COLON + port) : EMPTY_STRING,

        ].join(EMPTY_STRING);
    },

    /**
     * Returns or sets the path of the URL.
     *
     * @public
     * @method  path
     * @param   {String}        path    - Optional path to set on the URL
     * @return  {String | URL}  the URL path or the URL instance
     */
    path : function (path) {
        return ( arguments.length ? this._set(PATH, path) : this._url[PATH] );
    },

    /**
     * Returns or sets the query of the URL.
     * This takes or returns the parsed query as an Array of Arrays.
     *
     * @public
     * @method  query
     * @param   {Array}         query   - Optional query to set on the URL
     * @return  {Array | URL}   the URL query or the URL instance
     */
    query : function (query) {
        return ( arguments.length ? this._set(QUERY, query) : this._url[QUERY] );
    },

    /**
     * Returns or sets the query of the URL.
     * This takes or returns the query as a String; doesn't include the '?'
     *
     * @public
     * @method  queryString
     * @param   {String}        queryString - Optional queryString to set on the URL
     * @return  {String | URL}  the URL queryString or the URL instance
     */
    queryString : function (queryString) {

        // parse and set queryString
        if (arguments.length) {
            return this._set(QUERY, this._parseQuery(queryString));
        }

        queryString = EMPTY_STRING;

        var query = this._url[QUERY],
            i, len;

        if (query) {
            for (i = 0, len = query.length; i < len; i++) {
                queryString += query[i].join(EQUALS);
                if (i < len - 1) {
                    queryString += AMP;
                }
            }
        }

        return queryString;
    },

    /**
     * Returns or sets the fragment on the URL.
     * The fragment does not contain the '#'.
     *
     * @public
     * @method  fragment
     * @param   {String}        fragment    - Optional fragment to set on the URL
     * @return  {String | URL}  the URL fragment or the URL instance
     */
    fragment : function (fragment) {
        return ( arguments.length ? this._set(FRAGMENT, fragment) : this._url[FRAGMENT] );
    },

    /**
     * Returns a new, resolved URL instance using this as the baseUrl.
     * The URL passed in will be resolved against the baseUrl.
     *
     * @public
     * @method  resolve
     * @param   {String | URL}  url - the URL String, or URL instance to resolve
     * @return  {URL}           url - a resolved URL instance
     */
    resolve : function (url) {

        url = (url instanceof URL) ? url : new URL(url);

        var resolved, path;

        if ( ! (this.isValid() && url.isValid())) { return this; } // not sure what to do???

        // the easy way
        if (url.isAbsolute()) {
            return ( this.isAbsolute() ? url.scheme() ? url : new URL(url).scheme(this.scheme()) : url );
        }

        // the hard way
        resolved = new URL(this.isAbsolute() ? this : null);

        if (url.path()) {

            if (url.isHostRelative() || ! this.path()) {
                path = url.path();
            } else {
                path = this.path().substring(0, this.path().lastIndexOf(SLASH) + 1) + url.path();
            }

            resolved.path(this._normalizePath(path)).query(url.query()).fragment(url.fragment());

        } else if (url.query()) {
            resolved.query(url.query()).fragment(url.fragment());
        } else if (url.fragment()) {
            resolved.fragment(url.fragment());
        }

        return resolved;
    },

    /**
     * Returns a new, reduced relative URL instance using this as the baseUrl.
     * The URL passed in will be compared to the baseUrl with the goal of
     * returning a reduced-down URL to one that’s relative to the base (this).
     * This method is basically the opposite of resolve.
     *
     * @public
     * @method  reduce
     * @param   {String | URL}  url - the URL String, or URL instance to resolve
     * @return  {URL}           url - the reduced URL instance
     */
    reduce : function (url) {

        url = (url instanceof URL) ? url : new URL(url);

        var reduced = this.resolve(url);

        if (this.isAbsolute() && reduced.isAbsolute()) {
            if (reduced.scheme() === this.scheme() && reduced.authority() === this.authority()) {
                reduced.scheme(null).userInfo(null).host(null).port(null);
            }
        }

        return reduced;
    },

    // *** Private Methods *** //

    /**
     * Parses a URL into usable parts.
     * Reasonable defaults are applied to parts of the URL which weren't present in the input,
     * e.g. 'http://example.com' -> { type: 'absolute', scheme: 'http', host: 'example.com', path: '/' }
     * If nothing or a falsy value is returned, the URL wasn't something valid.
     *
     * @private
     * @method  _parse
     * @param   {String}    url     - the URL string to parse
     * @param   {String}    type    - Optional type to seed parsing: URL.ABSOLUTE or URL.RELATIVE
     * @return  {Boolean}   parsed  - whether or not the URL string was parsed
     */
    _parse : function (url, type) {

        // make sure we have a good string
        url = trim(url);
        if ( ! (isString(url) && url.length > 0)) {
            return false;
        }

        var urlParts, parsed;

        // figure out type, absolute or relative, or quit
        if ( ! type) {
            type = url.match(URL_TYPE_REGEX);
            type = type ? type[1] ? ABSOLUTE : type[2] ? RELATIVE : null : null;
        }

        switch (type) {

            case ABSOLUTE:
                urlParts = url.match(URL_ABSOLUTE_REGEX);
                if (urlParts) {
                    parsed              = {};
                    parsed[TYPE]        = ABSOLUTE;
                    parsed[SCHEME]      = urlParts[1] ? urlParts[1].toLowerCase() : undefined;
                    parsed[USER_INFO]   = urlParts[2];
                    parsed[HOST]        = urlParts[3].toLowerCase();
                    parsed[PORT]        = urlParts[4] ? parseInt(urlParts[4], 10) : undefined;
                    parsed[PATH]        = urlParts[5] || SLASH;
                    parsed[QUERY]       = this._parseQuery(urlParts[6]);
                    parsed[FRAGMENT]    = urlParts[7];
                }
                break;

            case RELATIVE:
                urlParts = url.match(URL_RELATIVE_REGEX);
                if (urlParts) {
                    parsed              = {};
                    parsed[TYPE]        = RELATIVE;
                    parsed[PATH]        = urlParts[1];
                    parsed[QUERY]       = this._parseQuery(urlParts[2]);
                    parsed[FRAGMENT]    = urlParts[3];
                }
                break;

            // try to parse as absolute, if that fails then as relative
            default:
                return ( this._parse(url, ABSOLUTE) || this._parse(url, RELATIVE) );
                break;

        }

        if (parsed) {
            this._url = parsed;
            return true;
        } else {
            return false;
        }
    },

    /**
     * Helper to parse a URL query string into an array of arrays.
     * Order of the query paramerters is maintained, an example structure would be:
     * queryString: 'foo=bar&baz' -> [['foo', 'bar'], ['baz']]
     *
     * @private
     * @method  _parseQuery
     * @param   {String}    queryString - the query string to parse, should not include '?'
     * @return  {Array}     parsedQuery - array of arrays representing the query parameters and values
     */
    _parseQuery : function (queryString) {

        if ( ! isString(queryString)) { return; }

        queryString = trim(queryString);

        var query       = [],
            queryParts  = queryString.split(AMP),
            queryPart, i, len;

        for (i = 0, len = queryParts.length; i < len; i++) {
            if (queryParts[i]) {
                queryPart = queryParts[i].split(EQUALS);
                query.push(queryPart[1] ? queryPart : [queryPart[0]]);
            }
        }

        return query;
    },

    /**
     * Helper for mutators to set a new URL-part value.
     * After the URL-part is updated, the URL will be toString'd and re-parsed.
     * This is a brute, but will make sure the URL stays in sync and is re-validated.
     *
     * @private
     * @method  _set
     * @param   {String}    urlPart - the _url Object member String name
     * @param   {Object}    val     - the new value for the URL-part, mixed type
     * @return  {URL}       this    - returns this URL instance, chainable
     */
    _set : function (urlPart, val) {

        this._url[urlPart] = val;

        if (val                     && (
            urlPart === SCHEME      ||
            urlPart === USER_INFO   ||
            urlPart === HOST        ||
            urlPart === PORT        )){
            this._url[TYPE] = ABSOLUTE; // temp, set this to help clue parsing
        }
        if ( ! val && urlPart === HOST) {
            this._url[TYPE] = RELATIVE; // temp, no host means relative
        }

        this._isValid = this._parse(this.toString());

        return this;
    },

    /**
     * Returns a normalized path String, by removing ../'s.
     *
     * @private
     * @method  _normalizePath
     * @param   {String}    path            — the path String to normalize
     * @return  {String}    normalizedPath  — the normalized path String
     */
    _normalizePath : function (path) {

        var pathParts, pathPart, pathStack, normalizedPath, i, len;

        if (path.indexOf(DOT_DOT_SLASH) > -1) {

            pathParts = path.split(SLASH);
            pathStack = [];

            for ( i = 0, len = pathParts.length; i < len; i++ ) {
                pathPart = pathParts[i];
                if (pathPart === DOT_DOT) {
                    pathStack.pop();
                } else if (pathPart) {
                    pathStack.push(pathPart);
                }
            }

            normalizedPath = pathStack.join(SLASH);

            // prepend slash if needed
            if (path[0] === SLASH) {
                normalizedPath = SLASH + normalizedPath;
            }

            // append slash if needed
            if (path[path.length - 1] === SLASH && normalizedPath.length > 1) {
                normalizedPath += SLASH;
            }

        } else {

            normalizedPath = path;

        }

        return normalizedPath;
    }

};

}());;
/*!
 * SDK Connector for social networks.
 * Copyright 2014, OnePress, http://byonepress.com
*/
(function ($) {
    'use strict';

    if (!$.onepress) $.onepress = {};
    $.onepress.connector = $.onepress.connector || {

   /**
    * Contains dictionary sdk_name => is_sdk_ready (bool)
    * 
    * @since 1.0.0
    * @return object
    */
    _ready: {},

   /**
    * Contains dictionaty sdk_name => is_sdk_connected (bool)
    * 
    * @since 1.0.0
    * @return object
    */
    _connected: {},

   /**
    * Get a SDK object by its name.
    * 
    * @since 1.0.0
    * @return object
    */
    getSDK: function (name) {
        if ( $.onepress.sdk[name] ) return $.onepress.sdk[name];
        return null;
    },

   /**
    * Checks whether a specified SDK is connected (sdk script is included into a page).
    * 
    * @since 1.0.0
    * @return object
    */
    isConnected: function (sdk) {
        if ( $("#" + sdk.scriptId).length > 0 ) return true;

        var found = false;
        $("script").each(function(){
            var src = $(this).attr('src');
            if ( !src ) return true;
            
            found = src.indexOf(sdk.url) !== -1;
            if ( found ) { 
                $(this).attr('id', sdk.scriptId);
                return false;
            }
        });
        return found;
    },

   /**
    * Gets loading SDK script on a page.
    * 
    * @since 1.0.0
    * @return object
    */
    getLoadingScript: function (sdk) {

        var byId = $("#" + sdk.scriptId);
        var byScr = $("script[src='*" + sdk.url + "']");
        return (byId.length > 0) ? byId : byScr;
    },

   /**
    * Checks whether a specified SQK is loaded and ready to use.
    * 
    * @since 1.0.0
    * @return object
    */
    isLoaded: function (sdk) {
        return this.isConnected(sdk) && sdk.isLoaded && sdk.isLoaded();
    },

    /**
    * Connects SKD if it's needed then calls callback.
    */
    connect: function (name, options, callback) {
        var self = this, sdk = this.getSDK(name);

        if (!sdk) {
            console && console.log('Invalide SDK name: ' + name);
            return;
        }

        sdk.options = options;
        
        // fire or bind callback
        if (callback) this._ready[name]
                ? callback(sdk)
                : $(document).bind(name + "-init", function () { callback(sdk); });

        if (this._connected[name]) return;

        // sets the default method if it's not specified
        if (!sdk.createEvents) {

            sdk.createEvents = function () {
                var isLoaded = sdk.isLoaded();

                var load = function () {
                    $(document).trigger(sdk.name + '-init');
                };

                if (isLoaded) { load(); return; }

                $(document).bind(sdk.name + "-script-loaded", function () {
                    load();
                });
            };
        }

        if (sdk.prepare) sdk.prepare();

        var loaded = sdk.isLoaded();
        var connected = this.isConnected(sdk);

        $(document).bind(name + "-init", function () { self._ready[name] = true; });
        
        // subscribes to events
        sdk.createEvents();

        // conencts sdk
        if (!connected) {

            var scriptConnection = function () {

                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.id = sdk.scriptId;
                script.src = sdk.url;
                
                var scriptContent = ( sdk.getScriptBody ) ? sdk.getScriptBody() : null;
                if ( scriptContent ) script.innerHtml = scriptContent;

                var bodyElement = document.getElementsByTagName('body')[0];
                bodyElement.appendChild(script);
            };

            scriptConnection();
        }

        // subsribes to onload event
        if (!loaded) {

            var loadingScript = this.getLoadingScript(sdk)[0];

            if (loadingScript) {
                loadingScript.onreadystatechange = loadingScript.onload = function () {
                    var state = loadingScript.readyState;                  
                    if ((!state || /loaded|complete/.test(state))) {
                        $(document).trigger(sdk.name + '-script-loaded');
                        $(document).unbind(sdk.name + '-script-loaded');
                    }
                };
            }
        }

        this._connected[name] = true;
    }
};

})(jQuery);;
/*!
 * OnePress Local State Provider
 * Copyright 2013, OnePress, http://byonepress.com
*/

(function ($) {
    'use strict';

    if (!$.onepress) $.onepress = {};
    if (!$.onepress.providers) $.onepress.providers = {};

    /**
    * Returns a state provide for the Strict Mode.
    */
    $.onepress.providers.clientStoreStateProvider = function (networkName, buttonName, url, options) {

        this.networkName = networkName;
        this.buttonName = buttonName;
        this.name = networkName + "-" + buttonName;
        
        this.demo = options.demo;
        this.useCookies = options.locker.useCookies;
        this.expires = options.locker.expires;
        this.scope = options.locker.scope && "scope_" + options.locker.scope;

        this.url = url;
        this.identity = "page_" + $.onepress.tools.hash(this.url) + "_hash_" + networkName + "-" + buttonName;       
        /**
        * Does the provider contain an unlocked state?
        */
        this.isUnlocked = function () {
            if (this.demo) return false;
            return ( (this._getValue(this.identity)) || (this._getValue( this.scope )) ) ? true : false;
        };

        /**
        * Does the provider contain a locked state?
        */
        this.isLocked = function () {
            return !this.isUnlocked();
        };

        /**
        * Gets a state and calls the callback with the one.
        */
        this.getState = function (callback) {
            if (this.demo) return callback(false);
            callback(this.isUnlocked());
        };

        /**
        * Sets state of a locker to provider.
        */
        this.setState = function (value) {
            if (this.demo) return true;            
            try {
                return value === "unlocked" 
                    ? ( this._setValue(this.identity) && this._setValue(this.scope) ) 
                    : ( this._removeValue(this.identity) && this._setValue(this.scope) ) ;
                    
            } catch (e) {
                console && console.log(e)
            }
        };
        
        /**
         * Sets a value to a provider.
         */
        this._setValue = function ( identity ) {
            if ( !identity ) return false;
                     
            var itemValue = true;
            var itemExpires = 10000;
            
            // if the option "expires" is set, then we need to save the time
            // when unlocked content will be locked again

            if ( this.expires ) {
                
                var today = new Date();
                var todayMs = today.getTime();
                
                var expires = todayMs + this.expires * 1000;
                
                itemExpires = Math.ceil(this.expires / 86400); // in days
                itemValue = JSON.stringify({expires: expires} );
                
            }
            
            // issue #SLJQ-44
            // for catching QUOTA_EXCEEDED_ERR

            var tryCookies = true;
            if ( localStorage && !this.useCookies ) {
                tryCookies = false;
                try {
                    localStorage.setItem( identity, itemValue );
                } catch(e) {
                    console && console.log(e);
                    tryCookies = true;
                }
            }

            if ( tryCookies ) {
                $.onepress.tools.cookie( identity, itemValue, { expires: itemExpires, path: "/" });
            }
            
            return true;
        };

        /**
         * Gets a value from a provider.
         */
        this._getValue = function ( identity ) {
            if ( !identity ) return false;
            
            // at first, trying to get a value from local storage
            // if there's not a situable value, then trying to get a value from cookies
            
            var value = localStorage && !this.useCookies && localStorage.getItem(identity);
            if ( !value ) value = $.onepress.tools.cookie(identity);
            
            if (value) {
                
                // if the got value is an object, then check the "expires" property
                
                try {
                    var valueObj = JSON.parse(value);
                    if ( valueObj && valueObj.expires ) {
                        var today = new Date();
                        return valueObj.expires > today;
                    }
                    return true;
                } catch (e) {
                    return true;
                }
            }
        };

        this._removeValue = function ( identity ) {
            if ( !identity ) return false;
                        
            if (localStorage) localStorage.removeItem(identity);
            $.onepress.tools.cookie(identity, null);
        };
    };

})(jQuery);;
/*!
 *
 * Version: 0.0.5
 * Author: Gianluca Guarini
 * Website: http://www.gianlucaguarini.com/
*/

/**
 * Copyright (c) Gianluca Guarini
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 **/


(function(window, document, $) {
  'use strict';

  // Plugin private cache
  // static vars
  var cache = {
    filterId: 0
  };
  
  var _browserPrefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  
  var cssfilters = function() {
          var el = document.createElement('div');
          el.style.cssText = _browserPrefixes.join('filter' + ':blur(2px); ');
          return !!el.style.length && ((document.documentMode === undefined || document.documentMode > 9));
        };

        // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/svg-filters.js
  var svgfilters = function() {
          var result = false;
          try {
            result = typeof SVGFEColorMatrixElement !== undefined &&
              SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE == 2;
          } catch (e) {}
          return result;
        };

  var Vague = function(elm, customOptions) {
    // Default options
    var defaultOptions = {
      intensity: 5,
      forceSVGUrl: false,
      animationOptions: {
        duration: 1000,
        easing: 'linear'
      }
    },
      // extend the default options with the ones passed to the plugin
      options = $.extend(defaultOptions, customOptions),

      

      /*
       *
       * Helpers
       *
       */

      
      _cssPrefixString = {},
      _cssPrefix = function(property) {
        if (_cssPrefixString[property] || _cssPrefixString[property] === '') return _cssPrefixString[property] + property;
        var e = document.createElement('div');
        var prefixes = ['', 'Moz', 'Webkit', 'O', 'ms', 'Khtml']; // Various supports...
        for (var i in prefixes) {
          if (typeof e.style[prefixes[i] + property] !== 'undefined') {
            _cssPrefixString[property] = prefixes[i];
            return prefixes[i] + property;
          }
        }
        return property.toLowerCase();
      },
      // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/css-filters.js
      _support = {
        cssfilters: cssfilters(),

        // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/svg-filters.js
        svgfilters: svgfilters()
      },

      /*
       *
       * PRIVATE VARS
       *
       */

      _blurred = false,
      // cache the right prefixed css filter property
      _cssFilterProp = _cssPrefix('Filter'),
      _svgGaussianFilter,
      _filterId,
      // to cache the jquery animation instance
      _animation,

      /*
       *
       * PRIVATE METHODS
       *
       */

      /**
       * Create any svg element
       * @param  { String } tagName: svg tag name
       * @return { SVG Node }
       */

      _createSvgElement = function(tagName) {
        return document.createElementNS('http://www.w3.org/2000/svg', tagName);
      },

      /**
       *
       * Inject the svg tag into the DOM
       * we will use it only if the css filters are not supported
       *
       */

      _appendSVGFilter = function() {
        // create the svg and the filter tags
        var svg = _createSvgElement('svg'),
          filter = _createSvgElement('filter');

        // cache the feGaussianBlur tag and make it available
        // outside of this function to easily update the blur intensity
        _svgGaussianFilter = _createSvgElement('feGaussianBlur');

        // hide the svg tag
        // we don't want to see it into the DOM!
        svg.setAttribute('style', 'position:absolute');
        svg.setAttribute('width', '0');
        svg.setAttribute('height', '0');
        // set the id that will be used as link between the DOM element to blur and the svg just created
        filter.setAttribute('id', 'blur-effect-id-' + cache.filterId);

        filter.appendChild(_svgGaussianFilter);
        svg.appendChild(filter);
        // append the svg into the body
        $('body').append(svg);

      };

    /*
     *
     * PUBLIC VARS
     *
     */

    // cache the DOM element to blur
    this.$elm = elm instanceof $ ? elm : $(elm);


    /*
     *
     * PUBLIC METHODS
     *
     */

    /**
     *
     * Initialize the plugin creating a new svg if necessary
     *
     */

    this.init = function() {
      // checking the css filter feature
      if (_support.svgfilters) {
        _appendSVGFilter();
      }
      // cache the filter id
      _filterId = cache.filterId;
      // increment the filter id static var
      cache.filterId++;

      return this;

    };

    /**
     *
     * Blur the DOM element selected
     *
     */

    this.blur = function() {

      var cssFilterValue,
        // variables needed to force the svg filter URL
        loc = window.location,
        svgUrl = options.forceSVGUrl ? loc.protocol + '//' + loc.host + loc.pathname : '';

      // use the css filters if supported
      if (_support.cssfilters) {
        cssFilterValue = 'blur(' + options.intensity + 'px)';
        // .. or use the svg filters
      } else if (_support.svgfilters) {
        // update the svg stdDeviation tag to set up the blur intensity
        _svgGaussianFilter.setAttribute('stdDeviation', options.intensity);
        cssFilterValue = 'url(' + svgUrl + '#blur-effect-id-' + _filterId + ')';
      } else {
        // .. use the IE css filters
        cssFilterValue = 'progid:DXImageTransform.Microsoft.Blur(pixelradius=' + options.intensity + ')';
      }

      // update the DOM element css
      this.$elm[0].style[_cssFilterProp] = cssFilterValue;
      // set the _blurred internal var to true to cache the element current status
      _blurred = true;

      return this;
    };


    /**
     * Animate the blur intensity
     * @param  { Int } newIntensity: new blur intensity value
     * @param  { Object } customAnimationOptions: default jQuery animate options
     */

    this.animate = function(newIntensity, customAnimationOptions) {
      // control the new blur intensity checking if it's a valid value
      if (typeof newIntensity !== 'number') {
        throw (typeof newIntensity + ' is not a valid number to animate the blur');
      } else if (newIntensity < 0) {
        throw ('I can animate only positive numbers');
      }
      // create a new jQuery deferred instance
      var dfr = new $.Deferred();

      // kill the previous animation
      if (_animation) {
        _animation.stop(true, true);
      }

      // trigger the animation using the jQuery Animation class
      _animation = new $.Animation(options, {
        intensity: newIntensity
      }, $.extend(options.animationOptions, customAnimationOptions))
        .progress($.proxy(this.blur, this))
        .done(dfr.resolve);

      // return the animation deferred promise
      return dfr.promise();
    };

    /**
     *
     * Unblur the DOM element
     *
     */
    this.unblur = function() {
      // set the DOM filter property to none
      this.$elm.css(_cssFilterProp, 'none');
      _blurred = false;
      return this;
    };

    /**
     *
     * Trigger alternatively the @blur and @unblur methods
     *
     */

    this.toggleblur = function() {
      if (_blurred) {
        this.unblur();
      } else {
        this.blur();
      }
      return this;
    };
    /**
     * Destroy the Vague.js instance removing also the svg filter injected into the DOM
     */
    this.destroy = function() {
      // do we need to remove the svg filter?
      if (_support.svgfilters) {
        $('filter#blur-effect-id-' + _filterId).parent().remove();
      }

      this.unblur();

      // clear all the property stored into this Vague.js instance
      for (var prop in this) {
        delete this[prop];
      }

      return this;
    };
    // init the plugin
    return this.init();
  };

  // export the plugin as a jQuery function
  $.fn.Vague = function(options) {
    return new Vague(this, options);
  };
  
  if (!$.onepress) $.onepress = {};
  if (!$.onepress.tools) $.onepress.tools = {};
  
  $.onepress.tools.supportBlurring = function(setMode, _default){
       // set the overlap mode            
       if ( _default === 'blurring' && (
            $.onepress.browser.msie && 
            $.onepress.browser.version > 9 && $.onepress.browser.msie < 12 || !cssfilters() && !svgfilters())){

            return setMode;
       }
       return _default;
  }

}(window, document, jQuery));;
/*!
 * Social Locker plugin for jQuery
 * Copyright 2013, OnePress, http://byonepress.com
*/

(function ($) {
    'use strict';
    if ($.fn.sociallocker) return;

    $.onepress.widget("sociallocker", {

        options: {},

        // The variable stores a current locker state.
        _isLocked: false,

        // Defauls option's values.
        _defaults: {
            _iPhoneBug: false,
            
            // Url that used to like/tweet/plusone.
            // It's obligatory to check whether a user likes a page.
            url: null,

            // Text above the locker buttons.
            text: {
                header: $.onepress.sociallocker.lang.defaultHeader,
                message: $.onepress.sociallocker.lang.defaultMessage
            },

            // Theme applied to the locker
            theme: "starter",
            
            // Sets overlap for the locked content.
            // false = mode:none
            overlap: {
                ie10Mode: 'transparence', 
                
                // Possible modes:
                // - full: hides the content, and show the locker instead (classic)
                // - transparence: transparent overlap
                // - blurring: to blur locked content
                mode: "full",
                
                // Using only if the mode is set to 'transparence' or 'blurring'
                // Defines the position of the locker. Possible values:
                // middle, top, scroll
                position: 'middle',
                
                // blur intensity (works only with the 'blue' mode)
                intensity: 5
            },

            // Extra class
            cssClass: null,

            // Sets whether the locker keep the state of always appears
            demo: false,
            
            actualUrls: false,
            
            // Optional. If set true, the locker will generate events for the Google Analytics.
            googleAnalytics: false,
            
            // Social buttons to use
            buttons: {

                // horizontal or vertical
                layout: 'horizontal',

                // an order of the buttons, available buttons:
                // -
                // twitter: twitter-tweet, twitter-follow
                // facebook: facebook-like, facebook-share
                // google: google-plus, google-share
                // -
                order: [
                    "twitter-tweet", "facebook-like"
					
                    ,"google-plus"
					
					
                ],

                // hide or show counters for the buttons
                counter: true
            },

            // --
            // Locker functionality.
            locker: {
                // if true, the locker will work as classic social buttons
                off: false,
                
                // if true, the locker waits until the user click all the available buttons.
                stepByStep: false,

                // Sets whether a user may remove the locker by a cross placed at the top-right corner.
                close: false,
                // Sets a timer interval to unlock content when the zero is reached.
                // If the value is 0, the timer will not be created. 
                timer: 0,
                // Sets whether the locker appears for mobiles devides.
                mobile: true,

                // Optional. If false, the content will be unlocked forever, else will be 
                // unlocked for the given number of seconds.
                expires: false,
                // Optional. Forces to use cookies instead of a local storage
                useCookies: false,
                
                // Optional. Allows to bind lockers into one group.
                // If one of lockers in the given scope are unlocked, all others will be unlocked too.
                scope: false,
                
                // Optional. Timeout for loading of the social scripts.
                loadingTimeout: 10000,
                
                // Optional. If on, the locker will protect your content 
                // against browser extensions which remove the lock automatically.
                tumbler: true,
                // Optional. Check interval for the Tumbler, 500 is good.
                tumblerInterval: 500
            },

            // -
            // Content that will be showen after unlocking.
            // -
            content: null,

            // --
            // Locker effects
            effects: {

                // Turns on the Flip effect.
                flip: false,

                // Turns on the Highlight effect.
                highlight: true
            },
            
            // --
            // Internal triggers
            triggers: {
                
            },

            // --
            // Facebook Options
            facebook: {
                url: null,
                
                // sdk version to load (v1.0, v2.0)
                version: 'v1.0',

                // App Id used to get extended contol tools (optionly).
                // You can create your own app here: https://developers.facebook.com/apps
                appId: null,
                // Language of the button labels. By default en_US.
                lang: 'en_US',                
                // The color scheme of the plugin. By default 'light'.
                colorScheme: "light",
                // The font of the button. By default 'tahoma'.
                font: 'tahoma',
                // A label for tracking referrals.
                ref: null,
                
                // - Separeted options for each buttons.
     
                like: {
                    title: $.onepress.sociallocker.lang.facebook_like,
                    
                    // #SLJQ-29: turn on this option if you see the 
                    // "confim link" after click the Like button.
                    theConfirmIssue: false
                },
                share: {
                    title: $.onepress.sociallocker.lang.facebook_share
                }
            },
            
            // --
            // Twitter Options
            twitter: {
                url: null,

                // Screen name of the user to attribute the Tweet to
                via: null,
                // Default Tweet text
                text: null,
                // Related accounts
                related: null,
                // The language for the Tweet Button
                lang: 'en', 
                // URL to which your shared URL resolves
                counturl: null,
                
                // - Separeted options for each buttons.
     
                tweet: {
                    title: $.onepress.sociallocker.lang.twitter_tweet
                },
                follow: {
                    title: $.onepress.sociallocker.lang.twitter_follow
                }
            },
            
            // --
            // Google Options
            google: {
                url: null,

                // Language of the button labels. By default en-US.
                // https://developers.google.com/+/plugins/+1button/#available-languages
                lang: 'en-US', 
                // Sets the annotation to display next to the button.
                annotation: null,
                // To disable showing recommendations within the +1 hover bubble, set recommendations to false.    
                recommendations: true,
                
                // - Separeted options for each buttons.
     
                plus: {
                    title: $.onepress.sociallocker.lang.google_plus
                },
                share: {
                    title: $.onepress.sociallocker.lang.google_share
                }
            },            
            // --
            // LinkedIn Options
            linkedin: {
                url: null,
                counter: "right",
                
                // - Separeted options for each buttons.
                
                share: {
                    title: $.onepress.sociallocker.lang.linkedin_share 
                }
            }
           
        },
        
        getState: function() {
            return this._isLocked ? "locked" : "unlocked";
        },

        /**
        * Enter point to start creating the locker. 
        */
        _create: function () {
            var self = this;
            
            this.events = {
                lock: function(typeSender, sender){
                    self.element.trigger('lock.sociallocker.onp', [typeSender, sender]);
                },
                unlock: function(typeSender, sender, url){
                    self.element.trigger('unlock.sociallocker.onp', [typeSender, sender]);  
                    
                    if ( self.options.googleAnalytics && ( window._gaq || window.ga ) && typeSender === 'button' ) {
                        
                        var actionName = null;
                        var buttonName = null;
                        
                        if ( sender === 'facebook-like' ) { buttonName = 'Facebook Like'; actionName = "Got a Like on Facebook"; }
                        else if ( sender === 'facebook-share' ) { buttonName = 'Facebook Share'; actionName = "Shared on Facebook"; }
                        else if ( sender === 'twitter-tweet' ) { buttonName = 'Twitter Tweet'; actionName = "Shared on Twitter"; }
                        else if ( sender === 'twitter-follow' ) { buttonName = 'Twitter Follow'; actionName = "Got a Follower on Twitter"; }
                        else if ( sender === 'google-plus' ) { buttonName = 'Google Plus'; actionName = "Got +1 on Google"; }
                        else if ( sender === 'google-share' ) { buttonName = 'Google Share'; actionName = "Shared on Google"; }
                        else if ( sender === 'linkedin-share' ) { buttonName = 'Linkedin Share'; actionName = "Shared on Linkedin"; }
                        
                        if ( window.ga ) window.ga('send', 'event', 'Social Locker (Leakages)', 'Unlocked by Social Button', buttonName);
                        else window._gaq.push(['_trackEvent', 'Social Locker (Leakages)', 'Unlocked by Social Button', buttonName]);  
                        
                        if ( window.ga ) window.ga('send', 'event', 'Social Locker (Activity)', actionName, url);
                        else window._gaq.push(['_trackEvent', 'Social Locker (Activity)', actionName, url]);                 
                    }
                },
                unlockByClose: function(){
                    self.element.trigger('unlockByClose.sociallocker.onp', []);  
                    
                    if ( self.options.googleAnalytics && ( window._gaq || window.ga ) ) {
                        if ( window.ga ) window.ga('send', 'event', 'Social Locker (Leakages)', 'Unlocked by Close Icon', null);
                        else window._gaq.push(['_trackEvent', 'Social Locker (Leakages)', 'Unlocked by Close Icon', null]);   
                    }
                },
                unlockByTimer: function(){
                    self.element.trigger('unlockByTimer.sociallocker.onp', []);   
                    
                    if ( self.options.googleAnalytics && ( window._gaq || window.ga ) ) {
                        if ( window.ga ) window.ga('send', 'event', 'Social Locker (Leakages)', 'Unlocked by Timer', null);
                        else window._gaq.push(['_trackEvent', 'Social Locker (Leakages)', 'Unlocked by Timer', null]); 
                    }
                }
            };

            // parse options
            this._processOptions();

            // don't show a locker in ie7
            if ($.onepress.browser.msie && parseInt($.onepress.browser.version, 10) === 7) {
                this._unlock("ie7"); return;
            }

            // check mobile devices
            if (!this.options.locker.mobile && this._isMobile()) {
                this._unlock("mobile"); return;
            }
            
            // remove buttons that are not supported by iPhone
            if ((/iPhone/i).test(navigator.userAgent) && this.options._iPhoneBug ) {
                var twitterIndex = $.inArray("twitter-tweet", this.options.buttons.order);
                if (twitterIndex >= 0) this.options.buttons.order.splice(twitterIndex, 1);
            }
            
            // remove a google share button for Opera, IE8 and mobile devices
            if ( $.onepress.browser.opera || $.onepress.browser.msie || this._isTabletOrMobile() ) {
                var googleIndex = $.inArray("google-share", this.options.buttons.order);   
                if (googleIndex >= 0) this.options.buttons.order.splice(googleIndex, 1);
            }
            
            // unlock the locker if no buttons are defined
            if (this.options.buttons.order.length === 0) {
                this._unlock("nobuttons"); return;
            }

            // creates provider
            this._controller = this._createProviderController();
            
            // get state to decide what our next step is
            this._controller.getState(function (result) {
                result.state ? self._unlock("provider") : self._lock();
            });
            
            // unlocking by the scope
            if ( self.options.locker.scope ) {
                $(document).bind("unlockByScope.sl.onp", function(e, element, scope){
                    if ( element === self.element ) return;
                    if ( self.options.locker.scope === scope ) {
                        self._unlock("scope");
                    }
                });
            }
        },

        /**
        * Creates and returns a controler of providers by using the options.
        */
        _createProviderController: function () {
            var self = this;
            this._providers = {};

            var totalCount = 0;

            for (var providerIndex in this.options.buttons.order) {
                var sourceName = this.options.buttons.order[providerIndex];
                if (typeof (sourceName) !== 'string') continue;

                // button separator
                if ( '#' === sourceName ) continue;

                var parts = sourceName.split('-');
                var networkName = parts.length === 2 ? parts[0] : null;
                var buttonName = parts.length === 2 ? parts[1] : parts[0];
                
                if ( !this._isValidButton(networkName, buttonName) ) {
                    this._setError("The button '" + sourceName + "' not found.");
                    return;
                }
    
                var buttonOptions = {};
                
                if ( networkName  ) {
                    if ( this.options[networkName] ) buttonOptions = $.extend({}, this.options[networkName]);
                    if ( this.options[networkName][buttonName] ) buttonOptions = $.extend(buttonOptions, this.options[networkName][buttonName] );
                } else {
                    if ( this.options[buttonName] ) buttonOptions = $.extend(buttonOptions, this.options[buttonName] );                    
                }
                
                var buttonApi = networkName 
                    ? $.onepress.sociallocker[networkName] && $.onepress.sociallocker[networkName][buttonName] 
                    : $.onepress.sociallocker[buttonName];
                
                // the function 'getStateId' should return an URL to share or 
                // any other identity which can be used to check whether the button was already used
                
                var id = buttonApi && buttonApi.getStateId
                    ?  buttonApi.getStateId( buttonOptions, this.options  )
                    : URL.normalize( buttonOptions.url || this.options.url || window.location.href );

                if ( this._providers[sourceName] ) return;
                
                this._providers[sourceName] = 
                    new $.onepress.providers.clientStoreStateProvider( networkName, buttonName, id, self.options );
            
                totalCount++;
            }

            // controller of providers
            return {
                
                /**
                 * Updates the state.
                 */
                updateState: function() {
                    this.getState(function(){});
                },
                
                /**
                * Gets result state for all defined providers.
                */
                getState: function (callback) {
                    
                    var counter = totalCount;
                    
                    // if the option 'stepByStep', we need to approve that 
                    // all the buttons have been used/clicked, else a single 
                    // button is enough to unlock the content
                    
                    var resultState = self.options.locker.stepByStep;
                    var completedSteps = 0;
                    var totalSteps = 0;
                    
                    for (var name in self._providers) {
                        var provider = self._providers[name];

                        provider.getState(function (state) {
                            counter--;
                            
                            if ( self.options.locker.stepByStep ) {
                                if ( !state ) resultState = false;
                                if ( state ) completedSteps++;
                                totalSteps++;
                            } else {
                                if ( state ) resultState = true; 
                            }
 
                            if (counter === 0) {
                                
                                var data = {
                                    state: resultState,
                                    completedSteps: completedSteps,
                                    totalSteps: totalSteps
                                };
                                
                                if ( self.options.triggers.state ) 
                                    self.options.triggers.state( data, self.locker, self );
                                
                                $(document).trigger('onp-sl-trigger-state', [data, self.locker, self]);
                                
                                callback(data, provider);
                            };
                        });
                    }
                }
            };
        },

        /**
        * Processes the locker options.
        */
        _processOptions: function () {
            var theme = this.options.theme || this._defaults.theme;
            var options = $.extend(true, {}, this._defaults);
            
            // uses preset options
            if ($.onepress.sociallocker.presets[theme]) {
                options = $.extend(true, {}, options, $.onepress.sociallocker.presets[theme]);

                if ( 
                    $.onepress.sociallocker.presets[theme].buttons && 
                    $.onepress.sociallocker.presets[theme].buttons.order) {
                    
                    options.buttons.order = $.onepress.sociallocker.presets[theme].buttons.order;
                }
            }

            // users user defined options
            options = $.extend(true, options, this.options);

            if (this.options.buttons && this.options.buttons.order) {
                options.buttons.order = this.options.buttons.order;
            }

            options.effects.flip = options.effects.flip || (options.style == 'onp-sociallocker-secrets');
            if ( !options.buttons.layout ) options.buttons.layout = 'horizontal';

            if (options.buttons.layout === "vertical") {
                options.facebook.like.layout = "box_count";
                options.facebook.share.layout = "box_count";       
                options.twitter.count = "vertical";
                options.twitter.size = "medium";
                options.google.plus.size = "tall";
                options.google.share.annotation = "vertical-bubble";   
                options.linkedin.share.counter = "top";                
                options.buttons.counter = true;
            }

            if (options.buttons.layout === "horizontal") {
                options.facebook.layout = "button_count";
                options.twitter.count = "horizontal";
                options.twitter.size = "medium";
                options.google.size = "medium";
                options.google.annotation = 'bubble';
                options.linkedin.share.counter = "right"; 
                
                if (!options.buttons.counter) {
                    options.twitter.count = 'none';
                    options.twitter.showCount = false;        
                    options.google.annotation = 'none';
                    options.facebook.count = 'none';
                    options.linkedin.share.counter = "none";
                }
            }

            if (typeof options.text !== "object") {
                options.text = { message: options.text };
            }

            if (options.text.header) {
                options.text.header = (typeof options.text.header === "function" && options.text.header(this)) ||
                                      (typeof options.text.header === "string" && $("<div>" + options.text.header + "</div>")) ||
                                      (typeof options.text.header === "object" && options.text.header.clone());
            }

            if (options.text.message) {
                options.text.message = (typeof options.text.message === "function" && options.text.message(this)) ||
                                       (typeof options.text.message === "string" && $("<div>" + options.text.message + "</div>")) ||
                                       (typeof options.text.message === "object" && options.text.message.clone());
            }

            options.locker.timer = parseInt(options.locker.timer);
            if (options.locker.timer == 0) options.locker.timer = null;

            this.options = options;
            
            // builds the css class name based on the theme name
            this.style = "onp-sociallocker-" + theme;  
           
            // ie 10-11 fix (they doesn't support the blur filter)
            
            this.options.overlap.mode = $.onepress.tools.supportBlurring(this.options.overlap.ie10Mode, this.options.overlap.mode);
            console.log(this.options.overlap.mode);
            this.overlap = ( this.options.overlap.mode === 'full' ) ? false : this.options.overlap.mode;
        },

        /**
        * Returns true if a current user use a mobile device, else false.
        */
        _isMobile: function () {
            
            if ((/webOS|iPhone|iPod|BlackBerry/i).test(navigator.userAgent)) return true;
            if ((/Android/i).test(navigator.userAgent) && (/Mobile/i).test(navigator.userAgent)) return true;
            return false;
        },
        
        /**
        * Returns true if a current user use a mobile device or tablet device, else false.
        */
        _isTabletOrMobile: function () {
            
            if ((/webOS|iPhone|iPad|Android|iPod|BlackBerry/i).test(navigator.userAgent)) return true;
            return false;
        },
        
        /**
         * Checks whether a button is valide for the locker.
         */
        _isValidButton: function( networkName, buttonName ) {
            
            if ( networkName ) {
                
                if ( !$.onepress.sociallocker[networkName] || !$.onepress.sociallocker[networkName][buttonName] ) {
                   return false; 
                }
                return true;
                
            } else {
                return $.onepress.sociallocker[buttonName] ? true : false;
            }
        },

        /**
        * Sets an error state.
        */
        _setError: function (text) {
            this._error = true;
            this._errorText = text;

            this.locker && this.locker.hide();

            this.element.html("<strong>[Error]: " + text + "</strong>");
            this.element.show().addClass("onp-sociallocker-error");
        },

        // --------------------------------------------------------------------------------------
        // Markups and others.
        // --------------------------------------------------------------------------------------

        /**
        * Creates the plugin markup.
        */
        _createMarkup: function () {
            var self = this;
            
            var element = (this.element.parent().is('a')) ? this.element.parent() : this.element;
            element.addClass("onp-sociallocker-content");

            var browser = ($.onepress.browser.mozilla && 'mozilla') ||
                          ($.onepress.browser.opera && 'opera') ||
                          ($.onepress.browser.webkit && 'webkit') || 'msie';

            this.locker = $("<div class='onp-sociallocker onp-sociallocker-" + browser + "'></div>");
            this.outerWrap = $("<div class='onp-sociallocker-outer-wrap'></div>").appendTo(this.locker);
            this.innerWrap = $("<div class='onp-sociallocker-inner-wrap'></div>").appendTo(this.outerWrap);
            if ( this.options.buttons.size === "fixed") this.locker.addClass("onp-sociallocker-buttons-fixed");
            this.locker.addClass(this.style);
            this.locker.addClass("onp-sociallocker-" + this.options.buttons.layout);

            if (!this.options.buttons.counter) this.locker.addClass('onp-sociallocker-no-counters');
            else this.locker.addClass('onp-sociallocker-has-counters');

            $.onepress.isTouch()
                ? this.locker.addClass('onp-sociallocker-touch')
                : this.locker.addClass('onp-sociallocker-no-touch');

            if ( this.options.cssClass ) this.locker.addClass( this.options.cssClass );

            var resultText = $("<div class='onp-sociallocker-text'></div>");
            if (this.options.text.header) resultText.append(this.options.text.header.addClass('onp-sociallocker-strong').clone());
            if (this.options.text.message) resultText.append(this.options.text.message.addClass('onp-sociallocker-message').clone());
           
            // main locker message
            this.innerWrap.append(resultText.addClass());
            resultText.prepend(($("<div class='onp-sociallocker-before-text'></div>")));
            resultText.append(($("<div class='onp-sociallocker-after-text'></div>")));

            // creates markup for buttons
            this._createButtonMarkup();

            // bottom locker message
            this.options.bottomText && this.innerWrap.append(this.options.bottomText.addClass('onp-sociallocker-bottom-text'));

            // close button and timer if needed
            this.options.locker.close && this._createClosingCross();
            this.options.locker.timer && this._createTimer();
            
            this._controller.updateState();

            // - classic mode
            // when we use the classic mode, we just set the display property of the locked content
            // to "none", then add the locker after the locked content.
            if ( !this.overlap ) {
               
                this.locker.hide();
                this.locker.insertAfter( element ); 
                
            // - overlap mode  
            // when we use the overlap mode, we put the locker inside the locked content,
            // then set the locker position to "absolute" and postion to "0px 0px 0px 0px".
            } else {
                           
                element.addClass("onp-sociallocker-overlap-mode");
                
                var displayProp = this.element.css("display");
                
                // creating content wrap if it's needed
                var $containerToTrackSize = element;
                if ( 
                    this.overlap === 'blurring' ||
                    element.is("img") || element.is("iframe") || element.is("object") || 
                    ( displayProp !== "block" && displayProp !== "inline-block" ) ) {
                
                    $containerToTrackSize = $('<div class="onp-sociallocker-content-wrap"></div>')
                    $containerToTrackSize.insertAfter( element );
                    $containerToTrackSize.append( element );
                }
                
                element.show();
                this.element.show();
                
                // creating another content which will be blurred
                if ( this.overlap === 'blurring' ) {  
                    this.blurArea = $("<div class='onp-sociallocker-blur-area'></div>");
                    this.blurArea.insertAfter( element );
                    this.blurArea.append( element );
                    element = this.blurArea;
                }
                
                var positionProp = $containerToTrackSize.css("position");
                if ( positionProp === 'static' ) $containerToTrackSize.css("position", 'relative');
                
                var innerFrame = ( element.is("iframe") && element ) || element.find("iframe");
                if ( innerFrame.length === 1 && innerFrame.css('position') === 'absolute' ){
                    $containerToTrackSize.css({
                        'position': 'absolute',
                        'width': '100%',
                        'height': '100%',
                        'top': innerFrame.css('top'),
                        'left': innerFrame.css('left'),
                        'right': innerFrame.css('right'),
                        'bottom': innerFrame.css('bottom'),
                        'margin': innerFrame.css('margin')
                    });
                    
                    innerFrame.css({
                        'top': 0,
                        'left': 0,
                        'right': 0,
                        'bottom': 0,
                        'margin': 'auto'
                    });
                }
				
                // creating other markup for the overlap
                this.overlapLockerBox = $("<div class='onp-sociallocker-overlap-locker-box'></div>").hide();
                this.overlapLockerBox.addClass('onp-sociallocker-position-' + this.options.overlap.position);
                this.overlapLockerBox.append( this.locker );

                this.overlapBox = $("<div class='onp-sociallocker-overlap-box'></div>");
                this.overlapBox.append( this.overlapLockerBox ); 
                this.overlapBox.addClass("onp-sociallocker-" + this.overlap + "-mode");
                
                var $overlapBackground = $("<div class='onp-sociallocker-overlap-background'></div>");
                this.overlapBox.append( $overlapBackground ); 
                
                $containerToTrackSize.append( this.overlapBox );

                if ( this.overlap === 'blurring' ) {
                                    
                    var intensity = ( this.options.overlap && this.options.overlap.intensity ) || 5;
                    this.blurArea = this.blurArea.Vague({
                        intensity: intensity,
                        forceSVGUrl: false
                    });
                    this.blurArea.blur();
                }
                
                $(window).resize(function(){
                    self._updateLockerPosition();
                });
                
                if ( this.options.overlap.position === 'scroll') {
                    $(window).scroll(function(){
                        self._updateLockerPositionOnScrolling();
                    });  
                }         
            }

            this._markupIsCreated = true;
            
            // issue #SLJQ-3 - a trick for a quick callback after liking
            // works only for the Like Button currently
 
            if ( $.inArray("facebook-like", this.options.buttons.order) >= 0 ) {
                this._startTrackIFrameSizes(); 
            }
        },
        
        _updateLockerPosition: function() {
            if ( !this.overlap ) return;
            
            var self = this;
            
            if ( this.options.overlap.position === 'top' || this.options.overlap.position === 'scroll' ) {     
                
                var boxWidth = this.overlapBox.outerWidth();
                var lockerWidth = this.locker.outerWidth();
                
                var boxHeight = this.overlapBox.outerHeight();
                var lockerHeight = this.locker.outerHeight();
                
                var offset = this.options.overlap.offset;
                
                if ( !offset ) {
                    var offset = Math.floor( ( boxWidth - lockerWidth ) / 2 );
                    if ( offset <= 10 ) offset = 10;
                }
            
                if ( offset * 2 + lockerHeight > boxHeight ) {
                    var offset = Math.floor( ( boxHeight - lockerHeight ) / 2 );
                }

                this.overlapLockerBox.css('marginTop', offset + 'px' ) ;
                
                if ( this.options.overlap.position === 'scroll' ) {
                    this._baseOffset = offset;
                    this._updateLockerPositionOnScrolling();
                }
            }
            
            if ( this.options.overlap.position === 'middle' ) {
                this.overlapLockerBox.css('marginTop', '-' + Math.floor( this.overlapLockerBox.innerHeight() / 2 ) + 'px' ) ;
                return;
            }
        },
        
        _updateLockerPositionOnScrolling: function () {
            
            var boxOffset = this.overlapBox.offset();
            var contentTopBorder = boxOffset.top;
            var contentLeftBorder = boxOffset.left;
            var contentBottomBorder = boxOffset.top + this.overlapBox.outerHeight();
            
            var boxWidth = this.overlapBox.outerWidth();
                
            var boxHeight = this.overlapBox.outerHeight();
            var lockerHeight = this.locker.outerHeight();

            if ( this._baseBoxOffset * 2 + lockerHeight + 10 >= boxHeight ) return;
      
            var scrollTop = $(document).scrollTop();
            
            var shift = 20;
            
            if ( scrollTop + lockerHeight + this._baseOffset * 2 + shift > contentBottomBorder ) {
                
                this.overlapLockerBox
                    .css('position', 'absolute')
                    .css('top', 'auto')
                    .css('left', '0px')
                    .css('width', 'auto') 
                    .css('bottom', this._baseOffset + 'px')
                    .css('margin-top', '0px');
            
                return;
            }
            
            if ( scrollTop + shift > contentTopBorder ) {
                
                this.overlapLockerBox
                    .css('position', 'fixed')
                    .css('top', this._baseOffset + shift + 'px')
                    .css('left', contentLeftBorder + 'px')
                    .css('width', boxWidth + 'px')
                    .css('bottom', 'auto') 
                    .css('margin-top', '0px');
            
                return;
            } 

            this.overlapLockerBox
                .css('position', 'absolute')
                .css('top', '0px')
                .css('left', '0px')
                .css('bottom', 'auto')
                .css('width', 'auto') 
                .css('margin-top', this._baseOffset + 'px');
        },
        
        /**
        * Creates markup for every social button.
        */
        _createButtonMarkup: function () {
            var self = this;
            this.buttonsWrap = $("<div class='onp-sociallocker-buttons'></div>").appendTo(this.innerWrap);
            var zIndex = 50;
            
            $.each( this.options.buttons.order, function( index, sourceName ) {
                if (typeof (sourceName) !== 'string') return true;

                // button separator
                if ( sourceName === '#' ) {
                    self.buttonsWrap.append("<div class='onp-button-separator'></div>");
                    return true;
                }
                
                // is button supported?
                if ( self.options.buttons.unsupported && jQuery.inArray(sourceName, self.options.buttons.unsupported ) >= 0 ) {
                    var title = 'The button "' + sourceName + '" is not supported by this theme.';
                    var button = $("<div class='onp-sociallocker-button onp-sociallocker-button-unsupported'></div>").css('z-index', zIndex);
                    var innerWrap = $("<div class='onp-sociallocker-button-inner-wrap'>" + title + "</div>").appendTo(button);
                    self.buttonsWrap.append(button);
                    return true;
                }

                var parts = sourceName.split('-');
                var networkName = parts.length === 2 ? parts[0] : null;
                var buttonName = parts.length === 2 ? parts[1] : parts[0];
                
                // setup options
                
                var buttonOptions = {};
                if ( networkName  ) {
                    if ( self.options[networkName] ) buttonOptions = $.extend({}, self.options[networkName]);
                    if ( self.options[networkName][buttonName] ) buttonOptions = $.extend(buttonOptions, self.options[networkName][buttonName] );
                } else {
                    if ( self.options[buttonName] ) buttonOptions = $.extend(buttonOptions, self.options[buttonName] );                    
                }
                
                if ( self.options.actualUrls ) {
                    buttonOptions.url = window.location.href;
                }

                buttonOptions.url = URL.normalize( buttonOptions.url || self.options.url || window.location.href );
                buttonOptions._provider = self._providers[sourceName];
                
                buttonOptions.unlock = function (senderType) {
                    
                    if ( !self.options.locker.stepByStep ) 
                        return self._unlock(senderType, buttonOptions._provider);
                    
                    // an opiton to unlock the content step by step (Lucas' add-on)
                    self._completeStep( buttonOptions, button );
                };
                
                buttonOptions.demo = self.options.demo;
                
                // creates button
                var button = $("<div class='onp-sociallocker-button onp-sociallocker-button-" + sourceName + " onp-sociallocker-state-loading'></div>").css('z-index', zIndex);
                button.addClass('onp-sociallocker-button-' + networkName);
                
                button.data('name', sourceName);
                self.buttonsWrap.append(button);

                var innerWrap = $("<div class='onp-sociallocker-button-inner-wrap'></div>").appendTo(button);  
                
                var buttonApi = networkName 
                    ? $.onepress.sociallocker[networkName][buttonName] 
                    : $.onepress.sociallocker[buttonName];
                    
                var buttonInited = buttonApi.create(innerWrap, buttonOptions, self);
                
                // sets the button state
                if ( self.options.locker.stepByStep ) {
                    buttonOptions._provider.getState(function( state ){
                       self._setButtonState( state, button );
                    });   
                }

                // --------------------------------------------
                // loading sdk and creating a button
                // -------------------------------------------- 
                
                if ( buttonInited ) {
                    
                    var verificationData = buttonApi.getVerificationData
                        ? buttonApi.getVerificationData( buttonOptions )
                        : {
                            container: 'iframe',
                            timeout: 5000
                        };
                    
                    if ( networkName ) {

                        var sdk = $.onepress.sdk[networkName];

                        // waiting until the sdk is loaded, otherwise shows an error
                        var sdkIsLoaded = false;
                        setTimeout(function(){
                            if ( sdkIsLoaded ) return;
                            self.setButtonError( innerWrap, $.onepress.sociallocker.lang.unableToLoadSDK.replace('{0}', networkName) ); 
                        }, self.options.locker.loadingTimeout );

                        // if sdk is loaded, waiting until the buttons is created, otherwise shows an error
                        $.onepress.connector.connect(networkName, buttonOptions, function (sdk) {
                            sdkIsLoaded = true;   
                            var buttonTimeout =  verificationData.timeout;

                            // waiting creating a button   
                            var iframeCheckFunction = function() {

                                if (button.find( verificationData.container ).length === 0 && buttonTimeout >= 0) {
                                    setTimeout(function () {
                                        iframeCheckFunction();
                                    }, 500);

                                    buttonTimeout = buttonTimeout - 500;
                                    return;
                                };

                                button.removeClass('onp-sociallocker-state-loading');

                                if ( buttonTimeout <= 0 ) {
                                    self.setButtonError( innerWrap, $.onepress.sociallocker.lang.unableToCreateButton.replace('{0}', sourceName) );                         
                                    return;
                                } else {
                                    innerWrap.trigger('onp-sl-button-created');
                                }
                            };

                            iframeCheckFunction();
                        });

                    } else {
                        button.removeClass('onp-sociallocker-state-loading');
                        innerWrap.trigger('onp-sl-button-created');
                    } 
                }
                
                // --------------------------------------------
                // flip effects
                // -------------------------------------------- 

                var flipEffect = self.options.effects.flip;
                var flipSupport = $.onepress.tools.has3d();

                // addes the flip effect
                (flipEffect && flipSupport && button.addClass("onp-sociallocker-flip")) || button.addClass("onp-sociallocker-no-flip");
                if (!flipEffect) return true;
                
                var title = buttonOptions.title || (networkName 
                    ? $.onepress.sociallocker.lang[networkName + "_" + buttonName]
                    : $.onepress.sociallocker.lang[buttonName]);
                    
                var overlay = $("<a></a>")
                      .addClass("onp-sociallocker-button-overlay") 

                      .append($("<div class='onp-sociallocker-overlay-back'></div>"))
                      .append(
                       $("<div class='onp-sociallocker-overlay-front'></div>")
                            .append($("<div class='onp-sociallocker-overlay-icon'></div>"))
                            .append($("<div class='onp-sociallocker-overlay-line'></div>"))               
                            .append($("<div class='onp-sociallocker-overlay-text'>" + title + "</div>"))
                       )
                      .append($("<div class='onp-sociallocker-overlay-header'></div>"));

                overlay.prependTo(innerWrap);
                
                if (!flipSupport && !self._isCompletedStep( button) ) { 
                    button.hover(
                        function () {
                            var overlay = $(this).find(".onp-sociallocker-button-overlay");
                            overlay.stop().animate({ opacity: 0 }, 200, function () {
                                overlay.hide();
                            });
                        },
                        function () {
                            var overlay = $(this).find(".onp-sociallocker-button-overlay").show();
                            overlay.stop().animate({ opacity: 1 }, 200);
                        }
                    );
                }
                
                // if it's a touch device
                if ($.onepress.isTouch()) {
                    
                    // if it's a touch device and flip effect enabled.
                    if (flipSupport) {

                        overlay.click(function () {
                            var btn = $(this).parents('.onp-sociallocker-button');

                            if (btn.hasClass('onp-sociallocker-flip-hover')) {
                                btn.removeClass('onp-sociallocker-flip-hover');
                            } else {
                                $('.onp-sociallocker-flip-hover').removeClass('onp-sociallocker-flip-hover');
                                btn.addClass('onp-sociallocker-flip-hover');
                            }

                            return false;
                        });

                    // if it's a touch device and flip effect is not enabled.
                    } else {
                        
                        if ( !self._isCompletedStep( button ) ) {
                            
                            overlay.click(function () {
                                var overlay = $(this);
                                overlay.stop().animate({ opacity: 0 }, 200, function () {
                                    overlay.hide();
                                });

                                return false;
                            });
                        }
                    }
                } 
                
                // every next button has the zindex less a previos button
                if ( overlay ) {
                    overlay.css('z-index', zIndex);
                    overlay.find('.onp-sociallocker-overlay-front').css('z-index', 1);
                    overlay.find('.onp-sociallocker-overlay-back').css('z-index', -1);  
                    overlay.find('.onp-sociallocker-overlay-header').css('z-index', 1 );                  
                }
                zIndex = zIndex - 5;
            });
        },
        
        /**
         * Sets the button to the error state.
         * 
         * @since 1.7.3
         * @param string an error text
         */
        setButtonError: function( $buttonHolder, errorText ) {
            if ( $buttonHolder.parent().hasClass('onp-sociallocker-state-error') ) return;
            
            this._createErrorMarkup( errorText ).appendTo( $buttonHolder );  
            $buttonHolder.parent()
                .removeClass('onp-sociallocker-state-loading')
                .addClass('onp-sociallocker-state-error');
        },
        
        /**
         * Generates en error html markup.
         * 
         * @since 1.5.5
         * @param string an error text
         * @returns object
         */
        _createErrorMarkup: function( errorText ) {
            var self = this;
            
            var $error = $("<div class='onp-sociallocker-error-body'>" + 
                        "<a href='#' class='onp-sociallocker-error-title'>" + $.onepress.sociallocker.lang.error + "</a>" +
                        "<div class='onp-sociallocker-error-text'>" + errorText + "</div>" + 
                     "</div>");
             
            var $errorText = $error.find('.onp-sociallocker-error-text');
            var $errorTitle = $error.find('.onp-sociallocker-error-title');
            
            $errorTitle.click(function(){
                self.locker.find('.onp-sociallocker-shown-error').remove();
                    
                if ( $error.hasClass('onp-sociallocker-active') ) {
                    $error.removeClass('onp-sociallocker-active');
                } else {
                    self.locker.find('.onp-sociallocker-active').removeClass('onp-sociallocker-active');
                    $error.addClass('onp-sociallocker-active');
                    self.buttonsWrap.after( $errorText.clone().addClass('onp-sociallocker-shown-error') );
                }
                
                return false;
            });
            
            return $error;
        },
        
        _createClosingCross: function () {
            var self = this;

            $("<div class='onp-sociallocker-cross' title='" + $.onepress.sociallocker.lang.close + "' />")
                .prependTo(this.locker)
                .click(function () {
                    if (!self.close || !self.close(self)) self._unlock("cross", true);
                });
        },

        _createTimer: function () {

            this.timer = $("<span class='onp-sociallocker-timer'></span>");
            var timerLabelText = $.onepress.sociallocker.lang.orWait;
            var secondLabel = $.onepress.sociallocker.lang.seconds;

            this.timerLabel = $("<span class='onp-sociallocker-timer-label'>" + timerLabelText + " </span>").appendTo(this.timer);
            this.timerCounter = $("<span class='onp-sociallocker-timer-counter'>" + this.options.locker.timer + secondLabel + "</span>").appendTo(this.timer);

            this.timer.appendTo(this.locker);

            this.counter = this.options.locker.timer;
            this._kickTimer();
        },

        _kickTimer: function () {
            var self = this;

            setTimeout(function () {

                if (!self._isLocked) return;

                self.counter--;
                if (self.counter <= 0) {
                    self._unlock("timer");
                } else {
                    self.timerCounter.text(self.counter + $.onepress.sociallocker.lang.seconds);

                    // Opera fix.
                    if ($.onepress.browser.opera) {
                        var box = self.timerCounter.clone();
                        box.insertAfter(self.timerCounter);
                        self.timerCounter.remove();
                        self.timerCounter = box;
                    }

                    self._kickTimer();
                }
            }, 1000);
        },
        
        // --------------------------------------------------------------------------------------
        // Tracking changes in button sizes to improve callback
        // --------------------------------------------------------------------------------------

        _startTrackIFrameSizes: function () {
            
            // #SLJQ-29: don't use the way based on measuring the frame size 
            // to check whether the user clicked the button
            if ( this.options.facebook.like.theConfirmIssue ) return;
            
            var self = this;
            this._trackIFrameTimer = null;
            
            this.locker.hover(
                function(){
                    var $button = self.locker.find(".onp-facebook-like-button");
                    
                    var $iframe = $button.find("iframe");
                    if ( !$iframe.length ) return;
                    
                    self._trackIFrameTimer = setInterval(function(){
                       var cssHeight = parseInt( $iframe[0].style.height );
                       if ( !cssHeight ) cssHeight = $iframe.height();
                       
                       if ( cssHeight > 200 ) {
                            self._stopTrackIFrameSizes();
                            var url = $button.find(".fake-fb-like").data('url-to-verify');
                            $(document).trigger('onp-sl-facebook-like', [url]);
                       }
                    }, 500);
                },
                function(){
                    self._stopTrackIFrameSizes();
                }
            );
        },
        
        _stopTrackIFrameSizes: function() {
            if ( this._trackIFrameTimer ) clearInterval( this._trackIFrameTimer ); 
        },
        
        // --------------------------------------------------------------------------------------
        // Step by Step
        // --------------------------------------------------------------------------------------        

        _isCompletedStep: function( $button ) {
            return $button.hasClass('onp-sl-step-completed');
        },

        _setButtonState: function( state, $button ) {
            if ( state ) $button.addClass('onp-sl-step-completed');
            else $button.removeClass('onp-sl-step-completed');
        },

        _completeStep: function( buttonOptions, $button ) {
            var self = this;
            
            var provider = buttonOptions._provider;
            provider.setState("unlocked");
            
            this._setButtonState(true, $button);
            if ( this.events.step ) this.events.step("button", provider && provider.name, provider && provider.url);
            
            this._controller.getState(function( result ){
                if ( result.state ) return self._unlock("step-by-step");
            });
        },

        // --------------------------------------------------------------------------------------
        // Lock/Unlock content.
        // --------------------------------------------------------------------------------------

        _lock: function (typeSender, sender) {
            var self = this;
            
            if (this._isLocked || this._stoppedByWatchdog) return;
            if (!this._markupIsCreated) this._createMarkup();

            if (typeSender === "button") sender.setState("locked");

            if ( !this.overlap) {
                this.element.hide();
                this.locker.fadeIn(1000);
            } else {

                this.overlapLockerBox.fadeIn(1000, function(){
                    self._updateLockerPosition();
                });
                self._updateLockerPosition();
            }

            this._isLocked = true;
            if (this.events.lock) this.events.lock(typeSender, sender && sender.name);
            
            // #issue: Fernando's mail
            // protection against browser extensions which unlock content automatically
            this._tumblerOn();
        },

        _unlock: function (typeSender, sender) {
            var self = this;

            // returns if we have turned off the locker
            if ( this.options.locker.off ) return;
       
            if (!this._isLocked) { this._showContent( typeSender !== "button" ); return false; }

            if (typeSender === "button") { 
                sender.setState("unlocked");

                if ( self.options.locker.scope ) 
                    $(document).trigger("unlockByScope.sl.onp", [ self.element, self.options.locker.scope ]);
            }

            // #issue: Fernando's mail
            // protection against browser extensions which unlock content automatically
            this._tumblerOff();

            this._showContent(true);
            this._isLocked = false;

            if ( typeSender === "scope" ) return;
            if (typeSender === "timer" && this.events.unlockByTimer) this.events.unlockByTimer();
            if (typeSender === "cross" && this.events.unlockByClose) this.events.unlockByClose();
            if (this.events.unlock) this.events.unlock(typeSender, sender && sender.name, sender && sender.url);
        },

        lock: function () {
            this._lock("user");
        },

        unlock: function () {
            this._unlock("user");
        },
        
        /**
         * Turns on the Tumbler which checks from time to time 
         * whether the locked content is still locked.
         */
        _tumblerOn: function() {

            if ( !this.options.locker.tumbler || this.options.locker.off ) return;
            if ( this._tumblerTicker ) return;

            var self = this;
            
            this._tumblerTicker = setInterval(function(){
                if ( !self._tumblerTicker ) return;
                
                if ( !self.locker.is(":visible") )
                    self.locker.css('display', 'block');
                
                if ( self.overlap ) {
                    
                    if ( !self.overlapBox || !self.overlapBox.is(":visible") )
                        self.overlapBox.css('display', 'block');   
                    
                } else {
                    
                    if ( self.element.is(":visible") ) {
                        self.element.css('display', 'none');
                    }                    
                }

            }, this.options.locker.tumblerInterval || 500 );
        },
        
        /**
         * Turns off the Tumbler.
         */
        _tumblerOff: function() {
            if ( !this.options.locker.tumbler || this.options.locker.off ) return;
            if ( !this._tumblerTicker ) return;
            
            clearInterval( this._tumblerTicker );
            this._tumblerTicker = null;
        },   

        _showContent: function (useEffects) {
            var self = this;
            this._stopTrackIFrameSizes();
            
            var effectFunction = function () {
                
                if ( self.overlap ) {
                    if ( self.overlapBox ) self.overlapBox.hide();
                    if ( self.blurArea ) self.blurArea.unblur();
                } else {
                    if (self.locker) self.locker.hide();    
                }
                
                if (self.locker) self.locker.hide();
                if (!useEffects) { self.element.show(); return; }

                self.element.fadeIn(1000, function () {
                    self.options.effects.highlight && self.element.effect && self.element.effect('highlight', { color: '#fffbcc' }, 800);
                });
            };

            if (!this.options.content) {
                effectFunction();

            } else if (typeof this.options.content === "string") {
                this.element.html(this.options.content);
                effectFunction();

            } else if (typeof this.options.content === "object" && !this.options.content.url) {
                this.element.append(this.options.content.clone().show());
                effectFunction();

            } else if (typeof this.options.content === "object" && this.options.content.url) {

                var ajaxOptions = $.extend(true, {}, this.options.content);

                var customSuccess = ajaxOptions.success;
                var customComplete = ajaxOptions.complete;
                var customError = ajaxOptions.error;

                ajaxOptions.success = function (data, textStatus, jqXHR) {

                    !customSuccess ? self.element.html(data) : customSuccess(self, data, textStatus, jqXHR);
                    effectFunction();
                };

                ajaxOptions.error = function (jqXHR, textStatus, errorThrown) {

                    self._setError("An error is triggered during the ajax request! Text: " + textStatus + " " + errorThrown);
                    customError && customError(jqXHR, textStatus, errorThrown);
                };

                ajaxOptions.complete = function (jqXHR, textStatus) {

                    customComplete && customComplete(jqXHR, textStatus);
                };

                $.ajax(ajaxOptions);

            } else {
                effectFunction();
            }
        }
    });

    /**
    * [obsolete]
    */
    $.fn.socialLock = function (opts) {

        opts = $.extend({}, opts);
        $(this).sociallocker(opts);
    };

})(jQuery);