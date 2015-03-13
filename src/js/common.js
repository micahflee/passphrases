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

var fs = require('fs');
var $ = require('jquery');

var gui = require('nw.gui');
var win = gui.Window.get();

Passphrases = {};

// load sound effects
var soundEffects = {
  'generate': new Audio("sounds/dice.ogg"),
  'success': new Audio("sounds/success.ogg"),
  'notification': new Audio("sounds/notification.ogg"),
};
Passphrases.playSound = function(sound) {
  if(Passphrases.prefs['sound']) {
    soundEffects[sound].play();
  }
}

// notifications
Passphrases.notify = function(message) {
  var options = {
    icon: 'images/icon.png',
    body: message
  };

  var notification = new Notification("Passphrases", options);
  notification.onclick = function () {
    win.focus();
  }
  notification.onshow = function () {
    // auto close after 3 seconds
    setTimeout(function() {notification.close();}, 3000);
  }
}

// define default preferences
Passphrases.prefs = {
  sound: true,
  wordlist: "securedrop",
  words: 7
};

function getPrefsDirname() {
  var dirname;
  if(process.platform == 'linux') {
    dirname = process.env.HOME + '/.config/PassphrasesApp'
  } else if(process.platform == 'darwin') {
    dirname = process.env.HOME + '/Library/Application Support/PassphrasesApp'
  } else if(process.platform == 'win32') {
    dirname = process.env.APPDATA + '\\\\PassphrasesApp'
  }
  return dirname;
}
function getPrefsFilename() {
  if(process.platform == 'win32') {
    return getPrefsDirname() + '\\\\passphrases.conf';
  } else {
    return getPrefsDirname() + '/passphrases.conf';
  }
}

function loadPrefs(callback) {
  try {
    data = fs.readFileSync(getPrefsFilename(), { encoding: 'utf8' });
    Passphrases.prefs = JSON.parse(data);
    callback();
  } catch(e) {
    Passphrases.savePrefs(callback);
  }
}
Passphrases.savePrefs = function(callback) {
  // create the prefs dir, if it's not already created
  try {
    fs.mkdirSync(getPrefsDirname());
  } catch(e) {}

  // save preferences
  fs.writeFile(getPrefsFilename(), JSON.stringify(Passphrases.prefs), function(err){
    if(callback) callback(err);
  })
}
loadPrefs();

$(function(){
  // make all links open in external browser
  $('a').each(function(){
    var url = $(this).attr('href');
    $(this).click(function(){
      gui.Shell.openExternal(url);
      return false;
    });
  });
});
