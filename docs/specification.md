# Microbit More v2 Communication Protocol Specification

## Overview

This document defines the communication protocol, binary packet data formats, and BLE GATT service specifications exchanged between **Scratch 3.0 / Microbit More v2 (mbit-more-v2)** and the **micro:bit firmware (pxt-mbit-more-v2)**.

---

## Communication Layer Overview

Microbit More v2 supports two types of communication transports:

1. **Web Bluetooth API (BLE)**: Wireless communication using custom GATT services
2. **Web Serial API (USB Serial)**: Arbitrated packet-based serial communication over USB connection

---

## BLE GATT Service & Characteristic Definitions

- **Service UUID**: `0b50f3e4-607f-4151-9091-7d008d6ffc5c` (`MM_SERVICE`)

| Characteristic Name | UUID | R/W | Role / Description |
|---|---|---|---|
| `COMMAND_CH` | `0b500100-607f-4151-9091-7d008d6ffc5c` | Read / Write | Initial configuration retrieval and command transmission channel |
| `STATE_CH` | `0b500101-607f-4151-9091-7d008d6ffc5c` | Read | Periodic state data reading (GPIO, buttons, light, temp, sound) |
| `MOTION_CH` | `0b500102-607f-4151-9091-7d008d6ffc5c` | Read | Periodic motion data reading (acceleration, orientation, mag force, compass) |
| `PIN_EVENT_CH` | `0b500110-607f-4151-9091-7d008d6ffc5c` | Notify | Digital and analog pin event notifications |
| `ACTION_EVENT_CH` | `0b500111-607f-4151-9091-7d008d6ffc5c` | Notify | Button events and gesture detection notifications |
| `MESSAGE_CH` | `0b500130-607f-4151-9091-7d008d6ffc5c` | Notify | String/numeric data notifications (micro:bit V2 exclusive) |

---

## Packet Format Specifications

### 1. State Data Packet (`STATE_CH` / 8 Bytes)

| Offset | Type | Description | Data Conversion & Format |
|---|---|---|---|
| `0..3` | Uint32LE | GPIO & Button state bitmap | Bits 0..23: GPIO pin levels<br>Bit 24: P0, Bit 25: P1, Bit 26: P2<br>Bit 27: Button A, Bit 28: Button B, Bit 29: LOGO |
| `4` | Uint8 | Light level | `0` (dark) to `255` (bright) |
| `5` | Uint8 | Temperature | `(val - 128)` Celsius [°C] |
| `6` | Uint8 | Sound level | `0` to `255` |
| `7` | Uint8 | Reserved | 0x00 |

### 2. Motion Data Packet (`MOTION_CH` / 20 Bytes)

| Offset | Type | Description | Data Conversion & Format |
|---|---|---|---|
| `0..1` | Int16LE | Pitch | `Math.round(val * 180 / Math.PI / 1000)` [degrees] |
| `2..3` | Int16LE | Roll | `Math.round(val * 180 / Math.PI / 1000)` [degrees] |
| `4..5` | Int16LE | Acceleration X | `val` [mg] (`1G = 1000`) |
| `6..7` | Int16LE | Acceleration Y | `val` [mg] |
| `8..9` | Int16LE | Acceleration Z | `val` [mg] |
| `10..11` | Uint16LE | Compass Heading | `0` to `359` [degrees] |
| `12..13` | Int16LE | Magnetic Force X | [µT] |
| `14..15` | Int16LE | Magnetic Force Y | [µT] |
| `16..17` | Int16LE | Magnetic Force Z | [µT] |
| `18..19` | - | Reserved | 0x0000 |

### 3. Action Event Notification Packet (`ACTION_EVENT_CH` / 20 Bytes)

Data format identifier `0x12` (`ACTION_EVENT`) is set at `offset 19`.

- **Button Event (`actionEventType = 0x01`)**:
  - `offset 0`: `0x01`
  - `offset 1..2`: Button ID (`0: P0`, `1: P1`, `2: P2`, `3: A`, `4: B`, `5: LOGO`)
  - `offset 3`: Event ID (`1: DOWN`, `2: UP`, `3: CLICK`, `4: LONG_CLICK`, `5: HOLD`)
  - `offset 4..7`: Timestamp [ms] (Uint32LE)

- **Gesture Event (`actionEventType = 0x02`)**:
  - `offset 0`: `0x02`
  - `offset 1`: Gesture ID (`1: TILT_UP`, `2: TILT_DOWN`, `3: TILT_LEFT`, `4: TILT_RIGHT`, `5: FACE_UP`, `6: FACE_DOWN`, `7: FREEFALL`, `8: G3`, `9: G6`, `10: G8`, `11: SHAKE`)
  - `offset 2..5`: Timestamp [ms] (Uint32LE)

### 4. Command Packet Specifications (`COMMAND_CH`)

- **Display Text Command (`0x01`)**:
  - `[0]`: `0x01` (COMMAND_ID)
  - `[1..2]`: Scroll delay time [ms] (Uint16LE)
  - `[3..]`: UTF-8 String (max 18 characters)

- **Pin Mode Setting Command (`0x10`)**:
  - `[0]`: `0x10`
  - `[1]`: Pin Index
  - `[2]`: Mode ID (`INPUT: 0`, `OUTPUT: 1`, `PWM: 2`, `SERVO: 3`, `TOUCH: 4`)
