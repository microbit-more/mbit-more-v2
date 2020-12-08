const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const ExtRoot = path.resolve(__dirname, '../');
const DesktopRoot = path.resolve(__dirname, '../../scratch-desktop');
const VmRoot = path.resolve(DesktopRoot, 'node_modules/scratch-vm');

const IcnsFilePath = path.join('buildResources', 'ScratchDesktop.icns');
const IcoFilePath = path.join('buildResources', 'ScratchDesktop.ico');
const SvgFilePath = path.join('src', 'icon', 'ScratchDesktop.svg');
const ProvisionProfilePath = path.join('embedded.provisionprofile');

let stdout;

// Apply patch to scratch-desktop
try {
    stdout = execSync(`cd ${DesktopRoot} && patch -p1 -N -s --no-backup-if-mismatch < ${path.join(ExtRoot, 'scripts', 'scratch-desktop.patch')}`);
    console.log(`stdout: ${stdout.toString()}`);
} catch (err) {
    console.log('fail to apply: scratch-desktop.patch');
}

// Install base GUI
stdout = execSync(`cd ${DesktopRoot} && npm install yokobond/scratch-gui#xcratch-desktop`);
console.log(`stdout: ${stdout.toString()}`);

// Update electron-builder to avoid fail of electron-builder v22.6.0 in Mac.
stdout = execSync(`cd ${DesktopRoot} && npm update electron-builder`);
console.log(`stdout: ${stdout.toString()}`);

// // Use local scratch-vm in scratch-desktop
// // Only for development of scratch-vm
// // Make symbolic link
// function makeSymbolickLink(to, from) {
//     try {
//         const stats = fs.lstatSync(from);
//         if (stats.isSymbolicLink()) {
//             if (fs.readlinkSync(from) === to) {
//                 console.log(`Already exists link: ${from} -> ${fs.readlinkSync(from)}`);
//                 return;
//             }
//             fs.unlink(from);
//         } else {
//             // execSync(`rm -r ${from}`);
//             fs.renameSync(from, `${from}~`);
//         }
//     } catch (err) {
//         // File not esists.
//     }
//     fs.symlinkSync(to, from);
//     console.log(`Make link: ${from} -> ${fs.readlinkSync(from)}`);
// }
// makeSymbolickLink(
//     path.resolve(__dirname, '../../scratch-vm'),
//     path.resolve(DesktopRoot, './node_modules/scratch-vm')
// )

// // Change WebBLE for Electron
// fs.copyFileSync(
//     path.join(VmRoot, 'src', 'io', 'ble-web-electron.js'),
//     path.join(VmRoot, 'src', 'io', 'ble-web.js')
// );

// Apply patch to scratch-vm
try {
    stdout = execSync(`cd ${VmRoot} && patch -p1 -N -s --no-backup-if-mismatch < ${path.join(ExtRoot, 'scripts', 'scratch-vm-desktop.patch')}`);
} catch (err) {
    console.log('fail to apply: scratch-vm-desktop.patch');
}

// Change logo image of scratch-desktop
fs.copyFileSync(
    path.join(ExtRoot, 'scratch-desktop', IcnsFilePath),
    path.join(DesktopRoot, IcnsFilePath)
);
fs.copyFileSync(
    path.join(ExtRoot, 'scratch-desktop', IcoFilePath),
    path.join(DesktopRoot, IcoFilePath)
);
fs.copyFileSync(
    path.join(ExtRoot, 'scratch-desktop', SvgFilePath),
    path.join(DesktopRoot, SvgFilePath)
);

// Set provision profile for Mac app
if (process.platform === 'darwin') {
    fs.copyFileSync(
        path.join(ExtRoot, 'scratch-desktop', ProvisionProfilePath),
        path.join(DesktopRoot, ProvisionProfilePath));
}
