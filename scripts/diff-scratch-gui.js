const path = require('path');
const { execSync } = require('child_process');

const Output = path.resolve(__dirname, 'scratch-gui.patch');
const GuiRoot = path.resolve(__dirname, '../../scratch-gui');

try {
    execSync(`cd ${GuiRoot} && git diff -- .  ':(exclude)package-lock.json' ':(exclude)src/lib/libraries/extensions/microbitMore' ':(exclude)*.orig' > ${Output}`);
} catch (err) {
    console.error(err);
}
