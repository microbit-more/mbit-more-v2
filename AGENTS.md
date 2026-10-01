# AGENTS.md - Microbit More v2

This document is a guide for AI agents (Antigravity, GitHub Copilot, etc.) to understand the project.

## Project Overview

**Microbit More v2** is a micro:bit extension for Scratch 3.0. It allows controlling all micro:bit sensors and pins using Scratch 3.0 blocks.

- **Name**: mbit-more-v2
- **Version**: 0.3.0
- **License**: MIT
- **Author**: Koji Yokokawa (@yokobond)

## Directory Structure

```
mbit-more-v2/
├── src/
│   ├── vm/                    # Scratch VM Extension
│   │   ├── extensions/block/  # Main extension block implementation
│   │   │   ├── index.js       # Export
│   │   │   ├── microbit-more.js # Core functionality
│   │   │   ├── ble.js         # BLE (scratch-vm io/ble: Web Bluetooth / Scratch Link)
│   │   │   └── serial-web.js  # Serial communication
│   │   ├── extension-support  # Extension support
│   │   ├── io                 # I/O handling
│   │   └── util               # Utilities
│   └── gui/lib/               # Scratch GUI entry point
├── dist/                      # Build output
├── scripts/                   # Build & development scripts
├── test/                      # Tests
├── docs/                      # Documentation
└── examples/                  # Sample projects
```

## Development Commands

```bash
# Set up development environment
npm run setup-dev

# Build (outputs to dist/)
npm run build

# Watch mode
npm run watch

# Start local Scratch editor
npm run start:local

# Run tests
npm run test

# Run tests (watch mode)
npm run test:watch

# Version bump
npm version [major|minor|patch]
```

## Tech Stack

- **Build**: Rollup
- **Transpiler**: Babel
- **Testing**: Jest + jsdom
- **Communication**: Web Bluetooth API / Scratch Link (LLK)
- **Logging**: tslog

## Testing Policy

Test files should be placed as `*.test.js` or `*.spec.js`:

- `src/vm/extensions/block/**/*.test.js`
- `src/gui/lib/libraries/extensions/entry/**/*.test.js`

### Test Priorities

1. **Connection / Disconnection Logic**: Connection state transitions with micro:bit
2. **Sensor Value Retrieval**: Conversion logic for acceleration, magnetometer, temperature, and light
3. **Event Notification**: Event generation for button and pin inputs
4. **VM Integration**: Opcode and argument mapping for extension blocks
5. **Send Queue / Resend**: Queue order and capacity management

## Related Repositories

This workspace contains related projects:

| Repository | Description |
|-----------|-------------|
| `pxt-mbit-more-v2/` | micro:bit firmware / extension for MakeCode (PXT) |
| `scratch-editor/` | Scratch Editor (GUI, VM, Render) |
| `microbit-more.github.io/` | Public site and hosted editor |
| `microbit-more-doc/` | Documentation site |

## Coding Conventions

- ESLint: Uses `eslint-config-scratch`
- Babel: Transpiles ES6+ → ES5
- React JSX support (for GUI components)

## Build Output

The build generates `dist/microbitMore.mjs`, which is consumed by Xcratch and the Microbit More editor.

```
https://microbit-more.github.io/dist/microbitMore.mjs
```

## BLE Communication Architecture

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│ Scratch VM  │────▶│ microbit-more│────▶│ BLE Layer  │
│   Blocks    │     │   Extension  │     │ (web/llk)  │
└─────────────┘     └──────────────┘     └────────────┘
                                                │ (BLE / Serial)
                                                ▼
                                   ┌─────────────────────────┐
                                   │  micro:bit              │
                                   │  (pxt-mbit-more-v2)     │
                                   │  Custom GATT Service    │
                                   └─────────────────────────┘
```

- **`mbit-more-v2` (Scratch Extension)**: Communicates with micro:bit using Web Bluetooth API or Scratch Link.
- **`pxt-mbit-more-v2` (micro:bit Firmware)**: Custom BLE GATT Service implemented in MakeCode PXT / C++. Runs on micro:bit to handle command packets from Scratch and stream real-time sensor data.

## Debugging

- Inspect logs in Browser DevTools Console
- Logging via `tslog`
- Trace Scratch VM block execution
