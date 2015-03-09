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
          updateWordlistNote();
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

  // wordlist note
  function updateWordlistNote() {
    var selectedWordlist = $('select.wordlists').val(),
      selectedWords = $('select.words').val(),
      wordlistCount = wordlists[selectedWordlist].count;

    // calculate entropy
    var bitsOfEntropy = Math.log2(wordlistCount) * selectedWords;

    // calculate average time to guess at 1 trillion guesses/sec
    var keyspace = Math.pow(wordlistCount, selectedWords),
      guessesPerSecond = 1000000000,
      guessesPerYear = guessesPerSecond * 60 * 60 * 24 * 365,
      years = (keyspace / 2) / guessesPerYear,
      val, unit;
    if(years >= 1000000000000) {
      val = years / 1000000000000;
      unit = 'trillion years'
    } else if(years >= 1000000000) {
      val = years / 1000000000;
      unit = 'billion years'
    } else if(years >= 1000000) {
      val = years / 1000000;
      unit = 'million years'
    } else if(years >= 1000) {
      val = years / 1000;
      unit = 'thousand years'
    } else if(years >= 100) {
      val = years / 100;
      unit = 'hundred years'
    } else {
      val = years;
      unit = 'years'
    }

    $('.wordlist-description').html(
      wordlists[selectedWordlist].description + '<br/>' +
      Math.round(bitsOfEntropy * 100) / 100 + ' bits of entropy with ' + selectedWords + ' words in passphrase<br/>' +
      Math.round(val * 10) / 10 + ' ' + unit + ' average at one trillion guesses per second'
    );
  }

  $('select.wordlists').change(updateWordlistNote);
  $('select.words').change(updateWordlistNote);

});
