/*\
title: $:/plugins/programmingincluded/tssre/tssre.js
type: application/javascript
module-type: widget

\*/
(function() {

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var REMOTE_TIDDLER_FILE = "$:config/tssre/remote-tiddlers"

var TSSRE = function(parseTreeNode, options) {
    this.initialise(parseTreeNode, options);

    this.addEventListener("tssre-export", function (event) {
        var callback = (err, data, request) => {
            console.log(this.wiki.getTiddlerText(REMOTE_TIDDLER_FILE, "NONE"));
        }

        // Set tiddler file with all the meta data
        this.setupRemoteTiddlers(callback);
        return true;
    }, false);

    this.addEventListener("tssre-test", function (event) {
        // Get the host that is inputted by user
        var host = this.getHost();
        var callback = (err, data, request) => {
            console.log(data);
            if (data == null) {
                console.log(err);
            }
        };

        // Just check if remote has our custom TSSRE file
        this.checkIsValidHost(host, callback);

        return true;
    }, false);
};

// Default widget settings for class
TSSRE.prototype = new Widget();

/* Render as DOM */
TSSRE.prototype.render = function(parent, nextSibling) {
    this.parentDomNode = parent;
    this.computeAttributes();
    this.execute();
    var domNode = this.document.createElement("div");
    parent.insertBefore(domNode, nextSibling);
    this.renderChildren(domNode, null);
    this.domNodes.push(domNode);
};

TSSRE.prototype.getHost = function() {
    var host = this.wiki.getTiddlerText("$:config/tssre/host", undefined);

    // Try to use local host if not available
    if (host == undefined) {
        host = document.location.protocol + ":/" + document.location.host + "/recipes/default";
    }

    // Remove extra slash at the end if added by accident
    if (host.charAt(host.length - 1) == '/')
        host = host.substring(0, host.length - 1);

    return host;
}

// Function to setup list of available tiddlers and save it as a tiddler file
// This will work if on NodeJS server
TSSRE.prototype.setupRemoteTiddlers = function(callback) {
    var host = this.getHost();
    var wiki = this.wiki;
    $tw.utils.httpRequest({
        url: host + "/tiddlers.json",
        callback: function(err, data, request) {
            wiki.setTiddlerData(REMOTE_TIDDLER_FILE, data, {});
            callback(err, data, request);
        }
    });
};

TSSRE.prototype.checkIsValidHost = function(callback) {
    var host = this.getHost();
    // Check to see if special file exists on host
    $tw.utils.httpRequest({
        url: host + "/" + encodeURIComponent(REMOTE_TIDDLER_FILE),
        callback: function(err, data, request) {
            callback(err, data, request);
        }
    });
};

exports.tssre = TSSRE;

})();