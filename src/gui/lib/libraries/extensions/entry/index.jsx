let formatMessage = messageData => messageData.defaultMessage;

import microbitMoreIconURL from './entry-icon.png';
import microbitMoreInsetIconURL from './inset-icon.svg';
import microbitMoreConnectionIconURL from './connection-icon.svg';
import microbitMoreConnectionSmallIconURL from './connection-small-icon.svg';

const version = 'v2-0.2.4';

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
    get description () {
        return formatMessage({
            defaultMessage: 'Play with all functions of micro:bit.',
            description: "Description for the 'Microbit More' extension",
            id: 'gui.extension.microbitMore.description'
        });
    },
    featured: true,
    disabled: false,
    bluetoothRequired: true,
    internetConnectionRequired: false,
    launchPeripheralConnectionFlow: true,
    useAutoScan: false,
    connectionIconURL: microbitMoreConnectionIconURL,
    connectionSmallIconURL: microbitMoreConnectionSmallIconURL,
    get connectingMessage () {
        return formatMessage({
            defaultMessage: 'Connecting',
            description: 'Message to help people connect to their micro:bit.',
            id: 'gui.extension.microbit.connectingMessage'
        });
    },
    helpLink: 'https://microbit-more.github.io/',
    setFormatMessage: formatter => {
        formatMessage = formatter;
    },
    translationMap: translationMap
};

export {entry}; // loadable-extension needs this line.
export default entry;
