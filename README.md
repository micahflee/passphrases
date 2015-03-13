# Passphrases

A tool to generate and help memorize cryptographically secure passphrases.

## Build Instructions

Install [node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) for your operating system.

Grab a copy of the source code and install the dependencies:

```sh
git clone https://github.com/micahflee/passphrases.git
cd passphrases
npm install
cd src
npm install
cd ..
```

To run the app while developing:

```sh
node_modules/.bin/nwbuild -r src
```

To build binaries for the current platform:

```sh
node build.js
```

If you'd like to completely package it, including codesigning and building an installer, use the `--package` argument:

```sh
node build.js --package
```
