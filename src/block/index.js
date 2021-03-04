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
let extensionURL = 'https://yokobond.github.io/mbit-more-v2/dist/microbitMore.mjs';

/**
 * Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAABG2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+Gkqr6gAAAYNpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHLK8RRFMc/82Dk0QgLC2XSsEKMGmwsZmIoLMYor83MzzzUPH79fjNpslW2U5TYeC34C9gqa6WIlGxsrIkN+jm/GTWSObdzz+d+7z2ne88FayippHR7H6TSWS0Y8Lnm5hdcjifsNFHNIO1hRVenZsZCVLT3WyxmvO4xa1U+96/VLUd1BSw1wiOKqmWFx4UnV7OqyVvCLUoivCx8ItytyQWFb0w9UuJnk+Ml/jRZCwX9YG0UdsV/ceQXKwktJSwvx51K5pSf+5gvqY+mZ2ckdoi3oRMkgA8XE4zix0s/wzJ76cFDr6yokN9XzJ8mI7mKzCp5NFaIkyBLt6g5qR6VGBM9KiNJ3uz/377qsQFPqXq9D6oeDeO1Exyb8FUwjI8Dw/g6BNsDnKfL+Zl9GHoTvVDW3HvgXIfTi7IW2YazDWi9V8NauCjZxK2xGLwcQ8M8NF9B7WKpZz/7HN1BaE2+6hJ2dqFLzjuXvgGIDmf1SJ4uQQAAAAlwSFlzAAALEwAACxMBAJqcGAAACJpJREFUWIXtmGlsXNUVx3/3vvdm7BnbSRxncRLHa+IsZCmIJbSlKQG1SLRNgoqiUFGpaoUUFSTURRQFlRLoQhekQtUPpYvEB0AiJQVBU1q2gptCUgjZIAl2xo4dJyHjZOzZ3nLv6YcZTwy2k1CpH5Dyl0bz3n1v3v29c849/6uBi7qoi/pkS310oL25RQFVgL7Qh2z+yW9fbKivafVc1wMIwqiQHhrZd//dm9Z/DBYD+N29KZkUsL25Rbfd9Js/eU2rbtFV08YBBu8+QWzxBgAkf4pocCde+w1EAzvwdz0CYj4Gz4clIkdCv3B316vPPjF2/EMQUzuvnxZrvuZrE8Lte4yo54XSG+VPUey6DxXlMMd2EPznN+PglFITfiaTUqrVi1dtbm9uiY8dd8eeVE9vnaFiNeOeEux7jKj7eZSXwOY/oNi1Bcl/QHRiN/bgNhCDqq7HSc4EwAwPIMHIpEBKKURkoivzAWdSwIk0CiciYEP8rvtQhXRp8kwPGogtWo81ETZ7HIB4x3KkeIYo9Y+zRSQggFIgci7ID+ucgMG+xwjff67y1tqGqGIa7Wi0gtLsgls7myD1MnboEMqpQsIM3rxV4OhKFEUEK4IVQKQMe37ISQFH4UYn0Aq01rha4TgOWqsyHtC7nao5VyJNV6EEJMohvS8Qj7mocgitCMZajLFEWBDB2v8xgmMjJyJordCqBOe5Dp7r4roajUIQTPEEUfc2rBUEwVEKx9E4ca9yT2SFKDIEIogojAjO1FaSi9cRJuYQpV4iKM95TsCxcKNSgCpHznNd4jGXFZk0Mwt5uua34cVj5PIFxIIbc/H9gJpkNWIss4eHuOTEcf42r41s+YVL6VbguMiUdkzfPwm7nz9/BAvvbx/x6hvPglVWoUIrcLTCczVxz+W2f71C3VCatmUrydyzmTfe2kMimWDJogX8dfvLXL96FflXX+PmZ7YS94t8cF0V/549D2OFMDKlZ4sQ9HcRHHjy46UYhAUdHWhdaodRGDAwMIDjaFxHE3MdnHwegM/u3c0bW7bgr76O3EiWVwaPU5OIc/zpZ/jmX54iHgQA1FqD52h8XUr//OZmBIX4bxK2NNNzJHXhgEuXLOEH37sN3/dLDRbY8uNfkzl9Gkc7uI5G67M97sq971ClFNvXrqVuylRiO3dx6zNb8cpwANrRpbrUmgUd7Xx709cx1uK6Lq7rctc9P6e/f2AcyzjHaGmeR3V1nFwuz+Z7f8kDP3uktFAcF6VKfUyPacAvXbsGqzUr9uzmxm1P07h/H7dufRLP9+lZsJBUa1tpIlWqY1XuBvl8gR/e9xD3//RhRIRkIklrS9M4nnEDdXW1uG4psBUMkcqxUgqlFaPt69CixWy7eQPGcVi65x3W/uFRvDDk8MJOnrrpq0TOWWNQUl5wUlosY33G81ym1NWOs55xKd6z912WLllMMplgy73fRakSoLFnvVasVFJsjKXw+dU87Tise/JxnCjiwMJO3rr9dmLDWVS5jhnT8oxYEolq7r3nTlzPRSnFmUyG/v6BcbuNCWtw/4ED/OiBh9Fal1pCFHF88DiJqlipTQDGWgAiYznw3vuYhtkM3LSBOSdP8PYly6GnD8fRRMaUk1D6nQDd3d384qFHEcAKhGE4Yf1NCgiKw909VF22iWDPH3GMj+fqSiCsCFqVzoPI0NLWzJHUAKda24ldfTUjBw6ytK2FdHqo0qosMgZS0XMkRWQMpuwmk9nexIBKEV/5LdwZywjGDIuAtVJxDIAwMuQLPtlCESc0DOey5IsB2UKBgh9U7ExsyYtFpOLFctYsJ9WEgLElG9D1najM4fIuREpwIlhriaxFyhMHkeF4aoDMSB5jLWeGswRBRE9qAAWYcoojKxhjsab8ahewk4FJtvXB/scpvPgdsjt+hUQFpAw5CheGESaRAGAExfq1N1DfUE/HgjY2blxPMYy48UtfYO68RkwyCUBOO4TGYqQEOgp5rk0sfGTLf9nl18ytq2/s/+hNTsWHNXHPI+Y5LE6foD6fY0dTG0XfJ7QQRQYrlpjn4SiIxz3m5nMsO3aUVzoWkTfgRxFBaAiNOZt+qXyPHD345uzu3lR+dO4JU7xgVjrT1pB+Np2r+dyu1JwmoVRDjopYs6h3pyivoYv5rdGUGZgwIrIKh4AvruzemQ90/PVDrcuNePiBoS+epL+tkytaBt/O++LvH6i7qug7lRR/ekHfoWrX3zeYmbJub3/DhaX4ms6jvb/bevobV7YNvOU5o/VnWd3ZU+w+uWSjterBzlnH8MOwFI3IsGbpEfNeX+0tgS93LG8alDAqjReDkE/N72Ok2HDnmVzDHSuaBjHlRTK9Js+iWSf+/vs/pzeumH8iNRHLuAi2zcjwmYXHlr3woOqfPTU/40i6oVTsVnF562DVVy49tNtzlbvrSCOe4+OoCFdHrGgadNZdOvSOCPJ2X6OKeyFaaapjEYvnnKZ1xt7nEEP/UB3WRCgtNE7N8uXL+jZd0ZFYH0TDs18/NC9/9OB5ANcs7WVqMlCZQt3MRGyYjasOMDXhExmNFUVgq5PTE8OsXuSzcv4gtdUhiVhAEClQbrVCWL04xfKmk8QcS0NdgWwxRjZMJGPa0jz9KB2z0jja0lCb5/DJuWq4mGicWZvm2iV93mtd5wAcGRo87WqVA5LTEtkxV0odSythSnUWrS1KGZSyaGXQyqCUg6MjYo4hNICyKG1xtEEpQ228UD62qIqnwMzaDDNrM0RGqPKiU0A0KaCJwkI6E7/r1HDVA3PrszV535WhkViuGGjHipJqL3I8x4+FolQm5/ln8p5fDJRb5bnadYyalizGrBU1lK3yz2RjgeOIMkZiRpRMT/oxrYQzOS8aynlFBUqsuPU12bigSI/Ec9m8+X53b2qsN4z/6wOgvbnFm2j8/yzp7k1F57/toi7qoj5Z+i+Wq1Nf6TRyQQAAAABJRU5ErkJggg==';

/**
 * Enum for version of the hardware.
 * @readonly
 * @enum {number}
 */
const MbitMoreHardwareVersion =
{
    MICROBIT_V1: 1,
    MICROBIT_V2: 2
};

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
    CMD_AUDIO: 0x03,
    CMD_DATA: 0x04
};

/**
 * Enum for command about gpio pins.
 * @readonly
 * @enum {number}
 */
