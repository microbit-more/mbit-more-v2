import { parseMotionData } from './motion-parser';

describe('motion-parser', () => {
    test('should return null if dataView is invalid or too small', () => {
        expect(parseMotionData(null)).toBeNull();

        const buffer = new ArrayBuffer(10);
        const dataView = new DataView(buffer);
        expect(parseMotionData(dataView)).toBeNull();
    });

    test('should parse acceleration, pitch, roll, compass, magneticForce', () => {
        const buffer = new ArrayBuffer(20);
        const dataView = new DataView(buffer);

        // Pitch & Roll raw value (approx 1000 rad * 1000)
        dataView.setInt16(0, 1000, true);
        dataView.setInt16(2, -500, true);

        // Accel: x=500, y=-250, z=1000
        dataView.setInt16(4, 500, true);
        dataView.setInt16(6, -250, true);
        dataView.setInt16(8, 1000, true);

        // Compass heading: 180
        dataView.setUint16(10, 180, true);

        // Mag force: x=10, y=-20, z=30
        dataView.setInt16(12, 10, true);
        dataView.setInt16(14, -20, true);
        dataView.setInt16(16, 30, true);

        const result = parseMotionData(dataView);

        expect(result).not.toBeNull();
        expect(result.pitch).toBe(57); // 1000 * 180 / PI / 1000 ~ 57.295 -> 57
        expect(result.roll).toBe(-29);
        expect(result.acceleration).toEqual({ x: 488.28125, y: -244.140625, z: 976.5625 });
        expect(result.compassHeading).toBe(180);
        expect(result.magneticForce).toEqual({ x: 10, y: -20, z: 30 });
    });
});
