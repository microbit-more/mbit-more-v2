const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
// const log = require('../../util/log');
const cast = require('../../util/cast');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');

/**
 * Formatter which is used for translating.
 * When it was loaded as a module, 'formatMessage' will be replaced which is used in the runtime.
 * @type {Function}
 */
let formatMessage = require('format-message');

const EXTENSION_ID = 'microbitMore';

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
let extensionURL = 'https://yokobond.github.io/mbit-more/dist/microbitMore.mjs';

/**
 * Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAABG2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+Gkqr6gAAAYNpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHLK8RRFMc/82Dk0QgLC2XSsEKMGmwsZmIoLMYor83MzzzUPH79fjNpslW2U5TYeC34C9gqa6WIlGxsrIkN+jm/GTWSObdzz+d+7z2ne88FayippHR7H6TSWS0Y8Lnm5hdcjifsNFHNIO1hRVenZsZCVLT3WyxmvO4xa1U+96/VLUd1BSw1wiOKqmWFx4UnV7OqyVvCLUoivCx8ItytyQWFb0w9UuJnk+Ml/jRZCwX9YG0UdsV/ceQXKwktJSwvx51K5pSf+5gvqY+mZ2ckdoi3oRMkgA8XE4zix0s/wzJ76cFDr6yokN9XzJ8mI7mKzCp5NFaIkyBLt6g5qR6VGBM9KiNJ3uz/377qsQFPqXq9D6oeDeO1Exyb8FUwjI8Dw/g6BNsDnKfL+Zl9GHoTvVDW3HvgXIfTi7IW2YazDWi9V8NauCjZxK2xGLwcQ8M8NF9B7WKpZz/7HN1BaE2+6hJ2dqFLzjuXvgGIDmf1SJ4uQQAAAAlwSFlzAAALEwAACxMBAJqcGAAACJpJREFUWIXtmGlsXNUVx3/3vvdm7BnbSRxncRLHa+IsZCmIJbSlKQG1SLRNgoqiUFGpaoUUFSTURRQFlRLoQhekQtUPpYvEB0AiJQVBU1q2gptCUgjZIAl2xo4dJyHjZOzZ3nLv6YcZTwy2k1CpH5Dyl0bz3n1v3v29c849/6uBi7qoi/pkS310oL25RQFVgL7Qh2z+yW9fbKivafVc1wMIwqiQHhrZd//dm9Z/DBYD+N29KZkUsL25Rbfd9Js/eU2rbtFV08YBBu8+QWzxBgAkf4pocCde+w1EAzvwdz0CYj4Gz4clIkdCv3B316vPPjF2/EMQUzuvnxZrvuZrE8Lte4yo54XSG+VPUey6DxXlMMd2EPznN+PglFITfiaTUqrVi1dtbm9uiY8dd8eeVE9vnaFiNeOeEux7jKj7eZSXwOY/oNi1Bcl/QHRiN/bgNhCDqq7HSc4EwAwPIMHIpEBKKURkoivzAWdSwIk0CiciYEP8rvtQhXRp8kwPGogtWo81ETZ7HIB4x3KkeIYo9Y+zRSQggFIgci7ID+ucgMG+xwjff67y1tqGqGIa7Wi0gtLsgls7myD1MnboEMqpQsIM3rxV4OhKFEUEK4IVQKQMe37ISQFH4UYn0Aq01rha4TgOWqsyHtC7nao5VyJNV6EEJMohvS8Qj7mocgitCMZajLFEWBDB2v8xgmMjJyJordCqBOe5Dp7r4roajUIQTPEEUfc2rBUEwVEKx9E4ca9yT2SFKDIEIogojAjO1FaSi9cRJuYQpV4iKM95TsCxcKNSgCpHznNd4jGXFZk0Mwt5uua34cVj5PIFxIIbc/H9gJpkNWIss4eHuOTEcf42r41s+YVL6VbguMiUdkzfPwm7nz9/BAvvbx/x6hvPglVWoUIrcLTCczVxz+W2f71C3VCatmUrydyzmTfe2kMimWDJogX8dfvLXL96FflXX+PmZ7YS94t8cF0V/549D2OFMDKlZ4sQ9HcRHHjy46UYhAUdHWhdaodRGDAwMIDjaFxHE3MdnHwegM/u3c0bW7bgr76O3EiWVwaPU5OIc/zpZ/jmX54iHgQA1FqD52h8XUr//OZmBIX4bxK2NNNzJHXhgEuXLOEH37sN3/dLDRbY8uNfkzl9Gkc7uI5G67M97sq971ClFNvXrqVuylRiO3dx6zNb8cpwANrRpbrUmgUd7Xx709cx1uK6Lq7rctc9P6e/f2AcyzjHaGmeR3V1nFwuz+Z7f8kDP3uktFAcF6VKfUyPacAvXbsGqzUr9uzmxm1P07h/H7dufRLP9+lZsJBUa1tpIlWqY1XuBvl8gR/e9xD3//RhRIRkIklrS9M4nnEDdXW1uG4psBUMkcqxUgqlFaPt69CixWy7eQPGcVi65x3W/uFRvDDk8MJOnrrpq0TOWWNQUl5wUlosY33G81ym1NWOs55xKd6z912WLllMMplgy73fRakSoLFnvVasVFJsjKXw+dU87Tise/JxnCjiwMJO3rr9dmLDWVS5jhnT8oxYEolq7r3nTlzPRSnFmUyG/v6BcbuNCWtw/4ED/OiBh9Fal1pCFHF88DiJqlipTQDGWgAiYznw3vuYhtkM3LSBOSdP8PYly6GnD8fRRMaUk1D6nQDd3d384qFHEcAKhGE4Yf1NCgiKw909VF22iWDPH3GMj+fqSiCsCFqVzoPI0NLWzJHUAKda24ldfTUjBw6ytK2FdHqo0qosMgZS0XMkRWQMpuwmk9nexIBKEV/5LdwZywjGDIuAtVJxDIAwMuQLPtlCESc0DOey5IsB2UKBgh9U7ExsyYtFpOLFctYsJ9WEgLElG9D1najM4fIuREpwIlhriaxFyhMHkeF4aoDMSB5jLWeGswRBRE9qAAWYcoojKxhjsab8ahewk4FJtvXB/scpvPgdsjt+hUQFpAw5CheGESaRAGAExfq1N1DfUE/HgjY2blxPMYy48UtfYO68RkwyCUBOO4TGYqQEOgp5rk0sfGTLf9nl18ytq2/s/+hNTsWHNXHPI+Y5LE6foD6fY0dTG0XfJ7QQRQYrlpjn4SiIxz3m5nMsO3aUVzoWkTfgRxFBaAiNOZt+qXyPHD345uzu3lR+dO4JU7xgVjrT1pB+Np2r+dyu1JwmoVRDjopYs6h3pyivoYv5rdGUGZgwIrIKh4AvruzemQ90/PVDrcuNePiBoS+epL+tkytaBt/O++LvH6i7qug7lRR/ekHfoWrX3zeYmbJub3/DhaX4ms6jvb/bevobV7YNvOU5o/VnWd3ZU+w+uWSjterBzlnH8MOwFI3IsGbpEfNeX+0tgS93LG8alDAqjReDkE/N72Ok2HDnmVzDHSuaBjHlRTK9Js+iWSf+/vs/pzeumH8iNRHLuAi2zcjwmYXHlr3woOqfPTU/40i6oVTsVnF562DVVy49tNtzlbvrSCOe4+OoCFdHrGgadNZdOvSOCPJ2X6OKeyFaaapjEYvnnKZ1xt7nEEP/UB3WRCgtNE7N8uXL+jZd0ZFYH0TDs18/NC9/9OB5ANcs7WVqMlCZQt3MRGyYjasOMDXhExmNFUVgq5PTE8OsXuSzcv4gtdUhiVhAEClQbrVCWL04xfKmk8QcS0NdgWwxRjZMJGPa0jz9KB2z0jja0lCb5/DJuWq4mGicWZvm2iV93mtd5wAcGRo87WqVA5LTEtkxV0odSythSnUWrS1KGZSyaGXQyqCUg6MjYo4hNICyKG1xtEEpQ228UD62qIqnwMzaDDNrM0RGqPKiU0A0KaCJwkI6E7/r1HDVA3PrszV535WhkViuGGjHipJqL3I8x4+FolQm5/ln8p5fDJRb5bnadYyalizGrBU1lK3yz2RjgeOIMkZiRpRMT/oxrYQzOS8aynlFBUqsuPU12bigSI/Ec9m8+X53b2qsN4z/6wOgvbnFm2j8/yzp7k1F57/toi7qoj5Z+i+Wq1Nf6TRyQQAAAABJRU5ErkJggg==';

/**
 * Enum for micro:bit BLE command protocol.
 * https://github.com/LLK/scratch-microbit-firmware/blob/master/protocol.md
 * @readonly
 * @enum {number}
 */
const BLECommand = {
    CMD_CONFIG: 0x00,
    CMD_PIN: 0x01,
    CMD_DISPLAY: 0x02,
    CMD_SHARED_DATA: 0x03
};


/**
 * Enum for command about gpio pins.
 * @readonly
 * @enum {number}
 */
const MMPinCommand =
{
    SET_OUTPUT: 0x01,
    SET_PWM: 0x02,
    SET_SERVO: 0x03,
    SET_PULL: 0x04,
    SET_EVENT: 0x05,
    SET_TOUCH: 0x06
};

/**
 * Enum for command about gpio pins.
 * @readonly
 * @enum {number}
 */
const MbitMoreDisplayCommand =
{
    CLEAR: 0x00,
    TEXT: 0x01,
    PIXELS_0: 0x02,
    PIXELS_1: 0x03
};


/**
 * Enum for pull mode.
 * @readonly
 * @enum {number}
 */
const MMPinMode = {
    PullNone: 0,
    PullUp: 1,
    PullDown: 2
};

/**
 * Enum for data format.
 * @readonly
 * @enum {number}
 */
const MMDataFormat = {
    PIN_EVENT: 0x10,
    ACTION_EVENT: 0x11,
    SHARED_DATA: 0x13
};

/**
 * Enum for action event type.
 * @readonly
 * @enum {number}
 */
const MbitMoreActionEvent = {
    BUTTON: 0x01,
    GESTURE: 0x02
};

/**
 * Enum for event value in the micro:bit runtime.
 * @readonly
 * @enum {number}
 */
const MMButtonID = {
    A: 5,
    B: 11,
    ANY: 255
};

/**
 * Enum for event value in the micro:bit runtime.
 * @readonly
 * @enum {number}
 */
const MMButtonEvent = {
    DOWN: 1,
    UP: 2,
    CLICK: 3,
    LONG_CLICK: 4,
    HOLD: 5,
    DOUBLE_CLICK: 6
};


/**
 * Enum for event value of gesture.
 * @readonly
 * @enum {number}
 */
const MbitMoreGestureEvent =
{
    TILT_UP: 1,
    TILT_DOWN: 2,
    TILT_LEFT: 3,
    TILT_RIGHT: 4,
    FACE_UP: 5,
    FACE_DOWN: 6,
    FREEFALL: 7,
    G3: 8,
    G6: 9,
    G8: 10,
    SHAKE: 11
};

/**
 * Enum for event type in the micro:bit runtime.
 * @readonly
 * @enum {number}
 */
const MMPinEventType = {
    NONE: 0,
    ON_EDGE: 1,
    ON_PULSE: 2,
    ON_TOUCH: 3
};

