const path = require('path');
const webpack = require('webpack');

const targetDir = 'dist';
const commontConfig = {
	node: {
		fs: 'empty'
	}
};

const normalConfig = Object.assign({}, commontConfig, {
	entry: './index.js',
	output: {
		filename: 'index.js',
		libraryTarget: 'commonjs',
		// library: 'RaxStyleUtil', // string,
		path: path.resolve(__dirname, targetDir)
	}
});

const browserConfig = Object.assign({}, commontConfig, {
	entry: './index.js',
	output: {
		filename: 'index.browser.js',
		libraryTarget: 'window',
		library: 'RaxStyleUtil', // string,
		path: path.resolve(__dirname, targetDir)
	}
});

module.exports = [normalConfig, browserConfig];
