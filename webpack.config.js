/**
 * Created by liuyufei on 13/07/18.
 */
const path = require('path');

module.exports = {
	mode: 'production',
	entry: './webpack/entry.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle_wp.js'
	},
};