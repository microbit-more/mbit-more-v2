import React from 'react';
import {FormattedMessage} from 'react-intl';

/**
 * MicroBit More extension
 */

import iconURL from './entry-icon.png';
import insetIconURL from './inset-icon.svg';
import connectionIconURL from './connection-icon.svg';
import connectionSmallIconURL from './connection-small-icon.svg';

const version = 'v2-0.2.4';
const translations =
{
    'en': {
        'mbitMore.entry.name': 'MicroBit More',
        'mbitMore.entry.description': `Play with all functions of micro:bit. (${version})`
    },
    'ja': {
        'mbitMore.entry.name': 'MicroBit More',
        'mbitMore.entry.description': `micro:bitのすべての機能で遊ぶ。 (${version})`
    },
    'ja-Hira': {
        'mbitMore.entry.name': 'MicroBit More',
        'mbitMore.entry.description': `マイクロビットのすべてのきのうであそぶ。 (${version})`
    }
};

const entry = {
    name: (
        <FormattedMessage
            defaultMessage="MicroBit More"
            description="Name for this extension"
            id="mbitMore.entry.name"
        />
    ),
    extensionId: 'microbitMore',
    extensionURL: null,
    collaborator: 'Yengawa Lab',
    iconURL: iconURL,
    insetIconURL: insetIconURL,
    description: (
        <FormattedMessage
            defaultMessage="Play with all functions of micro:bit."
            description="Description for the 'MicroBit More' extension"
            id="mbitMore.entry.description"
        />
    ),
    featured: true,
    disabled: false,
    bluetoothRequired: true,
    internetConnectionRequired: false,
    launchPeripheralConnectionFlow: true,
    useAutoScan: false,
    connectionIconURL: connectionIconURL,
    connectionSmallIconURL: connectionSmallIconURL,
    connectingMessage: (
        <FormattedMessage
            defaultMessage="Connecting"
            description="Message to help people connect to their micro:bit."
            id="gui.extension.microbitMore.description"
        />
    ),
    helpLink: 'https://microbit-more.github.io/',
    translationMap: translations
};

export {entry}; // loadable-extension needs this line.
export default entry;
