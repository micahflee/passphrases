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

var $ = require('jquery');
var gui = require('nw.gui');
var win = gui.Window.get();

Passphrases = {};

// load sound effects
Passphrases.soundEffects = {
  'generate': new Audio("sounds/dice.ogg"),
  'success': new Audio("sounds/success.ogg"),
  'notification': new Audio("sounds/notification.ogg"),
};

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
