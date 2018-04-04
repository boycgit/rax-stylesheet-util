const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');
const targetDir = 'dist';

module.exports = common.map(config => {
	return merge(config, {
		mode: 'development',
		devtool: 'inline-source-map',
		devServer: {
			contentBase: path.join(__dirname, targetDir),
			port: 9000,
			hot: true
		}
	});
});
