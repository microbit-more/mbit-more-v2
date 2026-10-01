export const DATA_FORMAT = {
    CONFIG: 0x10,
    PIN_EVENT: 0x11,
    ACTION_EVENT: 0x12,
    DATA_NUMBER: 0x13,
    DATA_TEXT: 0x14
};

export const ACTION_EVENT_TYPE = {
    BUTTON: 0x01,
    GESTURE: 0x02
};

export const BUTTON_ID = {
    0: 'P0',
    1: 'P1',
    2: 'P2',
    3: 'A',
    4: 'B',
    5: 'LOGO'
};

export const BUTTON_EVENT_ID = {
    1: 'DOWN',
    2: 'UP',
    3: 'CLICK',
    4: 'LONG_CLICK',
    5: 'HOLD'
};

export const GESTURE_ID = {
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
 * Parse event notification binary payload.
 * @param {DataView} dataView - DataView of 20-byte notification buffer
 * @returns {object|null} Parsed event object or null if unrecognized
 */
export const parseEventData = dataView => {
    if (!dataView || dataView.byteLength < 20) {
        return null;
    }

    const dataFormat = dataView.getUint8(19);

    if (dataFormat === DATA_FORMAT.ACTION_EVENT) {
        const actionEventType = dataView.getUint8(0);
        if (actionEventType === ACTION_EVENT_TYPE.BUTTON) {
            const buttonName = BUTTON_ID[dataView.getUint16(1, true)];
            const eventName = BUTTON_EVENT_ID[dataView.getUint8(3)];
            const timestamp = dataView.getUint32(4, true);
            return {
                type: 'button',
                buttonName,
                eventName,
                timestamp
            };
        }
        if (actionEventType === ACTION_EVENT_TYPE.GESTURE) {
            const gestureName = GESTURE_ID[dataView.getUint8(1)];
            const timestamp = dataView.getUint32(2, true);
            return {
                type: 'gesture',
                gestureName,
                timestamp
            };
        }
    }

    if (dataFormat === DATA_FORMAT.PIN_EVENT) {
        const pinIndex = dataView.getUint8(0);
        const event = dataView.getUint8(1);
        const value = dataView.getUint32(2, true);
        return {
            type: 'pin',
            pinIndex,
            event,
            value
        };
    }

    return null;
};
