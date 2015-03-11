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
