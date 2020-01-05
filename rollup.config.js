import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import react from 'react';
import reactDom from 'react-dom';
import ts from "@wessberg/rollup-plugin-ts";
import replace from 'rollup-plugin-replace';

const plugins = [
	replace({
		'process.env.NODE_ENV': JSON.stringify('production')
	}),
	ts({
		transpiler: 'babel'
	}),
	resolve({
		extensions: ['.tsx', '.ts', '.js', '.jsx']
	}),
	commonjs({
		include: 'node_modules/**',
		namedExports: {
			react: Object.keys(react),
			'react-dom': Object.keys(reactDom)
		}
	})
];
const external = ['react', 'react-dom'];
const input = 'src/index.ts';
const common = {
	plugins,
	external,
	input
};

export default [
	// browser umd
	{
		output: {
			name: 'grag',
			file: pkg.browser,
			format: 'umd',
			globals: {
				react: 'React',
				'react-dom': 'ReactDOM'
			},
			sourcemap: true
		},
		...common
	},
	// commonjs and ES module
	{
		output: [
			{ file: pkg.main, format: 'cjs', sourcemap: true },
			{ file: pkg.module, format: 'es', sourcemap: true }
		],
		...common
	}
];
