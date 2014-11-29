var SHOULD_PURGE = true;

var fs = require('fs');
var path = require('path');

exports.readIn = function (id) {
    return exports.readFile(__dirname +'/files/'+  id +'-in.js');
};

exports.readOut = function (id) {
    return exports.readFile(__dirname +'/files/'+  id +'-out.js');
};

exports.readFile = function (p) {
    return fs.readFileSync(p).toString();
};

exports.purge = function (dir) {
    if (!SHOULD_PURGE) return;

    fs.readdirSync(dir).forEach(function (relPath) {
        var p = path.join(dir, relPath);
        if (fs.statSync(p).isDirectory()) {
            exports.purge(p);
        } else {
            fs.unlinkSync(p);
        }
    });

    fs.rmdirSync(dir);
};

exports.mkdir = function (dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
};
