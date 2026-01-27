import entry, {entry as namedEntry} from './index.jsx';

describe('MicroBit More entry metadata', () => {
    beforeEach(() => {
        entry.setFormatMessage(data => data.defaultMessage || data.id);
    });
    test('default export and named export are the same', () => {
        expect(namedEntry).toBe(entry);
    });

    test('name includes default label and version', () => {
        expect(entry.name).toContain('MicroBit More');
        expect(entry.name).toContain('v2-0.2.5');
    });

    test('setFormatMessage customizes name and description', () => {
        entry.setFormatMessage(data => `T:${data.id}`);
        expect(entry.name).toContain('T:mbitMore.entry.name');
        expect(entry.description).toBe('T:mbitMore.entry.description');
    });

    test('entry flags and identifiers', () => {
        expect(entry.extensionId).toBe('microbitMore');
        expect(entry.bluetoothRequired).toBe(true);
        expect(entry.internetConnectionRequired).toBe(false);
        expect(entry.launchPeripheralConnectionFlow).toBe(true);
    });
});