/**
 * Enum for event value in the micro:bit runtime.
 * @readonly
 * @enum {number}
 */
const MMPinEvent = {
    RISE: 2,
    FALL: 3,
    PULSE_HIGH: 4,
    PULSE_LOW: 5
};

/**
 * A time interval to wait (in milliseconds) before reporting to the BLE socket
 * that data has stopped coming from the peripheral.
 */
const BLETimeout = 4500;

/**
 * A time interval to wait (in milliseconds) while a block that sends a BLE message is running.
 * @type {number}
 */
const BLESendInterval = 10;

/**
 * A string to report to the BLE socket when the micro:bit has stopped receiving data.
 * @type {string}
 */
const BLEDataStoppedError = 'micro:bit extension stopped receiving data';

const MM_SERVICE = {
    ID: 'a62d574e-1b34-4092-8dee-4151f63b2865',
    COMMAND_CH: 'a62d0100-1b34-4092-8dee-4151f63b2865',
    SENSORS_CH: 'a62d0101-1b34-4092-8dee-4151f63b2865',
    DIRECTION_CH: 'a62d0102-1b34-4092-8dee-4151f63b2865',
    PIN_EVENT_CH: 'a62d0110-1b34-4092-8dee-4151f63b2865',
    ACTION_EVENT_CH: 'a62d0111-1b34-4092-8dee-4151f63b2865',
    ANALOG_IN_CH: [
        'a62d0120-1b34-4092-8dee-4151f63b2865',
        'a62d0121-1b34-4092-8dee-4151f63b2865',
        'a62d0122-1b34-4092-8dee-4151f63b2865'
    ],
    SHARED_DATA_CH: 'a62d0130-1b34-4092-8dee-4151f63b2865'
};

/**
 * Enum for pin mode menu options.
 * @readonly
 * @enum {string}
 */
const PinMode = {
    PULL_NONE: 'pullNone',
    PULL_UP: 'pullUp',
    PULL_DOWN: 'pullDown'
};


// /**
//  * Enum for micro:bit touch pins.
//  * @readonly
//  * @enum {string}
//  */
// const MicroBitTouchPins = {
//     LOGO: 'logo',
//     P0: 'p0',
//     P1: 'p1',
//     P2: 'p2'
// };

/**
 * Enum for micro:bit pin states.
 * @readonly
 * @enum {string}
 */
const MicroBitPinState = {
    ON: 'on',
    OFF: 'off'
};


/**
 * Enum for axis menu options.
 * @readonly
 * @enum {string}
 */
const AxisSymbol = {
    X: 'x',
    Y: 'y',
    Z: 'z',
    Absolute: 'absolute'
};

/**
 * The unit-value of the gravitational acceleration from Micro:bit.
 * @type {number}
 */
const G = 1024;

/**
 * Manage communication with a MicroBit peripheral over a Scrath Link client socket.
 */
class MbitMore {

    /**
     * Construct a MicroBit communication object.
     * @param {Runtime} runtime - the Scratch 3.0 runtime
     * @param {string} extensionId - the id of the extension
     */
    constructor (runtime, extensionId) {

        /**
         * The Scratch 3.0 runtime used to trigger the green flag button.
         * @type {Runtime}
         * @private
         */
        this._runtime = runtime;

        /**
         * The BluetoothLowEnergy connection socket for reading/writing peripheral data.
         * @type {BLE}
         * @private
         */
        this._ble = null;
        this._runtime.registerPeripheralExtension(extensionId, this);

        /**
         * The id of the extension this peripheral belongs to.
         */
        this._extensionId = extensionId;

        /**
         * The most recently received value for each sensor.
         * @type {Object.<string, number>}
         * @private
         */
        this._sensors = {
            gestureState: 0,
            sharedData: [0, 0, 0, 0]
        };

        this.digitalLevel = {};
        this.lightLevel = 0;
        this.temperature = 0;
        this.soundLevel = 0;
        this.pitch = 0;
        this.roll = 0;
        this.acceleration = {
            x: 0,
            y: 0,
            z: 0
        };
        this.compassHeading = 0;
        this.magneticForce = {
            x: 0,
            y: 0,
            z: 0
        };

        /**
         * The most recently received button events for each buttons.
         * @type {Object} - Store of buttons which has events.
         * @private
         */
        this.buttonEvents = {};
        Object.values(MMButtonID).forEach(id => {
            this.buttonEvents[id] = {};
        });

        /**
         * The most recently received gesture events.
         * @type {Object <number, number>} - Store of gesture ID and timestamp.
         * @private
         */
        this.gestureEvents = {};


        /**
         * The most recently received events for each pin.
         * @type {Object} - Store of pins which has events.
         * @private
         */
        this._pinEvents = {};

        this.analogIn = [0, 1, 2];
        this.analogValue = [];
        this.analogIn.forEach(pinIndex => {
            this.analogValue[pinIndex] = 0;
        });

        this.gpio = [
            0, 1, 2,
            8,
            12, 13, 14, 15, 16
        ];
        this.gpio.forEach(pinIndex => {
            this.digitalLevel[pinIndex] = 0;
        });

        this.sharedDataLength = this._sensors.sharedData.length;

        /**
         * Interval ID for data reading timeout.
         * @type {number}
         * @private
         */
        this._timeoutID = null;

        /**
         * A flag that is true while we are busy sending data to the BLE socket.
         * @type {boolean}
         * @private
         */
        this._busy = false;

        /**
         * ID for a timeout which is used to clear the busy flag if it has been
         * true for a long time.
         */
        this._busyTimeoutID = null;

        this.reset = this.reset.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this.onNotified = this.onNotified.bind(this);
        this._useMbitMoreService = true;

        this.analogInUpdateInterval = 80; // milli-seconds
        this.analogInLastUpdated = [Date.now(), Date.now(), Date.now()];


        this.bleReadTimelimit = 40;

        this.microbitUpdateInterval = 30; // milli-seconds

        this.startUpdater();
    }

    startUpdater () {
        if (this.bleAccessWaiting) {
            setTimeout(() => this.startUpdater(), 0);
            return;
        }
        this.updateSensors()
            .then(() => this.updateDirection())
            .finally(() => {
                setTimeout(
                    () => this.startUpdater(),
                    this.microbitUpdateInterval
                );
            });
    }

    /**
     * @param {string} text - the text to display.
     * @param {number} delay - The time to delay between characters, in milliseconds.
     * @param {object} util - utility object provided by the runtime.
     */
    displayText (text, delay, util) {
        const textLength = Math.min(18, text.length);
        const textData = new Uint8Array(textLength + 1);
        for (let i = 0; i < textLength; i++) {
            textData[i] = text.charCodeAt(i);
        }
        this.sendCommandSet(
            [{
                id: (BLECommand.CMD_DISPLAY << 5) | MbitMoreDisplayCommand.TEXT,
                message: new Uint8Array([
                    Math.min(255, (Math.max(0, delay) / 10)),
                    ...textData
                ])
            }],
            util
        );
    }

    /**
     * Send display pixcels command to micro:bit.
     * @param {Array.<Array.<number>>} matrix - pattern to display.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} - a Promise that resolves when the process was done.
     */
    displayPixels (matrix, util) {
        const cmdSet = [
            {
                id: (BLECommand.CMD_DISPLAY << 5) | MbitMoreDisplayCommand.PIXELS_0,
                message: new Uint8Array([
                    ...matrix[0],
                    ...matrix[1],
                    ...matrix[2]
                ])
            },
            {
                id: (BLECommand.CMD_DISPLAY << 5) | MbitMoreDisplayCommand.PIXELS_1,
                message: new Uint8Array([
                    ...matrix[3],
                    ...matrix[4]
                ])
            }
        ];
        return this.sendCommandSet(cmdSet, util);
    }

    setPinMode (pinIndex, mode, util) {
        let command =
            (BLECommand.CMD_PIN << 5) | (MMPinCommand.SET_PULL << 2);
        switch (mode) {
        case PinMode.PULL_NONE:
            command = command | MMPinMode.PullNone;
            break;
        case PinMode.PULL_UP:
            command = command | MMPinMode.PullUp;
            break;
        case PinMode.PULL_DOWN:
            command = command | MMPinMode.PullDown;
            break;
        default:
            break;
        }
        return this.sendCommandSet(
            [{
                id: command,
                message: new Uint8Array([pinIndex])
            }],
            util
        );
    }

    /**
     * Set pin to digital output mode and the level.
     * @param {number} pinIndex - Index of pin.
     * @param {boolean} level - Value in digital (true = High)
     * @param {BlockUtility} util - utility object provided by the runtime.
     * @return {Promise} - a Promise that resolves when the process was done.
     */
    setPinOutput (pinIndex, level, util) {
        return this.sendCommandSet(
            [{
                id: (BLECommand.CMD_PIN << 5) | (MMPinCommand.SET_OUTPUT << 2),
                message: new Uint8Array(
                    [
                        pinIndex,
                        (level ? 1 : 0)
                    ]
                )
            }],
            util
        );
    }

    setPinPWM (pinIndex, level, util) {
        const dataView = new DataView(new ArrayBuffer(2));
        dataView.setUint16(0, level, true);
        this.sendCommandSet(
            [{
                id: (BLECommand.CMD_PIN << 5) | (MMPinCommand.SET_PWM << 2),
                message: new Uint8Array(
                    [
                        pinIndex,
                        dataView.getUint8(0),
                        dataView.getUint8(1)
                    ]
                )
            }],
            util
        );
    }

    setPinServo (pinIndex, angle, range, center, util) {
        if (!range || range < 0) range = 0;
        if (!center || center < 0) center = 0;
        const dataView = new DataView(new ArrayBuffer(6));
        dataView.setUint16(0, angle, true);
        dataView.setUint16(2, range, true);
        dataView.setUint16(4, center, true);
        this.sendCommandSet(
            [{
                id: (BLECommand.CMD_PIN << 5) | (MMPinCommand.SET_SERVO << 2),
                message: new Uint8Array(
                    [
                        pinIndex,
                        dataView.getUint8(0),
                        dataView.getUint8(1),
                        dataView.getUint8(2),
                        dataView.getUint8(3),
                        dataView.getUint8(4),
                        dataView.getUint8(5)
                    ]
                )
            }],
            util);
    }

    /**
     * @return {number} - the latest value received for the motion gesture states.
     */
    get gestureState () {
        return this._sensors.gestureState;
    }

    /**
     * @return {Uint8Array} - the current state of the 5x5 LED matrix.
     */
    get ledMatrixState () {
        return this._sensors.ledMatrixState;
    }

    /**
     * Read light level from the light sensor.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} - a Promise that resolves light level.
     */
    readLightLevel () {
        if (!this.isConnected()) {
            return 0;
        }
        return this.lightLevel;
    }

