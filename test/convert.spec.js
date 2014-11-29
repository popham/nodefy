var convert = require('../src/converter').convert;
var batchConvert = require('../src/converter').batchConvert;

var fs = require('fs');
var path = require('path');

var helper = require('./helpers');
var readFile = helper.readFile;
var readOut = helper.readOut;
var purgeFolder = helper.purge;
var mkdir = helper.mkdir;

var INPUT_DIR = path.join(__dirname, 'files');
var TEMP_DIR = path.join(__dirname, '_tmp');
var BATCH_DIR = path.join(TEMP_DIR, 'batch');

describe('convert', function () {
    beforeEach(function () {
        mkdir(TEMP_DIR);
    });

    afterEach(function () {
        purgeFolder(TEMP_DIR);
    });

    it('should read file from fs and output to a new file', function (done) {
        var inPath = path.join(INPUT_DIR, 'basic_returns_objexp-in.js');
        var outPath = path.join(TEMP_DIR, 'basic_returns_objexp-out.js');
        expect(fs.existsSync(outPath)).toBe(false);
        convert(inPath, outPath, function (err) {
            expect(err).toBe(null);
            expect(readFile(outPath)).toEqual(readOut('basic_returns_objexp'));
            done();
        });
    });

    it('should return string instead of writting to file if outputPath is missing', function (done) {
        var inPath = path.join(INPUT_DIR, 'basic_returns_objexp-in.js');
        convert(inPath, null, function (err, result) {
            expect(err).toBe(null);
            expect(result).toBe(readOut('basic_returns_objexp'));
            done();
        });
    });

    it('should return string instead of writting to file if outputPath is null', function (done) {
        var inPath = path.join(INPUT_DIR, 'basic_returns_objexp-in.js');
        convert(inPath, null, function (err, result) {
            expect(err).toBe(null);
            expect(result).toBe(readOut('basic_returns_objexp'));
            done();
        });
    });

    it('should throw error if it can\'t find file', function (done) {
        var inPath = path.join(INPUT_DIR, 'missing_file.js');
        var outPath = path.join(TEMP_DIR, 'missing_file.js');
        convert(inPath, outPath, function (err, result) {
            expect(err).not.toBe(null);
            expect(result).toBeUndefined();
            expect(function () { readFile(outPath); }).toThrow();
            done();
        });
    });


    it('should work with deep nested folders', function (done) {
        var inPath = path.join(INPUT_DIR, 'nested/deep/plugin-in.js');
        var outPath = path.join(TEMP_DIR, 'nested/deep/plugin-out.js');
        convert(inPath, outPath, function (err, result) {
            expect(err).toBe(null);
            expect(readFile(outPath)).toEqual(readOut('nested/deep/plugin'));
            done();
        });
    });

    describe('batchConvert', function () {
        beforeEach(function () {
            mkdir(BATCH_DIR);
        });

        afterEach(function () {
            purgeFolder(BATCH_DIR);
        });

        it('should return aggregated string from all files if missing outputPath', function (done) {
            var files = ['basic_returns_objexp-in.js', 'magic-in.js']
                .map(function (file) { return path.join(INPUT_DIR, file); });

            batchConvert(files, null, null, function (err, result) {
                expect(err).toBe(null);

                var expected = readOut('basic_returns_objexp') + readOut('magic');
                result = result.map(function (r) { return r.result; }).join('');
                expect(result).toBe(expected);

                done();
            });
        });
    });
});
