import React from 'react';
import {FormattedMessage} from 'react-intl';

import microbitMoreIconURL from './entry-icon.png';
import microbitMoreInsetIconURL from './inset-icon.svg';
import microbitMoreConnectionIconURL from './connection-icon.svg';
import microbitMoreConnectionSmallIconURL from './connection-small-icon.svg';

const version = 'v2-0.2.2';

const translationMap = {
    'en': {
        'gui.extension.microbitMore.description': `Play with all functions of micro:bit. (${version})`
    },
    'ja': {
        'gui.extension.microbitMore.description': `micro:bitのすべての機能で遊ぶ。 (${version})`
    },
    'ja-Hira': {
        'gui.extension.microbitMore.description': `マイクロビットのすべてのきのうであそぶ。 (${version})`
    }
};

const entry = {
    name: 'Microbit More',
    extensionId: 'microbitMore',
    extensionURL: 'https://microbit-more.github.io/dist/microbitMore.mjs',
    collaborator: 'Yengawa Lab',
    iconURL: microbitMoreIconURL,
    insetIconURL: microbitMoreInsetIconURL,
    description: (
        <FormattedMessage
            defaultMessage="Play with all functions of micro:bit."
            description="Description for the 'Microbit More' extension"
            id="gui.extension.microbitMore.description"
        />
    ),
    featured: true,
    disabled: false,
    bluetoothRequired: true,
    internetConnectionRequired: false,
    launchPeripheralConnectionFlow: true,
    useAutoScan: false,
    connectionIconURL: microbitMoreConnectionIconURL,
    connectionSmallIconURL: microbitMoreConnectionSmallIconURL,
    connectingMessage: (
        <FormattedMessage
            defaultMessage="Connecting"
            description="Message to help people connect to their micro:bit."
            id="gui.extension.microbit.connectingMessage"
        />
    ),
    helpLink: 'https://microbit-more.github.io/',
    translationMap: translationMap
};

export {entry}; // loadable-extension needs this line.
export default entry;
