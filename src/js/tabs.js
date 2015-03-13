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

var $ = require('jquery');

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

      if($('.memorize-input').is(':visible')) {
        $('.passphrase-to-memorize').focus();
      } else {
        $('.passphrase-test').focus();
      }
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
