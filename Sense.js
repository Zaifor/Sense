(function (window, document) {
    'use strict';

     /**
     * @constructor
     */
    var Sense = function() {
        this.asyncScript = "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        this.syncScript = "//pagead2.googlesyndication.com/pagead/show_ads.js";

        this.onBlockedCallback = function(){};
        this.onReadyCallback = function(){};

        var that = this;
        window.addEventListener('load', function() {
            that.isAdBlocked.call(that);
        });
    }

    Sense.prototype = {
        constructor: Sense,

        hasScript: function(url, AUTO_PROTOCOL) {
            var exists = false,
                protocol = '';

            if (AUTO_PROTOCOL) {
                protocol = window.location.protocol;
            }

            for (var i = 0; i < document.scripts.length; i++) {
                if(document.scripts[i].src === (protocol + url)) {
                    exists = true;

                    break;
                }
            }

            return exists;
        },

        isAdBlocked: function() {
            var that = this;

            setTimeout(function(){

                /* If | Async Blocked */
                if (that.hasScript(that.asyncScript, 1)) {
                    var adsbygoogle = window.adsbygoogle ? window.adsbygoogle : false;
                    if(adsbygoogle){
                        if(!adsbygoogle.loaded) {
                            that.onBlockedCallback();

                            return;
                        }
                    }
                }

                /* If | Sync Blocked */
                if (that.hasScript(that.syncScript, 1)) {
                    var google_onload_fired = window.google_onload_fired ? window.google_onload_fired : false;
                    if(!google_onload_fired) {
                        that.onBlockedCallback();

                        return;
                    }
                }

                /* Else | Not blocked */
                that.onReadyCallback();
            }, 0);
        },

        onblocked: function(callback) {
            this.onBlockedCallback = callback;
        },

        onready: function(callback) {
            this.onReadyCallback = callback;
        }
    };

    window.Sense = new Sense();

})(window, document);


/*console.log("Sense.hasScript(Sense.asyncScript)", Sense.hasScript(Sense.asyncScript, 1));
console.log("Sense.hasScript(Sense.syncScript)", Sense.hasScript(Sense.syncScript, 1));*/

/* Usage */
Sense.onblocked(function() {
    alert("Blocked!");

   /* ga('send', 'event', 'AdSense', 'Ads blocked', { 'nonInteraction': 1 }); */
});

Sense.onready(function() {
    alert("Not Blocked!");

   /* ga('send', 'event', 'AdSense', 'Ads not blocked', { 'nonInteraction': 1 }); */
});
