Passphrases = {};

$(function(){
  var gui = require('nw.gui');

  // make all links open in external browser
  $('a').each(function(){
    var url = $(this).attr('href');
    $(this).click(function(){
      gui.Shell.openExternal(url);
      return false;
    });
  });
});
