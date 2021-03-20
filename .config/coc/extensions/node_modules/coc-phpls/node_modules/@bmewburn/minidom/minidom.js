var parse5 = require("parse5");
var Handler = require("./handler");
var dom = require("./dom");

module.exports = function minidom(html) {
    if (!html) {
        html = "<!doctype html><html><head></head><body></body></html>";
    }

    var handler = new Handler(dom);

    parse5.parse(html, {treeAdapter: handler});

    return handler.document;
};
