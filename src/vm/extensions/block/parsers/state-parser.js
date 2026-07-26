/**
 * MbitMore button state bit index map
 */
export const BUTTON_STATE_INDEX = {
    P0: 0,
    P1: 1,
    P2: 2,
    A: 3,
    B: 4,
    LOGO: 5
};

/**
 * Parse binary state data buffer from micro:bit.
 * @param {DataView} dataView - DataView of the state buffer (8 bytes)
 * @param {Array<number>} gpioPins - List of GPIO pin numbers to extract
 * @returns {object} Parsed state data
 */
export const parseStateData = (dataView, gpioPins = [0, 1, 2, 8, 12, 13, 14, 15, 16]) => {
    if (!dataView || dataView.byteLength < 7) {
        return null;
    }

    const gpioData = dataView.getUint32(0, true);

    const digitalLevel = {};
    for (let i = 0; i < gpioPins.length; i++) {
        const pin = gpioPins[i];
        digitalLevel[pin] = (gpioData >> pin) & 1;
    }

    const buttonState = {};
    Object.keys(BUTTON_STATE_INDEX).forEach(name => {
        buttonState[name] = (gpioData >> (24 + BUTTON_STATE_INDEX[name])) & 1;
    });

    const lightLevel = dataView.getUint8(4);
    const temperature = dataView.getUint8(5) - 128;
    const soundLevel = dataView.getUint8(6);

    return {
        digitalLevel,
        buttonState,
        lightLevel,
        temperature,
        soundLevel
    };
};
