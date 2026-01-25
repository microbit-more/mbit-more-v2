import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const packageJsonPath = path.join(projectRoot, 'package.json');
const distDir = path.join(projectRoot, 'dist');

// Read package.json to get version and extensionId
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const version = packageJson.version;
const EXTENSION_ID = packageJson.extensionId;
if (!EXTENSION_ID) {
    console.error('Error: extensionId not found in package.json');
    process.exit(1);
}

console.log(`Building ${EXTENSION_ID} version ${version}...`);

// Run rollup build
try {
    execSync('npm run build', { 
        cwd: projectRoot,
        stdio: 'inherit'
    });
} catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
}

// Create version directory and copy files
const sourceFile = path.join(distDir, `${EXTENSION_ID}.mjs`);
const versionDir = path.join(distDir, version);
const targetFile = path.join(versionDir, `${EXTENSION_ID}.mjs`);

if (fs.existsSync(sourceFile)) {
    // Create version directory
    fs.ensureDirSync(versionDir);
    
    // Copy the module file
    fs.copyFileSync(sourceFile, targetFile);
    console.log(`✓ Created: dist/${version}/${EXTENSION_ID}.mjs`);
    
    // Also copy sourcemap if it exists
    const sourceMapFile = `${sourceFile}.map`;
    const targetMapFile = `${targetFile}.map`;
    if (fs.existsSync(sourceMapFile)) {
        fs.copyFileSync(sourceMapFile, targetMapFile);
        console.log(`✓ Created: dist/${version}/${EXTENSION_ID}.mjs.map`);
    }
    
    // Update versions.json file
    const versionJsonPath = path.join(distDir, 'versions.json');
    let versionData = {
        extensionId: EXTENSION_ID,
        versions: []
    };
    
    // Read existing versions.json if it exists
    if (fs.existsSync(versionJsonPath)) {
        try {
            versionData = JSON.parse(fs.readFileSync(versionJsonPath, 'utf-8'));
            // Ensure versions array exists
            if (!versionData.versions) {
                versionData.versions = [];
            }
        } catch (error) {
            console.warn('Warning: Could not parse existing versions.json, creating new one');
        }
    }
    
    // Remove existing entry for this version if it exists
    versionData.versions = versionData.versions.filter(v => v.version !== version);
    
    // Add new version info
    const newVersionInfo = {
        version: version,
        buildDate: new Date().toISOString(),
        module: `${version}/${EXTENSION_ID}.mjs`
    };
    
    versionData.versions.push(newVersionInfo);
    
    // Sort versions in descending order (newest first)
    versionData.versions.sort((a, b) => {
        const versionA = a.version.split('.').map(Number);
        const versionB = b.version.split('.').map(Number);
        for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
            const numA = versionA[i] || 0;
            const numB = versionB[i] || 0;
            if (numA !== numB) return numB - numA;
        }
        return 0;
    });
    
    // Add latest version reference
    versionData.latest = version;
    
    // Write versions.json
    fs.writeFileSync(versionJsonPath, JSON.stringify(versionData, null, 2), 'utf-8');
    console.log(`✓ Updated: dist/versions.json`);
    
} else {
    console.error(`Error: ${sourceFile} not found`);
    process.exit(1);
}

console.log(`\n✓ Version ${version} build completed successfully!`);
