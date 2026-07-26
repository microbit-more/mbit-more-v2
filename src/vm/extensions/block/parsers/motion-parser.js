const G = 1000;

/**
 * Parse motion data buffer (20 bytes) from micro:bit.
 * @param {DataView} dataView - DataView of the motion buffer
 * @returns {object|null} Parsed motion parameters or null if invalid
 */
export const parseMotionData = (dataView) => {
    if (!dataView || dataView.byteLength < 18) {
        return null;
    }

    const pitch = Math.round((dataView.getInt16(0, true) * 180) / Math.PI / 1000);
    const roll = Math.round((dataView.getInt16(2, true) * 180) / Math.PI / 1000);

    const acceleration = {
        x: (1000 * dataView.getInt16(4, true)) / G,
        y: (1000 * dataView.getInt16(6, true)) / G,
        z: (1000 * dataView.getInt16(8, true)) / G
    };

    const compassHeading = dataView.getUint16(10, true);

    const magneticForce = {
        x: dataView.getInt16(12, true),
        y: dataView.getInt16(14, true),
        z: dataView.getInt16(16, true)
    };

    return {
        pitch,
        roll,
        acceleration,
        compassHeading,
        magneticForce
    };
};
