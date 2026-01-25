#!/usr/bin/env node
'use strict'

import path from 'path';
import fs from 'fs-extra';

// Get scratch-vm path from command line argument
const args = process.argv.slice(2);
const vmPath = args[0] || '../scratch-editor/packages/scratch-vm';

// modify for your environment
const vmSrcDev = path.resolve(process.cwd(), './src/vm');
const vmSrcOrg = path.resolve(process.cwd(), vmPath, 'src');
const vmRefs = [
    'extension-support',
    'util',
    'io',
];

console.log(`Using scratch-vm at: ${vmSrcOrg}`);

// Make symbolic link
const makeSymbolicLink = function (to, from) {
    try {
        const stats = fs.lstatSync(from);
        if (stats.isSymbolicLink()) {
            if (fs.readlinkSync(from) === to) {
                console.log(`Already exists link: ${from} -> ${fs.readlinkSync(from)}`);
                return;
            }
            fs.unlink(from);
        } else {
            fs.renameSync(from, `${from}~`);
        }
    } catch (err) {
        // File not exists.
    }
    fs.symlinkSync(to, from, 'dir');
    console.log(`Make link: ${from} -> ${fs.readlinkSync(from)}`);
}

vmRefs.forEach(dir => {
    makeSymbolicLink(path.resolve(vmSrcOrg, dir), path.resolve(vmSrcDev, dir));
});
