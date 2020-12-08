<h1 align="center">scratch-microbit-more</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.5.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://yokobond.github.io/scratch-microbit-more" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/yokobond/scratch-microbit-more/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/yokobond/scratch-microbit-more/blob/trunk/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/yokobond/scratch-microbit-more" />
  </a>
</p>

> Full-functional extension of micro:bit for Scratch3

### ✨ Open [Microbit More Web-App](https://yokobond.github.io/scratch-microbit-more)

### 🏠 [Homepage](https://lab.yengawa.com/project/scratch-microbit-more/)

## Setup Development Environment

Download the Scratch3 repositories according to the supporsed directory configuration.

```
.
|-- scratch-microbit-more
|-- scratch-vm
|-- scratch-gui
```

Install node modules and setup to use local repo for development.

```sh
cd ./scratch-microbit-more
npm install
npm run setup:local
npm run install:local
```

## Install into Scratch3

To install this extention into your selfbuild Scratch3, execute `scripts/install.js` with options as follows.

```sh
node ./scripts/install.js --gui="../scratch-gui" --vm="../scratch-gui/node_modules/scratch-vm" --url="https://yokobond.github.io/scratch-microbit-more/dist/microbitMore.mjs"
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
node ./scripts/build.js --name=microbitMore --block="./src/block" --entry="./src/entry" --vm="../scratch-vm" --gui="../scratch-gui" --output="./dist"
```

- --name: name of the module file (without '.mjs').
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

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/yokobond/scratch-microbit-more/issues). You can also take a look at the [contributing guide](https://github.com/yokobond/scratch-microbit-more/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!


## 📝 License

Copyright © 2020 [Koji Yokokawa](https://github.com/yokobond).<br />
This project is [MIT](https://github.com/yokobond/scratch-microbit-more/blob/trunk/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_