const MbitMorePinCommand =
{
    SET_OUTPUT: 0x01,
    SET_PWM: 0x02,
    SET_SERVO: 0x03,
    SET_PULL: 0x04,
    SET_EVENT: 0x05
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
 * Enum for name of pull mode.
 * @readonly
 * @enum {number}
 */
const MbitMorePullModeName = {
    NONE: 'NONE',
    DOWN: 'DOWN',
    UP: 'UP'
};

/**
 * Enum for ID of pull mode.
 * @readonly
 * @enum {number}
 */
const MbitMorePullModeID = {
    NONE: 0,
    DOWN: 1,
    UP: 2
};

/**
 * Enum for data format.
 * @readonly
 * @enum {number}
 */
const MbitMoreDataFormat = {
    CONFIG: 0x10, // not used at this version
    PIN_EVENT: 0x11,
    ACTION_EVENT: 0x12,
    DATA_NUMBER: 0x13,
    DATA_TEXT: 0x14
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
 * Enum for ID of pin-mode
 * @readonly
 * @enum {string}
 */
const MbitMorePinMode = {
    INPUT: 'INPUT',
    OUTPUT: 'OUTPUT',
    PWM: 'PWM',
    SERVO: 'SERVO',
    TOUCH: 'TOUCH'
};

/**
 * Enum for ID of buttons
 * @readonly
 * @enum {string}
 */
const MbitMoreButtonName = {
    P0: 'P0',
    P1: 'P1',
    P2: 'P2',
    A: 'A',
    B: 'B',
    LOGO: 'LOGO'
};

/**
 * Enum for componentID of buttons
 * @readonly
 * @enum {string}
 */
const MbitMoreButtonID = {
    1: 'A',
    2: 'B',
    100: 'P0',
    101: 'P1',
    102: 'P2',
    121: 'LOGO'
};

/**
 * Enum for index of pin for buttons
 * @readonly
 * @enum {number}
 */
const MbitMoreButtonPinIndex = {
    P0: 0,
    P1: 1,
    P2: 2
};

/**
 * Enum for index in data of button state
 * @readonly
 * @enum {number}
 */
const MbitMoreButtonStateIndex = {
    P0: 0,
    P1: 1,
    P2: 2,
    A: 3,
    B: 4,
    LOGO: 5
};

/**
 * Enum for name of event from button
 * @readonly
 * @enum {string}
 */
const MbitMoreButtonEventName = {
    DOWN: 'DOWN',
    UP: 'UP',
    CLICK: 'CLICK',
    LONG_CLICK: 'LONG_CLICK',
    HOLD: 'HOLD',
    DOUBLE_CLICK: 'DOUBLE_CLICK'
};

/**
 * Enum for ID of event from button
 * @readonly
 * @enum {string}
 */
const MbitMoreButtonEventID = {
    1: 'DOWN',
    2: 'UP',
    3: 'CLICK',
    4: 'LONG_CLICK',
    5: 'HOLD',
    6: 'DOUBLE_CLICK'
};

/**
 * Enum for name of gesture.
 * @readonly
 * @enum {string}
 */
const MbitMoreGestureName =
{
    TILT_UP: 'TILT_UP',
    TILT_DOWN: 'TILT_DOWN',
    TILT_LEFT: 'TILT_LEFT',
    TILT_RIGHT: 'TILT_RIGHT',
    FACE_UP: 'FACE_UP',
    FACE_DOWN: 'FACE_DOWN',
    FREEFALL: 'FREEFALL',
    G3: 'G3',
    G6: 'G6',
    G8: 'G8',
    SHAKE: 'SHAKE'
};

/**
 * Enum for ID of gesture.
 * @readonly
 * @enum {string}
 */
const MbitMoreGestureID =
{
    1: 'TILT_UP',
    2: 'TILT_DOWN',
    3: 'TILT_LEFT',
    4: 'TILT_RIGHT',
    5: 'FACE_UP',
    6: 'FACE_DOWN',
    7: 'FREEFALL',
    8: 'G3',
    9: 'G6',
    10: 'G8',
    11: 'SHAKE'
};

/**
 * Enum for event type in the micro:bit runtime.
 * @readonly
 * @enum {number}
 */
const MbitMorePinEventType = {
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
const MbitMorePinEvent = {
    RISE: 2,
    FALL: 3,
    PULSE_HIGH: 4,
    PULSE_LOW: 5
};

/**
 * Enum for data type of data-sending.
 * @readonly
 * @enum {number}
 */
const MbitMoreSendingDataType = {
    NUMBER: 1,
    TEXT: 2
};

/**
 * Enum for sub-command about configurations.
 * @readonly
 * @enum {number}
 */
const MbitMoreConfig =
{
    MIC: 0x01,
    TOUCH: 0x02
};

/**
 * Enum for sub-command about audio.
 * @readonly
 * @enum {number}
 */
const MbitMoreAudioCommand =
{
    STOP_TONE: 0x00,
    PLAY_TONE: 0x01
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
const BLESendInterval = 30;

/**
 * A string to report to the BLE socket when the micro:bit has stopped receiving data.
 * @type {string}
 */
const BLEDataStoppedError = 'micro:bit extension stopped receiving data';

const MM_SERVICE = {
    ID: '0b50f3e4-607f-4151-9091-7d008d6ffc5c',
    COMMAND_CH: '0b500100-607f-4151-9091-7d008d6ffc5c',
    STATE_CH: '0b500101-607f-4151-9091-7d008d6ffc5c',
    MOTION_CH: '0b500102-607f-4151-9091-7d008d6ffc5c',
    PIN_EVENT_CH: '0b500110-607f-4151-9091-7d008d6ffc5c',
    ACTION_EVENT_CH: '0b500111-607f-4151-9091-7d008d6ffc5c',
    ANALOG_IN_CH: [
        '0b500120-607f-4151-9091-7d008d6ffc5c',
        '0b500121-607f-4151-9091-7d008d6ffc5c',
        '0b500122-607f-4151-9091-7d008d6ffc5c'
    ],
    MESSAGE_CH: '0b500130-607f-4151-9091-7d008d6ffc5c'
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
        this.runtime = runtime;

        /**
         * The BluetoothLowEnergy connection socket for reading/writing peripheral data.
         * @type {BLE}
         * @private
         */
        this._ble = null;
        this.runtime.registerPeripheralExtension(extensionId, this);

        /**
         * The id of the extension this peripheral belongs to.
         */
        this._extensionId = extensionId;

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

        this.buttonState = {};

        /**
         * The most recently received button events for each buttons.
         * @type {Object} - Store of buttons which has events.
         * @private
         */
        this.buttonEvents = {};
        Object.keys(MbitMoreButtonStateIndex).forEach(name => {
            this.buttonEvents[name] = {};
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

        /**
         * The most recently received data from micro:bit.
         * @type {Object} - Store of received data
         * @private
         */
        this.receivedData = {};

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
        this.bleBusy = true;

        /**
         * ID for a timeout which is used to clear the busy flag if it has been
         * true for a long time.
         */
        this.bleBusyTimeoutID = null;

        this.reset = this.reset.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this.onNotify = this.onNotify.bind(this);

        this.stopTone = this.stopTone.bind(this);
        if (this.runtime) {
            this.runtime.on('PROJECT_STOP_ALL', this.stopTone);
        }

        this.analogInUpdateInterval = 100; // milli-seconds
        this.analogInLastUpdated = [Date.now(), Date.now(), Date.now()];

        this.initConfig();
    }

    /**
     * Initialize configuration of the micro:bit.
     */
    initConfig () {
        this.config = {};
        this.config.mic = false;
        this.config.pinMode = {};
    }

    /**
     * Start updating process for micro:bit state and motion.
     */
    startUpdater () {
        if (this.updater) {
            clearTimeout(this.updater);
        }
        if (this.bleAccessWaiting) {
            this.updater = setTimeout(() => this.startUpdater(), 0);
            return;
        }
        this.updateState()
            .then(() => this.updateMotion())
            .finally(() => {
                this.updater = setTimeout(
                    () => this.startUpdater(),
                    this.microbitUpdateInterval
                );
            });
    }

    /**
     * Stop updating process for micro:bit state and motion.
     */
    stopUpdater () {
        clearTimeout(this.updater);
    }

    /**
     * @param {string} text - the text to display.
     * @param {number} delay - The time to delay between characters, in milliseconds.
     * @param {object} util - utility object provided by the runtime.
     * @return {?Promise} a Promise that resolves when command sending done or undefined if this process was yield.
     */
    displayText (text, delay, util) {
        const textLength = Math.min(18, text.length);
        const textData = new Uint8Array(textLength + 1);
        for (let i = 0; i < textLength; i++) {
            textData[i] = text.charCodeAt(i);
        }
        return this.sendCommandSet(
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
     * @return {?Promise} a Promise that resolves when command sending done or undefined if this process was yield.
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

    /**
     * Set pull mode to the pin.
     * @param {number} pinIndex - index of the pin
     * @param {MbitMorePullModeID} pullMode - pull mode to set
     * @param {BlockUtility} util - utility object provided from the runtime
     * @return {?Promise} a Promise that resolves when command sending done or undefined if this process was yield.
     */
    setPullMode (pinIndex, pullMode, util) {
        this.config.pinMode[pinIndex] = MbitMorePinMode.INPUT;
        return this.sendCommandSet(
            [{
                id: (BLECommand.CMD_PIN << 5) | MbitMorePinCommand.SET_PULL,
                message: new Uint8Array([
                    pinIndex,
                    pullMode
                ])
            }],
            util
        );
    }

    /**
     * Set pin to digital output mode and the level.
     * @param {number} pinIndex - Index of pin.
     * @param {boolean} level - Value in digital (true = High)
     * @param {BlockUtility} util - utility object provided by the runtime.
     * @return {?Promise} a Promise that resolves when command sending done or undefined if this process was yield.
     */
    setPinOutput (pinIndex, level, util) {
        this.config.pinMode[pinIndex] = MbitMorePinMode.OUTPUT;
        return this.sendCommandSet(
            [{
                id: (BLECommand.CMD_PIN << 5) | MbitMorePinCommand.SET_OUTPUT,
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

    /**
     *
     * @param {number} pinIndex - index of the pin
     * @param {number} level - value of analog output [0..1024].
     * @param {BlockUtility} util - utility object provided by the runtime.
     * @return {?Promise} a Promise that resolves when command sending done or undefined if this process was yield.
     */
    setPinPWM (pinIndex, level, util) {
        this.config.pinMode[pinIndex] = MbitMorePinMode.PWM;
        const dataView = new DataView(new ArrayBuffer(2));
        dataView.setUint16(0, level, true);
        return this.sendCommandSet(
            [{
                id: (BLECommand.CMD_PIN << 5) | MbitMorePinCommand.SET_PWM,
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
        this.config.pinMode[pinIndex] = MbitMorePinMode.SERVO;
        if (!range || range < 0) range = 0;
        if (!center || center < 0) center = 0;
        const dataView = new DataView(new ArrayBuffer(6));
        dataView.setUint16(0, angle, true);
        dataView.setUint16(2, range, true);
        dataView.setUint16(4, center, true);
        return this.sendCommandSet(
            [{
                id: (BLECommand.CMD_PIN << 5) | MbitMorePinCommand.SET_SERVO,
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
     * @return {?Promise} a Promise that resolves value of analog input or undefined if this process was yield.
     */
    readAnalogIn (pinIndex, util) {
        if (!this.isConnected()) {
            return Promise.resolve(0);
        }
        if ((Date.now() - this.analogInLastUpdated[pinIndex]) < this.analogInUpdateInterval) {
            return Promise.resolve(this.analogValue[pinIndex]);
        }
        if (this.bleBusy) {
            this.bleAccessWaiting = true;
            if (util) util.yield(); // re-try this call after a while.
            return; // Do not return Promise.resolve() to re-try.
        }
        this.bleBusy = true;
        this.bleBusyTimeoutID = window.setTimeout(() => {
            this.bleBusy = false;
            this.bleAccessWaiting = false;
        }, 1000);
        return new Promise(resolve => this._ble.read(
            MM_SERVICE.ID,
            MM_SERVICE.ANALOG_IN_CH[pinIndex],
            false)
            .then(result => {
                window.clearTimeout(this.bleBusyTimeoutID);
                this.bleBusy = false;
                this.bleAccessWaiting = false;
                if (!result) {
                    return resolve(this.analogValue[pinIndex]);
                }
                const data = Base64Util.base64ToUint8Array(result.message);
                const dataView = new DataView(data.buffer, 0);
                this.analogValue[pinIndex] = dataView.getUint16(0, true);
                this.analogInLastUpdated = Date.now();
                resolve(this.analogValue[pinIndex]);
            })
        );
    }

    /**
     * Update data of digital level, light level, temperature, sound level.
     * @return {Promise} - a Promise that resolves updated data holder.
     */
    updateState () {
        if (!this.isConnected()) return Promise.resolve(this);
        if (this.bleBusy) {
            return Promise.resolve(this);
        }
        this.bleBusy = true;
        this.bleBusyTimeoutID = window.setTimeout(() => {
            this.bleBusy = false;
        }, 1000);
        return new Promise(resolve => {
            this._ble.read(
                MM_SERVICE.ID,
                MM_SERVICE.STATE_CH,
                false)
                .then(result => {
                    window.clearTimeout(this.bleBusyTimeoutID);
                    this.bleBusy = false;
                    if (!result) return resolve(this);
                    const data = Base64Util.base64ToUint8Array(result.message);
                    const dataView = new DataView(data.buffer, 0);
                    // Digital Input
                    const gpioData = dataView.getUint32(0, true);
                    for (let i = 0; i < this.gpio.length; i++) {
                        this.digitalLevel[this.gpio[i]] = (gpioData >> this.gpio[i]) & 1;
                    }
                    Object.keys(MbitMoreButtonStateIndex).forEach(
                        name => {
                            this.buttonState[name] = (gpioData >> (24 + MbitMoreButtonStateIndex[name])) & 1;
                        });
                    this.lightLevel = dataView.getUint8(4);
                    this.temperature = dataView.getUint8(5) - 128;
                    this.soundLevel = dataView.getUint8(6);
                    this.resetConnectionTimeout();
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
     * Configurate microphone.
     * @param {boolean} use - true to use microphone.
     * @param {object} util - utility object provided by the runtime.
     * @return {?Promise} - a Promise that resolves state of the microphone or undefined if the process was yield.
     */
    configMic (use, util) {
        use = (use === true);
        if (!this.isConnected()) {
            return Promise.resolve(false);
        }
        if (this.config.mic === use) {
            return Promise.resolve(this.config.mic);
        }
        const sendPromise = this.sendCommandSet(
            [{
                id: (BLECommand.CMD_CONFIG << 5) | MbitMoreConfig.MIC,
                message: new Uint8Array([(use ? 1 : 0)]) // use microphone
            }],
            util
        );
        if (sendPromise) {
            return sendPromise
                .then(() => {
                    this.config.mic = use;
                    return this.config.mic;
                });
        }
        return;
    }

    /**
     * Play tone on the speaker.
     * @param {number} frequency - wave frequency to play [Hz]
     * @param {number} volume laudness of tone [%]
     * @param {object} util - utility object provided by the runtime.
     * @return {?Promise} - a Promise that resolves to send command or undefined if this process was yield.
     */
    playTone (frequency, volume, util) {
        if (!this.isConnected()) {
            return Promise.resolve();
        }
        const frequencyData = new DataView(new ArrayBuffer(4));
        frequencyData.setUint32(0, Math.round(1000000 / frequency), true);
        volume = Math.round(volume * 0xff / 100);
        return this.sendCommandSet(
            [{
                id: (BLECommand.CMD_AUDIO << 5) | MbitMoreAudioCommand.PLAY_TONE,
                message: new Uint8Array([
                    frequencyData.getUint8(0),
                    frequencyData.getUint8(1),
                    frequencyData.getUint8(2),
                    frequencyData.getUint8(3),
                    volume
                ])
            }],
            util
        );
    }

    /**
     * Stop playing tone on the speaker.
     * @param {object} util - utility object provided by the runtime.
     * @return {?Promise} - a Promise that resolves to send command or undefined if this process was yield.
     */
    stopTone (util) {
        if (!this.isConnected()) {
            return Promise.resolve();
        }
        return this.sendCommandSet(
            [{
                id: (BLECommand.CMD_AUDIO << 5) | MbitMoreAudioCommand.STOP_TONE,
                message: new Uint8Array([])
            }],
            util
        );
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
    updateMotion () {
        if (!this.isConnected()) return Promise.resolve(this);
        if (this.bleBusy) {
            return Promise.resolve(this);
        }
        this.bleBusy = true;
        this.bleBusyTimeoutID = window.setTimeout(() => {
            this.bleBusy = false;
        }, 1000);
        return new Promise(resolve => {
            this._ble.read(
                MM_SERVICE.ID,
                MM_SERVICE.MOTION_CH,
                false)
                .then(result => {
                    window.clearTimeout(this.bleBusyTimeoutID);
                    this.bleBusy = false;
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
                    this.resetConnectionTimeout();
                    resolve(this);
                });
        });
    }

    /**
     * Read pitch [degrees] of the micro:bit heading direction.
     * @return {number} - degree of pitch.
     */
    readPitch () {
        if (!this.isConnected()) {
            return 0;
        }
        return this.pitch;
    }

    /**
     * Read roll [degrees] of the micro:bit heading direction.
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
     * Read value of magnetic force [micro teslas] for the axis.
     * @param {AxisSymbol} axis - direction of magnetic force.
     * @return {number} - value of magnetic force.
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
        this.bleBusy = true;
        this._ble = new BLE(this.runtime, this._extensionId, {
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
        this.stopUpdater();
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
        if (this.bleBusy) {
            this.bleAccessWaiting = true;
            if (util) {
                util.yield(); // re-try this call after a while.
            } else {
                setTimeout(() => this.sendCommandSet(commands, util), 1);
            }
            return; // Do not return Promise.resolve() to re-try.
        }
        this.bleBusy = true;
        // Clear busy and BLE access waiting flag when the scratch-link does not respond.
        this.bleBusyTimeoutID = window.setTimeout(() => {
            this.bleBusy = false;
            this.bleAccessWaiting = false;
        }, 1000);
        return new Promise(resolve => {
            commands.reduce(
                (acc, cur, i) => {
                    const sendPromise = acc.then(() => this.sendCommand(cur));
                    if (i === commands.length - 1) {
                        // the last command
                        sendPromise.then(() => {
                            this.bleBusy = false;
                            this.bleAccessWaiting = false;
                            window.clearTimeout(this.bleBusyTimeoutID);
                            resolve();
                        });
                    }
                    return sendPromise;
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
        this._ble.read(
            MM_SERVICE.ID,
            MM_SERVICE.COMMAND_CH,
            false)
            .then(result => {
                const data = Base64Util.base64ToUint8Array(result.message);
                const dataView = new DataView(data.buffer, 0);
                this.hardware = dataView.getUint8(0);
                this.protocol = dataView.getUint8(1);
                this._ble.startNotifications(
                    MM_SERVICE.ID,
                    MM_SERVICE.ACTION_EVENT_CH,
                    this.onNotify);
                this._ble.startNotifications(
                    MM_SERVICE.ID,
                    MM_SERVICE.PIN_EVENT_CH,
                    this.onNotify);
                if (this.hardware === MbitMoreHardwareVersion.MICROBIT_V1) {
                    this.microbitUpdateInterval = 100; // milli-seconds
                } else {
                    this._ble.startNotifications(
                        MM_SERVICE.ID,
                        MM_SERVICE.MESSAGE_CH,
                        this.onNotify);
                    this.microbitUpdateInterval = 50; // milli-seconds
                }
                this.initConfig();
                this.bleBusy = false;
                this.startUpdater();
                this.resetConnectionTimeout();
            });
    }

    /**
     * Process the data from the incoming BLE characteristic.
     * @param {string} msg - the incoming BLE data.
     * @private
     */
    onNotify (msg) {
        const data = Base64Util.base64ToUint8Array(msg);
        const dataView = new DataView(data.buffer, 0);
        const dataFormat = dataView.getUint8(19);
        if (dataFormat === MbitMoreDataFormat.ACTION_EVENT) {
            const actionEventType = dataView.getUint8(0);
            if (actionEventType === MbitMoreActionEvent.BUTTON) {
                const buttonName = MbitMoreButtonID[dataView.getUint16(1, true)];
                const eventName = MbitMoreButtonEventID[dataView.getUint8(3)];
                this.buttonEvents[buttonName][eventName] = dataView.getUint32(4, true); // Timestamp
            } else if (actionEventType === MbitMoreActionEvent.GESTURE) {
                const gestureName = MbitMoreGestureID[dataView.getUint8(1)];
                this.gestureEvents[gestureName] = dataView.getUint32(2, true); // Timestamp
            }
        } else if (dataFormat === MbitMoreDataFormat.PIN_EVENT) {
            const pinIndex = dataView.getUint8(0);
            if (!this._pinEvents[pinIndex]) {
                this._pinEvents[pinIndex] = {};
            }
            const event = dataView.getUint8(1);
            this._pinEvents[pinIndex][event] =
            {
                value: dataView.getUint32(2, true), // timesamp of the edge or duration of the pulse
                timestamp: Date.now() // received time
            };
        } else if (dataFormat === MbitMoreDataFormat.DATA_NUMBER) {
            const label = new TextDecoder().decode(data.slice(0, 8).filter(char => (char !== 0)));
            this.receivedData[label] =
            {
                content: dataView.getFloat32(8, true),
                timestamp: Date.now()
            };
        } else if (dataFormat === MbitMoreDataFormat.DATA_TEXT) {
            const label = new TextDecoder().decode(data.slice(0, 8).filter(char => (char !== 0)));
            this.receivedData[label] =
            {
                content: new TextDecoder().decode(data.slice(8, 20).filter(char => (char !== 0))),
                timestamp: Date.now()
            };
        }
        this.resetConnectionTimeout();
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
     * Return whether the button is pressed.
     * @param {string} buttonName - name of the button
     * @return {boolean} - true when it is pressed
     */
    isButtonPressed (buttonName) {
        if (!this.isConnected()) {
            return false;
        }
        return this.buttonState[buttonName] === 1;
    }

    /**
     * Return whether the pin is touch-mode.
     * @param {number} pinIndex - indesx of the pin
     * @return {boolean} - true when it is touch-mode
     */
    isPinTouchMode (pinIndex) {
        return this.config.pinMode[pinIndex] === MbitMorePinMode.TOUCH;
    }

    /**
     * Configurate touch mode of the pin.
     * @param {number} pinIndex - index of the pin as a button.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} - a Promise that resolves when configured or the process was yield.
     */
    configTouchPin (pinIndex, util) {
        if (!this.isConnected()) {
            return Promise.resolve();
        }
        if (this.isPinTouchMode(pinIndex)) {
            return Promise.resolve();
        }
        const sendPromise = this.sendCommandSet(
            [{
                id: (BLECommand.CMD_CONFIG << 5) | MbitMoreConfig.TOUCH,
                message: new Uint8Array([
                    pinIndex,
                    1
                ])
            }],
            util
        );
        if (sendPromise) {
            return sendPromise
                .then(() => {
                    this.config.pinMode[pinIndex] = MbitMorePinMode.TOUCH;
                });
        }
        return Promise.resolve();
    }

    /**
     * Return whether the touche-pin is touched.
     * @param {string} buttonName - ID to check.
     * @return {boolean} - whether the id is high or not.
     */
    isTouched (buttonName) {
        if (!this.isConnected()) {
            return false;
        }
        return this.buttonState[buttonName] === 1;
    }

    /**
     * Return the last timestamp of the button event or undefined if the event is not received.
     * @param {MbitMoreButtonName} buttonName - name of the button to get the event.
     * @param {MbitMoreButtonEventName} eventName - name of event to get.
     * @return {?number} Timestamp of the last event or null.
     */
    getButtonEventTimestamp (buttonName, eventName) {
        if (this.buttonEvents[buttonName] && this.buttonEvents[buttonName][eventName]) {
            return this.buttonEvents[buttonName][eventName];
        }
        return null;
    }

    /**
     * Return the last timestamp of the gesture event or undefined if the event is not received.
     * @param {MbitMoreGestureName} gestureName - name of the event.
     * @return {?number} Timestamp of the last event or null.
     */
    getGestureEventTimestamp (gestureName) {
        if (this.gestureEvents[gestureName]) {
            return this.gestureEvents[gestureName];
        }
        return null;
    }

    /**
     * Return the last value of the pin event or undefined if the event was not received.
     * @param {number} pinIndex - index of the pin to get the event.
     * @param {MbitMorePinEvent} event - event to get.
     * @return {?number} Timestamp of the last event or null.
     */
    getPinEventValue (pinIndex, event) {
        if (this._pinEvents[pinIndex] && this._pinEvents[pinIndex][event]) {
            return this._pinEvents[pinIndex][event].value;
        }
        return null;
    }

    /**
     * Return the last timestamp of the pin event or undefined if the event was not received.
     * @param {number} pinIndex - index of the pin to get the event.
     * @param {MbitMorePinEvent} event - event to get.
     * @return {?number} Timestamp of the last event or null.
     */
    getPinEventTimestamp (pinIndex, event) {
        if (this._pinEvents[pinIndex] && this._pinEvents[pinIndex][event]) {
            return this._pinEvents[pinIndex][event].timestamp;
        }
        return null;
    }

    /**
     * Set event type to be get from the pin.
     * @param {number} pinIndex - Index of the pin to set.
     * @param {MbitMorePinEventType} eventType - Event type to set.
     * @param {BlockUtility} util - utility object provided by the runtime.
     * @return {?Promise} a Promise that resolves when command sending done or undefined if this process was yield.
     */
    listenPinEventType (pinIndex, eventType, util) {
        return this.sendCommandSet(
            [{
                id: (BLECommand.CMD_PIN << 5) | MbitMorePinCommand.SET_EVENT,
                message: new Uint8Array([
                    pinIndex,
                    eventType
                ])
            }],
            util
        );
    }

    /**
     * Send data to micro:bit.
     * @param {string} label - label of the data [ascii]
     * @param {string} content - content of the data [ascii | number]
     * @param {BlockUtility} util - utility object provided by the runtime.
     * @return {?Promise} a Promise that resolves when sending done or undefined if this process was yield.
     */
    sendData (label, content, util) {
        const labelData = new Array(8)
            .fill()
            .map((_value, index) => label.charCodeAt(index));
        const contentNumber = Number(content);
        let contentData;
        let type;
        if (Number.isNaN(contentNumber)) {
            type = MbitMoreSendingDataType.TEXT;
            contentData = content
                .split('')
                .map(ascii => ascii.charCodeAt(0))
                .slice(0, 11);
        } else {
            type = MbitMoreSendingDataType.NUMBER;
            const dataView = new DataView(new ArrayBuffer(4));
            dataView.setFloat32(0, contentNumber, true);
            contentData = [
                dataView.getUint8(0),
                dataView.getUint8(1),
                dataView.getUint8(2),
                dataView.getUint8(3)
            ];
        }
        return this.sendCommandSet(
            [{
                id: ((BLECommand.CMD_DATA << 5) | type),
                message: new Uint8Array([
                    ...labelData,
                    ...contentData])
            }],
            util);
    }

    /**
     * Return the last data with the label or undefined if no data received with the label.
     * @param {string} label - label to get.
     * @return {?(number | string)} data of the label or null.
     */
    getDataLabeled (label) {
        if (this.receivedData[label]) {
            return this.receivedData[label].content;
        }
        return null;
    }

    /**
     * Return the last timestamp of the data or undefined if the data is not received.
     * @param {string} label - label of the data.
     * @return {?number} Timestamp of the last data or null.
     */
    getDataTimestamp (label) {
        if (this.receivedData[label]) {
            return this.receivedData[label].timestamp;
        }
        return null;
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
                value: MbitMoreGestureName.TILT_UP
            },
            {
                text: formatMessage({
                    id: 'mbitMore.gesturesMenu.tiltDown',
                    default: 'titl down',
                    description: 'label for tilt down gesture in gesture picker for microbit more extension'
                }),
                value: MbitMoreGestureName.TILT_DOWN
            },
            {
                text: formatMessage({
                    id: 'mbitMore.gesturesMenu.tiltLeft',
                    default: 'titl left',
                    description: 'label for tilt left gesture in gesture picker for microbit more extension'
                }),
                value: MbitMoreGestureName.TILT_LEFT
            },
            {
                text: formatMessage({
                    id: 'mbitMore.gesturesMenu.tiltRight',
                    default: 'titl right',
                    description: 'label for tilt right gesture in gesture picker for microbit more extension'
                }),
                value: MbitMoreGestureName.TILT_RIGHT
            },
            {
                text: formatMessage({
                    id: 'mbitMore.gesturesMenu.faceUp',
                    default: 'face up',
                    description: 'label for face up gesture in gesture picker for microbit more extension'
                }),
                value: MbitMoreGestureName.FACE_UP
            },
            {
                text: formatMessage({
                    id: 'mbitMore.gesturesMenu.faceDown',
                    default: 'face down',
                    description: 'label for face down gesture in gesture picker for microbit more extension'
                }),
                value: MbitMoreGestureName.FACE_DOWN
            },
            {
                text: formatMessage({
                    id: 'mbitMore.gesturesMenu.freefall',
                    default: 'freefall',
                    description: 'label for freefall gesture in gesture picker for microbit more extension'
                }),
                value: MbitMoreGestureName.FREEFALL
            },
            {
                text: formatMessage({
                    id: 'mbitMore.gesturesMenu.g3',
                    default: '3G',
                    description: 'label for 3G gesture in gesture picker for microbit more extension'
                }),
                value: MbitMoreGestureName.G3
            },
            {
                text: formatMessage({
                    id: 'mbitMore.gesturesMenu.g6',
                    default: '6G',
                    description: 'label for 6G gesture in gesture picker for microbit more extension'
                }),
                value: MbitMoreGestureName.G6
            },
            {
                text: formatMessage({
                    id: 'mbitMore.gesturesMenu.g8',
                    default: '8G',
                    description: 'label for 3G gesture in gesture picker for microbit more extension'
                }),
                value: MbitMoreGestureName.G8
            },
            {
                text: formatMessage({
                    id: 'mbitMore.gesturesMenu.shake',
                    default: 'shake',
                    description: 'label for shaken gesture in gesture picker for microbit more extension'
                }),
                value: MbitMoreGestureName.SHAKE
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
                value: MbitMoreButtonName.A
            },
            {
                text: formatMessage({
                    id: 'mbitMore.buttonIDMenu.b',
                    default: 'B',
                    description: 'label for "B" element in button picker for micro:bit more extension'
                }),
                value: MbitMoreButtonName.B
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
                value: MbitMoreButtonEventName.DOWN
            },
            {
                text: formatMessage({
                    id: 'mbitMore.buttonEventMenu.up',
                    default: 'up',
                    description: 'label for button up event'
                }),
                value: MbitMoreButtonEventName.UP
            },
            {
                text: formatMessage({
                    id: 'mbitMore.buttonEventMenu.click',
                    default: 'click',
                    description: 'label for button click event'
                }),
                value: MbitMoreButtonEventName.CLICK
            // },
            // // These events are not in use because they are unstable in coal-microbit-v2.
            // {
            //     text: formatMessage({
            //         id: 'mbitMore.buttonEventMenu.pressed',
            //         default: 'pressed',
            //         description: 'label for button hold event'
            //     }),
            //     value: MbitMoreButtonEventName.HOLD
            // },
            // {
            //     text: formatMessage({
            //         id: 'mbitMore.buttonEventMenu.longClick',
            //         default: 'long click',
            //         description: 'label for button long click event'
            //     }),
            //     value: MbitMoreButtonEventName.LONG_CLICK
            // },
            // {
            //     text: formatMessage({
            //         id: 'mbitMore.buttonEventMenu.doubleClick',
            //         default: 'double click',
            //         description: 'label for button double click event'
            //     }),
            //     value: MbitMoreButtonEventName.DOUBLE_CLICK
            }
        ];
    }

    /**
     * @return {array} - text and values for each buttons menu element
     */
    get TOUCH_ID_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'mbitMore.touchIDMenu.logo',
                    default: 'LOGO',
                    description: 'label for "LOGO" element in touch button picker for micro:bit more extension'
                }),
                value: MbitMoreButtonName.LOGO
            },
            {
                text: 'P0',
                value: MbitMoreButtonName.P0
            },
            {
                text: 'P1',
                value: MbitMoreButtonName.P1
            },
            {
                text: 'P2',
                value: MbitMoreButtonName.P2
            }
        ];
    }

    /**
     * @return {array} - Menu items for touch event selector.
     */
    get TOUCH_EVENT_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'mbitMore.touchEventMenu.touched',
                    default: 'touched',
                    description: 'label for touched event'
                }),
                value: MbitMoreButtonEventName.DOWN
            },
            {
                text: formatMessage({
                    id: 'mbitMore.touchEventMenu.released',
                    default: 'released',
                    description: 'label for released event'
                }),
                value: MbitMoreButtonEventName.UP
            },
            {
                text: formatMessage({
                    id: 'mbitMore.touchEventMenu.tapped',
                    default: 'tapped',
                    description: 'label for tapped event'
                }),
                value: MbitMoreButtonEventName.CLICK
            // },
            // // These events are not in use because they are unstable in coal-microbit-v2.
            // {
            //     text: formatMessage({
            //         id: 'mbitMore.touchEventMenu.pressed',
            //         default: 'pressed',
            //         description: 'label for hold event in touch'
            //     }),
            //     value: MbitMoreButtonEventName.HOLD
            // },
            // {
            //     text: formatMessage({
            //         id: 'mbitMore.touchEventMenu.longClick',
            //         default: 'long click',
            //         description: 'label for long click event in touch'
            //     }),
            //     value: MbitMoreButtonEventName.LONG_CLICK
            // },
            // {
            //     text: formatMessage({
            //         id: 'mbitMore.touchEventMenu.doubleClick',
            //         default: 'double click',
            //         description: 'label for double click event in touch'
            //     }),
            //     value: MbitMoreButtonEventName.DOUBLE_CLICK
            }
        ];
    }

    get ANALOG_IN_PINS_MENU () {
        return this._peripheral.analogIn.map(
            pinIndex =>
                Object.create({
                    text: `P${pinIndex.toString()}`,
                    value: pinIndex.toString()
                })
        );
    }


    get GPIO_MENU () {
        return this._peripheral.gpio.map(
            pinIndex =>
                Object.create({
                    text: `P${pinIndex.toString()}`,
                    value: pinIndex.toString()
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
                value: 'false'
            },
            {
                text: formatMessage({
                    id: 'mbitMore.digitalValueMenu.High',
                    default: 'High',
                    description: 'label for high value in digital output menu for microbit more extension'
                }),
                value: 'true'
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
                value: MbitMorePullModeName.NONE
            },
            {
                text: formatMessage({
                    id: 'mbitMore.pinModeMenu.pullUp',
                    default: 'pull up',
                    description: 'label for pullUp mode'
                }),
                value: MbitMorePullModeName.UP
            },
            {
                text: formatMessage({
                    id: 'mbitMore.pinModeMenu.pullDown',
                    default: 'pull down',
                    description: 'label for pullDown mode'
                }),
                value: MbitMorePullModeName.DOWN
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

        /**
         * The previous timestamps of messages.
         * @type {Object.<number, Object>} pin index to object with event and timestamp.
         */
        this.prevReceivedData = {};
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
                },
                '---',
                {
                    opcode: 'whenButtonEvent',
                    text: formatMessage({
                        id: 'mbitMore.whenButtonEvent',
                        default: 'when button [NAME] is [EVENT]',
                        description: 'when the selected button on the micro:bit get the selected event'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            menu: 'buttonIDMenu',
                            defaultValue: MbitMoreButtonName.A
                        },
                        EVENT: {
                            type: ArgumentType.STRING,
                            menu: 'buttonEventMenu',
                            defaultValue: MbitMoreButtonEventName.DOWN
                        }
                    }
                },
                {
                    opcode: 'isButtonPressed',
                    text: formatMessage({
                        id: 'mbitMore.isButtonPressed',
                        default: 'button [NAME] pressed?',
                        description: 'is the selected button on the micro:bit pressed?'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            menu: 'buttonIDMenu',
                            defaultValue: MbitMoreButtonName.A
                        }
                    }
                },
                {
                    opcode: 'whenTouchEvent',
                    text: formatMessage({
                        id: 'mbitMore.whenTouchEvent',
                        default: 'when pin [NAME] is [EVENT]',
                        description: 'when the selected touch pin on the micro:bit is touched'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            menu: 'touchIDMenu',
                            defaultValue: MbitMoreButtonName.LOGO
                        },
                        EVENT: {
                            type: ArgumentType.STRING,
                            menu: 'touchEventMenu',
                            defaultValue: MbitMoreButtonEventName.DOWN
                        }
                    }
                },
                {
                    opcode: 'isPinTouched',
                    text: formatMessage({
                        id: 'mbitMore.isPinTouched',
                        default: 'pin [NAME] is touched?',
                        description: 'is the selected pin is touched?'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            menu: 'touchIDMenu',
                            defaultValue: MbitMoreButtonName.LOGO
                        }
                    }
                },
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
                            type: ArgumentType.STRING,
                            menu: 'gestures',
                            defaultValue: MbitMoreGestureName.SHAKE
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
                            defaultValue: 'Hello!'
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
                        id: 'mbitMore.clearDisplay',
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
                    opcode: 'getSoundLevel',
                    text: formatMessage({
                        id: 'mbitMore.soundLevel',
                        default: 'sound level',
                        description: 'level of the sound from microphone on micro:bit'
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
                            type: ArgumentType.STRING,
                            menu: 'analogInPins',
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'setPullMode',
                    text: formatMessage({
                        id: 'mbitMore.setPullMode',
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
                            defaultValue: MbitMorePullModeName.UP
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
                            type: ArgumentType.STRING,
                            menu: 'gpio',
                            defaultValue: '0'
                        }
                    }
                },
                '---',
                {
                    opcode: 'setDigitalOut',
                    text: formatMessage({
                        id: 'mbitMore.setDigitalOut',
                        default: 'set [PIN] Digital [LEVEL]',
                        description: 'set pin to Digtal Output mode and the level(true = High)'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'gpio',
                            defaultValue: '0'
                        },
                        LEVEL: {
                            type: ArgumentType.STRING,
                            menu: 'digitalValueMenu',
                            defaultValue: 'false'
                        }
                    }
                },
                {
                    opcode: 'setAnalogOut',
                    text: formatMessage({
                        id: 'mbitMore.setAnalogOut',
                        default: 'set [PIN] analog [LEVEL] %',
                        description: 'set pin to PWM mode and the level(0 to 1023)'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'gpio',
                            defaultValue: '0'
                        },
                        LEVEL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'playTone',
                    text: formatMessage({
                        id: 'mbitMore.playTone',
                        default: 'play tone [FREQ] Hz volume [VOL] %',
                        description: 'play tone on the speaker'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        FREQ: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 440
                        },
                        VOL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'stopTone',
                    text: formatMessage({
                        id: 'mbitMore.stopTone',
                        default: 'stop tone',
                        description: 'stop tone on the speaker'
                    }),
                    blockType: BlockType.COMMAND
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
                            type: ArgumentType.STRING,
                            menu: 'gpio',
                            defaultValue: '0'
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
                    opcode: 'listenPinEventType',
                    text: formatMessage({
                        id: 'mbitMore.listenPinEventType',
                        default: 'catch event [EVENT_TYPE] on [PIN]',
                        description: 'listen the event on the pin'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        EVENT_TYPE: {
                            type: ArgumentType.STRING,
                            menu: 'pinEventTypeMenu',
                            defaultValue: 'NONE'
                        },
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'gpio',
                            defaultValue: '0'
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
                            type: ArgumentType.STRING,
                            menu: 'gpio',
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'getPinEventValue',
                    text: formatMessage({
                        id: 'mbitMore.getPinEventValue',
                        default: 'value of [EVENT] at [PIN]',
                        description: 'value of the value of the event (timestamp of the edge or duration of the pulse)'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        EVENT: {
                            type: ArgumentType.STRING,
                            menu: 'pinEventTimestampMenu',
                            defaultValue: 'PULSE_LOW'
                        },
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'gpio',
                            defaultValue: '0'
                        }
                    }
                },
                '---',
                {
                    opcode: 'whenDataReceived',
                    text: formatMessage({
                        id: 'mbitMore.whenDataReceived',
                        default: 'when data with loabel [LABEL] received from micro:bit',
                        description: 'when the data which has the label received'

                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        LABEL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'label-01'
                        }
                    }
                },
                {
                    opcode: 'getDataLabeled',
                    text: formatMessage({
                        id: 'mbitMore.getDataLabeled',
                        default: 'data of label [LABEL]',
                        description: 'the last data which has the label'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        LABEL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'label-01'
                        }
                    }
                },
                {
                    opcode: 'sendData',
                    text: formatMessage({
                        id: 'mbitMore.sendData',
                        default: 'send data [DATA] with label [LABEL] to micro:bit',
                        description: 'send data content with label to micro:bit'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        LABEL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'label-01'
                        },
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: 'data'
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
                touchIDMenu: {
                    acceptReporters: false,
                    items: this.TOUCH_ID_MENU
                },
                touchEventMenu: {
                    acceptReporters: false,
                    items: this.TOUCH_EVENT_MENU
                },
                gestures: {
                    acceptReporters: false,
                    items: this.GESTURES_MENU
                },
                analogInPins: {
                    acceptReporters: false,
                    items: this.ANALOG_IN_PINS_MENU
                },
                digitalValueMenu: {
                    acceptReporters: true,
                    items: this.DIGITAL_VALUE_MENU
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
            Object.entries(events).forEach(([eventName, timestamp]) => {
                this.prevButtonEvents[componentID][eventName] = timestamp;
            });
        });
    }

    /**
     * Test whether the event raised at the button.
     * @param {object} args - the block's arguments.
     * @param {string} args.NAME - name of the button.
     * @param {string} args.EVENT - name of event to catch.
     * @return {boolean} - true if the event raised.
     */
    whenButtonEvent (args) {
        if (!this.updateLastButtonEventTimer) {
            this.updateLastButtonEventTimer = setTimeout(() => {
                this.updatePrevButtonEvents();
                this.updateLastButtonEventTimer = null;
            }, this.runtime.currentStepTime);
        }
        const buttonName = args.NAME;
        const eventName = args.EVENT;
        const lastTimestamp =
            this._peripheral.getButtonEventTimestamp(buttonName, eventName);
        if (lastTimestamp === null) return false;
        if (!this.prevButtonEvents[buttonName]) return true;
        return lastTimestamp !== this.prevButtonEvents[buttonName][eventName];
    }

    /**
     * Test whether the A or B button is pressed
     * @param {object} args - the block's arguments.
     * @param {string} args.NAME - name of the button.
     * @param {object} util - utility object provided by the runtime.
     * @return {boolean} - whether the button is pressed or not.
     */
    isButtonPressed (args) {
        const buttonName = args.NAME;
        return this._peripheral.isButtonPressed(buttonName);
    }


    /**
     * Test whether the touch event raised at the pin.
     * @param {object} args - the block's arguments.
     * @param {string} args.NAME - name of the pin to catch.
     * @param {string} args.EVENT - event to catch.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} - a Promise that resolves that resolves the touch state.
     */
    whenTouchEvent (args, util) {
        const buttonName = args.NAME;
        if (buttonName === MbitMoreButtonName.LOGO) {
            return this.whenButtonEvent(args);
        }
        if (this._peripheral.isPinTouchMode(MbitMoreButtonPinIndex[buttonName])) {
            return this.whenButtonEvent(args);
        }
        this._peripheral.configTouchPin(MbitMoreButtonPinIndex[buttonName], util);
        return false;
    }

    /**
     * Test whether the touch-pin is touched.
     * @param {object} args - the block's arguments.
     * @param {string} args.NAME - name of the pin.
     * @param {object} util - utility object provided by the runtime.
     * @return {boolean} - whether the button is pressed or not.
     */
    isPinTouched (args, util) {
        const buttonName = args.NAME;
        if (buttonName === MbitMoreButtonName.LOGO) {
            return this._peripheral.isTouched(buttonName);
        }
        if (this._peripheral.isPinTouchMode(MbitMoreButtonPinIndex[buttonName])) {
            return this._peripheral.isTouched(buttonName);
        }
        this._peripheral.configTouchPin(MbitMoreButtonPinIndex[buttonName], util);
        return false;
    }

    /**
     * Update the last occured time of all gesture events.
     */
    updatePrevGestureEvents () {
        this.prevGestureEvents = {};
        Object.entries(this._peripheral.gestureEvents).forEach(([gestureName, timestamp]) => {
            this.prevGestureEvents[gestureName] = timestamp;
        });
    }

    /**
     * Test whether the gesture event raised.
     * @param {object} args - the block's arguments.
     * @param {string} args.GESTURE - name of the gesture.
     * @return {boolean} - true if the event raised.
     */
    whenGesture (args) {
        if (!this.updateLastGestureEventTimer) {
            this.updateLastGestureEventTimer = setTimeout(() => {
                this.updatePrevGestureEvents();
                this.updateLastGestureEventTimer = null;
            }, this.runtime.currentStepTime);
        }
        const gestureName = args.GESTURE;
        const lastTimestamp =
            this._peripheral.getGestureEventTimestamp(gestureName);
        if (lastTimestamp === null) return false;
        if (!this.prevGestureEvents[gestureName]) return true;
        return lastTimestamp !== this.prevGestureEvents[gestureName];
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
        return this._peripheral.isPinHigh(parseInt(args.PIN, 10));
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
     * Get loudness of the sound from microphone on micro:bit.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} - a Promise that resolves digital input value of the pin.
     */
    getSoundLevel (args, util) {
        return this._peripheral.configMic(true, util)
            .then(micState => {
                if (micState) {
                    return this._peripheral.readSoundLevel();
                }
                return 0;
            });
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
     * @return {?Promise} a Promise that resolves analog input value of the pin or undefined if this process was yield.
     */
    getAnalogValue (args, util) {
        const pinIndex = parseInt(args.PIN, 10);
        const resultPromise = this._peripheral.readAnalogIn(pinIndex, util);
        if (!resultPromise) return;
        return resultPromise.then(level => Math.round(level * 100 * 10 / 1024) / 10);
    }

    /**
     * Return digital value of the pin.
     * @param {object} args - the block's arguments.
     * @param {number} args.PIN - pin ID.
     * @return {Promise} - a Promise that resolves digital input value of the pin.
     */
    getDigitalValue (args) {
        return this._peripheral.readDigitalLevel(parseInt(args.PIN, 10));
    }

    /**
     * Send data with label.
     * @param {object} args - the block's arguments.
     * @property {string} args.LABEL - label of the data.
     * @property {string} args.DATA - content of the data.
     * @param {object} util - utility object provided by the runtime.
     * @return {?Promise} - a Promise that resolves when the process was done or undefined if labels was empty.
     */
    sendData (args, util) {
        if (args.LABEL.length <= 0) {
            return;
        }
        return this._peripheral.sendData(args.LABEL, args.DATA, util);
    }

    /**
     * Set pull mode of the pin.
     * @param {object} args - the block's arguments.
     * @param {number} args.PIN - pin ID.
     * @param {MbitMorePullModeName} args.MODE - mode to set.
     * @param {BlockUtility} util - utility object provided by the runtime.
     * @return {undefined}
     */
    setPullMode (args, util) {
        this._peripheral.setPullMode(parseInt(args.PIN, 10), MbitMorePullModeID[args.MODE], util);
    }

    /**
     * Set the pin to Output mode and level.
     * @param {object} args - the block's arguments.
     * @param {number} args.PIN - pin ID.
     * @param {boolean | string | number} args.LEVEL - value to be set.
     * @param {object} util - utility object provided by the runtime.
     * @return {undefined}
     */
    setDigitalOut (args, util) {
        let level = (args.LEVEL === true);
        level = level || (args.LEVEL === 'true');
        if (!level) {
            const num = Number(args.LEVEL);
            if (!isNaN(num)) {
                level = (num > 0);
            }
        }
        this._peripheral.setPinOutput(parseInt(args.PIN, 10), level, util);
    }

    /**
     * Set the pin to PWM mode and level.
     * @param {object} args - the block's arguments.
     * @param {number} args.PIN - pin ID.
     * @param {number} args.LEVEL - value[%] for PWM.
     * @param {BlockUtility} util - utility object provided by the runtime.
     * @return {?Promise} a Promise that resolves when command sending done or undefined if this process was yield.
     */
    setAnalogOut (args, util) {
        let percent = parseInt(args.LEVEL, 10);
        if (isNaN(percent)) {
            return;
        }
        percent = Math.max(0, Math.min(percent, 100));
        const level = Math.round(percent * 1024 / 100);
        return this._peripheral.setPinPWM(
            parseInt(args.PIN, 10),
            level,
            util
        );
    }

    /**
     * Set the pin to Servo mode and angle.
     * @param {object} args - the block's arguments.
     * @param {number} args.PIN - pin ID.
     * @param {BlockUtility} util - utility object provided by the runtime.
     * @return {?Promise} a Promise that resolves when command sending done or undefined if this process was yield.
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
        return this._peripheral.setPinServo(parseInt(args.PIN, 10), angle, null, null, util);
    }

    /**
     * Return the value of magnetic force [micro tesla] on axis.
     * @param {object} args - the block's arguments.
     * @property {AxisSymbol} AXIS - the axis (X, Y, Z, Absolute).
     * @return {number} - value of magnetic force.
     */
    getMagneticForce (args) {
        return this._peripheral.readMagneticForce(args.AXIS);
    }

    /**
     * Return the value of acceleration on the specified axis.
     * @param {object} args - the block's arguments.
     * @param {AxisSymbol} args.AXIS - direction to get.
     * @return {number} - value of acceleration.
     */
    getAcceleration (args) {
        return this._peripheral.readAcceleration(args.AXIS);
    }

    /**
     * Return pitch [degrees] of the micro:bit heading direction.
     * @return {number} - degree of pitch.
     */
    getPitch () {
        return this._peripheral.readPitch();
    }

    /**
     * Read roll [degrees] of the micro:bit heading direction.
     * @return {number} - degree of roll.
     */
    getRoll () {
        return this._peripheral.readRoll();
    }


    /**
     * Play tone on the speaker.
     * @param {object} args - the block's arguments.
     * @param {string} args.FREQ - wave frequency to play
     * @param {string} args.VOL laudness of tone
     * @param {object} util - utility object provided by the runtime.
     * @return {?Promise} - a Promise that resolves to send command or undefined if this process was yield.
     */
    playTone (args, util) {
        const frequency = parseFloat(args.FREQ);
        let volume = parseInt(args.VOL, 10);
        volume = Math.min(100, (Math.max(0, volume)));
        return this._peripheral.playTone(frequency, volume, util);
    }

    /**
     * Stop playing tone on the speaker.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @return {?Promise} - a Promise that resolves to send command or undefined if this process was yield.
     */
    stopTone (args, util) {
        return this._peripheral.stopTone(util);
    }

    /**
     * Set listening event type at the pin.
     * @param {object} args - the block's arguments.
     * @param {number} args.PIN - pin ID.
     * @param {string} args.EVENT_TYPE - event to listen.
     * @param {BlockUtility} util - utility object provided by the runtime.
     * @return {?Promise} a Promise that resolves when command sending done or undefined if this process was yield.
    */
    listenPinEventType (args, util) {
        return this._peripheral.listenPinEventType(parseInt(args.PIN, 10), MbitMorePinEventType[args.EVENT_TYPE], util);
    }

    /**
     * Rerutn value (timestamp of the edge or duration of the pulse) of the event or 0 when the event is not received.
     * @param {object} args - the block's arguments.
     * @param {number} args.PIN - pin ID.
     * @param {string} args.EVENT - event value to get.
     * @param {object} util - utility object provided by the runtime.
     * @return {number} - timestamp of the event or 0.
     */
    getPinEventValue (args) {
        const value = this._peripheral.getPinEventValue(parseInt(args.PIN, 10), MbitMorePinEvent[args.EVENT]);
        return value ? value : 0;
    }

    /**
     * Update the previous occured time of all pin events.
     */
    updatePrevPinEvents () {
        this.prevPinEvents = {};
        Object.entries(this._peripheral._pinEvents).forEach(([pinIndex, events]) => {
            this.prevPinEvents[pinIndex] = {};
            Object.entries(events).forEach(([eventID, eventData]) => {
                this.prevPinEvents[pinIndex][eventID] = {};
                Object.entries(eventData).forEach(([key, value]) => {
                    this.prevPinEvents[pinIndex][eventID][key] = value;
                });
            });
        });
    }

    /**
     * Return the previous timestamp of the pin event or undefined if the event was not received.
     * @param {number} pinIndex - index of the pin to get the event.
     * @param {MbitMorePinEvent} eventID - ID of the event to get.
     * @return {?number} Timestamp of the previous event or null.
     */
    getPrevPinEventTimestamp (pinIndex, eventID) {
        if (this.prevPinEvents[pinIndex] && this.prevPinEvents[pinIndex][eventID]) {
            return this.prevPinEvents[pinIndex][eventID].timestamp;
        }
        return null;
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
            this.updateLastPinEventTimer = setTimeout(() => {
                this.updatePrevPinEvents();
                this.updateLastPinEventTimer = null;
            }, this.runtime.currentStepTime);
        }
        const pinIndex = parseInt(args.PIN, 10);
        const eventID = MbitMorePinEvent[args.EVENT];
        const lastTimestamp =
            this._peripheral.getPinEventTimestamp(pinIndex, eventID);
        if (lastTimestamp === null) return false;
        const prevTimestamp = this.getPrevPinEventTimestamp(pinIndex, eventID);
        if (prevTimestamp === null) return true;
        return lastTimestamp !== prevTimestamp;
    }

    /**
     * Rerutn the last content of the messge or undefined if the data which has the label is not received.
     * @param {object} args - the block's arguments.
     * @param {number} args.LABEL - label of the data.
     * @return {?(string | number)} - content of the data.
     */
    getDataLabeled (args) {
        return this._peripheral.getDataLabeled(args.LABEL);
    }

    /**
     * Update the previous occured time of all received data.
     */
    updatePrevReceivedData () {
        this.prevReceivedData = {};
        Object.entries(this._peripheral.receivedData).forEach(([label, contentObject]) => {
            this.prevReceivedData[label] = {};
            Object.entries(contentObject).forEach(([key, value]) => {
                this.prevReceivedData[label][key] = value;
            });
        });
    }

    /**
     * Return the previous timestamp of the data or undefined if the data was not received.
     * @param {string} label - label of the data.
     * @return {?number} Timestamp of the previous data or null.
     */
    getPrevReceivedDataTimestamp (label) {
        if (this.prevReceivedData[label]) {
            return this.prevReceivedData[label].timestamp;
        }
        return null;
    }

    /**
     * Test whether the data received which had the label.
     * @param {object} args - the block's arguments.
     * @param {number} args.LABEL - label of the data.
     * @return {boolean} - true if the data received.
     */
    whenDataReceived (args) {
        if (!this.updateLastDataTimer) {
            this.updateLastDataTimer = setTimeout(() => {
                this.updatePrevReceivedData();
                this.updateLastDataTimer = null;
            }, this.runtime.currentStepTime);
        }
        const label = args.LABEL;
        const lastTimestamp =
            this._peripheral.getDataTimestamp(label);
        if (lastTimestamp === null) return false;
        const prevTimestamp = this.getPrevReceivedDataTimestamp(label);
        if (prevTimestamp === null) return true;
        return lastTimestamp !== prevTimestamp;
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
        'mbitMore.whenButtonEvent': 'ボタン [NAME] が [EVENT] とき',
        'mbitMore.buttonIDMenu.a': 'A',
        'mbitMore.buttonIDMenu.b': 'B',
        'mbitMore.buttonEventMenu.down': '下がった',
        'mbitMore.buttonEventMenu.pressed': '押された',
        'mbitMore.buttonEventMenu.up': '上がった',
        'mbitMore.buttonEventMenu.click': 'クリックされた',
        'mbitMore.buttonEventMenu.longClick': '長くクリックされた',
        'mbitMore.buttonEventMenu.doubleClick': 'ダブルクリックされた',
        'mbitMore.isButtonPressed': 'ボタン [NAME] が押された',
        'mbitMore.whenTouchEvent': 'ピン [NAME] が [EVENT] とき',
        'mbitMore.isPinTouched': 'ピン [NAME] が触れられた',
        'mbitMore.touchIDMenu.logo': 'ロゴ',
        'mbitMore.touchEventMenu.touched': '触れられた',
        'mbitMore.touchEventMenu.pressed': '押された',
        'mbitMore.touchEventMenu.released': '放された',
        'mbitMore.touchEventMenu.tapped': 'タップされた',
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
        'mbitMore.clearDisplay': '画面を消す',
        'mbitMore.isPinHigh': 'ピン [PIN] がハイである',
        'mbitMore.lightLevel': '明るさ',
        'mbitMore.temperature': '温度',
        'mbitMore.compassHeading': '北からの角度',
        'mbitMore.magneticForce': '磁力 [AXIS]',
        'mbitMore.acceleration': '加速度 [AXIS]',
        'mbitMore.pitch': 'ピッチ',
        'mbitMore.roll': 'ロール',
        'mbitMore.soundLevel': '音の大きさ',
        'mbitMore.analogValue': 'ピン [PIN] のアナログレベル',
        'mbitMore.setPullMode': 'ピン [PIN] を [MODE] 入力にする',
        'mbitMore.setDigitalOut': 'ピン [PIN] をデジタル出力 [LEVEL] にする',
        'mbitMore.setAnalogOut': 'ピン [PIN] をアナログ出力 [LEVEL] %にする',
        'mbitMore.playTone': '[FREQ] Hzの音を [VOL] %の大きさで鳴らす',
        'mbitMore.stopTone': '音を止める',
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
        'mbitMore.listenPinEventType': 'ピン [PIN] で [EVENT_TYPE] ',
        'mbitMore.pinEventTypeMenu.none': 'イベントを受けない',
        'mbitMore.pinEventTypeMenu.edge': 'エッジイベントを受ける',
        'mbitMore.pinEventTypeMenu.pulse': 'パルスイベントを受ける',
        'mbitMore.pinEventTypeMenu.touch': 'タッチイベントを受ける',
        'mbitMore.whenPinEvent': 'ピン [PIN] で [EVENT] イベントが上がった',
        'mbitMore.pinEventMenu.rise': 'ライズ',
        'mbitMore.pinEventMenu.fall': 'フォール',
        'mbitMore.pinEventMenu.pulseHigh': 'ハイパルス',
        'mbitMore.pinEventMenu.pulseLow': 'ローパルス',
        'mbitMore.getPinEventValue': 'ピン [PIN] の [EVENT]',
        'mbitMore.pinEventTimestampMenu.rise': 'ライズの時刻',
        'mbitMore.pinEventTimestampMenu.fall': 'フォールの時刻',
        'mbitMore.pinEventTimestampMenu.pulseHigh': 'ハイパルスの期間',
        'mbitMore.pinEventTimestampMenu.pulseLow': 'ローパルスの期間',
        'mbitMore.whenDataReceived': 'micro:bit からラベル [LABEL] のデータを受け取ったとき',
        'mbitMore.getDataLabeled': 'ラベル [LABEL] のデータ',
        'mbitMore.sendData': 'micro:bit へデータ [DATA] にラベル [LABEL] を付けて送る',
        'mbitMore.connectionStateMenu.connected': 'つながった',
        'mbitMore.connectionStateMenu.disconnected': '切れた',
        'mbitMore.whenConnectionChanged': 'micro:bit と[STATE]とき'
    },
    'ja-Hira': {
        'mbitMore.whenButtonEvent': '[NAME] ボタンが [EVENT] とき',
        'mbitMore.buttonIDMenu.a': 'A',
        'mbitMore.buttonIDMenu.b': 'B',
        'mbitMore.buttonEventMenu.down': 'さがった',
        'mbitMore.buttonEventMenu.hold': 'おされた',
        'mbitMore.buttonEventMenu.up': 'あがった',
        'mbitMore.buttonEventMenu.click': 'クリックされた',
        'mbitMore.buttonEventMenu.longClick': 'ながくクリックされた',
        'mbitMore.buttonEventMenu.doubleClick': 'ダブルクリックされた',
        'mbitMore.isButtonPressed': '[NAME] ボタンがおされた',
        'mbitMore.whenTouchEvent': 'ピン [NAME] が [EVENT] とき',
        'mbitMore.isPinTouched': 'ピン [NAME] がふれられた',
        'mbitMore.touchIDMenu.logo': 'ロゴ',
        'mbitMore.touchEventMenu.touched': 'ふれられた',
        'mbitMore.touchEventMenu.pressed': 'おされた',
        'mbitMore.touchEventMenu.released': 'はなされた',
        'mbitMore.touchEventMenu.tapped': 'タップされた',
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
        'mbitMore.clearDisplay': 'がめんをけす',
        'mbitMore.isPinHigh': 'ピン [PIN] がハイである',
        'mbitMore.lightLevel': 'あかるさ',
        'mbitMore.temperature': 'おんど',
        'mbitMore.compassHeading': 'きたからのかくど',
        'mbitMore.magneticForce': 'じりょく [AXIS]',
        'mbitMore.acceleration': 'かそくど [AXIS]',
        'mbitMore.pitch': 'ピッチ',
        'mbitMore.roll': 'ロール',
        'mbitMore.soundLevel': 'おとのおおきさ',
        'mbitMore.analogValue': 'ピン [PIN] のアナログレベル',
        'mbitMore.setPullMode': 'ピン [PIN] を [MODE] にゅうりょくにする',
        'mbitMore.setDigitalOut': 'ピン [PIN] をデジタルしゅつりょく [LEVEL] にする',
        'mbitMore.setAnalogOut': 'ピン [PIN] をアナログしゅつりょく [LEVEL] パーセントにする',
        'mbitMore.playTone': '[FREQ] ヘルツのおとを [VOL] パーセントの大きさで鳴らす',
        'mbitMore.stopTone': 'おとをとめる',
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
        'mbitMore.listenPinEventType': 'ピン [PIN] で [EVENT_TYPE]',
        'mbitMore.pinEventTypeMenu.none': 'イベントをうけない',
        'mbitMore.pinEventTypeMenu.edge': 'エッジイベントをうける',
        'mbitMore.pinEventTypeMenu.pulse': 'パルスイベントをうける',
        'mbitMore.pinEventTypeMenu.touch': 'タッチイベントをうける',
        'mbitMore.whenPinEvent': 'ピン [PIN] で [EVENT] イベントがあがった',
        'mbitMore.pinEventMenu.rise': 'ライズ',
        'mbitMore.pinEventMenu.fall': 'フォール',
        'mbitMore.pinEventMenu.pulseHigh': 'ハイパルス',
        'mbitMore.pinEventMenu.pulseLow': 'ローパルス',
        'mbitMore.getPinEventValue': 'ピン [PIN] の [EVENT]',
        'mbitMore.pinEventTimestampMenu.rise': 'ライズのじかん',
        'mbitMore.pinEventTimestampMenu.fall': 'フォールのじかん',
        'mbitMore.pinEventTimestampMenu.pulseHigh': 'ハイパルスのきかん',
        'mbitMore.pinEventTimestampMenu.pulseLow': 'ローパルスのきかん',
        'mbitMore.whenDataReceived': 'micro:bit からラベル [LABEL] のデータをうけとったとき',
        'mbitMore.getDataLabeled': 'ラベル [LABEL] のデータ',
        'mbitMore.sendData': 'micro:bit へデータ [DATA] にラベル [LABEL] をつけておくる',
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
        'mbitMore.setInput': 'Definir Pino[PIN] como entrada',
        'mbitMore.setAnalogOut': 'Definir pino PWM[PIN]com[LEVEL]',
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
        'mbitMore.setInput': 'Definir Pino[PIN] como entrada',
        'mbitMore.setAnalogOut': 'Definir pino PWM[PIN]com[LEVEL]',
        'mbitMore.setServo': 'Definir Servo no pino [PIN]com ângulo de [ANGLE]॰',
        'mbitMore.digitalValueMenu.Low': 'desligado',
        'mbitMore.digitalValueMenu.High': 'ligado'
    }
};

exports.blockClass = MbitMoreBlocks; // loadable-extension needs this line.
module.exports = MbitMoreBlocks;
