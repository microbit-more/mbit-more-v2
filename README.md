<h1 align="center">Microbit More v2</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://yokobond.github.io/mbit-more-v2" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/yokobond/mbit-more-v2/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/yokobond/mbit-more-v2/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/yokobond/mbit-more-v2" />
  </a>
</p>

> Full-functional extension of micro:bit for Scratch3

### 🏠 [Homepage](https://lab.yengawa.com/project/scratch-microbit-more/) (in Japanese)

### ✨ Open [Microbit More Web-App](https://yokobond.github.io/mbit-more-v2) 
This is a mod application from [Scratch3 by MIT](https://scratch.mit.edu/). You can code using 'Microbit More' and all blocks in nomal Scratch3 on this app.

You don't need to run [Scratch Link](https://scratch.mit.edu/microbit) when your browser is Chrome, Edge or 'Web Bluetooth API' supporting one (the browser in Chromebook, [‎Bluefy](https://apps.apple.com/jp/app/bluefy-web-ble-browser/id1492822055) in iPadOS, like that).


## How to Use

Get a micro:bit (either v1 or v2) and a PC then follow the steps below.

1. download extension program [microbit-mbit-more-v2-0_1_0.hex](https://github.com/yokobond/pxt-mbit-more-v2/releases/download/0.1.0/microbit-mbit-more-v2-0_1_0.hex) on your micro:bit
2. calibrate compass by playing 'TILT TO FILL SCREEN' ([How to calibrate the micro:bit compass : Help & Support](https://support.microbit.org/support/solutions/articles/19000008874-calibrating-the-micro-bit-compass))
3. open [Microbit More Web-App](https://yokobond.github.io/mbit-more-v2)
4. click **(!) button** in the "Microbit More" category to scan micro:bit (run [Scratch Link](https://scratch.mit.edu/microbit) if you claimed it)
5. select your micro:bit on the device list then click **pair**
6. return to the editor and click **[display pattern [:heart:]]** to check the connection with your micro:bit

## Restrictions

* Do not share on the official Scratch website. (You can save project on your PC and share the file)
* Messaging blocks are not available for micro:bit v1.

## Setup Development Environment

Download the Scratch3 repositories according to the supporsed directory configuration.

```
.
|-- mbit-more-v2
|-- scratch-vm
|-- scratch-gui
```

Install node modules and setup to use local repo for development.

```sh
cd ./mbit-more-v2
npm install
npm run setup:local
npm run install:local
```

## Install into selfbuild Scratch3

To install this extention into your selfbuild Scratch3, execute `scripts/install.js` with options as follows.

```sh
node ./scripts/install.js --gui="../scratch-gui" --vm="../scratch-gui/node_modules/scratch-vm" --url="https://yokobond.github.io/mbit-more-v2/dist/microbitMore.mjs"
```

- --gui : location of scratch-gui from current dir.
- --vm : location of scratch-vm form current dir.
- --url : URL to get its module as a lodable extension for Xcratch.

**CAUTION:** This script will change '`extension default`' in `scratch-gui/src/lib/libraries/extensions/index.jsx` as follows.

change from the original code

```js
export default [...];
```

to

```js
const extensions = [...];
export default extensions;
```

It may break installation mechanism of the other extensions.


## Xcratch Module Building

Build module as loadable extension for [Xcratch](https://github.com/yokobond/xcratch).

```sh
node ./scripts/build.js --name=microbitMore --url="https://yokobond.github.io/mbit-more-v2/dist/microbitMore.mjs" --block="./src/block" --entry="./src/entry" --vm="../scratch-vm" --gui="../scratch-gui" --output="./dist"
```

- --name: name of the module file (without '.mjs').
- --url : URL to get its module as a lodable extension for Xcratch.
- --block : location of block files from current dir.
- --entry : location of entry files from current dir.
- --gui : location of scratch-gui from current dir.
- --vm : location of scratch-vm form current dir.
- --output : location to save module form current dir.

## Author

👤 **Koji Yokokawa**

* Website: http://www.yengawa.com/
* Github: [@yokobond](https://github.com/yokobond)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/yokobond/mbit-more-v2/issues). You can also take a look at the [contributing guide](https://github.com/yokobond/mbit-more-v2/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!


## 📝 License

Copyright © 2020-2021 [Koji Yokokawa](https://github.com/yokobond).<br />
This project is [MIT](https://github.com/yokobond/mbit-more-v2/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_