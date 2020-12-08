const path = require('path');
const { execSync } = require('child_process');

const ExtRoot = path.resolve(__dirname, '../');
const DesktopRoot = path.resolve(__dirname, '../../scratch-desktop');

try {
    execSync(`cd ${DesktopRoot} && git diff -- .  ':(exclude)package-lock.json' ':(exclude)buildResources' ':(exclude)src/icon' > ${path.join(ExtRoot, 'scripts', 'scratch-desktop.patch')}`);
} catch (err) {
    console.error(err);
}
