const path = require('path');
const fs = require('fs');
// const { execSync } = require('child_process')

const VmRoot = path.resolve(__dirname, '../../scratch-vm');
const GuiRoot = path.resolve(__dirname, '../../scratch-gui');

// Make symbolic link
function makeSymbolickLink(to, from) {
    try {
        const stats = fs.lstatSync(from);
        if (stats.isSymbolicLink()) {
            if (fs.readlinkSync(from) === to) {
                console.log(`Already exists link: ${from} -> ${fs.readlinkSync(from)}`);
                return;
            }
            fs.unlink(from);
        } else {
            // execSync(`rm -r ${from}`);
            fs.renameSync(from, `${from}~`);
        }
    } catch (err) {
        // File not esists.
    }
    fs.symlinkSync(to, from);
    console.log(`Make link: ${from} -> ${fs.readlinkSync(from)}`);
}

// Use local scratch-vm in scratch-gui
makeSymbolickLink(
    VmRoot,
    path.resolve(GuiRoot, './node_modules/scratch-vm')
)
