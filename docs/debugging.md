# Debugging Guide (VS Code & Xcratch)

This guide explains how to set up and debug the `mbit-more-v2` extension in VS Code using the public [Xcratch Editor](https://xcratch.github.io/editor/).

---

## Overview

In this debug setup, the extension built locally (`dist/microbitMore.mjs`) is served over HTTPS via `live-server` at `https://0.0.0.0:5500`, and loaded directly into the public Xcratch editor (`https://xcratch.github.io/editor/`) via the `?extension=` URL parameter.

By connecting VS Code's Chrome debugger to this session, you can set breakpoints directly in your `src/` source code files and step through execution.

---

## Prerequisites

### 1. Install mkcert & Trust Local CA

To serve files over HTTPS locally, generate local SSL certificates using `mkcert`.

#### Installation (macOS)
```bash
brew install mkcert
```

#### Install Local CA
```bash
mkcert -install
```

#### Generate Certificates
Run inside the `.vscode` directory of the project:
```bash
cd .vscode
mkcert -cert-file localhost.pem -key-file localhost-key.pem localhost 127.0.0.1 0.0.0.0 ::1
```

This creates:
- `.vscode/localhost.pem`
- `.vscode/localhost-key.pem`

*(Note: `*.pem` files are ignored by `.gitignore`.)*

---

## VS Code Configuration

The repository includes pre-configured settings in `.vscode`:

### 1. `.vscode/live-server-https.cjs`
A Node.js script that supplies the generated SSL certificate and private key to `live-server`.

### 2. `.vscode/tasks.json`
Defines the `start live server` background task using `npx live-server` on port 5500 over HTTPS with CORS enabled.

### 3. `.vscode/launch.json`
Defines Chrome debugging configurations:
- **`debug extension on xcratch.github.io editor`**: Automatically starts the live server task and opens Chrome at `https://xcratch.github.io/editor/?extension=https://0.0.0.0:5500/dist/microbitMore.mjs`.
- **`attach on xcratch.github.io editor`**: Attaches debugger if `live-server` is already running.

---

## Step-by-Step Debugging

### Step 1: Start Watch Build
In your terminal, start the watch mode to rebuild the extension when source files change:
```bash
npm run watch
```

### Step 2: Launch Debugger
1. Press `F5` in VS Code (or open "Run and Debug" side bar).
2. Select **`debug extension on xcratch.github.io editor`**.
3. When prompted for the Extension URL, accept the default value (`https://0.0.0.0:5500/dist/microbitMore.mjs`) by pressing `Enter`.

### Step 3: Browser Permissions
1. If Chrome displays a self-signed certificate warning, click "Advanced" -> "Proceed to 0.0.0.0 (unsafe)".
2. If prompted for "Local Network Access", click **Allow** and reload the page if necessary.

### Step 4: Set Breakpoints & Debug
1. Open any source file in VS Code (e.g. `src/vm/extensions/block/microbit-more.js`).
2. Click next to the line numbers to set breakpoints.
3. Trigger the block action in Xcratch Editor; execution will hit your breakpoint in VS Code.
