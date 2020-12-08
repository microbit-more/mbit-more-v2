const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process')

function getArgs() {
    const args = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach(arg => {
            if (arg.slice(0, 2) === '--') {
                // long arg
                const longArg = arg.split('=');
                const longArgFlag = longArg[0].slice(2, longArg[0].length);
                const longArgValue = longArg.length > 1 ? longArg[1] : true;
                args[longArgFlag] = longArgValue;
            }
            else if (arg[0] === '-') {
                // flags
                const flags = arg.slice(1, arg.length).split('');
                flags.forEach(flag => {
                    args[flag] = true;
                });
            }
        });
    return args;
}

const args = getArgs();

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
            if (process.platform === 'win32') {
                execSync(`rd /s /q ${from}`);
            } else {
                execSync(`rm -r ${from}`);
                // fs.renameSync(from, `${from}~`);
            }
        }
    } catch (err) {
        // File not esists.
    }
    fs.symlinkSync(to, from);
    console.log(`Make link: ${from} -> ${fs.readlinkSync(from)}`);
}

// Copy directory after delete old one.
function copyDir(from, to) {
    try {
        const stats = fs.lstatSync(to);
        if (stats.isSymbolicLink()) {
            fs.unlinkSync(to);
        } else {
            if (process.platform === 'win32') {
                execSync(`rd /s /q ${to}`);
            } else {
                execSync(`rm -r ${to}`);
                // fs.renameSync(to, `${to}~`);
            }
        }
    } catch (err) {
        // File not esists.
    }
    if (process.platform === 'win32') {
        execSync(`xcopy ${from} ${to} /I /Y`);
    } else {
        execSync(`mkdir -p ${to} && cp -r ${path.join(from, '*')} ${to}`);
    }

    console.log(`copy dir ${from} -> ${to}`);
}

const ExtId = 'microbitMore';
const ExtDirName = 'microbitMore';

const VmRoot = args['vm'] ?
    path.resolve(process.cwd(), args['vm']) :
    path.resolve(__dirname, '../../scratch-vm');
const GuiRoot = args['gui'] ?
    path.resolve(process.cwd(), args['gui']) :
    path.resolve(__dirname, '../../scratch-gui');

const ExtBlockPath = path.resolve(__dirname, '../src/block');
const ExtEntryPath = path.resolve(__dirname, '../src/entry');

const VmExtDirPath = path.resolve(VmRoot, `src/extensions/${ExtDirName}`);
const GuiExtDirPath = path.resolve(GuiRoot, `src/lib/libraries/extensions/${ExtDirName}`);

const EntryFile = path.resolve(GuiExtDirPath, './index.jsx');
const BlockFile = path.resolve(VmExtDirPath, './index.js');

const VmExtManagerFile = path.resolve(VmRoot, './src/extension-support/extension-manager.js');
const VmVirtualMachineFile = path.resolve(VmRoot, './src/virtual-machine.js');
const GuiExtIndexFile = path.resolve(GuiRoot, './src/lib/libraries/extensions/index.jsx');

let stdout;

if (args['link']) {
    // Make symbolic link in scratch-vm. 
    makeSymbolickLink(ExtBlockPath, VmExtDirPath);
    // Make symbolic link in scratch-gui. 
    makeSymbolickLink(ExtEntryPath, GuiExtDirPath);
} else {
    // Copy block dir to scratch-vm. 
    copyDir(ExtBlockPath, VmExtDirPath);
    // Copy entry dir in scratch-gui. 
    copyDir(ExtEntryPath, GuiExtDirPath);
}

// Replace URL in entry and block code.
if (args['url']) {
    const url = args['url'];
    // Replace URL in entry
    let entryCode = fs.readFileSync(EntryFile, 'utf-8');
    entryCode = entryCode.replace(/extensionURL:\s*[^,]+,/m, `extensionURL: '${url}',`);
    fs.writeFileSync(EntryFile, entryCode);
    console.log(`Entry: extensionURL = ${url}`);

    // Replace URL in entry
    let blockCode = fs.readFileSync(BlockFile, 'utf-8');
    blockCode = blockCode.replace(/let\s+extensionURL\s+=\s+[^;]+;/m, `let extensionURL = '${url}';`);
    fs.writeFileSync(BlockFile, blockCode);
    console.log(`Block: extensionURL = ${url}`);
}

// Add the extension to extension manager of scratch-vm. 
let managerCode = fs.readFileSync(VmExtManagerFile, 'utf-8');
if (managerCode.includes(ExtId)) {
    console.log(`Already registered in manager: ${ExtId}`);
} else {
    fs.copyFileSync(VmExtManagerFile, `${VmExtManagerFile}_orig`);
    managerCode = managerCode.replace(/builtinExtensions = {[\s\S]*?};/, `$&\n\nbuiltinExtensions.${ExtId} = () => require('../extensions/${ExtDirName}');`);
    fs.writeFileSync(VmExtManagerFile, managerCode);
    console.log(`Registered in manager: ${ExtId}`);
}

if (args['C']) {
    // Add the extension as a core extension. 
    let vmCode = fs.readFileSync(VmVirtualMachineFile, 'utf-8');
    if (vmCode.includes(ExtId)) {
        console.log(`Already added as a core extension: ${ExtId}`);
    } else {
        fs.copyFileSync(VmVirtualMachineFile, `${VmVirtualMachineFile}_orig`);
        vmCode = vmCode.replace(/CORE_EXTENSIONS = \[[\s\S]*?\];/, `$&\n\nCORE_EXTENSIONS.push('${ExtId}');`);
        fs.writeFileSync(VmVirtualMachineFile, vmCode);
        console.log(`Add as a core extension: ${ExtId}`);
    }
}

// Add the extension to list of scratch-gui. 
let indexCode = fs.readFileSync(GuiExtIndexFile, 'utf-8');
if (indexCode.includes(ExtId)) {
    console.log(`Already added to extrnsion list: ${ExtId}`);
} else {
    fs.copyFileSync(GuiExtIndexFile, `${GuiExtIndexFile}_orig`);
    const immutableDefault = /^\s*export\s+default\s+\[/m
    if (immutableDefault.test(indexCode)) {
        // Make the list of extensions mutable.
        indexCode = indexCode.replace(immutableDefault, 'const extensions = [');
        indexCode += '\nexport default extensions;';
    }
    indexCode += `\n// Injected for extra extension ${ExtId}`;
    indexCode += `\nimport ${ExtId} from './${ExtDirName}/index.jsx';`;
    indexCode += `\nextensions.unshift(${ExtId});`;
    indexCode += '\n';
    fs.writeFileSync(GuiExtIndexFile, indexCode);
    console.log(`Added to extrnsion list: ${ExtId}`);
}

// Applay patch fro translation to scratch-gui
try {
    stdout = execSync(`cd ${GuiRoot} && patch -p1 -N -s --no-backup-if-mismatch < ${path.resolve(__dirname, './scratch-gui-translation.patch')}`);
    console.log(`stdout: ${stdout.toString()}`);
} catch (err) {
    // already applyed
    console.log(`fail scratch-gui-translation.patch`);
    // console.error(err);
}
