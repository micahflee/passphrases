# Build Instructions

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

## Packaging

If you'd like to completely package Passphrases, including codesigning and building an installer, use the `--package` argument:

```sh
node build.js --package
```

Here are platform-specific notes about packaging.

### Linux

At the moment there's no simple way to build a Debian source package and compile it into a binary package. Running `node build.js --package` in Linux at the moment is sort of hacky, but ends up creating binary-only packages (that install to /opt) that can be installed in Debian, Ubuntu, Tails, etc. See [#1](https://github.com/micahflee/passphrases/issues/1) for more information.

### Mac OS X

TODO: Finish OSX packaging.

### Windows

TODO: Finish Windows packaging.