    /**
     * Update data of the analog input.
     * @param {number} pinIndex - index of the pin to get value.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} - a Promise that resolves sensors which updated data of the analog input.
     */
    updateAnalogIn (pinIndex, util) {
        if ((Date.now() - this.analogInLastUpdated[pinIndex]) < this.analogInUpdateInterval) {
            return Promise.resolve(this.analogValue[pinIndex]);
        }
        if (this._busy) {
            this.bleAccessWaiting = true;
            if (util) util.yield(); // re-try this call after a while.
            return; // Do not return Promise.resolve() to re-try.
        }
        this._busy = true;
        this._busyTimeoutID = window.setTimeout(() => {
            this._busy = false;
            this.bleAccessWaiting = false;
        }, 1000);
        return new Promise(resolve => this._ble.read(
            MM_SERVICE.ID,
            MM_SERVICE.ANALOG_IN_CH[pinIndex],
            false)
            .then(result => {
                window.clearTimeout(this._busyTimeoutID);
                this._busy = false;
                this.bleAccessWaiting = false;
                if (!result) {
                    return resolve(this.analogValue[pinIndex]);
                }
                const data = Base64Util.base64ToUint8Array(result.message);
                const dataView = new DataView(data.buffer, 0);
                this.analogValue[pinIndex] = dataView.getUint16(0, true);
                this.analogInLastUpdated = Date.now();
                resolve(this.analogValue[pinIndex]);
            }));
    }

    /**
     * Read analog input from the pin [0, 1, 2].
     * @param {number} pinIndex - Index of the pin to read.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} - a Promise that resolves analog input value of the pin.
     */
    readAnalogIn (pinIndex, util) {
        if (!this.isConnected()) {
            return Promise.resolve(0);
        }
        return this.updateAnalogIn(pinIndex, util);
    }

    /**
     * Update data of digital level, light level, temperature, sound level.
     * @return {Promise} - a Promise that resolves updated data holder.
     */
    updateSensors () {
        if (!this.isConnected()) return Promise.resolve(this);
        if (this._busy) {
            return Promise.resolve(this);
        }
        this._busy = true;
        this._busyTimeoutID = window.setTimeout(() => {
            this._busy = false;
        }, 1000);
        return new Promise(resolve => {
            this._ble.read(
                MM_SERVICE.ID,
                MM_SERVICE.SENSORS_CH,
                false)
                .then(result => {
                    window.clearTimeout(this._busyTimeoutID);
                    this._busy = false;
                    if (!result) return resolve(this);
                    const data = Base64Util.base64ToUint8Array(result.message);
                    const dataView = new DataView(data.buffer, 0);
                    // Digital Input
                    const gpioData = dataView.getUint32(0, true);
                    for (let i = 0; i < this.gpio.length; i++) {
                        this.digitalLevel[this.gpio[i]] = (gpioData >> this.gpio[i]) & 1;
                    }
                    this.digitalLevel[MMButtonID.A] = (gpioData >> MMButtonID.A) & 1;
                    this.digitalLevel[MMButtonID.B] = (gpioData >> MMButtonID.B) & 1;
                    this.lightLevel = dataView.getUint8(4);
                    this.temperature = dataView.getUint8(5) - 128;
                    this.soundLevel = dataView.getUint8(6);
                    resolve(this);
                });
        });
    }

    /**
     * Read temperature (integer in celsius) from the micro:bit cpu.
     * @return {number} - degrees of temperature [centigrade].
     */
    readTemperature () {
        if (!this.isConnected()) {
            return 0;
        }
        return this.temperature;
    }

    /**
     * Read sound level.
     * @return {number} - level of loudness (0 .. 255).
     */
    readSoundLevel () {
        if (!this.isConnected()) {
            return 0;
        }
        return this.soundLevel;
    }

    /**
     * Update data of acceleration, magnetic force.
     * @return {Promise} - a Promise that resolves updated data holder.
     */
    updateDirection () {
        if (!this.isConnected()) return Promise.resolve(this);
        if (this._busy) {
            return Promise.resolve(this);
        }
        this._busy = true;
        this._busyTimeoutID = window.setTimeout(() => {
            this._busy = false;
        }, 1000);
        return new Promise(resolve => {
            this._ble.read(
                MM_SERVICE.ID,
                MM_SERVICE.DIRECTION_CH,
                false)
                .then(result => {
                    window.clearTimeout(this._busyTimeoutID);
                    this._busy = false;
                    if (!result) return resolve(this);
                    const data = Base64Util.base64ToUint8Array(result.message);
                    const dataView = new DataView(data.buffer, 0);
                    // Accelerometer
                    this.pitch = Math.round(dataView.getInt16(0, true) * 180 / Math.PI / 1000);
                    this.roll = Math.round(dataView.getInt16(2, true) * 180 / Math.PI / 1000);
                    this.acceleration.x = 1000 * dataView.getInt16(4, true) / G;
                    this.acceleration.y = 1000 * dataView.getInt16(6, true) / G;
                    this.acceleration.z = 1000 * dataView.getInt16(8, true) / G;
                    // Magnetometer
                    this.compassHeading = dataView.getUint16(10, true);
                    this.magneticForce.x = dataView.getInt16(12, true);
                    this.magneticForce.y = dataView.getInt16(14, true);
                    this.magneticForce.z = dataView.getInt16(16, true);
                    resolve(this);
                });
        });
    }

    /**
     * Read pitch [degrees] is 3D space.
     * @return {number} - degree of pitch.
     */
    readPitch () {
        if (!this.isConnected()) {
            return 0;
        }
        return this.pitch;
    }

    /**
     * Read roll [degrees] is 3D space.
     * @return {number} - degree of roll.
     */
    readRoll () {
        if (!this.isConnected()) {
            return 0;
        }
        return this.roll;
    }

    /**
     * Read the value of gravitational acceleration [milli-g] for the axis.
     * @param {AxisSymbol} axis - direction of acceleration.
     * @return {number} - value of acceleration.
     */
    readAcceleration (axis) {
        if (!this.isConnected()) {
            return 0;
        }
        if (axis === AxisSymbol.Absolute) {
            return Math.round(
                Math.sqrt(
                    (this.acceleration.x ** 2) +
                            (this.acceleration.y ** 2) +
                            (this.acceleration.z ** 2)
                )
            );
        }
        return this.acceleration[axis];
    }

    /**
     * Read the angle (degrees) of heading direction from the north.
     * @return {number} - degree of compass heading.
     */
    readCompassHeading () {
        if (!this.isConnected()) {
            return 0;
        }
        return this.compassHeading;
    }


    /**
     * Read value of magnetic field [micro teslas] for the axis.
     * @param {AxisSymbol} axis - direction of magnetic field.
     * @return {number} - value of magnetic filed.
     */
    readMagneticForce (axis) {
        if (!this.isConnected()) {
            return 0;
        }
        if (axis === AxisSymbol.Absolute) {
            return Math.round(
                Math.sqrt(
                    (this.magneticForce.x ** 2) +
                            (this.magneticForce.y ** 2) +
                            (this.magneticForce.z ** 2)
                )
            );
        }
        return this.magneticForce[axis];
    }

    /**
     * Called by the runtime when user wants to scan for a peripheral.
     */
    scan () {
        if (this._ble) {
            this._ble.disconnect();
        }
        this._ble = new BLE(this._runtime, this._extensionId, {
            filters: [
                {namePrefix: 'BBC micro:bit'},
                {services: [MM_SERVICE.ID]}
            ]
        }, this._onConnect, this.reset);
    }

    /**
     * Called by the runtime when user wants to connect to a certain peripheral.
     * @param {number} id - the id of the peripheral to connect to.
     */
    connect (id) {
        if (this._ble) {
            this._ble.connectPeripheral(id);
        }
    }

    /**
     * Disconnect from the micro:bit.
     */
    disconnect () {
        if (this._ble) {
            this._ble.disconnect();
        }

        this.reset();
    }

    /**
     * Reset all the state and timeout/interval ids.
     */
    reset () {
        if (this._timeoutID) {
            window.clearTimeout(this._timeoutID);
            this._timeoutID = null;
        }
    }

    /**
     * Return true if connected to the micro:bit.
     * @return {boolean} - whether the micro:bit is connected.
     */
    isConnected () {
        let connected = false;
        if (this._ble) {
            connected = this._ble.isConnected();
        }
        return connected;
    }

    /**
     * Send a message to the peripheral BLE socket.
     * @param {number} command - the BLE command hex.
     * @param {Uint8Array} message - the message to write
     * @param {object} util - utility object provided by the runtime.
     */
    send (command, message, util) {
        if (!this.isConnected()) return;
        if (this._busy) {
            if (util) util.yield();
            return;
        }

        // Set a busy flag so that while we are sending a message and waiting for
        // the response, additional messages are ignored.
        this._busy = true;

        // Set a timeout after which to reset the busy flag. This is used in case
        // a BLE message was sent for which we never received a response, because
        // e.g. the peripheral was turned off after the message was sent. We reset
        // the busy flag after a while so that it is possible to try again later.
        this._busyTimeoutID = window.setTimeout(() => {
            this._busy = false;
        }, 1000);

        const output = new Uint8Array(message.length + 1);
        output[0] = command; // attach command to beginning of message
        for (let i = 0; i < message.length; i++) {
            output[i + 1] = message[i];
        }
        const data = Base64Util.uint8ArrayToBase64(output);

        this._ble.write(MM_SERVICE.ID, MM_SERVICE.COMMAND_CH, data, 'base64', false).then(
            () => {
                this._busy = false;
                window.clearTimeout(this._busyTimeoutID);
            }
        );
    }

    /**
     * Send a command to micro:bit.
     * @param {object} command command to send.
     * @param {number} command.id ID of the command.
     * @param {Uint8Array} command.message Contents of the command.
     * @return {Promise} a Promise that resolves when the data was sent.
     */
    sendCommand (command) {
        const data = Base64Util.uint8ArrayToBase64(
            new Uint8Array([
                command.id,
                ...command.message
            ])
        );
        return new Promise(resolve => {
            this._ble.write(
                MM_SERVICE.ID,
                MM_SERVICE.COMMAND_CH,
                data,
                'base64',
                false
            );
            setTimeout(() => resolve(), BLESendInterval);
        });
    }

    /**
     * Send multiple commands sequentially.
     * @param {Array.<{id: number, message: Uint8Array}>} commands array of command.
     * @param {BlockUtility} util - utility object provided by the runtime.
     * @return {Promise} a Promise that resolves when the all commands was sent.
     */
    sendCommandSet (commands, util) {
        if (!this.isConnected()) return Promise.resolve();
        if (this._busy) {
            this.bleAccessWaiting = true;
            if (util) util.yield(); // re-try this call after a while.
            return; // Do not return Promise.resolve() to re-try.
        }
        this._busy = true;
        // Clear busy and BLE access waiting flag when the scratch-link does not respond.
        this._busyTimeoutID = window.setTimeout(() => {
            this._busy = false;
            this.bleAccessWaiting = false;
        }, 1000);
        return new Promise(resolve => {
            commands.reduce(
                (acc, cur, i) => {
                    const sendProm = acc.then(() => this.sendCommand(cur));
                    if (i === commands.length - 1) {
                        sendProm.then(() => {
                            this._busy = false;
                            this.bleAccessWaiting = false;
                            window.clearTimeout(this._busyTimeoutID);
                            resolve();
                        });
                    }
                    return sendProm;
                },
                Promise.resolve()
            );
        });
    }

    /**
     * Starts reading data from peripheral after BLE has connected to it.
     * @private
     */
    _onConnect () {
        this._useMbitMoreService = true;
        this._ble.startNotifications(
            MM_SERVICE.ID,
            MM_SERVICE.ACTION_EVENT_CH,
            this.onNotified);
        // this._ble.startNotifications(
        //     MM_SERVICE.ID,
        //     MM_SERVICE.SHARED_DATA_CH,
        //     this.onNotified);
        // this._ble.startNotifications(
        //     MM_SERVICE.ID,
        //     MM_SERVICE.PIN_EVENT_CH,
        //     this.onNotified);
        this.bleAccessWaiting = false;
        this._busy = false;
        // this.resetConnectionTimeout();
    }

