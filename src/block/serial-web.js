const log = require('../../util/log');
const Buffer = require('buffer');
const arrayBufferToBase64 = buffer => Buffer.from(buffer).toString('base64');
const base64ToUint8Array = base64 => Buffer.from(base64, 'base64');

/**
 * Characteristic ID on serial-port.
 */
const SERIAL_CH_ID = {
    '0b500100-607f-4151-9091-7d008d6ffc5c': 0x0100,
    '0b500101-607f-4151-9091-7d008d6ffc5c': 0x0101,
    '0b500102-607f-4151-9091-7d008d6ffc5c': 0x0102,
    '0b500110-607f-4151-9091-7d008d6ffc5c': 0x0110,
    '0b500111-607f-4151-9091-7d008d6ffc5c': 0x0111,
    '0b500120-607f-4151-9091-7d008d6ffc5c': 0x0120,
    '0b500121-607f-4151-9091-7d008d6ffc5c': 0x0121,
    '0b500122-607f-4151-9091-7d008d6ffc5c': 0x0122,
    '0b500130-607f-4151-9091-7d008d6ffc5c': 0x0130
};

/**
 * Start Frame Delimiter
 */
const SFD = 0xFF;

/**
 * Request type in data frame.
 */
const ChRequest = {
    READ: 0x01,
    WRITE: 0x10,
    WRITE_RESPONSE: 0x11,
    NOTIFY_STOP: 0x20,
    NOTIFY_START: 0x21
};

/**
 * Response type in data frame.
 */
const ChResponse = {
    READ: 0x01,
    WRITE_RESPONSE: 0x11,
    NOTIFY: 0x21
};

/**
 * Class to communicate with device via USB serial-port using Web Serial API.
 */
class WebSerial {

    /**
     * A BLE peripheral object.  It handles connecting, over Web Bluetooth API, to
     * BLE peripherals, and reading and writing data to them.
     * @param {Runtime} runtime - the Runtime for sending/receiving GUI update events.
     * @param {string} extensionId - the id of the extension using this object.
     * @param {object} peripheralOptions - the list of options for peripheral discovery.
     * @param {function} connectCallback - a callback for connection.
     * @param {function} resetCallback - a callback for resetting extension state.
     */
    constructor (runtime, extensionId, peripheralOptions, connectCallback, resetCallback = null) {
        /**
         * Remote device which have been connected.
         * @type {SerialPort}
         */
        this.port = null;

        this._connectCallback = connectCallback;
        this.state = 'init';
        this._resetCallback = resetCallback;
        this._extensionId = extensionId;
        this._peripheralOptions = peripheralOptions;
        this._serialOptions = {
            // baudRate: 57600
            baudRate: 115200 // Default for micro:bit
        };
        this._runtime = runtime;
        this.receivingInterval = 1;
        this.sendDataInterval = 10; // Time for receiving process in micro:bit

        /**
         * Store of received type and value for each characteristics.
         * @type {Object.<number, Object.<number, Uint8Array>>} - { ch: { type: value }}.
         */
        this.chValues = {};

        /**
         * Notification callbacks.
         * @type {Object.<number, function>} - { ch: callback }
         */
        this.notifyListeners = {};

        this.requestPeripheral();
    }

    /**
     * Request connection to the peripheral.
     * Request user to choose a device, and then connect it automatically.
     * @return {Promise} - a Promise which will resolved when a serial-port was selected.
     */
    requestPeripheral () {
        let promise = Promise.resolve();
        if (this.isConnected()) {
            promise = promise.then(() => this.disconnect());
        }
        return promise.then(() => {
            navigator.serial.requestPort(this._peripheralOptions)
                .then(selected => {
                    this.port = selected;
                    this._runtime.connectPeripheral(this._extensionId, null);
                })
                .catch(e => {
                    this._handleRequestError(e);
                });
        });
    }

