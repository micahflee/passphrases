#!/usr/bin/env node

/* Passphrases | https://github.com/micahflee/passphrases
   Copyright (C) 2015 Micah Lee <micah@micahflee.com>

   Permission is hereby granted, free of charge, to any person obtaining a
   copy of this software and associated documentation files (the
   "Software"), to deal in the Software without restriction, including
   without limitation the rights to use, copy, modify, merge, publish,
   distribute, sublicense, and/or sell copies of the Software, and to
   permit persons to whom the Software is furnished to do so, subject to
   the following conditions:

   The above copyright notice and this permission notice shall be included
   in all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
   OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
   IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
   CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
   TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var fs = require('fs-extra');
var path = require('path');
var child_process = require('child_process');
var NwBuilder = require('node-webkit-builder');

// are we building a package to distribute?
var buildPackage = (process.argv[2] == '--package');
if(buildPackage) {
  process.umask(0022);

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

      function copyBinaryPackageSync(pkgName, arch) {
        try {
          // create directory structure
          fs.mkdirsSync('./dist/' + pkgName + '/opt');
          fs.mkdirsSync('./dist/' + pkgName + '/usr/bin');
          fs.mkdirsSync('./dist/' + pkgName + '/usr/share/pixmaps');
          fs.mkdirsSync('./dist/' + pkgName + '/usr/share/applications');

          // copy binaries
          fs.copySync('./build/Passphrases/' + arch, './dist/' + pkgName + '/opt/Passphrases');

          // copy icon, .desktop
          fs.copySync('./packaging/passphrases.png', './dist/' + pkgName + '/usr/share/pixmaps/passphrases.png');
          fs.copySync('./packaging/passphrases.desktop', './dist/' + pkgName + '/usr/share/applications/passphrases.desktop');

          // create passphrases symlink
          fs.symlinkSync('../../opt/Passphrases/Passphrases', './dist/' + pkgName + '/usr/bin/passphrases');
        } catch(e) { throw e; }
      }

      function copyAndReplace(src_filename, dest_filename, arch, replaceArch) {
        var text = fs.readFileSync(src_filename, { encoding: 'utf8' });
        text = text.replace('{{version}}', version);
        if(arch == 'linux32') text = text.replace('{{arch}}', replaceArch);
        if(arch == 'linux64') text = text.replace('{{arch}}', replaceArch);
        fs.writeFileSync(dest_filename, text);
      }

      // can we make debian packages?
      child_process.exec('which dpkg-deb', function(err, stdout, stderr){
        if(err || stdout == '') {
          console.log('Cannot find dpkg-deb, skipping building Debian package');
          return;
        }

        // building two .deb packages, for linux32 and linux64
        ['linux32', 'linux64'].forEach(function(arch){
          if(!arch) return;

          var debArch;
          if(arch == 'linux32') debArch = 'i386';
          if(arch == 'linux64') debArch = 'amd64';

          var pkgName = 'passphrases_' + version + '-1_{{arch}}';
          pkgName = pkgName.replace('{{arch}}', debArch);

          copyBinaryPackageSync(pkgName, arch);

          // write the debian control file
          fs.mkdirsSync('./dist/' + pkgName + '/DEBIAN');
          copyAndReplace('./packaging/DEBIAN/control', './dist/' + pkgName + '/DEBIAN/control', arch, debArch);

          // build .deb packages
          console.log('Building ' + pkgName + '.deb');
          child_process.exec('dpkg-deb --build ' + pkgName, { cwd: './dist' }, function(err, stdout, stderr){
            if(err) throw err;
          });
        });
      });

      // can we make rpm packages?
      child_process.exec('which rpmbuild', function(err, stdout, stderr){
        if(err || stdout == '') {
          console.log('Cannot find rpmbuild, skipping building Red Hat package');
          return;
        }

        // building two .rpm packages, for linux32 and linux64
        ['linux32', 'linux64'].forEach(function(arch){
          if(!arch) return;

          // following instructions from:
          // https://stackoverflow.com/questions/880227/what-is-the-minimum-i-have-to-do-to-create-an-rpm-file

          var rpmArch;
          if(arch == 'linux32') rpmArch = 'i686';
          if(arch == 'linux64') rpmArch = 'x86_64';

          fs.mkdirsSync('./dist/' + rpmArch + '/RPMS');
          fs.mkdirsSync('./dist/' + rpmArch + '/SRPMS');
          fs.mkdirsSync('./dist/' + rpmArch + '/BUILD');
          fs.mkdirsSync('./dist/' + rpmArch + '/SOURCES');
          fs.mkdirsSync('./dist/' + rpmArch + '/SPECS');
          fs.mkdirsSync('./dist/' + rpmArch + '/tmp');

          var pkgName = 'passphrases-' + version;

          copyBinaryPackageSync(rpmArch + '/' + pkgName, arch);

          // write the spec file
          copyAndReplace('./packaging/SPECS/passphrases.spec', './dist/' + rpmArch + '/SPECS/passphrases.spec', arch, rpmArch);

          // tarball the source
          console.log('Compressing binary for ' + arch);
          child_process.exec('tar -zcf SOURCES/' + pkgName + '.tar.gz ' + pkgName + '/', { cwd: './dist/' + rpmArch }, function(err, stdout, stderr){
            if(err) {
              console.log('Error after compressing - ' + arch, err);
              return;
            }

            console.log('Building ' + pkgName + '.rpm (' + arch + ')');
            var topDir = path.resolve('./dist/' + rpmArch);
            child_process.exec('rpmbuild --define \'_topdir ' + topDir +'\' -ba dist/' + rpmArch + '/SPECS/passphrases.spec', function(err, stdout, stderr){
              if(err) {
                console.log('Error after rpmbuild - ' + arch, err);
                return;
              }

            });
          });
        });

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
      // copy .app folder
      fs.copySync('./build/Passphrases/osx32/Passphrases.app', './dist/Passphrases.app');

      // codesigning
      console.log('Codesigning');
      var signingIdentityApp = '3rd Party Mac Developer Application: Micah Lee';
      var signingIdentityInstaller = 'Developer ID Installer: Micah Lee';
      child_process.exec('codesign --force --deep --verify --verbose --sign "' + signingIdentityApp + '" Passphrases.app', { cwd: './dist' }, function(err, stdout, stderr){
        if(err) {
          console.log('Error during codesigning', err);
          return;
        }

        // build a package
        child_process.exec('productbuild --component Passphrases.app /Applications Passphrases.pkg --sign "' + signingIdentityInstaller + '"', { cwd: './dist' }, function(err, stdout, stderr){
          if(err) {
            console.log('Error during productbuild', err);
            return;
          }
          console.log('All done');
        });

      });
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
      // copy binaries
      fs.copySync('./build/passphrases/win32', './dist/Passphrases');

      // copy license
      fs.copySync('./LICENSE.md', './dist/Passphrases/LICENSE.md');

      // codesign Passphrases.exe
      child_process.execSync('signtool.exe sign /v /d "Passphrases" /a /tr "http://www.startssl.com/timestamp" .\\dist\\Passphrases\\Passphrases.exe');

      // make the installer
      child_process.execSync('makensisw packaging\\windows_installer.nsi');

      // codesign the installer
      child_process.execSync('signtool.exe sign /v /d "Passphrases" /a /tr "http://www.startssl.com/timestamp" .\\dist\\Passphrases_Setup.exe');
    }
  });
}

// unsupported platform
else {
  console.log('Error: unrecognized platform');
  process.exit();
}
