import { parseStateData } from './state-parser';

describe('state-parser', () => {
    test('should return null if dataView is invalid or too small', () => {
        expect(parseStateData(null)).toBeNull();

        const buffer = new ArrayBuffer(5);
        const dataView = new DataView(buffer);
        expect(parseStateData(dataView)).toBeNull();
    });

    test('should correctly parse GPIO, buttons, light, temperature, sound', () => {
        const buffer = new ArrayBuffer(8);
        const dataView = new DataView(buffer);

        // Bit 0 (P0 = 1), Bit 27 (Button A = 1 -> 24 + 3)
        const gpioVal = (1 << 0) | (1 << 27);
        dataView.setUint32(0, gpioVal, true);
        dataView.setUint8(4, 128); // light
        dataView.setUint8(5, 148); // temp (20 + 128)
        dataView.setUint8(6, 200); // sound

        const result = parseStateData(dataView, [0, 1, 2]);

        expect(result).not.toBeNull();
        expect(result.digitalLevel[0]).toBe(1);
        expect(result.digitalLevel[1]).toBe(0);
        expect(result.buttonState.A).toBe(1);
        expect(result.buttonState.B).toBe(0);
        expect(result.lightLevel).toBe(128);
        expect(result.temperature).toBe(20);
        expect(result.soundLevel).toBe(200);
    });
});
