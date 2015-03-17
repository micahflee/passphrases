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

var fs = require('fs');
var $ = require('jquery');

var gui = require('nw.gui');
var win = gui.Window.get();

// make shortcut keys like Cmd-Q work in OSX (#4)
if(process.platform === 'darwin') {
  var nativeMenuBar = new gui.Menu({ type: "menubar" });
  nativeMenuBar.createMacBuiltin("Passphrases", {
    hideEdit: true,
    hideWindow: true
  });
  win.menu = nativeMenuBar;
}

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
