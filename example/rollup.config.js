import resolve from 'rollup-plugin-node-resolve';
import path from 'path';
import commonjs from 'rollup-plugin-commonjs';
import react from 'react';
import reactDom from 'react-dom';
import ts from "@wessberg/rollup-plugin-ts";
import replace from 'rollup-plugin-replace';

export default {
	input: path.resolve(__dirname, 'src/index.ts'),
	output: {
		file: path.resolve(__dirname, 'dist/bundle.js'),
		format: 'iife',
		globals: {
			react: 'React',
			'react-dom': 'ReactDOM'
		},
		sourcemap: true
	},
	external: ['react', 'react-dom'],
	plugins: [
		replace({
			'process.env.NODE_ENV': JSON.stringify('development')
		}),
		ts({
			transpiler: 'babel',
			babelConfig: path.resolve(__dirname, '../babel.config.js')
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
	]
};
