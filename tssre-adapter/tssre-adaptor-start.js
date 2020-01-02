/*\
title: $:/plugins/programmingincluded/tssre-adaptor/tssre-adaptor-start.js
type: application/javascript
module-type: startup

\*/
(function() {
    
    var REMOTE_TIDDLER_FILE = "$:/config/tssre/remote-tiddlers";
    var HOST_TIDDLER = "$:config/tssre/host";
    var NOTIFICATION_TIDDLER = "$:/config/tssre/notification";

    var notify = function(msg) {
        $tw.wiki.setTiddlerData(NOTIFICATION_TIDDLER, msg);
        $tw.notifier.display(NOTIFICATION_TIDDLER);
    }

    var getHost = function() {
        var host = $tw.wiki.getTiddlerText(HOST_TIDDLER, undefined);
    
        // Try to use local host if not available
        if (host == undefined || host == "") {
            host = document.location.protocol + ":/" + document.location.host;
        }
    
        // Remove extra slash at the end if added by accident
        if (host.charAt(host.length - 1) == '/')
            host = host.substring(0, host.length - 1);
    
        return host;
    }

    var checkIsValidHost = function(host) {
        // Remove any and all invalid windows values and add underscores instead. As seen in filesystem adaptor.
        var remoteFilename = REMOTE_TIDDLER_FILE.replace(/<|>|\:|\"|\||\?|\*|\^|\//g,"_");

        // Check to see if special file exists on host
        $tw.utils.httpRequest({
            url: host + "/" + remoteFilename + ".tid",
            callback: function(err, data, request) {
                if (data == null) {
                    notify("Failed to get TSSRE setup at: " + host);
                } else {
                    notify("Valid TSSRE setup found at: " + host);
                }
            }
        });
    };


    exports.startup = function() {
        $tw.rootWidget.addEventListener("tssre-test", function (event) {
            // Get the host that is inputted by user
            var host = getHost();
            // Just check if remote has our custom TSSRE file
            checkIsValidHost(host);
            return true;
        });
    }

 })();