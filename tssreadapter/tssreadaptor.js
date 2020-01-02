/*\
title: $:/plugins/programmingincluded/tssreadaptor/tssreadaptor.js
type: application/javascript
module-type: syncadaptor

\*/

(function() {
    var REMOTE_TIDDLER_FILE = "$:/config/tssre/remote-tiddlers";
    var NOTIFICATION_TIDDLER = "$:/config/tssre/notification";
    var HOST_TIDDLER = "$:/config/tssre/host";

    var HTMLSaver = require("$:/core/modules/savers/download.js");

    var notify = function(msg) {
        $tw.wiki.setTiddlerData(NOTIFICATION_TIDDLER, msg);
        $tw.notifier.display(NOTIFICATION_TIDDLER);
    }

    var getHost = function() {
        var host = $tw.wiki.getTiddlerText(HOST_TIDDLER, undefined);

        // Remove extra slash at the end if added by accident
        if (host.charAt(host.length - 1) == '/')
            host = host.substring(0, host.length - 1);
    
        return host;
    }

    var preprocessTiddlerName = function(str) {
        return str.replace(/<|>|\:|\"|\||\?|\*|\^|\//g,"_");
    }

    var remoteTiddlerFilename = function() {
        return preprocessTiddlerName(REMOTE_TIDDLER_FILE);
    }

    function TSSREAdapator(options) {
        this.wiki = options.wiki;
        this.logger = new $tw.utils.Logger("TSSREAdaptor");
        this.saver = HTMLSaver.create(this.wiki);
    }

    TSSREAdapator.prototype.getTiddlerInfo = function(tiddler) {
        return {};
    }

    TSSREAdapator.prototype.getSkinnyTiddlers = function(callback) {
        $tw.utils.httpRequest({
            url: getHost() + "/" + remoteTiddlerFilename() + ".tid",
            callback: (err, data) => {
                if(err) {
                    return callback(err);
                }
                // Remove first few metadata lines
                var split = data.split("\n");
                split.splice(0, 5);
                data = split.join("\n");
                // TODO: Remove double stringify
                var tiddlers = JSON.parse(JSON.parse(data));
                callback(null, tiddlers);
            }
        });
    }

    TSSREAdapator.prototype.loadTiddler = function(title, callback) {
        var name = encodeURIComponent(preprocessTiddlerName(title));
        var process = (data) => {
            // Process data
            var tiddler = {"text": ""};
            var lines = data.split("\n");
            var meta = true;
            lines.forEach((item) => {
                if (meta) {
                    if (item != "") {
                        var metaValue = item.split(": ");
                        tiddler[metaValue[0]] = metaValue[1];
                    } else {
                        meta = false;
                    }
                } else {
                    tiddler["text"] += item + "\r\n";
                }
            });
            return tiddler;
        }
        $tw.utils.httpRequest({
            url: getHost() + "/" + name + ".tid",
            callback: (err, data) => {
                if (err) {
                    // Try html
                    return $tw.utils.httpRequest({
                        url: getHost() + "/" + name + ".html",
                        callback: (err, data) => {
                            if (err) {
                                return callback(err);
                            }
                            var tiddler = {};
                            tiddler["text"] = data;
                            return callback(null, tiddler);
                        }
                    });
                }
                var tiddler = process(data);
                return callback(null, tiddler);
            }
        });
    }

    TSSREAdapator.prototype.saveTiddler = function(tiddler, callback, tiddlerInfo) {
        return callback(null, {}, 0);
    }

    TSSREAdapator.prototype.deleteTiddler = function(title, callback, tiddlerInfo) {
        notify("No delete supported for TSSRE Adapator");
        return callback("No delete supported");
    }

    exports.adaptorClass = TSSREAdapator;

})();