    /**
     * Try connecting to the serial-port of the device, and then call the connect
     * callback when connection is successful.
     */
    connectPeripheral (/* id */) {
        if (!this.port) {
            throw new Error('device is not chosen');
        }
        class ChValueTransformer {
            constructor () {
                // A container for holding stream data until a new frame.
                this.chunks = [];
            }

            transform (chunk, controller) {
                // Append new chunks to existing chunks.
                this.chunks = this.chunks.concat(Array.from(chunk));
                // Split chunks into {ch: {type: value}.
                // Skip until SFD occurred
                const frameStart = this.chunks.findIndex(element => element === SFD);
                if (frameStart === -1) {
                    this.chunks = [];
                    return;
                }
                this.chunks = this.chunks.slice(frameStart);
                // Read header
                if (this.chunks.length < 5) {
                    return;
                }
                const type = this.chunks[1];
                if (type > ChResponse.NOTIFY) {
                    this.chunks = []; // remove all until SFD + valid type
                    return;
                }
                const ch = (this.chunks[2] << 8) | this.chunks[3];
                const valueLength = this.chunks[4];
                const frameEnd = 5 + valueLength;
                if (this.chunks.length < (frameEnd + 1)) {
                    return;
                }
                const value = this.chunks.slice(5, frameEnd);
                // Checksum
                const checksum = this.chunks.slice(0, frameEnd).reduce((acc, cur) => acc + cur) % 0xFF;
                if (checksum === this.chunks[frameEnd]) {
                    // Received successfully
                    this.chunks.splice(0, frameEnd + 1);
                    controller.enqueue({ch: ch, data: {type: type, value: value}});
                } else {
                    // Error occurred
                    log.debug(this.chunks); // debug
                    this.chunks.shift(); // Remove current SFD
                    return;
                }
            }

            flush (controller) {
                // When the stream is closed, delete any remaining chunks.
                controller.terminate();
            }
        }
        this.port.open(this._serialOptions)
            .then(() => {
                log.log(`SerialPort: open`);
                this.state = 'open';
                this.writer = this.port.writable.getWriter();
                // eslint-disable-next-line no-undef
                const chValueTransformStream = new TransformStream(new ChValueTransformer());
                this.readableStreamClosed = this.port.readable.pipeTo(chValueTransformStream.writable);
                this.reader = chValueTransformStream.readable.getReader();
                this.port.addEventListener('disconnect',
                    event => {
                        this.onDisconnected(event);
                    });
                this._runtime.emit(this._runtime.constructor.PERIPHERAL_CONNECTED);
                this._connectCallback();
                this.startReceiving();
            });
    }

    /**
     * Disconnect from the device and clean up.
     * Then emit the connection state by the runtime.
     * @return {Promise} - a Promise which will resolve when the serial-port was disconnected.
     */
    disconnect () {
        if (this.state !== 'open') return Promise.resolve();
        this.state = 'closing';
        this.stopReceiving();
        return this.reader.cancel()
            .then(() => this.readableStreamClosed.catch(() => { /* Ignore the error */ }))
            .then(() => {
                this.writer.close();
                this.writer.releaseLock();
                return this.write.closed;
            })
            .then(() => {
                this.port.close();
                this.state = 'close';
                this.reader = null;
                this.writer = null;
                this.port = null;
                this._runtime.emit(this._runtime.constructor.PERIPHERAL_DISCONNECTED);
            });
    }

    /**
     * @return {bool} whether the peripheral is connected.
     */
    isConnected () {
        return this.state === 'open';
    }

    /**
     * Receive data and process it.
     * @returns {Promise} - a Promise which will resolve when read next data
     */
    receiveData () {
        return this.reader.read()
            .then(result => {
                const {value, done} = result;
                if (done) {
                    this.reader.releaseLock();
                }
                if (value) {
                    const data = value.data;
                    const ch = value.ch;
                    if (!this.chValues[ch]) {
                        this.chValues[ch] = {};
                    }
                    this.chValues[ch][data.type] = data.value;
                    if (data.type === ChResponse.NOTIFY) {
                        if (ch in this.notifyListeners) {
                            this.notifyListeners[ch](arrayBufferToBase64(data.value));
                        }
                    }
                    // log.debug({ch: ch, type: data.type, value: data.value});
                }
            });
    }

    /**
     * Start data receiving process.
     */
    startReceiving () {
        this.dataReceiving = window.setTimeout(() => {
            if (this.state !== 'open') return;
            this.receiveData()
                .then(() => {
                    // start again
                    this.startReceiving();
                })
                .catch(() => {
                    this.handleDisconnectError();
                });
        }, this.receivingInterval);
    }