    /**
     * Process the sensor data from the incoming BLE characteristic.
     * @param {string} msg - the incoming BLE data.
     * @private
     */
    onNotified (msg) {
        const data = Base64Util.base64ToUint8Array(msg);
        const dataView = new DataView(data.buffer, 0);
        const dataFormat = dataView.getUint8(19);
        if (dataFormat === MMDataFormat.ACTION_EVENT) {
            const actionEventType = dataView.getUint8(0);
            if (actionEventType === MbitMoreActionEvent.BUTTON) {
                const buttonID = dataView.getUint8(1);
                const event = dataView.getUint8(2, true);
                this.buttonEvents[MMButtonID.ANY][event] =
                 this.buttonEvents[buttonID][event] =
                  dataView.getUint32(3, true); // Timestamp
            } else if (actionEventType === MbitMoreActionEvent.GESTURE) {
                const event = dataView.getUint8(1);
                this.gestureEvents[event] = dataView.getUint32(2, true); // Timestamp
            }
        } else if (dataFormat === MMDataFormat.PIN_EVENT) {
            const pinIndex = dataView.getUint8(0);
            if (!this._pinEvents[pinIndex]) {
                this._pinEvents[pinIndex] = {};
            }
            const event = dataView.getUint8(1, true);
            this._pinEvents[pinIndex][event] = dataView.getUint32(2, true); // Timestamp
        } else if (dataFormat === MMDataFormat.SHARED_DATA) {
            this._sensors.sharedData[0] = dataView.getInt16(0, true);
            this._sensors.sharedData[1] = dataView.getInt16(2, true);
            this._sensors.sharedData[2] = dataView.getInt16(4, true);
            this._sensors.sharedData[3] = dataView.getInt16(6, true);
        }
        // this.resetConnectionTimeout();
    }

    /**
     * Cancel disconnect timeout and start counting again.
     */
    resetConnectionTimeout () {
        if (this._timeoutID) window.clearTimeout(this._timeoutID);
        this._timeoutID = window.setTimeout(() => this._ble.handleDisconnectError(BLEDataStoppedError), BLETimeout);
    }

    /**
     * Return whether the pin value is high.
     * @param {number} pin - the pin to check.
     * @return {boolean} - whether the pin is high or not.
     */
    isPinHigh (pin) {
        const level = this.readDigitalLevel(pin);
        return level === 1;
    }

    /**
     * Read digital input from the pin.
     * @param {number} pin - the pin to read.
     * @return {number} - digital input value of the pin [0|1].
     */
    readDigitalLevel (pin) {
        if (!this.isConnected()) {
            return 0;
        }
        return this.digitalLevel[pin];
    }

    /**
     * Return the value of the shared data.
     * @param {number} index - the shared data index.
     * @return {number} - the latest value received for the shared data.
     */
    getSharedData (index) {
        return this._sensors.sharedData[index];
    }

    setSharedData (sharedDataIndex, sharedDataValue, util) {
        const dataView = new DataView(new ArrayBuffer(2));
        dataView.setInt16(0, sharedDataValue, true);
        this.sendCommandSet(
            [{
                id: (BLECommand.CMD_SHARED_DATA << 5),
                message: new Uint8Array([
                    sharedDataIndex,
                    dataView.getUint8(0),
                    dataView.getUint8(1)])
            }],
            util);
        this._sensors.sharedData[sharedDataIndex] = sharedDataValue;
    }

    /**
     * Return the last timestamp of the button event or null when the event is not received.
     * @param {MMButtonID} buttonID - ID of the button to get the event.
     * @param {MMButtonEvent} event - event to get.
     * @return {?number} Timestamp of the last event or null.
     */
    getButtonEventTimestamp (buttonID, event) {
        if (this.buttonEvents[buttonID] && this.buttonEvents[buttonID][event]) {
            return this.buttonEvents[buttonID][event];
        }
        return null;
    }

    /**
     * Return the last timestamp of the gesture event or null when the event is not received.
     * @param {MbitMoreGestureEvent} gestureID - ID of the event.
     * @return {?number} Timestamp of the last event or null.
     */
    getGestureEventTimestamp (gestureID) {
        if (this.gestureEvents[gestureID]) {
            return this.gestureEvents[gestureID];
        }
        return null;
    }

    /**
     * Return the last timestamp of the pin event or null when the event is not received.
     * @param {number} pinIndex - index of the pin to get the event.
     * @param {MMPinEvent} event - event to get.
     * @return {?number} Timestamp of the last event or null.
     */
    getPinEventTimestamp (pinIndex, event) {
        if (this._pinEvents[pinIndex] && this._pinEvents[pinIndex][event]) {
            return this._pinEvents[pinIndex][event];
        }
        return null;
    }

    /**
     * Set event type to be get from the pin.
     * @param {number} pinIndex - Index of the pin to set.
     * @param {MMPinEventType} eventType - Event type to set.
     * @param {object} util - utility object provided by the runtime.
    */
    setPinEventType (pinIndex, eventType, util) {
        if (!this._useMbitMoreService) return;
        this.sendCommandSet(
            [{
                id: (BLECommand.CMD_PIN << 5) | (MMPinCommand.SET_EVENT << 2),
                message: new Uint8Array([
                    pinIndex,
                    eventType])
            }],
            util
        );
    }
}

/**
 * Scratch 3.0 blocks to interact with a MicroBit peripheral.
 */
