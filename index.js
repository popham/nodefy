var _parser = require('./src/parser');
var _converter = require('./src/converter');

/**
 * Convert AMD-style JavaScript string into node.js compatible module
 * @param String raw
 * @return String
 */
exports.parse = _parser.parse;

/**
 * Map AMD files to Node files.
 * @param String[] files - AMD file paths that get converted.
 * @param String srcPrefix - Filename prefix to remove from files prior to
 * output.
 * @param String outputFolder - Base directory to receive Node files.
 * @param Function callback(err, results)
 */
exports.batchConvert = _converter.batchConvert;