    /**
     * Stop data receiving process.
     */
    stopReceiving () {
        clearTimeout(this.dataReceiving);
        this.dataReceiving = null;
    }

    /**
     * Send data to the device.
     * @param {Uint8Array} data - data to send
     * @returns {Promise} - a Promise which will resolve write process was done
     */
    sendData (data) {
        return this.writer.ready
            .then(() => this.writer.write(data))
            .then(() => new Promise(resolve => {
                setTimeout(() => resolve(), this.sendDataInterval); // Wait for receiving process in micro:bit
            }));
    }

    /**
     * Start receiving notifications from the device.
     * @param {number} _serviceId - the ble service to read. (ignore it for serial-port)
     * @param {number} characteristicId - the ble characteristic to get notifications from.
     * @param {function?} onCharacteristicChanged - callback for characteristic change notifications
     *  like function(base64message).
     * @return {Promise} - a Promise which will resolve when requested start notification.
     */
    startNotifications (_serviceId, characteristicId, onCharacteristicChanged = null) {
        // Connected device will start necessary notifications automatically on serial-port.
        this.notifyListeners[SERIAL_CH_ID[characteristicId]] = onCharacteristicChanged;
        return Promise.resolve();
    }

    readCh (ch) {
        if (this.state !== 'open') {
            return Promise.reject(new Error('port is not opened'));
        }
        return new Promise(resolve => {
            const dataFrame = new Uint8Array(4);
            dataFrame[0] = SFD;
            dataFrame[1] = ChRequest.READ;
            dataFrame[2] = ch >> 8;
            dataFrame[3] = ch & 0xFF;
            if (this.chValues[ch]) {
                this.chValues[ch][ChResponse.READ] = null;
            }
            this.sendData(dataFrame)
                .then(() => {
                    const checkInterval = 10;
                    const check = count => {
                        const received = this.chValues[ch];
                        if (received && received[ChResponse.READ]) {
                            return resolve({
                                message: arrayBufferToBase64(received[ChResponse.READ])
                            });
                        }
                        count--;
                        if (count === 0) {
                            return resolve(null);
                        }
                        setTimeout(() => {
                            check(count);
                        }, checkInterval);
                    };
                    check(20);
                });
        });
    }

    /**
     * Read from the specified ble service.
     * @param {number} serviceId - the ble service to read.
     * @param {number} characteristicId - the ble characteristic to read.
     * @param {boolean} optStartNotifications - whether to start receiving characteristic change notifications.
     * @param {function} onCharacteristicChanged - callback for characteristic change notifications
     *  like function(base64message).
     * @return {Promise} - a Promise from the remote read request which resolve {message: base64string}.
     */
    read (serviceId, characteristicId, optStartNotifications = false, onCharacteristicChanged = null) {
        const ch = SERIAL_CH_ID[characteristicId];
        const constantUpdatingCh = [
            0x0101, /* State */
            0x0102 /* Motion */
        ];
        if (constantUpdatingCh.includes(ch)) {
            // Return already received values because rapid repeating requests will make the port freeze.
            if (!this.chValues[ch]) {
                return Promise.resolve(null);
            }
            return Promise.resolve({
                message: arrayBufferToBase64(this.chValues[ch][ChResponse.READ])
            });
        }
        const readRetry = count => new Promise((resolve, reject) => {
            if (count < 0) {
                reject(new Error(`no response`));
                log.debug(`read ch: ${ch} dose not response`);
                return;
            }
            this.readCh(ch)
                .then(result => {
                    if (result) {
                        if (optStartNotifications) {
                            this.startNotifications(serviceId, characteristicId, onCharacteristicChanged)
                                .then(() => resolve(result));
                            return;
                        }
                        resolve(result);
                        return;
                    }
                    count--;
                    resolve(readRetry(count));
                    return;
                })
                .catch(err => {
                    resolve(null);
                    log.debug(err);
                    return;
                });
        });
        return readRetry(2)
            .catch(err => {
                log.debug(err);
                this.handleDisconnectError(err);
                return;
            });
    }
    
