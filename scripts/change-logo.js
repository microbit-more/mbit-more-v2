const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process')

function getArgs () {
    const args = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach( arg => {
            if (arg.slice(0,2) === '--') {
                // long arg
                const longArg = arg.split('=');
                const longArgFlag = longArg[0].slice(2,longArg[0].length);
                const longArgValue = longArg.length > 1 ? longArg[1] : true;
                args[longArgFlag] = longArgValue;
            }
            else if (arg[0] === '-') {
                // flags
                const flags = arg.slice(1,arg.length).split('');
                flags.forEach(flag => {
                    args[flag] = true;
                });
            }
        });
    return args;
}

const args = getArgs();

const GuiRoot = args['gui'] ?
    path.resolve(process.cwd(), args['gui'])
    : path.resolve(__dirname, '../../scratch-gui');
const GuiMenuBarLogoFile = path.resolve(GuiRoot, 'src/components/menu-bar/scratch-logo.svg');

// Change logo image of scratch-gui
fs.copyFileSync(path.resolve(__dirname, '../site/scratch-logo.svg'), GuiMenuBarLogoFile);
console.log(`Overwrite ${GuiMenuBarLogoFile} `);

// Applay patch to scratch-gui
try {
    execSync(`cd ${GuiRoot} && patch -p1 -N -s --no-backup-if-mismatch < ${path.resolve(__dirname, './scratch-gui-logo.patch')}`);
    console.log(`Patch ${path.resolve(__dirname, './scratch-gui-logo.patch')}`);
} catch (err) {
    // already applyed?
    console.log(`Fail patch ${path.resolve(__dirname, './scratch-gui-logo.patch')}`);
    // console.error(err);
}
