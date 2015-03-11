$(function(){
  // initialize memorize
  $('.memorize-input').show();
  $('.memorize-go').hide();

  // start memorizing
  function startMemorizing(passphrase) {
    // switch from input mode to go mode
    $('.memorize-input').hide();
    $('.memorize-go').show();
    $('.passphrase-test').attr('type', 'text');

    var delay = 0;
    var tries = 0;
    $('.hint-show').html(passphrase);

    var typedWithoutLooking = false;

    function updateStats() {
      if(tries == 0) {
        $('.memorize-note').html('Type the passphrase');
      } else if(tries == 1) {
        $('.memorize-note').html('Try to type the passphrase before the hint appears');
      } else if(typedWithoutLooking && tries < 10) {
        $('.memorize-note').html('Good job! Try making it to 10 tries.');
      } else if(typedWithoutLooking) {
        $('.memorize-note').html('Keep practicing');
      }
      $('.memorize-tries').html(tries);
    }
    updateStats();

    function nextTry() {
      // reset the hint
      $('.hint-progress').stop();
      $('.hint-progress').css('width', '0%');
      $('.hint-progress-wrapper').show();
      $('.hint-show').hide();

      // reset the passphrase
      $('.passphrase-test').val('').focus();

      // animate the progress bar
      $('.hint-progress').animate({ width: '100%' }, delay * 1000, function(){
        // delay is up, show the hint
        $('.hint-progress-wrapper').hide();
        $('.hint-show').show();
      });
    }

    // test for success
    $('.passphrase-test').keyup(function(){
      var passphraseTest = $(this).val();

      // have we achieved success?
      if(passphraseTest == passphrase) {
        // is the animation still happening?
        if($('.hint-progress').is(':animated')) {
          typedWithoutLooking = true;
        }

        // success
        tries++;

        // 2nd try has a 5 second delay
        if(tries == 1) {
          delay = 5;
        } else {
          // tries 2-6 have slowly longer delays
          if(tries <= 6) {
            delay++;
          }
        }

        // increase delay, if needed
        if(delay <= 10)
          delay += 2;

        // update stats
        updateStats();

        // after 10 tries, change from text field to password field
        if(tries == 11) {
          $('.passphrase-test').attr('type', 'password');
        }

        if(tries < 11) {
          nextTry();
        } else {
          // todo: set a 10 minute delay
          nextTry();
        }
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

    // start at zero seconds
    nextTry();
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

  // let the outside world start memorizing a passphrase
  Passphrases.memorizeStart = function(passphrase){
    $('.passphrase-to-memorize').val(passphrase);
    startMemorizing(passphrase);
  };

});
