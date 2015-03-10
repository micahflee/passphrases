$(function(){
  // initialize memorize
  $('.memorize-input').show();
  $('.memorize-go').hide();

  // start memorizing
  function startMemorizing(passphrase) {
    // switch from input mode to go mode
    $('.memorize-input').hide();
    $('.memorize-go').show();

    var successes = 0;
    var fails = 0;
    $('.hint-show').html(passphrase);

    function updateStats() {
      $('.memorize-successes').html(successes);
      $('.memorize-fails').html(fails);
    }
    updateStats();

    function nextTry(delay) {
      // reset the hint
      $('.hint-progess-wrapper').show();
      $('.hint-show').hide();

      // animate the progress bar
      $('.hint-progress').animate({ width: '100%' }, delay * 1000, function(){
        // delay is up, show the hint
        $('.hint-progress-wrapper').hide();
        $('.hint-show').show();
      });

      // test for success
      $('.passphrase-test').keyup(function(){
        var passphraseTest = $(this).val();

        // have we achieved success?
        if(passphraseTest == passphrase) {
          // success
          nextTry(delay + 5);
        }
        // check for typo
        else {
          var match = true;

          if(passphraseTest.length > passphrase.length) {
            match = false;
          } else {
            // does it match the passphrase correctly so far?
            for(var i = 0; i < passphraseTest.length; i++) {
              if(passphraseTest[i] != passphrase[i]) {
                match = false;
                break;
              }
            }
          }

          if(match) {
            $(this).removeClass('typo');
          } else {
            $(this).addClass('typo');
          }
        }
      });
    }

    nextTry(5);
  }

  $('.button-start-memorizing').click(function(){
    var passphrase = $('.passphrase-to-memorize').val();
    startMemorizing(passphrase);
  });

  $('.button-cancel').click(function(){
    // switch from go mode to input mode
    $('.memorize-input').show();
    $('.memorize-go').hide();
  });
});
