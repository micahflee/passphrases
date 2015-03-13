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

var fs = require('fs-extra');
var exec = require('child_process').exec;
var NwBuilder = require('node-webkit-builder');

// are we building a package to distribute?
var buildPackage = (process.argv[2] == '--package');
if(buildPackage) {
  // clean up from last time
  try {
    fs.removeSync('./dist');
    fs.mkdirSync('./dist');
  } catch(e) {}
}

// learn version of app
var version = JSON.parse(fs.readFileSync('./src/package.json'))['version'];

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
  options.platforms = ['linux32', 'linux64'];

  build(options, function(err){
    if(err) throw err;
    if(buildPackage) {
      console.log('Note that there is no simple way to build source packages yet.');

      // building two .deb packages, for linux32 and linux64
      ['linux32', 'linux64'].forEach(function(arch){
        if(!arch) return;
        var pkgName = 'passphrases_' + version + '-1_{{arch}}';
        if(arch == 'linux32') pkgName = pkgName.replace('{{arch}}', 'i386');
        if(arch == 'linux64') pkgName = pkgName.replace('{{arch}}', 'amd64');

        try {
          // create directory structure
          fs.mkdirsSync('./dist/' + pkgName + '/opt');
          fs.mkdirsSync('./dist/' + pkgName + '/usr/bin');
          fs.mkdirsSync('./dist/' + pkgName + '/usr/share/pixmaps');
          fs.mkdirsSync('./dist/' + pkgName + '/usr/share/applications');
          fs.mkdirsSync('./dist/' + pkgName + '/DEBIAN');

          // copy binaries
          fs.copySync('./build/Passphrases/' + arch, './dist/' + pkgName + '/opt/Passphrases');

          // copy icon, .desktop
          fs.copySync('./packaging/passphrases.png', './dist/' + pkgName + '/usr/share/pixmaps/passphrases.png');
          fs.copySync('./packaging/passphrases.desktop', './dist/' + pkgName + '/usr/share/applications/passphrases.desktop');

          // create passphrases symlink
          fs.symlinkSync('../../opt/Passphrases/Passphrases', './dist/' + pkgName + '/usr/bin/passphrases');

          // write the debian control file
          var control = fs.readFileSync('./packaging/DEBIAN/control', { encoding: 'utf8' });
          control = control.replace('{{version}}', version);
          if(arch == 'linux32') control = control.replace('{{arch}}', 'i386');
          if(arch == 'linux64') control = control.replace('{{arch}}', 'amd64');
          fs.writeFileSync('./dist/' + pkgName + '/DEBIAN/control', control);

          // build .deb packages
          console.log('Building ' + pkgName + '.deb');
          exec('dpkg-deb --build ' + pkgName, { cwd: './dist' }, function(err, stdout, stderr){
            if(err) throw err;
          });

        } catch(e) { throw e; }
      });
    }
  });
}

// OSX
else if(process.platform == 'darwin') {
  options.platforms = ['osx32'];
  options.macIcns = './packaging/icon.icns';

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
  options.winIco = './packaging/icon.ico';

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
