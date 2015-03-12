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

$(function(){
  // check the box if sound is enabled
  $('.enable-sound').prop('checked', Passphrases.prefs['sound']);

  // toggling sound updates settings
  $('.enable-sound').change(function(){
    Passphrases.prefs['sound'] = $(this).prop('checked');
    Passphrases.savePrefs();
  });
});
