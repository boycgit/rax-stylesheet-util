import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

const targetFile = process.env.NODE_ENV === 'production' ? 'dist' : 'build';
export default {
	input: 'index.js',
	output: [
		{
			file: `${targetFile}/index.js`,
			format: 'cjs'
		},
		{
			file: `${targetFile}/index.es.js`,
			format: 'es'
		}
	],
	sourceMap: 'inline',
	plugins: [
		resolve(),
		commonjs(),
		// globals(),
		// builtins(),
		eslint(),
		json(),
		replace({
			exclude: 'node_modules/**',
			ENV: JSON.stringify(process.env.NODE_ENV || 'development')
		}),
		process.env.NODE_ENV === 'production' && uglify()
	]
};
