import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {IntlProvider, addLocaleData} from 'react-intl';
import jaLocaleData from 'react-intl/locale-data/ja';
import deLocaleData from 'react-intl/locale-data/de';

import entry from './index-stretch3.jsx';
import translations from './translations.json';
import {version as packageVersion} from '../../../../../../package.json';

// react-intl v2 needs locale data for non-English locales.
// 'ja-Hira' falls back to 'ja' data (react-intl resolves it by language subtag).
addLocaleData([...jaLocaleData, ...deLocaleData]);

const locales = ['en', 'ja', 'ja-Hira', 'de'];

// Mimic Stretch3's ExtensionLibrary:
// Object.assign(intl.messages, extension.translationMap[intl.locale])
const render = (locale, node) => {
    const messages = {};
    Object.assign(messages, entry.translationMap[locale]);
    return renderToStaticMarkup(
        <IntlProvider
            locale={locale}
            messages={messages}
        >
            <div>{node}</div>
        </IntlProvider>
    );
};

const text = html => html.replace(/<[^>]*>/g, '');

describe('MicroBit More entry for Stretch3', () => {
    let errorSpy;
    beforeEach(() => {
        // Silence react-intl warnings about missing messages (connectingMessage is provided by the GUI).
        errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });
    afterEach(() => {
        errorSpy.mockRestore();
    });

    test('translationMap has name and description for every locale', () => {
        expect(Object.keys(entry.translationMap).length).toBeGreaterThan(0);
        Object.keys(entry.translationMap).forEach(locale => {
            // keys contain dots, so check with Object.keys instead of toHaveProperty's path syntax
            expect(Object.keys(entry.translationMap[locale])).toEqual(
                expect.arrayContaining(['mbitMore.entry.name', 'mbitMore.entry.description'])
            );
        });
    });

    locales.forEach(locale => {
        describe(`locale: ${locale}`, () => {
            test('name is translated and includes version', () => {
                const html = render(locale, entry.name);
                expect(html).not.toContain('undefined');
                const name = text(html);
                expect(name).toContain(translations[locale]['mbitMore.entry.name']);
                expect(name).toContain(`(v2-${packageVersion})`);
            });

            test('description is translated', () => {
                const html = render(locale, entry.description);
                expect(html).not.toContain('undefined');
                expect(text(html)).toBe(translations[locale]['mbitMore.entry.description']);
            });

            test('connectingMessage renders', () => {
                const html = render(locale, entry.connectingMessage);
                expect(html).not.toContain('undefined');
                expect(text(html)).not.toBe('');
            });
        });
    });
});
