var _parser = require('./src/parser');
var _converter = require('./src/converter');

/**
 * Convert AMD-style JavaScript string into node.js compatible module
 * @param String raw
 * @return String
 */
exports.parse = _parser.parse;

/**
 * Read glob content and output files into output folder
 * @param String[] files - Files that should be converted
 * @param String [outputFolder]
 * @param Function callback(err, results)
 */
exports.batchConvert = _converter.batchConvert;
