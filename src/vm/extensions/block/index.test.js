// scratch-vm modules are linked by `npm run setup-dev` and are not available in CI.
jest.mock('../../extension-support/argument-type', () => ({
    MATRIX: 'matrix',
    NUMBER: 'number',
    STRING: 'string'
}), {virtual: true});
jest.mock('../../extension-support/block-type', () => ({
    BOOLEAN: 'Boolean',
    COMMAND: 'command',
    HAT: 'hat',
    REPORTER: 'reporter'
}), {virtual: true});
jest.mock('../../util/cast', () => ({
    toString: value => String(value)
}), {virtual: true});

jest.mock('./microbit-more', () => ({
    MicrobitMore: class MicrobitMoreMock {
        constructor (runtime, extensionId) {
            this.runtime = runtime;
            this.extensionId = extensionId;
            this.analogIn = [0, 1, 2];
            this.gpio = [0, 1, 2, 8, 12, 13, 14, 15, 16];
        }
    }
}));

import MicrobitMoreBlocks from './index';
import translations from './translations.json';

describe('MicrobitMoreBlocks', () => {
    const makeRuntime = (overrides = {}) => {
        const formatter = data => data.defaultMessage || data.id;
        formatter.setup = () => ({locale: 'en', translations: {en: {}}});
        return {
            formatMessage: formatter,
            registerPeripheralExtension: jest.fn(),
            on: jest.fn(),
            emit: jest.fn(),
            currentStepTime: 0,
            ...overrides
        };
    };

    test('static identifiers and extensionURL setter', () => {
        expect(MicrobitMoreBlocks.EXTENSION_ID).toBe('microbitMore');
        const originalUrl = MicrobitMoreBlocks.extensionURL;
        const newUrl = 'https://example.com/microbitMore.mjs';
        MicrobitMoreBlocks.extensionURL = newUrl;
        expect(MicrobitMoreBlocks.extensionURL).toBe(newUrl);
        MicrobitMoreBlocks.extensionURL = originalUrl;
    });

    test('constructor creates microbit with extension id', () => {
        const runtime = makeRuntime();
        const blocks = new MicrobitMoreBlocks(runtime);
        expect(blocks.microbit.extensionId).toBe(MicrobitMoreBlocks.EXTENSION_ID);
    });

    test('button event menu includes expected items', () => {
        const blocks = new MicrobitMoreBlocks(makeRuntime());
        const values = blocks.BUTTON_EVENT_MENU.map(item => item.value);
        expect(values).toEqual(['DOWN', 'UP', 'CLICK']);
    });

    test('gesture menu contains 11 gestures', () => {
        const blocks = new MicrobitMoreBlocks(makeRuntime());
        const values = blocks.GESTURES_MENU.map(item => item.value);
        expect(values).toHaveLength(11);
        expect(values).toEqual([
            'TILT_UP',
            'TILT_DOWN',
            'TILT_LEFT',
            'TILT_RIGHT',
            'FACE_UP',
            'FACE_DOWN',
            'FREEFALL',
            'G3',
            'G6',
            'G8',
            'SHAKE'
        ]);
    });

    test('getInfo returns extension metadata', () => {
        const blocks = new MicrobitMoreBlocks(makeRuntime());
        const info = blocks.getInfo();
        expect(info.id).toBe(MicrobitMoreBlocks.EXTENSION_ID);
        expect(info.extensionURL).toBe(MicrobitMoreBlocks.extensionURL);
        expect(info.blocks.length).toBeGreaterThan(0);
    });

    test('block methods delegate to microbit instance', () => {
        const blocks = new MicrobitMoreBlocks(makeRuntime());
        blocks.microbit.readTemperature = jest.fn(() => 25);
        blocks.microbit.isButtonPressed = jest.fn(() => true);

        expect(blocks.getTemperature()).toBe(25);
        expect(blocks.microbit.readTemperature).toHaveBeenCalled();

        expect(blocks.isButtonPressed({ NAME: 'A' })).toBe(true);
        expect(blocks.microbit.isButtonPressed).toHaveBeenCalledWith('A');
    });

    describe('translations setup', () => {
        const makeLocaleRuntime = locale => {
            const localeTranslations = {[locale]: {}};
            const formatter = data => data.defaultMessage || data.id;
            formatter.setup = () => ({locale, translations: localeTranslations});
            return {
                runtime: makeRuntime({formatMessage: formatter}),
                localeTranslations
            };
        };

        test('uses exact locale match', () => {
            const {runtime, localeTranslations} = makeLocaleRuntime('ja-Hira');
            new MicrobitMoreBlocks(runtime).getInfo();
            expect(localeTranslations['ja-Hira']['mbitMore.isButtonPressed'])
                .toBe(translations['ja-Hira']['mbitMore.isButtonPressed']);
        });

        test.each(['de-DE', 'de_DE'])('falls back to base locale for %s', locale => {
            const {runtime, localeTranslations} = makeLocaleRuntime(locale);
            new MicrobitMoreBlocks(runtime).getInfo();
            expect(localeTranslations[locale]['mbitMore.isButtonPressed'])
                .toBe(translations.de['mbitMore.isButtonPressed']);
        });

        test('leaves unknown locale untouched', () => {
            const {runtime, localeTranslations} = makeLocaleRuntime('fr-FR');
            new MicrobitMoreBlocks(runtime).getInfo();
            expect(localeTranslations['fr-FR']).toEqual({});
        });
    });
});
