$(function(){
  // load the wordlists
  var wordlists = {
    'diceware': {
      'name': 'Diceware',
      'description': 'Original Diceware wordlist'
    },
    'securedrop': {
      'name': 'SecureDrop',
      'description': 'Wordlist used for generating SecureDrop code names'
    }
  };

  var wordlistCount = 0;
  $.each(wordlists, function(wordlist){ wordlistCount++; });

  function populateWordlistsDropdown() {
    $.each(wordlists, function(wordlist){
      var $option = $('<option />')
        .val(wordlist)
        .html(wordlists[wordlist].name);
      $('select.wordlists').append($option);
    });
  }

  var loadCount = 0;
  $.each(wordlists, function(wordlist){
    console.log('Loading wordlist', wordlists[wordlist]);

    $.ajax({
      url: 'wordlists/' + wordlist + '.wordlist',
      type: 'get',
      error: function(jqXHR, textStatus, errorThrown) {
        console.log('Error loading word list ' + textStatus, errorThrown);
      },
      success: function(data, textStatus, jqXHR) {
        if(!data) {
          console.log('Error, no data');
          return;
        }

        wordlists[wordlist].wordlist = data.split('\n');
        wordlists[wordlist].wordlist.pop(); // remove the trailing blank item
        wordlists[wordlist].count = wordlists[wordlist].wordlist.length;

        loadCount++;
        if(loadCount == wordlistCount) {

          // all wordlists have been loaded, populate dropdown
          populateWordlistsDropdown();
          update();
        }
      }
    });
  });

  // populate the words dropdown, from 3 to 10
  for(var i = 3; i <= 10; i++) {
    var $option = $('<option />').val(i).html('' + i + ' words');
    if(i == 7) $option.attr('selected', 'selected');
    $('select.words').append($option);
  }

  // update each time options change
  function update() {
    generatePassphrase();

    // update the note
    var selectedWordlist = $('select.wordlists').val(),
      selectedWords = $('select.words').val(),
      wordlistCount = wordlists[selectedWordlist].count;

    // calculate entropy
    var bitsOfEntropy = Math.log2(wordlistCount) * selectedWords;

    // calculate average time to guess at 1 trillion guesses/sec
    var keyspace = Math.pow(wordlistCount, selectedWords);
    var guessesPerSecond = 1000000000;
    var seconds = (keyspace / 2) / guessesPerSecond;
    var years = seconds /  60 / 60 / 24 / 365;

    console.log('years: ' + years);

    var val, unit;
    if(years >= 1000000000000000) {
      val = years / 1000000000000000;
      unit = 'trillion years';
    } else if(years >= 1000000000000) {
      val = years / 1000000000000;
      unit = 'billion years';
    } else if(years >= 1000000000) {
      val = years / 1000000000;
      unit = 'million years';
    } else if(years >= 1000000) {
      val = years / 1000000;
      unit = 'thousand years';
    } else {
      val = years;
      unit = 'years';
    }

    $('.wordlist-description').html(
      wordlists[selectedWordlist].description + '<br/>' +
      Math.round(bitsOfEntropy * 100) / 100 + ' bits of entropy with ' + selectedWords + ' words in passphrase<br/>' +
      Math.round(val * 10) / 10 + ' ' + unit + ' average at one trillion guesses per second'
    );
  }
  $('select.wordlists').change(update);
  $('select.words').change(update);

  // generate a passphrase
  function generatePassphrase() {
    var selectedWordlist = $('select.wordlists').val(),
      selectedWords = $('select.words').val(),
      wordlistCount = wordlists[selectedWordlist].count;

      var random = new Random();
      var passphrase = '';
      for(var i = 0; i < selectedWords; i++) {
        passphrase += wordlists[selectedWordlist].wordlist[random.integer(0, wordlistCount - 1)];
        if(i < selectedWords - 1) { passphrase += ' '; }
      }

      $('.passphrase').html(passphrase);
  }

  $('.button-generate').click(generatePassphrase);
  $('.button-memorize').click(function(){
    var passphrase = $('.passphrase').html();
    Passphrases.tabMemorize();
    Passphrases.memorizeStart(passphrase);
  });

});
