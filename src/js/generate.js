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

var $ = require('jquery'),
  Random = require('random-js'),
  fs = require('fs');

$(function(){
  // load the wordlists
  var wordlists = {
    'securedrop': {
      'name': 'SecureDrop',
      'description': 'Wordlist used for generating SecureDrop code names'
    },
    'english-diceware': {
      'name': 'English Diceware',
      'description': 'Original English Diceware wordlist'
    },
    'catalan-diceware': {
      'name': 'Catalan Diceware',
      'description': 'Diccionari catal&agrave; per Marcel Hernandez CC-BY 4.0'
    },
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

    fs.readFile('wordlists/' + wordlist + '.wordlist', { encoding: 'utf8' }, function(err, data){
      if(err) {
        console.log('Error loading word list', err);
        return;
      }

      wordlists[wordlist].wordlist = data.split('\n');
      wordlists[wordlist].wordlist.pop(); // remove the trailing blank item
      wordlists[wordlist].count = wordlists[wordlist].wordlist.length;

      loadCount++;
      if(loadCount == wordlistCount) {
        // all wordlists have been loaded, populate dropdown
        populateWordlistsDropdown();

        // select wordlist and words from prefs
        $('select.wordlists option[value="' + Passphrases.prefs.wordlist + '"]').prop('selected', true);
        $('select.words option[value="' + Passphrases.prefs.words + '"]').prop('selected', true);

        // update the generate screen
        update();
      }
    })
  });

  // populate the words dropdown, from 3 to 10
  for(var i = 3; i <= 10; i++) {
    var $option = $('<option />').val(i).html('' + i + ' words');
    if(i == 7) $option.attr('selected', 'selected');
    $('select.words').append($option);
  }

  // update each time options change
  function update() {
    // save option changes
    Passphrases.prefs.wordlist = $('select.wordlists').val();
    Passphrases.prefs.words = $('select.words').val();
    Passphrases.savePrefs();

    // generate a new passphrase
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
    // play dice roll sound effect
    Passphrases.playSound('generate');

    var selectedWordlist = $('select.wordlists').val(),
      selectedWords = $('select.words').val(),
      wordlistCount = wordlists[selectedWordlist].count;

      var random = new Random();
      var passphrase = '';
      for(var i = 0; i < selectedWords; i++) {
        passphrase += wordlists[selectedWordlist].wordlist[random.integer(0, wordlistCount - 1)].trim();
        if(i < selectedWords - 1) { passphrase += ' '; }
      }

      $('.passphrase').text(passphrase);
  }

  $('.button-generate').click(generatePassphrase);
  $('.button-memorize').click(function(){
    var passphrase = $('.passphrase').text();
    Passphrases.tabMemorize();
    Passphrases.memorizeStart(passphrase);
  });

});
