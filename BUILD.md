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

Running `node build.js --package` in Windows does a couple of things. First, it uses nw.js to create a folder that includes `Passphrases.exe`. It also builds an installer, `Passphrases_Setup.exe`, which includes an uninstaller, `uninstall.exe`. It uses Authenticode to codesign all three of these binaries.

To get started:

* Go to http://nsis.sourceforge.net/Download and download the latest NSIS. I downloaded nsis-3.0b0-setup.exe.
* Go to http://msdn.microsoft.com/en-us/vstudio/aa496123 and install the latest .NET Framework. I installed .NET Framework 4.5.1.
* Go to http://www.microsoft.com/en-us/download/confirmation.aspx?id=8279 and install the Windows SDK.
* Right click on Computer, go to Properties. Click "Advanced system settings". Click Environment Variables. Under "System variables" double-click on Path to edit it. Add `;C:\Program Files (x86)\NSIS;C:\Program Files\Microsoft SDKs\Windows\v7.1\Bin`.

You'll also, of course, need a code signing certificate. I roughly followed [this guide](http://blog.assarbad.net/20110513/startssl-code-signing-certificate/) to make one using my StartSSL account. Once you get a code signing key and certificate and covert it to a pfx file, import it into your certificate store.