class MbitMoreBlocks {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'micro:bit more';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return EXTENSION_ID;
    }

    /**
     * URL to get this extension.
     * @type {string}
     */
    static get extensionURL () {
        return extensionURL;
    }

    /**
     * Set URL to get this extension.
     * @param {string} url - URL
     */
    static set extensionURL (url) {
        extensionURL = url;
    }

    /**
     * @return {array} - text and values for each gestures menu element
     */
    get GESTURES_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'mbitMore.gesturesMenu.tiltUp',
                    default: 'titl up',
                    description: 'label for tilt up gesture in gesture picker for microbit more extension'
                }),
                value: MbitMoreGestureEvent.TILT_UP
            },
            {
                text: formatMessage({
                    id: 'mbitMore.gesturesMenu.tiltDown',
                    default: 'titl down',
                    description: 'label for tilt down gesture in gesture picker for microbit more extension'
                }),
                value: MbitMoreGestureEvent.TILT_DOWN
            },
            {
                text: formatMessage({
                    id: 'mbitMore.gesturesMenu.tiltLeft',
                    default: 'titl left',
                    description: 'label for tilt left gesture in gesture picker for microbit more extension'
                }),
                value: MbitMoreGestureEvent.TILT_LEFT
            },
            {
                text: formatMessage({
                    id: 'mbitMore.gesturesMenu.tiltRight',
                    default: 'titl right',
                    description: 'label for tilt right gesture in gesture picker for microbit more extension'
                }),
                value: MbitMoreGestureEvent.TILT_RIGHT
            },
            {
                text: formatMessage({
                    id: 'mbitMore.gesturesMenu.faceUp',
                    default: 'face up',
                    description: 'label for face up gesture in gesture picker for microbit more extension'
                }),
                value: MbitMoreGestureEvent.FACE_UP
            },
            {
                text: formatMessage({
                    id: 'mbitMore.gesturesMenu.faceDown',
                    default: 'face down',
                    description: 'label for face down gesture in gesture picker for microbit more extension'
                }),
                value: MbitMoreGestureEvent.FACE_DOWN
            },
            {
                text: formatMessage({
                    id: 'mbitMore.gesturesMenu.freefall',
                    default: 'freefall',
                    description: 'label for freefall gesture in gesture picker for microbit more extension'
                }),
                value: MbitMoreGestureEvent.FREEFALL
            },
            {
                text: formatMessage({
                    id: 'mbitMore.gesturesMenu.g3',
                    default: '3G',
                    description: 'label for 3G gesture in gesture picker for microbit more extension'
                }),
                value: MbitMoreGestureEvent.G3
            },
            {
                text: formatMessage({
                    id: 'mbitMore.gesturesMenu.g6',
                    default: '6G',
                    description: 'label for 6G gesture in gesture picker for microbit more extension'
                }),
                value: MbitMoreGestureEvent.G6
            },
            {
                text: formatMessage({
                    id: 'mbitMore.gesturesMenu.g8',
                    default: '8G',
                    description: 'label for 3G gesture in gesture picker for microbit more extension'
                }),
                value: MbitMoreGestureEvent.G8
            },
            {
                text: formatMessage({
                    id: 'mbitMore.gesturesMenu.shake',
                    default: 'shake',
                    description: 'label for shaken gesture in gesture picker for microbit more extension'
                }),
                value: MbitMoreGestureEvent.SHAKE
            }

        ];
    }


    /**
     * @return {array} - text and values for each buttons menu element
     */
    get BUTTON_ID_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'mbitMore.buttonIDMenu.a',
                    default: 'A',
                    description: 'label for "A" element in button picker for micro:bit more extension'
                }),
                value: MMButtonID.A
            },
            {
                text: formatMessage({
                    id: 'mbitMore.buttonIDMenu.b',
                    default: 'B',
                    description: 'label for "B" element in button picker for micro:bit more extension'
                }),
                value: MMButtonID.B
            },
            {
                text: formatMessage({
                    id: 'mbitMore.buttonIDMenu.any',
                    default: 'any',
                    description: 'label for "any" element in button picker for micro:bit more extension'
                }),
                value: MMButtonID.ANY
            }
        ];
    }

    /**
     * @return {array} - Menu items for button event selector.
     */
    get BUTTON_EVENT_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'mbitMore.buttonEventMenu.down',
                    default: 'down',
                    description: 'label for button down event'
                }),
                value: MMButtonEvent.DOWN
            },
            {
                text: formatMessage({
                    id: 'mbitMore.buttonEventMenu.up',
                    default: 'up',
                    description: 'label for button up event'
                }),
                value: MMButtonEvent.UP
            },
            {
                text: formatMessage({
                    id: 'mbitMore.buttonEventMenu.click',
                    default: 'click',
                    description: 'label for button click event'
                }),
                value: MMButtonEvent.CLICK
            // },
            // // These events are not in use because they are unstable in coal-microbit-v2.
            // {
            //     text: formatMessage({
            //         id: 'mbitMore.buttonEventMenu.longClick',
            //         default: 'long click',
            //         description: 'label for button long click event'
            //     }),
            //     value: MMButtonEvent.LONG_CLICK
            // },
            // {
            //     text: formatMessage({
            //         id: 'mbitMore.buttonEventMenu.hold',
            //         default: 'hold',
            //         description: 'label for button hold event'
            //     }),
            //     value: MMButtonEvent.HOLD
            // },
            // {
            //     text: formatMessage({
            //         id: 'mbitMore.buttonEventMenu.doubleClick',
            //         default: 'double click',
            //         description: 'label for button double click event'
            //     }),
            //     value: MMButtonEvent.DOUBLE_CLICK
            }
        ];
    }

    /**
     * @return {array} - text and values for each pin state menu element
     */
    get PIN_STATE_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'microbit.pinStateMenu.on',
                    default: 'on',
                    description: 'label for on element in pin state picker for micro:bit extension'
                }),
                value: MicroBitPinState.ON
            },
            {
                text: formatMessage({
                    id: 'microbit.pinStateMenu.off',
                    default: 'off',
                    description: 'label for off element in pin state picker for micro:bit extension'
                }),
                value: MicroBitPinState.OFF
            }
        ];
    }

    get ANALOG_IN_PINS_MENU () {
        return this._peripheral.analogIn.map(
            pinIndex =>
                Object.create({
                    text: `P${pinIndex.toString()}`,
                    value: pinIndex
                })
        );
    }

    get SHARED_DATA_INDEX_MENU () {
        const menu = [];
        for (let i = 0; i < this._peripheral.sharedDataLength; i++) {
            menu.push(i.toString());
        }
        return menu;
    }

    get GPIO_MENU () {
        return this._peripheral.gpio.map(
            pinIndex =>
                Object.create({
                    text: `P${pinIndex.toString()}`,
                    value: pinIndex
                })
        );
    }

    get DIGITAL_VALUE_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'mbitMore.digitalValueMenu.Low',
                    default: 'Low',
                    description: 'label for low value in digital output menu for microbit more extension'
                }),
                value: false
            },
            {
                text: formatMessage({
                    id: 'mbitMore.digitalValueMenu.High',
                    default: 'High',
                    description: 'label for high value in digital output menu for microbit more extension'
                }),
                value: true
            }
        ];
    }

    get AXIS_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'mbitMore.axisMenu.x',
                    default: 'x',
                    description: 'label of X axis.'
                }),
                value: AxisSymbol.X
            },
            {
                text: formatMessage({
                    id: 'mbitMore.axisMenu.y',
                    default: 'y',
                    description: 'label of Y axis.'
                }),
                value: AxisSymbol.Y
            },
            {
                text: formatMessage({
                    id: 'mbitMore.axisMenu.z',
                    default: 'z',
                    description: 'label of Z axis.'
                }),
                value: AxisSymbol.Z
            },
            {
                text: formatMessage({
                    id: 'mbitMore.axisMenu.absolute',
                    default: 'absolute',
                    description: 'label of absolute value.'
                }),
                value: AxisSymbol.Absolute
            }
        ];
    }

    /**
     * @return {array} - text and values for each pin mode menu element
     */
    get PIN_MODE_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'mbitMore.pinModeMenu.pullNone',
                    default: 'pull none',
                    description: 'label for pullNone mode'
                }),
                value: PinMode.PULL_NONE
            },
            {
                text: formatMessage({
                    id: 'mbitMore.pinModeMenu.pullUp',
                    default: 'pull up',
                    description: 'label for pullUp mode'
                }),
                value: PinMode.PULL_UP
            },
            {
                text: formatMessage({
                    id: 'mbitMore.pinModeMenu.pullDown',
                    default: 'pull down',
                    description: 'label for pullDown mode'
                }),
                value: PinMode.PULL_DOWN
            }
        ];
    }

    /**
     * @return {array} - Menu items for event selector.
     */
    get PIN_EVENT_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'mbitMore.pinEventMenu.pulseLow',
                    default: 'low pulse',
                    description: 'label for low pulse event'
                }),
                value: 'PULSE_LOW'
            },
            {
                text: formatMessage({
                    id: 'mbitMore.pinEventMenu.pulseHigh',
                    default: 'high pulse',
                    description: 'label for high pulse event'
                }),
                value: 'PULSE_HIGH'
            },
            {
                text: formatMessage({
                    id: 'mbitMore.pinEventMenu.fall',
                    default: 'fall',
                    description: 'label for fall event'
                }),
                value: 'FALL'
            },
            {
                text: formatMessage({
                    id: 'mbitMore.pinEventMenu.rise',
                    default: 'rise',
                    description: 'label for rise event'
                }),
                value: 'RISE'
            }
        ];
    }

    /**
     * @return {array} - Menu items for event selector.
     */
    get PIN_EVENT_TIMESTAMP_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'mbitMore.pinEventTimestampMenu.pulseLow',
                    default: 'low pulse',
                    description: 'label for low pulse event'
                }),
                value: 'PULSE_LOW'
            },
            {
                text: formatMessage({
                    id: 'mbitMore.pinEventTimestampMenu.pulseHigh',
                    default: 'high pulse',
                    description: 'label for high pulse event'
                }),
                value: 'PULSE_HIGH'
            },
            {
                text: formatMessage({
                    id: 'mbitMore.pinEventTimestampMenu.fall',
                    default: 'fall',
                    description: 'label for fall event'
                }),
                value: 'FALL'
            },
            {
                text: formatMessage({
                    id: 'mbitMore.pinEventTimestampMenu.rise',
                    default: 'rise',
                    description: 'label for rise event'
                }),
                value: 'RISE'
            }
        ];
    }

    /**
     * @return {array} - Menu items for event listening.
     */
    get PIN_EVENT_TYPE_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'mbitMore.pinEventTypeMenu.none',
                    default: 'none',
                    description: 'label for remove event listener'
                }),
                value: 'NONE'
            },
            {
                text: formatMessage({
                    id: 'mbitMore.pinEventTypeMenu.pulse',
                    default: 'pulse',
                    description: 'label for pulse event type'
                }),
                value: 'ON_PULSE'
            },
            {
                text: formatMessage({
                    id: 'mbitMore.pinEventTypeMenu.edge',
                    default: 'edge',
                    description: 'label for edge event type'
                }),
                value: 'ON_EDGE'
            }
        ];
    }

    /**
     * @return {array} - Menu items for connection state.
     */
    get CONNECTION_STATE_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'mbitMore.connectionStateMenu.connected',
                    default: 'connected',
                    description: 'label for connected'
                }),
                value: 'connected'
            },
            {
                text: formatMessage({
                    id: 'mbitMore.connectionStateMenu.disconnected',
                    default: 'disconnected',
                    description: 'label for disconnected'
                }),
                value: 'disconnected'
            }
        ];
    }

    /**
     * Construct a set of MicroBit blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        if (runtime.formatMessage) {
            // Replace 'formatMessage' to a formatter which is used in the runtime.
            formatMessage = runtime.formatMessage;
        }
        // Create a new MicroBit peripheral instance
        this._peripheral = new MbitMore(this.runtime, MbitMoreBlocks.EXTENSION_ID);

        /**
         * The previous timestamps of button events.
         * @type {Object.<number, Object.<number, number>>} button ID to object with event and timestamp.
         */
        this.prevButtonEvents = {};

        /**
         * The previous timestamps of gesture events.
         * @type {Object.<number, number>} key: event ID, value: timestamp.
         */
        this.prevGestureEvents = {};

        /**
         * The previous timestamps of pin events.
         * @type {Object.<number, Object.<number, number>>} pin index to object with event and timestamp.
         */
        this.prevPinEvents = {};

    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        this.setupTranslations();
        return {
            id: MbitMoreBlocks.EXTENSION_ID,
            name: MbitMoreBlocks.EXTENSION_NAME,
            extensionURL: MbitMoreBlocks.extensionURL,
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'whenButtonEvent',
                    text: formatMessage({
                        id: 'mbitMore.whenButtonEvent',
                        default: 'when [BUTTON] is [EVENT]',
                        description: 'when the selected button on the micro:bit get the selected event'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        BUTTON: {
                            type: ArgumentType.NUMBER,
                            menu: 'buttonIDMenu',
                            defaultValue: MMButtonID.A
                        },
                        EVENT: {
                            type: ArgumentType.NUMBER,
                            menu: 'buttonEventMenu',
                            defaultValue: MMButtonEvent.DOWN
                        }
                    }
                },
                {
                    opcode: 'isButtonPressed',
                    text: formatMessage({
                        id: 'mbitMore.isButtonPressed',
                        default: '[BUTTON] button pressed?',
                        description: 'is the selected button on the micro:bit pressed?'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        BUTTON: {
                            type: ArgumentType.NUMBER,
                            menu: 'buttonIDMenu',
                            defaultValue: MMButtonID.A
                        }
                    }
                },
                // {
                //     opcode: 'whenPinTouched',
                //     text: formatMessage({
                //         id: 'microbit.whenPinTouched',
                //         default: 'when [PIN] is [EVENT]',
                //         description: 'when the selected touch pin on the micro:bit is touched'
                //     }),
                //     blockType: BlockType.HAT,
                //     arguments: {
                //         PIN: {
                //             type: ArgumentType.STRING,
                //             menu: 'touchPins',
                //             defaultValue: MicroBitTouchPins.LOGO
                //         }
                //     }
                // },
                '---',
                {
                    opcode: 'whenGesture',
                    text: formatMessage({
                        id: 'mbitMore.whenGesture',
                        default: 'when [GESTURE]',
                        description: 'when the selected gesture is detected by the micro:bit'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        GESTURE: {
                            type: ArgumentType.NUMBER,
                            menu: 'gestures',
                            defaultValue: MbitMoreGestureEvent.SHAKE
                        }
                    }
                },
                '---',
                {
                    opcode: 'displayMatrix',
                    text: formatMessage({
                        id: 'mbitMore.displayMatrix',
                        default: 'display pattern [MATRIX] ',
                        description: 'display a pattern on the micro:bit display'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        MATRIX: {
                            type: ArgumentType.MATRIX,
                            defaultValue: '0101010101100010101000100'
                        }
                    }
                },
                {
                    opcode: 'displayText',
                    text: formatMessage({
                        id: 'mbitMore.displayText',
                        default: 'display text [TEXT] delay [DELAY] ms',
                        description: 'display text on the micro:bit display'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'microbit.defaultTextToDisplay',
                                default: 'Hello!',
                                description: `default text to display.
                                IMPORTANT - the micro:bit only supports letters a-z, A-Z.
                                Please substitute a default word in your language
                                that can be written with those characters,
                                substitute non-accented characters or leave it as "Hello!".
                                Check the micro:bit site documentation for details`
                            })
                        },
                        DELAY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 120
                        }
                    }
                },
                {
                    opcode: 'displayClear',
                    text: formatMessage({
                        id: 'microbit.clearDisplay',
                        default: 'clear display',
                        description: 'display nothing on the micro:bit display'
                    }),
                    blockType: BlockType.COMMAND
                },
                '---',
                {
                    opcode: 'getLightLevel',
                    text: formatMessage({
                        id: 'mbitMore.lightLevel',
                        default: 'light intensity',
                        description: 'how much the amount of light falling on the LEDs on micro:bit'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getTemperature',
                    text: formatMessage({
                        id: 'mbitMore.temperature',
                        default: 'temperature',
                        description: 'temperature (celsius) on the surface of CPU of micro:bit'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getCompassHeading',
                    text: formatMessage({
                        id: 'mbitMore.compassHeading',
                        default: 'angle with the North',
                        description: 'angle from the North to the micro:bit heading direction'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getPitch',
                    text: formatMessage({
                        id: 'mbitMore.pitch',
                        default: 'pitch',
                        description: 'nose up movement of the micro:bit from level'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getRoll',
                    text: formatMessage({
                        id: 'mbitMore.roll',
                        default: 'roll',
                        description: 'clockwise circular movement of the micro:bit from level'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getMagneticForce',
                    text: formatMessage({
                        id: 'mbitMore.magneticForce',
                        default: 'magnetic force',
                        description: 'value of magnetic force (micro tesla)'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        AXIS: {
                            type: ArgumentType.STRING,
                            menu: 'axis',
                            defaultValue: AxisSymbol.Absolute
                        }
                    }
                },
                {
                    opcode: 'getAcceleration',
                    text: formatMessage({
                        id: 'mbitMore.acceleration',
                        default: 'acceleration [AXIS]',
                        description: 'value of acceleration on the axis (milli-g)'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        AXIS: {
                            type: ArgumentType.STRING,
                            menu: 'axis',
                            defaultValue: AxisSymbol.X
                        }
                    }
                },
                '---',
                {
                    opcode: 'getAnalogValue',
                    text: formatMessage({
                        id: 'mbitMore.analogValue',
                        default: 'analog value of pin [PIN]',
                        description: 'analog input value of the pin'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            menu: 'analogInPins',
                            defaultValue: this.ANALOG_IN_PINS_MENU[0].value
                        }
                    }
                },
                {
                    opcode: 'setPinMode',
                    text: formatMessage({
                        id: 'mbitMore.setPinMode',
                        default: 'set pin [PIN] to input [MODE]',
                        description: 'set a pin into the mode'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'gpio',
                            defaultValue: '0'
                        },
                        MODE: {
                            type: ArgumentType.STRING,
                            menu: 'pinMode',
                            defaultValue: PinMode.PULL_UP
                        }
                    }
                },
                {
                    opcode: 'isPinHigh',
                    text: formatMessage({
                        id: 'mbitMore.isPinHigh',
                        default: '[PIN] pin is high?',
                        description: 'is the selected pin high as digital?'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            menu: 'gpio',
                            defaultValue: 0
                        }
                    }
                },
                '---',
                {
                    opcode: 'setOutput',
                    text: formatMessage({
                        id: 'mbitMore.setOutput',
                        default: 'set [PIN] Digital [LEVEL]',
                        description: 'set pin to Digtal Output mode and the level(true = High)'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            menu: 'gpio',
                            defaultValue: 0
                        },
                        LEVEL: {
                            type: ArgumentType.BOOLEAN,
                            menu: 'digitalValueMenu'
                            // defaultValue: this.DIGITAL_VALUE_MENU[0].value
                        }
                    }
                },
                {
                    opcode: 'setPWM',
                    text: formatMessage({
                        id: 'mbitMore.setPWM',
                        default: 'set [PIN] PWM [LEVEL]',
                        description: 'set pin to PWM mode and the level(0 to 1023)'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            menu: 'gpio',
                            defaultValue: 0
                        },
                        LEVEL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setServo',
                    text: formatMessage({
                        id: 'mbitMore.setServo',
                        default: 'set [PIN] Servo [ANGLE]',
                        description: 'set pin to Servo mode and the angle(0 to 180)'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            menu: 'gpio',
                            defaultValue: 0
                        },
                        ANGLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        RANGE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2000
                        },
                        CENTER: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1500
                        }
                    }
                },
                '---',
                {
                    opcode: 'setPinEventType',
                    text: formatMessage({
                        id: 'mbitMore.setPinEventType',
                        default: 'catch event [EVENT_TYPE] on [PIN]',
                        description: 'listen the event on the pin'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        EVENT_TYPE: {
                            type: ArgumentType.STRING,
                            menu: 'pinEventTypeMenu',
                            defaultValue: this.PIN_EVENT_TYPE_MENU[0].value
                        },
                        PIN: {
                            type: ArgumentType.NUMBER,
                            menu: 'gpio',
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'whenPinEvent',
                    text: formatMessage({
                        id: 'mbitMore.whenPinEvent',
                        default: 'when catch [EVENT] at pin [PIN]',
                        description: 'when catch the event at the pin'

                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        EVENT: {
                            type: ArgumentType.STRING,
                            menu: 'pinEventMenu',
                            defaultValue: 'PULSE_LOW'
                        },
                        PIN: {
                            type: ArgumentType.NUMBER,
                            menu: 'gpio',
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'getPinEventTimestamp',
                    text: formatMessage({
                        id: 'mbitMore.getPinEventTimestamp',
                        default: 'timestamp of [EVENT] at [PIN]',
                        description: 'value of the timestamp of the event'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        EVENT: {
                            type: ArgumentType.STRING,
                            menu: 'pinEventTimestampMenu',
                            defaultValue: 'PULSE_LOW'
                        },
                        PIN: {
                            type: ArgumentType.NUMBER,
                            menu: 'gpio',
                            defaultValue: 0
                        }
                    }
                },
                '---',
                {
                    opcode: 'getSharedData',
                    text: formatMessage({
                        id: 'mbitMore.getSharedData',
                        default: 'shared data [INDEX]',
                        description: 'value of the shared data'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        INDEX: {
                            type: ArgumentType.STRING,
                            menu: 'sharedDataIndex',
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'setSharedData',
                    text: formatMessage({
                        id: 'mbitMore.setSharedData',
                        default: 'shared data [INDEX] to [VALUE]',
                        description: 'set value into the shared data'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        INDEX: {
                            type: ArgumentType.STRING,
                            menu: 'sharedDataIndex',
                            defaultValue: '0'
                        },
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                '---',
                {
                    opcode: 'whenConnectionChanged',
                    text: formatMessage({
                        id: 'mbitMore.whenConnectionChanged',
                        default: 'when micro:bit [STATE]',
                        description: 'when a micro:bit connection state changed'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        STATE: {
                            type: ArgumentType.STRING,
                            menu: 'connectionStateMenu',
                            defaultValue: 'connected'
                        }
                    }
                }
            ],
            menus: {
                buttonIDMenu: {
                    acceptReporters: false,
                    items: this.BUTTON_ID_MENU
                },
                buttonEventMenu: {
                    acceptReporters: false,
                    items: this.BUTTON_EVENT_MENU
                },
                gestures: {
                    acceptReporters: false,
                    items: this.GESTURES_MENU
                },
                pinState: {
                    acceptReporters: true,
                    items: this.PIN_STATE_MENU
                },
                analogInPins: {
                    acceptReporters: false,
                    items: this.ANALOG_IN_PINS_MENU
                },
                digitalValueMenu: {
                    acceptReporters: false,
                    items: this.DIGITAL_VALUE_MENU
                },
                sharedDataIndex: {
                    acceptReporters: false,
                    items: this.SHARED_DATA_INDEX_MENU
                },
                gpio: {
                    acceptReporters: false,
                    items: this.GPIO_MENU
                },
                axis: {
                    acceptReporters: false,
                    items: this.AXIS_MENU
                },
                pinMode: {
                    acceptReporters: false,
                    items: this.PIN_MODE_MENU
                },
                pinEventTypeMenu: {
                    acceptReporters: false,
                    items: this.PIN_EVENT_TYPE_MENU
                },
                pinEventMenu: {
                    acceptReporters: false,
                    items: this.PIN_EVENT_MENU
                },
                pinEventTimestampMenu: {
                    acceptReporters: false,
                    items: this.PIN_EVENT_TIMESTAMP_MENU
                },
                connectionStateMenu: {
                    acceptReporters: false,
                    items: this.CONNECTION_STATE_MENU
                }
            },
            // eslint-disable-next-line no-use-before-define
            translationMap: extensionTranslations
        };
    }

    /**
     * Update the previous occured time of all button events.
     */
    updatePrevButtonEvents () {
        this.prevButtonEvents = {};
        Object.entries(this._peripheral.buttonEvents).forEach(([componentID, events]) => {
            this.prevButtonEvents[componentID] = {};
            Object.entries(events).forEach(([eventID, timestamp]) => {
                this.prevButtonEvents[componentID][eventID] = timestamp;
            });
        });
    }

    /**
     * Test whether the event raised at the button.
     * @param {object} args - the block's arguments.
     * @param {number} args.BUTTON - ID of the button.
     * @param {number} args.EVENT - event to catch.
     * @return {boolean} - true if the event raised.
     */
    whenButtonEvent (args) {
        if (!this.updateLastButtonEventTimer) {
            this.updateLastButtonEventTimer = setTimeout(() => {
                this.updatePrevButtonEvents();
                this.updateLastButtonEventTimer = null;
            }, this.runtime.currentStepTime);
        }
        const buttonID = args.BUTTON;
        const eventID = args.EVENT;
        const lastTimestamp =
            this._peripheral.getButtonEventTimestamp(buttonID, eventID);
        if (lastTimestamp === null) return false;
        if (!this.prevButtonEvents[buttonID]) return true;
        return lastTimestamp !== this.prevButtonEvents[buttonID][eventID];
    }

    /**
     * Test whether the A or B button is pressed
     * @param {object} args - the block's arguments.
     * @param {number} args.BUTTON - ID of the button.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} - Promise that resolve whether the button is pressed or not.
     */
    isButtonPressed (args) {
        if (!this._peripheral.isConnected()) return Promise.resolve(false);
        const buttonID = args.BUTTON;
        if (buttonID === MMButtonID.ANY) {
            if (this._peripheral.readDigitalLevel(MMButtonID.A) === 0) return true;
            if (this._peripheral.readDigitalLevel(MMButtonID.B) === 0) return true;
        }
        return (this._peripheral.readDigitalLevel(buttonID) === 0);
    }

    // /**
    //  * Test whether the touch pin is received the event.
    //  * @param {object} args - the block's arguments.
    //  * @param {number} args.PIN - pin ID.
    //  * @param {string} args.EVENT - event ID.
    //  * @return {boolean} true if the pin received the event.
    //  */
    // whenPinTouched (args) {
    //     // should be implemented
    //     return false;
    // }

    /**
     * Update the last occured time of all gesture events.
     */
    updatePrevGestureEvents () {
        this.prevGestureEvents = {};
        Object.entries(this._peripheral.gestureEvents).forEach(([gestureID, timestamp]) => {
            this.prevGestureEvents[gestureID] = timestamp;
        });
    }

    /**
     * Test whether the gesture event raised.
     * @param {object} args - the block's arguments.
     * @param {number} args.GESTURE - ID of the gesture.
     * @return {boolean} - true if the event raised.
     */
    whenGesture (args) {
        if (!this.updateLastGestureEventTimer) {
            this.updateLastGestureEventTimer = setTimeout(() => {
                this.updatePrevGestureEvents();
                this.updateLastGestureEventTimer = null;
            }, this.runtime.currentStepTime);
        }
        const gestureID = args.GESTURE;
        const lastTimestamp =
            this._peripheral.getGestureEventTimestamp(gestureID);
        if (lastTimestamp === null) return false;
        if (!this.prevGestureEvents[gestureID]) return true;
        return lastTimestamp !== this.prevGestureEvents[gestureID];
    }

    /**
     * Display pixcel pattern on the 5x5 LED matrix with brightness and write mode.
     * @param {object} args - the block's arguments.
     * @param {string} args.MATRIX - the pattern of the pixels.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} - a Promise that resolves after a tick.
     */
    displayMatrix (args, util) {
        const matrixString = cast.toString(args.MATRIX)
            .replace(/！-～/g, ws => String.fromCharCode(ws.charCodeAt(0) - 0xFEE0)); // zenkaku to hankaku
        let matrixData;
        if (matrixString.includes(',')) {
            // comma separated values
            matrixData = matrixString.split(/[,\n]/);
        } else if (/[ \t]\d*[ \t]/g.test(matrixString)) {
            // space|tab separated values
            matrixData = matrixString.split(/\s/g);
        } else {
            // 0|1 pattern.
            matrixData = matrixString.replace(/\s/g, '')
                .split('');
            matrixData = matrixData.map(level => ((level === '0') ? 0 : 100));
        }
        matrixData = matrixData.map(brightness =>
            (Math.max(0,
                Math.min(100,
                    Number(brightness)) * 255 / 100))); // percent to 8bits value
        const matrix = [];
        for (let line = 0; line < 5; line++) {
            matrix[line] = [];
            for (let col = 0; col < 5; col++) {
                matrix[line][col] = matrixData[(line * 5) + col];
            }
        }
        return this._peripheral.displayPixels(matrix, util);
    }

    /**
     * Display text on the 5x5 LED matrix.
     * Displayable character is ascii and non-ascii is replaced to '?'.
     * @param {object} args - the block's arguments.
     * @param {string} args.TEXT - The contents to display.
     * @param {number} args.DELAY - The time to delay between characters, in milliseconds.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} - a Promise that resolves after the text is done printing.
     * Note the limit is 18 characters
     * The print time is calculated by multiplying the number of horizontal pixels
     * by the default scroll delay of 120ms.
     * The number of horizontal pixels = 6px for each character in the string,
     * 1px before the string, and 5px after the string.
     */
    displayText (args, util) {
        const text = String(args.TEXT)
            .replace(/！-～/g, zenkaku =>
                String.fromCharCode(zenkaku.charCodeAt(0) - 0xFEE0)) // zenkaku to hankaku
            .replace(/[^ -~]/g, '?');
        let delay = parseInt(args.DELAY, 10);
        delay = isNaN(delay) ? 120 : delay; // Use default delay if NaN.
        if (text.length > 0) this._peripheral.displayText(text, delay, util);
        const yieldDelay = delay * ((6 * text.length) + 6);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, yieldDelay);
        });
    }

    /**
     * Turn all 5x5 matrix LEDs off.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} - a Promise that resolves after a tick.
     */
    displayClear (args, util) {
        const matrix = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ];
        return this._peripheral.displayPixels(matrix, util);
    }

    /**
     * Test the selected pin is high as digital.
     * @param {object} args - the block's arguments.
     * @param {number} args.PIN - pin ID.
     * @return {boolean} - true if the pin is high.
     */
    isPinHigh (args) {
        return this._peripheral.isPinHigh(args.PIN);
    }

    /**
     * Get amount of light (0 - 255) on the LEDs.
     * @param {object} args - the block's arguments.
     * @return {number} - light level.
     */
    getLightLevel () {
        const level = this._peripheral.readLightLevel();
        return Math.round(level * 1000 / 255) / 10;
    }

    /**
     * Get temperature (integer in celsius) of micro:bit.
     * @param {object} args - the block's arguments.
     * @return {number} - value of temperature [centigrade].
     */
    getTemperature () {
        return this._peripheral.readTemperature();
    }

    /**
     * Return angle from the north to the micro:bit heading direction.
     * @return {number} - degree of compass heading angle from the north (0 - 359 degrees).
     */
    getCompassHeading () {
        return this._peripheral.readCompassHeading();
    }

    /**
     * Return analog value of the pin.
     * @param {object} args - the block's arguments.
     * @param {number} args.PIN - pin ID.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} - a Promise that resolves analog input value of the pin.
     */
    getAnalogValue (args, util) {
        return this._peripheral.readAnalogIn(args.PIN, util)
            .then(level => Math.round(level * 1000 / 1023) / 10);
    }

    /**
     * Return digital value of the pin.
     * @param {object} args - the block's arguments.
     * @param {number} args.PIN - pin ID.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} - a Promise that resolves digital input value of the pin.
     */
    getDigitalValue (args) {
        return this._peripheral.readDigitalLevel(args.PIN);
    }

    /**
     * Return value of the shared data.
     * @param {object} args - the block's arguments.
     * @property {string} args.INDEX - index of the shared data.
     * @return {number} - analog value of the shared data.
     */
    getSharedData (args) {
        const sharedDataIndex = parseInt(args.INDEX, 10);
        if (Number.isNaN(sharedDataIndex)) return 0;
        if (!this.SHARED_DATA_INDEX_MENU.includes(sharedDataIndex.toString())) return 0;
        return this._peripheral.getSharedData(sharedDataIndex);
    }

    /**
     * Set the shared data value.
     * @param {object} args - the block's arguments.
     * @property {string} args.INDEX - index of the shared data.
     * @param {object} util - utility object provided by the runtime.
     * @return {undefined}
     */
    setSharedData (args, util) {
        const sharedDataIndex = parseInt(args.INDEX, 10);
        if (Number.isNaN(sharedDataIndex)) return;
        if (!this.SHARED_DATA_INDEX_MENU.includes(sharedDataIndex.toString())) return;
        const sharedDataValue = parseInt(args.VALUE, 10);
        if (Number.isNaN(sharedDataValue)) return;
        this._peripheral.setSharedData(sharedDataIndex, sharedDataValue, util);
    }

    /**
     * Set mode of the pin.
     * @param {object} args - the block's arguments.
     * @param {number} args.PIN - pin ID.
     * @param {string} args.MODE - mode to set.
     * @param {object} util - utility object provided by the runtime.
     * @return {undefined}
     */
    setPinMode (args, util) {
        this._peripheral.setPinMode(args.PIN, args.MODE, util);
    }

    /**
     * Set the pin to Output mode and level.
     * @param {object} args - the block's arguments.
     * @param {number} args.PIN - pin ID.
     * @param {boolean} args.LEVEL - value to be set.
     * @param {object} util - utility object provided by the runtime.
     * @return {undefined}
     */
    setOutput (args, util) {
        this._peripheral.setPinOutput(args.PIN, args.LEVEL, util);
    }

    /**
     * Set the pin to PWM mode and level.
     * @param {object} args - the block's arguments.
     * @param {number} args.PIN - pin ID.
     * @param {object} util - utility object provided by the runtime.
     * @return {undefined}
     */
    setPWM (args, util) {
        let level = parseInt(args.LEVEL, 10);
        if (isNaN(level)) return;
        level = Math.max(0, level);
        level = Math.min(level, 1023);
        this._peripheral.setPinPWM(args.PIN, level, util);
    }

    /**
     * Set the pin to Servo mode and angle.
     * @param {object} args - the block's arguments.
     * @param {number} args.PIN - pin ID.
     * @param {object} util - utility object provided by the runtime.
     * @return {undefined}
     */
    setServo (args, util) {
        let angle = parseInt(args.ANGLE, 10);
        if (isNaN(angle)) return;
        angle = Math.max(0, angle);
        angle = Math.min(angle, 180);
        // let range = parseInt(args.RANGE, 10);
        // if (isNaN(range)) range = 0;
        // range = Math.max(0, range);
        // let center = parseInt(args.CENTER, 10);
        // if (isNaN(center)) range = 0;
        // center = Math.max(0, center);
        this._peripheral.setPinServo(args.PIN, angle, null, null, util);
    }

    /**
     * Return the value of magnetic force [micro tesla] on axis.
     * @param {object} args - the block's arguments.
     * @property {AxisSymbol} AXIS - the axis (X, Y, Z, Absolute).
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} -  a Promise that resolves value of magnetic force.
     */
    getMagneticForce (args, util) {
        return this._peripheral.readMagneticForce(args.AXIS, util);
    }

    /**
     * Return the value of acceleration on the specified axis.
     * @param {object} args - the block's arguments.
     * @param {AxisSymbol} args.AXIS - direction to get.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} - a Promise that resolves acceleration on the axis [milli-g].
     */
    getAcceleration (args, util) {
        return this._peripheral.readAcceleration(args.AXIS, util);
    }

    /**
     * Return pitch [degrees] of the micro:bit heading direction.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} - a Promise that resolves pitch.
     */
    getPitch (args, util) {
        return this._peripheral.readPitch(util);
    }

    /**
     * Return roll [degrees] of the micro:bit heading direction.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} - a Promise that resolves roll.
     */
    getRoll (args, util) {
        return this._peripheral.readRoll(util);
    }

    /**
     * Set listening event type at the pin.
     * @param {object} args - the block's arguments.
     * @param {number} args.PIN - pin ID.
     * @param {string} args.EVENT_TYPE - event to listen.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} - a Promise that resolves the setting.
    */
    setPinEventType (args, util) {
        return this._peripheral.setPinEventType(args.PIN, MMPinEventType[args.EVENT_TYPE], util);
    }

    /**
     * Rerutn timestamp value (micro senonds) of the event or 0 when the event is not received.
     * @param {object} args - the block's arguments.
     * @param {number} args.PIN - pin ID.
     * @param {string} args.EVENT - event value to get.
     * @param {object} util - utility object provided by the runtime.
     * @return {number} - timestamp of the event or 0.
     */
    getPinEventTimestamp (args) {
        const timestamp = this._peripheral.getPinEventTimestamp(args.PIN, MMPinEvent[args.EVENT]);
        return timestamp ? timestamp : 0;
    }

    /**
     * Update the previous occured time of all pin events.
     */
    updatePrevPinEvents () {
        this.prevPinEvents = {};
        Object.entries(this._peripheral._pinEvents).forEach(([componentID, events]) => {
            this.prevPinEvents[componentID] = {};
            Object.entries(events).forEach(([eventID, timestamp]) => {
                this.prevPinEvents[componentID][eventID] = timestamp;
            });
        });
    }

    /**
     * Test whether the event raised at the pin.
     * @param {object} args - the block's arguments.
     * @param {number} args.PIN - pin ID.
     * @param {string} args.EVENT - event to catch.
     * @return {boolean} - true if the event raised.
     */
    whenPinEvent (args) {
        if (!this.updateLastPinEventTimer) {
            this.updatePrevPinEvents = setTimeout(() => {
                this.updatePrevPinEvents();
                this.updateLastPinEventTimer = null;
            }, this.runtime.currentStepTime);
        }
        const pinIndex = args.PIN;
        const lastTimestamp =
            this._peripheral.getPinEventTimestamp(pinIndex, MMPinEvent[args.EVENT]);
        if (lastTimestamp === null) return false;
        if (!this.prevPinEvents[pinIndex]) return true;
        return lastTimestamp !== this.prevPinEvents[pinIndex][MMPinEvent[args.EVENT]];
    }

    /**
     * Test whether a micro:bit connected.
     * @param {object} args - the block's arguments.
     * @property {string} args.STATE - the state of connection to check.
     * @return {boolean} - true if the state is matched.
     */
    whenConnectionChanged (args) {
        const state = (args.STATE === 'connected');
        return (state === this._peripheral.isConnected());
    }

    /**
     * Setup format-message for this extension.
     */
    setupTranslations () {
        const localeSetup = formatMessage.setup();
        if (localeSetup && localeSetup.translations[localeSetup.locale]) {
            Object.assign(
                localeSetup.translations[localeSetup.locale],
                // eslint-disable-next-line no-use-before-define
                extensionTranslations[localeSetup.locale]
            );
        }
    }
}

const extensionTranslations = {
    'ja': {
        'mbitMore.whenButtonEvent': '[BUTTON] ボタンが[EVENT]とき',
        'mbitMore.buttonIDMenu.a': 'A',
        'mbitMore.buttonIDMenu.b': 'B',
        'mbitMore.buttonIDMenu.any': 'どれかの',
        'mbitMore.buttonEventMenu.down': '押された',
        'mbitMore.buttonEventMenu.up': '放された',
        'mbitMore.buttonEventMenu.click': 'クリックされた',
        'mbitMore.buttonEventMenu.longClick': '長くクリックされた',
        'mbitMore.buttonEventMenu.hold': '押され続けた',
        'mbitMore.buttonEventMenu.doubleClick': 'ダブルクリックされた',
        'mbitMore.isButtonPressed': '[BUTTON] ボタンが押された',
        'mbitMore.whenGesture': '[GESTURE] とき',
        'mbitMore.gesturesMenu.tiltUp': '上へ傾いた',
        'mbitMore.gesturesMenu.tiltDown': '下へ傾いた',
        'mbitMore.gesturesMenu.tiltLeft': '左へ傾いた',
        'mbitMore.gesturesMenu.tiltRight': '右へ傾いた',
        'mbitMore.gesturesMenu.faceUp': '表になった',
        'mbitMore.gesturesMenu.faceDown': '裏になった',
        'mbitMore.gesturesMenu.freefall': '落ちた',
        'mbitMore.gesturesMenu.g3': '3Gかかった',
        'mbitMore.gesturesMenu.g6': '6Gかかった',
        'mbitMore.gesturesMenu.g8': '8Gかかった',
        'mbitMore.gesturesMenu.shake': 'ゆさぶられた',
        'mbitMore.displayMatrix': 'パターン [MATRIX] を表示する',
        'mbitMore.displayText': '文字 [TEXT] を [DELAY] ミリ秒間隔で流す',
        'mbitMore.isPinHigh': 'ピン [PIN] がハイである',
        'mbitMore.lightLevel': '明るさ',
        'mbitMore.temperature': '温度',
        'mbitMore.compassHeading': '北からの角度',
        'mbitMore.magneticForce': '磁力 [AXIS]',
        'mbitMore.acceleration': '加速度 [AXIS]',
        'mbitMore.pitch': 'ピッチ',
        'mbitMore.roll': 'ロール',
        'mbitMore.analogValue': 'ピン [PIN] のアナログレベル',
        'mbitMore.getSharedData': '共有データ [INDEX]',
        'mbitMore.setSharedData': '共有データ [INDEX] を [VALUE] にする',
        'mbitMore.setPinMode': 'ピン [PIN] を [MODE] 入力にする',
        'mbitMore.setOutput': 'ピン [PIN] をデジタルレベル [LEVEL] にする',
        'mbitMore.setPWM': 'ピン [PIN] をアナログレベル [LEVEL] にする',
        'mbitMore.setServo': 'ピン [PIN] をサーボ [ANGLE] 度にする',
        'mbitMore.digitalValueMenu.Low': 'ロー',
        'mbitMore.digitalValueMenu.High': 'ハイ',
        'mbitMore.axisMenu.x': 'x',
        'mbitMore.axisMenu.y': 'y',
        'mbitMore.axisMenu.z': 'z',
        'mbitMore.axisMenu.absolute': '大きさ',
        'mbitMore.pinModeMenu.pullNone': '開放',
        'mbitMore.pinModeMenu.pullUp': 'プルアップ',
        'mbitMore.pinModeMenu.pullDown': 'プルダウン',
        'mbitMore.setPinEventType': 'ピン [PIN] で [EVENT_TYPE] ',
        'mbitMore.pinEventTypeMenu.none': 'イベントを受けない',
        'mbitMore.pinEventTypeMenu.edge': 'エッジタイプのイベントを受ける',
        'mbitMore.pinEventTypeMenu.pulse': 'パルスタイプのイベントを受ける',
        'mbitMore.whenPinEvent': 'ピン [PIN] で [EVENT] イベントが上がった',
        'mbitMore.pinEventMenu.rise': 'ライズ',
        'mbitMore.pinEventMenu.fall': 'フォール',
        'mbitMore.pinEventMenu.pulseHigh': 'ハイパルス',
        'mbitMore.pinEventMenu.pulseLow': 'ローパルス',
        'mbitMore.getPinEventTimestamp': 'ピン [PIN] の [EVENT]',
        'mbitMore.pinEventTimestampMenu.rise': 'ライズの時刻',
        'mbitMore.pinEventTimestampMenu.fall': 'フォールの時刻',
        'mbitMore.pinEventTimestampMenu.pulseHigh': 'ハイパルスの期間',
        'mbitMore.pinEventTimestampMenu.pulseLow': 'ローパルスの期間',
        'mbitMore.connectionStateMenu.connected': 'つながった',
        'mbitMore.connectionStateMenu.disconnected': '切れた',
        'mbitMore.whenConnectionChanged': 'micro:bit と[STATE]とき'
    },
    'ja-Hira': {
        'mbitMore.whenButtonEvent': '[BUTTON] ボタンが[EVENT]とき',
        'mbitMore.buttonIDMenu.a': 'A',
        'mbitMore.buttonIDMenu.b': 'B',
        'mbitMore.buttonIDMenu.any': 'どれかの',
        'mbitMore.buttonEventMenu.down': 'おされた',
        'mbitMore.buttonEventMenu.up': 'はなされた',
        'mbitMore.buttonEventMenu.click': 'クリックされた',
        'mbitMore.buttonEventMenu.longClick': 'ながくクリックされた',
        'mbitMore.buttonEventMenu.hold': 'おされつづけた',
        'mbitMore.buttonEventMenu.doubleClick': 'ダブルクリックされた',
        'mbitMore.isButtonPressed': '[BUTTON] ボタンがおされた',
        'mbitMore.whenGesture': '[GESTURE] とき',
        'mbitMore.gesturesMenu.tiltUp': 'うえへかたむいた',
        'mbitMore.gesturesMenu.tiltDown': 'したへかたむいた',
        'mbitMore.gesturesMenu.tiltLeft': 'ひだりへかたむいた',
        'mbitMore.gesturesMenu.tiltRight': 'みぎへかたむいた',
        'mbitMore.gesturesMenu.faceUp': 'おもてになった',
        'mbitMore.gesturesMenu.faceDown': 'うらになった',
        'mbitMore.gesturesMenu.freefall': 'おちた',
        'mbitMore.gesturesMenu.g3': '3Gかかった',
        'mbitMore.gesturesMenu.g6': '6Gかかった',
        'mbitMore.gesturesMenu.g8': '8Gかかった',
        'mbitMore.gesturesMenu.shake': 'ゆさぶられた',
        'mbitMore.displayMatrix': 'パターン [MATRIX] をひょうじする',
        'mbitMore.displayText': 'もじ [TEXT] を [DELAY] ミリびょうかんかくでながす',
        'mbitMore.isPinHigh': 'ピン [PIN] がハイである',
        'mbitMore.lightLevel': 'あかるさ',
        'mbitMore.temperature': 'おんど',
        'mbitMore.compassHeading': 'きたからのかくど',
        'mbitMore.magneticForce': 'じりょく [AXIS]',
        'mbitMore.acceleration': 'かそくど [AXIS]',
        'mbitMore.pitch': 'ピッチ',
        'mbitMore.roll': 'ロール',
        'mbitMore.analogValue': 'ピン [PIN] のアナログレベル',
        'mbitMore.getSharedData': 'きょうゆうデータ [INDEX]',
        'mbitMore.setSharedData': 'きょうゆうデータ [INDEX] を [VALUE] にする',
        'mbitMore.setPinMode': 'ピン [PIN] を [MODE] にゅうりょくにする',
        'mbitMore.setOutput': 'ピン [PIN] をデジタルレベル [LEVEL] にする',
        'mbitMore.setPWM': 'ピン [PIN] をアナログレベル [LEVEL] にする',
        'mbitMore.setServo': 'ピン [PIN] をサーボ [ANGLE] どにする',
        'mbitMore.digitalValueMenu.Low': 'ロー',
        'mbitMore.digitalValueMenu.High': 'ハイ',
        'mbitMore.axisMenu.x': 'x',
        'mbitMore.axisMenu.y': 'y',
        'mbitMore.axisMenu.z': 'z',
        'mbitMore.axisMenu.absolute': 'おおきさ',
        'mbitMore.pinModeMenu.pullNone': 'かいほう',
        'mbitMore.pinModeMenu.pullUp': 'プルアップ',
        'mbitMore.pinModeMenu.pullDown': 'プルダウン',
        'mbitMore.setPinEventType': 'ピン [PIN] で [EVENT_TYPE]',
        'mbitMore.pinEventTypeMenu.none': 'イベントをうけない',
        'mbitMore.pinEventTypeMenu.edge': 'エッジタイプのイベントをうける',
        'mbitMore.pinEventTypeMenu.pulse': 'パルスタイプのイベントをうける',
        'mbitMore.whenPinEvent': 'ピン [PIN] で [EVENT] イベントがあがった',
        'mbitMore.pinEventMenu.rise': 'ライズ',
        'mbitMore.pinEventMenu.fall': 'フォール',
        'mbitMore.pinEventMenu.pulseHigh': 'ハイパルス',
        'mbitMore.pinEventMenu.pulseLow': 'ローパルス',
        'mbitMore.getPinEventTimestamp': 'ピン [PIN] の [EVENT]',
        'mbitMore.pinEventTimestampMenu.rise': 'ライズのじかん',
        'mbitMore.pinEventTimestampMenu.fall': 'フォールのじかん',
        'mbitMore.pinEventTimestampMenu.pulseHigh': 'ハイパルスのきかん',
        'mbitMore.pinEventTimestampMenu.pulseLow': 'ローパルスのきかん',
        'mbitMore.connectionStateMenu.connected': 'つながった',
        'mbitMore.connectionStateMenu.disconnected': 'きれた',
        'mbitMore.whenConnectionChanged': 'micro:bit と[STATE]とき'
    },
    'pt-br': {
        'mbitMore.lightLevel': 'Intensidade da Luz',
        'mbitMore.compassHeading': 'Está em direção ao Norte',
        'mbitMore.magneticForce': 'Força Magnética [AXIS]',
        'mbitMore.acceleration': 'Aceleração no Eixo[AXIS]',
        'mbitMore.analogValue': 'Ler Pino Analógico [PIN]',
        'mbitMore.getSharedData': 'Dados compartilhados [INDEX]',
        'mbitMore.setSharedData': 'Definir dados compartilhados [INDEX] com valor [VALUE]',
        'mbitMore.setInput': 'Definir Pino[PIN] como entrada',
        'mbitMore.setPWM': 'Definir pino PWM[PIN]com[LEVEL]',
        'mbitMore.setServo': 'Definir Servo no pino [PIN]com ângulo de [ANGLE]॰',
        'mbitMore.digitalValueMenu.Low': 'desligado',
        'mbitMore.digitalValueMenu.High': 'ligado'
    },
    'pt': {
        'mbitMore.lightLevel': 'Intensidade da Luz',
        'mbitMore.compassHeading': 'Está em direção ao Norte',
        'mbitMore.magneticForce': 'Força Magnética [AXIS]',
        'mbitMore.acceleration': 'Aceleração no Eixo[AXIS]',
        'mbitMore.analogValue': 'Ler Pino Analógico [PIN]',
        'mbitMore.getSharedData': 'Dados compartilhados [INDEX]',
        'mbitMore.setSharedData': 'Definir dados compartilhados [INDEX] com valor [VALUE]',
        'mbitMore.setInput': 'Definir Pino[PIN] como entrada',
        'mbitMore.setPWM': 'Definir pino PWM[PIN]com[LEVEL]',
        'mbitMore.setServo': 'Definir Servo no pino [PIN]com ângulo de [ANGLE]॰',
        'mbitMore.digitalValueMenu.Low': 'desligado',
        'mbitMore.digitalValueMenu.High': 'ligado'
    }
};

exports.blockClass = MbitMoreBlocks; // loadable-extension needs this line.
module.exports = MbitMoreBlocks;
