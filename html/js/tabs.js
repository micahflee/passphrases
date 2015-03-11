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

$(function(){
  // tab functions
  function activateGenerate() {
    $('.tab-generate').addClass('active');
    $('.content-generate').addClass('active');
  }
  function deactivateGenerate() {
    $('.tab-generate').removeClass('active');
    $('.content-generate').removeClass('active');
  }
  function activateMemorize() {
    $('.tab-memorize').addClass('active');
    $('.content-memorize').addClass('active');
  }
  function deactivateMemorize() {
    $('.tab-memorize').removeClass('active');
    $('.content-memorize').removeClass('active');
  }
  function activateAbout() {
    $('.tab-about').addClass('active');
    $('.content-about').addClass('active');
  }
  function deactivateAbout() {
    $('.tab-about').removeClass('active');
    $('.content-about').removeClass('active');
  }

  function clickGenerateTab() {
    if(!$('.tab-generate').hasClass('active')) {
      activateGenerate();
      deactivateMemorize();
      deactivateAbout();
    };
  }
  $('.tab-generate').click(clickGenerateTab);

  function clickMemorizeTab() {
    if(!$('.tab-memorize').hasClass('active')) {
      activateMemorize();
      deactivateGenerate();
      deactivateAbout();
    };
  }
  $('.tab-memorize').click(clickMemorizeTab);

  function clickAboutTab() {
    if(!$('.tab-about').hasClass('active')) {
      activateAbout();
      deactivateGenerate();
      deactivateMemorize();
    };
  }
  $('.tab-about').click(clickAboutTab);

  $('.navigation .tab').hover(function(){
    $(this).addClass('hover');
  }, function(){
    $(this).removeClass('hover');
  });

  // let the outside world switch to memorize tab
  Passphrases.tabMemorize = function(){
    clickMemorizeTab();
  };

  // start with generate
  clickGenerateTab();
});