    /**
     * Write value on the characteristic.
     * @param {number} ch - characteristic to write
     * @param {Uint8Array} value - value to write
     * @param {boolean} withResponse - whether request response or not
     * @returns {Promise} - a Promise which will resolve true when success to write
     */
    writeCh (ch, value, withResponse) {
        if (this.state !== 'open') {
            return Promise.reject(new Error('port is not opened'));
        }
        return new Promise(resolve => {
            const header = new Uint8Array(5);
            header[0] = SFD;
            header[1] = withResponse ? ChRequest.WRITE_RESPONSE : ChRequest.WRITE;
            header[2] = ch >> 8;
            header[3] = ch & 0xFF;
            header[4] = value.length;
            const dataFrame = new Uint8Array([...header, ...value, 0]);
            dataFrame[dataFrame.length - 1] = dataFrame.reduce((acc, cur) => acc + cur) % 0xFF;
            if (withResponse) {
                this.sendData(dataFrame)
                    .then(() => {
                        const checkInterval = 10;
                        const check = count => {
                            const received = this.chValues[ch];
                            if (received && (received[ChResponse.WRITE_RESPONSE])) {
                                return resolve(received[ChResponse.WRITE_RESPONSE][0] === 1);
                            }
                            count--;
                            if (count === 0) {
                                return resolve(false);
                            }
                            setTimeout(() => {
                                check(count);
                            }, checkInterval);
                        };
                        check(20);
                    });
            } else {
                this.sendData(dataFrame)
                    .then(() => resolve(true));
            }
        });
    }

    /**
     * Write data to the specified ble service.
     * @param {number} serviceId - the ble service to write.
     * @param {number} characteristicId - the ble characteristic to write.
     * @param {string} message - the message to send.
     * @param {string} encoding - the message encoding type.
     * @param {boolean} withResponse - if true, resolve after peripheral's response. Always true for serial port.
     * @return {Promise} - a Promise which will resolve true when success to write or reject with 'no response'
     */
    // eslint-disable-next-line no-unused-vars
    write (serviceId, characteristicId, message, encoding = null, withResponse = null) {
        withResponse = true; // "response" is always required for noise tolerance on serial-port.
        const value = (encoding === 'base64') ? base64ToUint8Array(message) : message;
        const ch = SERIAL_CH_ID[characteristicId];
        if (this.chValues[ch]) {
            this.chValues[ch][ChResponse.WRITE_RESPONSE] = null;
        }
        const writeRetry = count => new Promise((resolve, reject) => {
            if (count < 0) {
                reject(new Error(`no response`));
                log.debug(`write ch: ${ch} dose not response`);
                return;
            }
            this.writeCh(ch, value, withResponse)
                .then(result => {
                    if (result) {
                        resolve(result);
                        return;
                    }
                    count--;
                    resolve(writeRetry(count));
                    return;
                })
                .catch(err => {
                    resolve(null);
                    log.debug(err);
                    return;
                });
        });
        return writeRetry(2)
            .catch(err => {
                log.debug(err);
                this.handleDisconnectError(err);
                return;
            });
    }

    /**
     * Handle an error resulting from losing connection to a peripheral.
     *
     * This could be due to:
     * - battery depletion
     * - going out of bluetooth range
     * - being powered down
     *
     * Disconnect the device, and if the extension using this object has a
     * reset callback, call it. Finally, emit an error to the runtime.
     */
    handleDisconnectError (/* e */) {
        if (this.state !== 'open') return;

        this.disconnect()
            .then(() => {
                if (this._resetCallback) {
                    this._resetCallback();
                }

                this._runtime.emit(this._runtime.constructor.PERIPHERAL_CONNECTION_LOST_ERROR, {
                    message: `Scratch lost connection to`,
                    extensionId: this._extensionId
                });
            });
    }

    _handleRequestError (/* e */) {
        // log.error(`BLE error: ${JSON.stringify(e)}`);

        this._runtime.emit(this._runtime.constructor.PERIPHERAL_REQUEST_ERROR, {
            message: `Scratch lost connection to`,
            extensionId: this._extensionId
        });
    }

    /**
     * Called when disconnected by the device.
     */
    onDisconnected (/* event */) {
        this.handleDisconnectError(new Error('device disconnected'));
    }
}

module.exports = WebSerial;
