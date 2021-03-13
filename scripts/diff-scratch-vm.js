const path = require('path');
const { execSync } = require('child_process');

const Output = path.resolve(__dirname, 'scratch-vm.patch');
const VmRoot = path.resolve(__dirname, '../../scratch-vm');

try {
    execSync(`cd ${VmRoot} && git diff -- .  ':(exclude)package-lock.json' ':(exclude)src/extensions' ':(exclude)*.orig' > ${Output}`);
} catch (err) {
    console.error(err);
}
