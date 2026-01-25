import path from 'path';
import fs from 'fs-extra';

import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import nodePolifills from 'rollup-plugin-polyfill-node';
import importImage from '@rollup/plugin-image';
import multi from '@rollup/plugin-multi-entry';
import json from '@rollup/plugin-json';

// Read package.json to get extensionId
const packageJsonPath = path.resolve(process.cwd(), './package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const EXTENSION_ID = packageJson.extensionId;
if (!EXTENSION_ID) {
    console.error('Error: extensionId not found in package.json');
    process.exit(1);
}

// path for block
const blockSrcDir = path.resolve(process.cwd(), './src/vm/extensions/block');
const blockFile = path.resolve(blockSrcDir, 'index.js');
// path for entry
const entrySrcDir = path.resolve(process.cwd(), './src/gui/lib/libraries/extensions/entry');
const entryFile = path.resolve(entrySrcDir, 'index.jsx');
// path for output
const outputDir = path.resolve(process.cwd(), './dist');
const moduleFile = path.resolve(outputDir, `${EXTENSION_ID}.mjs`);

const rollupOptions = {
    input: [entryFile, blockFile],
    context: `window`,
    plugins: [
        multi(),
        importImage(),
        commonjs(),
        nodePolifills(),
        nodeResolve({
            browser: true, 
            preferBuiltins: false, 
            modulePaths: [
                path.resolve(process.cwd(), './node_modules'),
            ],
            // Add these options to better resolve @babel/runtime
            include: ['**'],
            skip: [],
        }),
        json(),
        babel({
            babelrc: false,
            exclude: ['node_modules/**'],
            presets: [
                ['@babel/preset-env',
                    {
                        "modules": false,
                        targets: {
                            browsers: [
                                'last 3 versions',
                                'Safari >= 8',
                                'iOS >= 8']
                        }
                    }
                ],
                '@babel/preset-react'
            ],
            babelHelpers: 'runtime',
            plugins: [
                '@babel/plugin-transform-react-jsx',
                [
                    "@babel/plugin-transform-runtime",
                    { 
                        "regenerator": true,
                        "useESModules": true
                    }
                ]
            ],
        }),
    ],
    output: {
        file: moduleFile,
        format: 'es',
        sourcemap: true,
    },
    watch: {
        clearScreen: false,
        chokidar: {
            usePolling: true,
        },
        buildDelay: 500,
    },
    external: [],
}

export default rollupOptions;
