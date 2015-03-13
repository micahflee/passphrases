#!/usr/bin/env node

/* Passphrases | https://github.com/micahflee/passphrases
   Copyright (C) 2015 Micah Lee <micah@micahflee.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var NwBuilder = require('node-webkit-builder');

var buildPackage = (process.argv[2] == '--package');

function build(options, callback) {
  var nw = new NwBuilder(options);

  nw.on('log',  console.log);
  nw.build().then(function () {
    callback();
  }).catch(function(err) {
    console.log('');
    console.log('Build complete.');
    console.log('');
    callback(err);
  });
}

// options for all platforms
var options = { files: './src/**' }

// Linux
if(process.platform == 'linux') {
  if(process.arch == 'ia32') {
    options.platforms = ['linux32'];
  } else if(process.arch == 'x64') {
    options.platforms = ['linux64'];
  } else {
    console.log('Error: unsupported architecture');
    process.exit();
  }

  build(options, function(err){
    if(err) throw err;
    console.log('Note that there is no simple way to build source/binary Debian packages yet.');
  });
}

// OSX
else if(process.platform == 'darwin') {
  options.platforms = ['osx32'];
  options.macIcns = './icons/icon.icns';

  build(options, function(err){
    if(err) throw err;
    if(buildPackage) {
      // todo: OSX code signing
      // todo: OSX packaging
    }
  });
}

// Windows
else if(process.platform == 'win32') {
  options.platforms = ['win32'];
  options.winIco = './icons/icon.ico';

  build(options, function(err){
    if(err) throw err;
    if(buildPackage) {
      // todo: Windows code signing
      // todo: Windows packaging
    }
  });
}

// unsupported platform
else {
  console.log('Error: unrecognized platform');
  process.exit();
}
