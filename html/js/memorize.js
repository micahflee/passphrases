$(function(){
  // initialize memorize
  $('.memorize-input').show();
  $('.memorize-go').hide();

  // start memorizing
  function startMemorizing(passphrase) {
    // switch from input mode to go mode
    $('.memorize-input').hide();
    $('.memorize-go').show();

    $('.memorize-active').show();
    $('.memorize-waiting').hide();
    $('.memorize-ready').hide();

    $('.passphrase-test').attr('type', 'text');

    var delay = 0;
    var tries = 0;
    $('.hint-show').text(passphrase);

    var typedWithoutLooking = false;

    // countdown values are in seconds
    var countdownValues = [60, 120, 300, 600, 1800, 3600];
    var currentCountdown = 0;

    function updateStats() {
      if(tries == 0) {
        $('.memorize-note').html('Type the passphrase');
      } else if(tries == 1) {
        $('.memorize-note').html('Try to type the passphrase before the hint appears');
      } else if(typedWithoutLooking && tries < 10) {
        $('.memorize-note').html('Good job! Try making it to 10 tries');
      } else if(typedWithoutLooking && tries < 15) {
        $('.memorize-note').html('Try making it to 15 tries without seeing what you type');
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

      // show active, hide waiting
      $('.memorize-active').show();
      $('.memorize-waiting').hide();
      $('.memorize-ready').hide();

      // reset the passphrase
      $('.passphrase-test').val('').focus();

      // animate the progress bar
      $('.hint-progress').animate({ width: '100%' }, delay * 1000, function(){
        // delay is up, show the hint
        $('.hint-progress-wrapper').hide();
        $('.hint-show').show();
      });
    }

    function countdownComplete(countdownInterval) {
      // stop the timer
      clearInterval(countdownInterval);

      // remove the click handler for skip button
      $('.button-skip-countdown').unbind('click');

      // display ready
      $('.memorize-active').hide();
      $('.memorize-waiting').hide();
      $('.memorize-ready').show();

      // wait for space presses
      $('.passphrase-test').blur();
      $(window).keypress(function(e) {
        if (e.keyCode == 0 || e.keyCode == 32) {
          $(window).unbind('keypress');
          nextTry();
          return false;
        }
      });

      // todo: notification
    }

    function countdown() {
      typedWithoutLooking = false;

      // show waiting, hide active
      $('.memorize-active').hide();
      $('.memorize-waiting').show();
      $('.memorize-ready').hide();
      $('.memorize-note').html('Give your mind a rest');

      // how many seconds do we wait?
      var total_seconds = countdownValues[currentCountdown];

      // update the countdown each second
      function updateCountdown(){
        var seconds = total_seconds % 60;
        if(seconds < 10) seconds = '0' + seconds;
        var minutes = Math.floor(total_seconds / 60);
        $('.countdown').html(minutes + ':' + seconds);
      }
      updateCountdown();

      var countdownInterval = setInterval(function(){
        updateCountdown();

        // decrease the seconds
        total_seconds--;
        if(total_seconds < 0) {
          // countdown complete, move on to the next countdown
          if(currentCountdown < countdownValues.length - 1)
            currentCountdown++;

          countdownComplete(countdownInterval);
        }
      }, 1000);

      // skip button
      $('.button-skip-countdown').click(function(){
        countdownComplete(countdownInterval);
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
          delay++;

        // update stats
        updateStats();

        // after 10 tries, change from text field to password field
        if(tries == 10) {
          $('.passphrase-test').attr('type', 'password');
        }

        if(tries < 15) {
          nextTry();
        } else {
          if(typedWithoutLooking) {
            countdown();
          } else {
            nextTry();
          }
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

    // stop listening for space keypress
    $(window).unbind('keypress');
  });

  // let the outside world start memorizing a passphrase
  Passphrases.memorizeStart = function(passphrase){
    $('.passphrase-to-memorize').val(passphrase);
    startMemorizing(passphrase);
  };

});
