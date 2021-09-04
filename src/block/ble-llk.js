const BLE = require('../../io/ble');
const WebBLE = require('./ble-web');

module.exports = navigator.bluetooth ? WebBLE : BLE;
