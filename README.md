# Passphrases

A tool to generate and help memorize cryptographically secure passphrases.

## Build Instructions

These instructions have never been tested in Windows. Install [node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) for your operating system. Also, you'll need to install [Wine](https://www.winehq.org/) on your computer to set the Windows icon in the build process for `build.js` to work (if you don't care about building for Windows, comment out the `winIco` line in `build.js`).

Grab a copy of the source code and install the dependencies:

```sh
git clone https://github.com/micahflee/passphrases.git
cd passphrases
npm install
```

To run the app while developing:

```sh
node_modules/.bin/nwbuild -r src
```

To build binaries for OSX and Windows:

```sh
./build.js
```

While it's simple to get this to run in Linux as well, I'm still working on the best way to package it.
