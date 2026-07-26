export const COMMAND_ID = {
    DISPLAY_TEXT: 0x01,
    DISPLAY_MATRIX: 0x02,
    PIN_MODE: 0x10,
    PIN_OUTPUT: 0x11,
    PULSE_GEN: 0x12,
    MIC_CONFIG: 0x20
};

/**
 * Encode display text command payload.
 * @param {string} text - Text to display (max 18 chars)
 * @param {number} delay - Delay between chars in ms
 * @returns {Uint8Array} Encoded command packet
 */
export const encodeDisplayTextCommand = (text, delay = 400) => {
    const textLength = Math.min(18, text.length);
    const packet = new Uint8Array(textLength + 3);
    packet[0] = COMMAND_ID.DISPLAY_TEXT;
    packet[1] = delay & 0xff;
    packet[2] = (delay >> 8) & 0xff;
    for (let i = 0; i < textLength; i++) {
        packet[i + 3] = text.charCodeAt(i);
    }
    return packet;
};

/**
 * Encode pin mode configuration command packet.
 * @param {number} pin - Pin index
 * @param {number} mode - Mode byte
 * @returns {Uint8Array} Encoded command packet
 */
export const encodePinModeCommand = (pin, mode) => {
    const packet = new Uint8Array(3);
    packet[0] = COMMAND_ID.PIN_MODE;
    packet[1] = pin;
    packet[2] = mode;
    return packet;
};
