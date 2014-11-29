var _fs = require('fs');
var _path = require('path');

var _async = require('async');
var _mkdirp = require('mkdirp');

var _parser = require('./parser');

exports.convert = function (inputPath, outputPath, callback) {
    _fs.readFile(inputPath, function (err, content) {
        if (!err) {
            try {
                content = _parser.parse(content.toString());
            } catch(e) {
                err = e;
            }
        }

        if (err) {
            callback(err);
            return;
        }

        if (!outputPath) {
            callback(null, content);
        } else {
            safeCreateDir(outputPath, function (err) {
                if (err) {
                    callback(err);
                    return;
                }
                _fs.writeFile(outputPath, content, function (err) {
                    callback(err, content);
                });
            });
        }
    });
};


function safeCreateDir(filePath, callback) {
    var dir = _path.dirname(filePath);
    if (!_fs.existsSync(dir)) {
        _mkdirp(dir, callback);
    } else {
        callback(null);
    }
}

exports.batchConvert = function (files, srcPrefix, outputFolder, callback) {
    if (outputFolder === null) outputFolder = process.cwd();
    else outputFolder = _path.resolve(outputFolder);

    if (srcPrefix === null) srcPrefix = process.cwd();
    else srcPrefix = _path.resolve(srcPrefix);

    srcPrefix = srcPrefix.split(_path.sep);

    files = files
        .map(function (name) { return _path.resolve(name); })
        .map(function (name) {
            var target = name.split(_path.sep);
            for (var i=0; i<srcPrefix.length; ++i) {
                // Failed match
                if (target[i] !== srcPrefix[i]) {
                    throw new Error('The source file \''+name+'\' does not descend from the src-prefix directory, \''+srcPrefix.join(_path.sep)+'\'');
                }
            }

            // Successful match
            return {
                source : name,
                target : _path.join(
                    outputFolder,
                    target.slice(srcPrefix.length).join(_path.sep)
                )
            };
        });

    _async.map(files, function (name, cb) {
        exports.convert(name.source, name.target, function (err, result) {
            cb(
                err,
                {
                    sourcePath : name.source,
                    outputPath : name.target,
                    result : result
                }
            );
        });

    }, callback);
};
