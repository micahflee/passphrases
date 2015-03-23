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
      'description': 'English wordlist used for generating SecureDrop code names'
    },
    'english-diceware': {
      'name': 'English Diceware',
      'description': 'Original English Diceware wordlist'
    },
    'eowl': {
      'name': 'English Open Word List',
      'description': 'The English Open Word List. Copyright &copy; J Ross Beresford 1993-1999. All Rights Reserved.'
    },
    'catalan-diceware': {
      'name': 'Catalan Diceware',
      'description': 'Diccionari catal&agrave; per Marcel Hernandez - CC-BY 4.0'
    },
    'german-diceware': {
      'name': 'Deutsch Diceware',
      'description': 'Deutsch W&ouml;rterbuch, von Benjamin Tenne - GPL'
    },
    'french-diceware': {
      'name': 'Fran&ccedil;ais Diceware',
      'description': 'Dictionnaire fran&ccedil;ais par Matthieu Weber'
    },
    'italian-diceware': {
      'name': 'Italiano Diceware',
      'description': 'Lista di parole Diceware in Italiano by Tarin Gamberini - GPL'
    },
    'japanese-diceware': {
      'name': 'Japanese Diceware',
      'description': 'Japanese Diceware by Hiroshi Yuki &amp; J Greely - CC-BY-SA'
    },
    'dutch-diceware': {
      'name': 'Dutch Diceware',
      'description': 'Nederlands woordenboek door Bart Van den Eynde - GPL'
    },
    'polish-diceware': {
      'name': 'Polski Diceware',
      'description': 'Polski S&lstrok;ownik przez Piotr (DrFugazi) Tarnowski'
    },
    'swedish-diceware': {
      'name': 'Svensk Diceware',
      'description': 'Svensk ordbok av Magnus Bodin'
    },
    'Cornish-wiktionary': {
      'name': 'Cornish-wiktionary Wiktionary',
      'description': 'Cornish-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Cornish-wiktionary-short': {
      'name': 'Cornish-wiktionary-short Wiktionary',
      'description': 'Cornish-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'French-wiktionary': {
      'name': 'French-wiktionary Wiktionary',
      'description': 'French-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'French-wiktionary-short': {
      'name': 'French-wiktionary-short Wiktionary',
      'description': 'French-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Finnish-wiktionary': {
      'name': 'Finnish-wiktionary Wiktionary',
      'description': 'Finnish-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Finnish-wiktionary-short': {
      'name': 'Finnish-wiktionary-short Wiktionary',
      'description': 'Finnish-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Sundanese-wiktionary': {
      'name': 'Sundanese-wiktionary Wiktionary',
      'description': 'Sundanese-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Sundanese-wiktionary-short': {
      'name': 'Sundanese-wiktionary-short Wiktionary',
      'description': 'Sundanese-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Albanian-wiktionary': {
      'name': 'Albanian-wiktionary Wiktionary',
      'description': 'Albanian-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Albanian-wiktionary-short': {
      'name': 'Albanian-wiktionary-short Wiktionary',
      'description': 'Albanian-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Tagalog-wiktionary': {
      'name': 'Tagalog-wiktionary Wiktionary',
      'description': 'Tagalog-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Tagalog-wiktionary-short': {
      'name': 'Tagalog-wiktionary-short Wiktionary',
      'description': 'Tagalog-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Italian-wiktionary': {
      'name': 'Italian-wiktionary Wiktionary',
      'description': 'Italian-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Italian-wiktionary-short': {
      'name': 'Italian-wiktionary-short Wiktionary',
      'description': 'Italian-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Afrikaans-wiktionary': {
      'name': 'Afrikaans-wiktionary Wiktionary',
      'description': 'Afrikaans-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Afrikaans-wiktionary-short': {
      'name': 'Afrikaans-wiktionary-short Wiktionary',
      'description': 'Afrikaans-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Occitan-wiktionary': {
      'name': 'Occitan-wiktionary Wiktionary',
      'description': 'Occitan-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Occitan-wiktionary-short': {
      'name': 'Occitan-wiktionary-short Wiktionary',
      'description': 'Occitan-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    //'Volapük-wiktionary': {
    //  'name': 'Volapük-wiktionary Wiktionary',
    //  'description': 'Volapük-wiktionary Wiktionary Words -- CC BY-SA'
    //},
    //'Volapük-wiktionary-short': {
    //  'name': 'Volapük-wiktionary-short Wiktionary',
    //  'description': 'Volapük-wiktionary-short Wiktionary Words -- CC BY-SA'
    //},
    'Indonesian-wiktionary': {
      'name': 'Indonesian-wiktionary Wiktionary',
      'description': 'Indonesian-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Indonesian-wiktionary-short': {
      'name': 'Indonesian-wiktionary-short Wiktionary',
      'description': 'Indonesian-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Latin-wiktionary': {
      'name': 'Latin-wiktionary Wiktionary',
      'description': 'Latin-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Latin-wiktionary-short': {
      'name': 'Latin-wiktionary-short Wiktionary',
      'description': 'Latin-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Zulu-wiktionary': {
      'name': 'Zulu-wiktionary Wiktionary',
      'description': 'Zulu-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Zulu-wiktionary-short': {
      'name': 'Zulu-wiktionary-short Wiktionary',
      'description': 'Zulu-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Navajo-wiktionary': {
      'name': 'Navajo-wiktionary Wiktionary',
      'description': 'Navajo-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Navajo-wiktionary-short': {
      'name': 'Navajo-wiktionary-short Wiktionary',
      'description': 'Navajo-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Uzbek-wiktionary': {
      'name': 'Uzbek-wiktionary Wiktionary',
      'description': 'Uzbek-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Uzbek-wiktionary-short': {
      'name': 'Uzbek-wiktionary-short Wiktionary',
      'description': 'Uzbek-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Serbo-Croatian-wiktionary': {
      'name': 'Serbo-Croatian-wiktionary Wiktionary',
      'description': 'Serbo-Croatian-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Serbo-Croatian-wiktionary-short': {
      'name': 'Serbo-Croatian-wiktionary-short Wiktionary',
      'description': 'Serbo-Croatian-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Latvian-wiktionary': {
      'name': 'Latvian-wiktionary Wiktionary',
      'description': 'Latvian-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Latvian-wiktionary-short': {
      'name': 'Latvian-wiktionary-short Wiktionary',
      'description': 'Latvian-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'English-wiktionary': {
      'name': 'English-wiktionary Wiktionary',
      'description': 'English-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'English-wiktionary-short': {
      'name': 'English-wiktionary-short Wiktionary',
      'description': 'English-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Breton-wiktionary': {
      'name': 'Breton-wiktionary Wiktionary',
      'description': 'Breton-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Breton-wiktionary-short': {
      'name': 'Breton-wiktionary-short Wiktionary',
      'description': 'Breton-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Turkish-wiktionary': {
      'name': 'Turkish-wiktionary Wiktionary',
      'description': 'Turkish-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Turkish-wiktionary-short': {
      'name': 'Turkish-wiktionary-short Wiktionary',
      'description': 'Turkish-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Hungarian-wiktionary': {
      'name': 'Hungarian-wiktionary Wiktionary',
      'description': 'Hungarian-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Hungarian-wiktionary-short': {
      'name': 'Hungarian-wiktionary-short Wiktionary',
      'description': 'Hungarian-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Lithuanian-wiktionary': {
      'name': 'Lithuanian-wiktionary Wiktionary',
      'description': 'Lithuanian-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Lithuanian-wiktionary-short': {
      'name': 'Lithuanian-wiktionary-short Wiktionary',
      'description': 'Lithuanian-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Malay-wiktionary': {
      'name': 'Malay-wiktionary Wiktionary',
      'description': 'Malay-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Malay-wiktionary-short': {
      'name': 'Malay-wiktionary-short Wiktionary',
      'description': 'Malay-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'German-wiktionary': {
      'name': 'German-wiktionary Wiktionary',
      'description': 'German-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'German-wiktionary-short': {
      'name': 'German-wiktionary-short Wiktionary',
      'description': 'German-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Basque-wiktionary': {
      'name': 'Basque-wiktionary Wiktionary',
      'description': 'Basque-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Basque-wiktionary-short': {
      'name': 'Basque-wiktionary-short Wiktionary',
      'description': 'Basque-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Corsican-wiktionary': {
      'name': 'Corsican-wiktionary Wiktionary',
      'description': 'Corsican-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Corsican-wiktionary-short': {
      'name': 'Corsican-wiktionary-short Wiktionary',
      'description': 'Corsican-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Dutch-wiktionary': {
      'name': 'Dutch-wiktionary Wiktionary',
      'description': 'Dutch-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Dutch-wiktionary-short': {
      'name': 'Dutch-wiktionary-short Wiktionary',
      'description': 'Dutch-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Welsh-wiktionary': {
      'name': 'Welsh-wiktionary Wiktionary',
      'description': 'Welsh-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Welsh-wiktionary-short': {
      'name': 'Welsh-wiktionary-short Wiktionary',
      'description': 'Welsh-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Interlingua-wiktionary': {
      'name': 'Interlingua-wiktionary Wiktionary',
      'description': 'Interlingua-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Interlingua-wiktionary-short': {
      'name': 'Interlingua-wiktionary-short Wiktionary',
      'description': 'Interlingua-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Japanese-wiktionary': {
      'name': 'Japanese-wiktionary Wiktionary',
      'description': 'Japanese-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Japanese-wiktionary-short': {
      'name': 'Japanese-wiktionary-short Wiktionary',
      'description': 'Japanese-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Quechua-wiktionary': {
      'name': 'Quechua-wiktionary Wiktionary',
      'description': 'Quechua-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Quechua-wiktionary-short': {
      'name': 'Quechua-wiktionary-short Wiktionary',
      'description': 'Quechua-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Esperanto-wiktionary': {
      'name': 'Esperanto-wiktionary Wiktionary',
      'description': 'Esperanto-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Esperanto-wiktionary-short': {
      'name': 'Esperanto-wiktionary-short Wiktionary',
      'description': 'Esperanto-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Estonian-wiktionary': {
      'name': 'Estonian-wiktionary Wiktionary',
      'description': 'Estonian-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Estonian-wiktionary-short': {
      'name': 'Estonian-wiktionary-short Wiktionary',
      'description': 'Estonian-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Azeri-wiktionary': {
      'name': 'Azeri-wiktionary Wiktionary',
      'description': 'Azeri-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Azeri-wiktionary-short': {
      'name': 'Azeri-wiktionary-short Wiktionary',
      'description': 'Azeri-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Manx-wiktionary': {
      'name': 'Manx-wiktionary Wiktionary',
      'description': 'Manx-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Manx-wiktionary-short': {
      'name': 'Manx-wiktionary-short Wiktionary',
      'description': 'Manx-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Walloon-wiktionary': {
      'name': 'Walloon-wiktionary Wiktionary',
      'description': 'Walloon-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Walloon-wiktionary-short': {
      'name': 'Walloon-wiktionary-short Wiktionary',
      'description': 'Walloon-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Romansch-wiktionary': {
      'name': 'Romansch-wiktionary Wiktionary',
      'description': 'Romansch-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Romansch-wiktionary-short': {
      'name': 'Romansch-wiktionary-short Wiktionary',
      'description': 'Romansch-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Galician-wiktionary': {
      'name': 'Galician-wiktionary Wiktionary',
      'description': 'Galician-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Galician-wiktionary-short': {
      'name': 'Galician-wiktionary-short Wiktionary',
      'description': 'Galician-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Slovak-wiktionary': {
      'name': 'Slovak-wiktionary Wiktionary',
      'description': 'Slovak-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Slovak-wiktionary-short': {
      'name': 'Slovak-wiktionary-short Wiktionary',
      'description': 'Slovak-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Polish-wiktionary': {
      'name': 'Polish-wiktionary Wiktionary',
      'description': 'Polish-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Polish-wiktionary-short': {
      'name': 'Polish-wiktionary-short Wiktionary',
      'description': 'Polish-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Ewe-wiktionary': {
      'name': 'Ewe-wiktionary Wiktionary',
      'description': 'Ewe-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Ewe-wiktionary-short': {
      'name': 'Ewe-wiktionary-short Wiktionary',
      'description': 'Ewe-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Faroese-wiktionary': {
      'name': 'Faroese-wiktionary Wiktionary',
      'description': 'Faroese-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Faroese-wiktionary-short': {
      'name': 'Faroese-wiktionary-short Wiktionary',
      'description': 'Faroese-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Danish-wiktionary': {
      'name': 'Danish-wiktionary Wiktionary',
      'description': 'Danish-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Danish-wiktionary-short': {
      'name': 'Danish-wiktionary-short Wiktionary',
      'description': 'Danish-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Norwegian-wiktionary': {
      'name': 'Norwegian-wiktionary Wiktionary',
      'description': 'Norwegian-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Norwegian-wiktionary-short': {
      'name': 'Norwegian-wiktionary-short Wiktionary',
      'description': 'Norwegian-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Aragonese-wiktionary': {
      'name': 'Aragonese-wiktionary Wiktionary',
      'description': 'Aragonese-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Aragonese-wiktionary-short': {
      'name': 'Aragonese-wiktionary-short Wiktionary',
      'description': 'Aragonese-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Slovene-wiktionary': {
      'name': 'Slovene-wiktionary Wiktionary',
      'description': 'Slovene-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Slovene-wiktionary-short': {
      'name': 'Slovene-wiktionary-short Wiktionary',
      'description': 'Slovene-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Swahili-wiktionary': {
      'name': 'Swahili-wiktionary Wiktionary',
      'description': 'Swahili-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Swahili-wiktionary-short': {
      'name': 'Swahili-wiktionary-short Wiktionary',
      'description': 'Swahili-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Swedish-wiktionary': {
      'name': 'Swedish-wiktionary Wiktionary',
      'description': 'Swedish-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Swedish-wiktionary-short': {
      'name': 'Swedish-wiktionary-short Wiktionary',
      'description': 'Swedish-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Icelandic-wiktionary': {
      'name': 'Icelandic-wiktionary Wiktionary',
      'description': 'Icelandic-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Icelandic-wiktionary-short': {
      'name': 'Icelandic-wiktionary-short Wiktionary',
      'description': 'Icelandic-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Greenlandic-wiktionary': {
      'name': 'Greenlandic-wiktionary Wiktionary',
      'description': 'Greenlandic-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Greenlandic-wiktionary-short': {
      'name': 'Greenlandic-wiktionary-short Wiktionary',
      'description': 'Greenlandic-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Malagasy-wiktionary': {
      'name': 'Malagasy-wiktionary Wiktionary',
      'description': 'Malagasy-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Malagasy-wiktionary-short': {
      'name': 'Malagasy-wiktionary-short Wiktionary',
      'description': 'Malagasy-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Catalan-wiktionary': {
      'name': 'Catalan-wiktionary Wiktionary',
      'description': 'Catalan-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Catalan-wiktionary-short': {
      'name': 'Catalan-wiktionary-short Wiktionary',
      'description': 'Catalan-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Luxembourgish-wiktionary': {
      'name': 'Luxembourgish-wiktionary Wiktionary',
      'description': 'Luxembourgish-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Luxembourgish-wiktionary-short': {
      'name': 'Luxembourgish-wiktionary-short Wiktionary',
      'description': 'Luxembourgish-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Hausa-wiktionary': {
      'name': 'Hausa-wiktionary Wiktionary',
      'description': 'Hausa-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Hausa-wiktionary-short': {
      'name': 'Hausa-wiktionary-short Wiktionary',
      'description': 'Hausa-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Irish-wiktionary': {
      'name': 'Irish-wiktionary Wiktionary',
      'description': 'Irish-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Irish-wiktionary-short': {
      'name': 'Irish-wiktionary-short Wiktionary',
      'description': 'Irish-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Czech-wiktionary': {
      'name': 'Czech-wiktionary Wiktionary',
      'description': 'Czech-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Czech-wiktionary-short': {
      'name': 'Czech-wiktionary-short Wiktionary',
      'description': 'Czech-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Romanian-wiktionary': {
      'name': 'Romanian-wiktionary Wiktionary',
      'description': 'Romanian-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Romanian-wiktionary-short': {
      'name': 'Romanian-wiktionary-short Wiktionary',
      'description': 'Romanian-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Limburgish-wiktionary': {
      'name': 'Limburgish-wiktionary Wiktionary',
      'description': 'Limburgish-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Limburgish-wiktionary-short': {
      'name': 'Limburgish-wiktionary-short Wiktionary',
      'description': 'Limburgish-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Maltese-wiktionary': {
      'name': 'Maltese-wiktionary Wiktionary',
      'description': 'Maltese-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Maltese-wiktionary-short': {
      'name': 'Maltese-wiktionary-short Wiktionary',
      'description': 'Maltese-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Ojibwe-wiktionary': {
      'name': 'Ojibwe-wiktionary Wiktionary',
      'description': 'Ojibwe-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Ojibwe-wiktionary-short': {
      'name': 'Ojibwe-wiktionary-short Wiktionary',
      'description': 'Ojibwe-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Kurdish-wiktionary': {
      'name': 'Kurdish-wiktionary Wiktionary',
      'description': 'Kurdish-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Kurdish-wiktionary-short': {
      'name': 'Kurdish-wiktionary-short Wiktionary',
      'description': 'Kurdish-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Ido-wiktionary': {
      'name': 'Ido-wiktionary Wiktionary',
      'description': 'Ido-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Ido-wiktionary-short': {
      'name': 'Ido-wiktionary-short Wiktionary',
      'description': 'Ido-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Portuguese-wiktionary': {
      'name': 'Portuguese-wiktionary Wiktionary',
      'description': 'Portuguese-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Portuguese-wiktionary-short': {
      'name': 'Portuguese-wiktionary-short Wiktionary',
      'description': 'Portuguese-wiktionary-short Wiktionary Words -- CC BY-SA'
    },
    'Spanish-wiktionary': {
      'name': 'Spanish-wiktionary Wiktionary',
      'description': 'Spanish-wiktionary Wiktionary Words -- CC BY-SA'
    },
    'Spanish-wiktionary-short': {
      'name': 'Spanish-wiktionary-short Wiktionary',
      'description': 'Spanish-wiktionary-short Wiktionary Words -- CC BY-SA'
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
        // This is a security flaw
        //$('select.wordlists option[value="' + Passphrases.prefs.wordlist + '"]').prop('selected', true);
        //$('select.words option[value="' + Passphrases.prefs.words + '"]').prop('selected', true);

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

  // populate the word separator dropdown
  var $option = $('<option />').val(0).html('spaces');
  $option.attr('selected', 'selected');
  $('select.separator').append($option);
  var $option = $('<option />').val(1).html('numbers');
  $('select.separator').append($option);
  var $option = $('<option />').val(2).html('punctuation');
  $('select.separator').append($option);
  var $option = $('<option />').val(3).html('all');
  $('select.separator').append($option);

  // update each time options change
  function update() {
    // save option changes
    // This is a security flaw
    //Passphrases.prefs.wordlist = $('select.wordlists').val();
    //Passphrases.prefs.words = $('select.words').val();
    //Passphrases.savePrefs();

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
  $('select.separator').change(update);
  $("#use-upcase").on('click', function(){update()});

  // generate a passphrase
  function generatePassphrase() {
    // play dice roll sound effect
    Passphrases.playSound('generate');

    var selectedWordlist = $('select.wordlists').val(),
      selectedWords = $('select.words').val(),
      wordlistCount = wordlists[selectedWordlist].count;

      var specialChars ="!\"#$%&'()*+,-./:;<=>?@[\]^_`{|}~";
      var specialCharCount = specialChars.length;
      var numericChars = "0123456789";
      var numericCharCount = numericChars.length;

      var random = new Random();
      var passphrase = '';
      var sepChar = ' ';
      for (var i = 0; i < selectedWords; i++) {
        newWord = wordlists[selectedWordlist].wordlist[random.integer(0, wordlistCount - 1)].trim();
        if ($('#use-upcase:checked').val() == "on") {
          if (random.integer(0, 1) == 1) {
            newWord = newWord.charAt(0).toUpperCase() + newWord.substring(1);
          }
        }
        passphrase += newWord;
        if ($('select.separator').val() == 1) {
          sepChar = random.integer(0, 9).toString();
        }
        if ($('select.separator').val() == 2) {
          sepChar = specialChars[random.integer(0, specialCharCount-1)];
        }
        if ($('select.separator').val() == 3) {
          sepChar = (specialChars+numericChars)[random.integer(0, specialCharCount+numericCharCount-1)];
        }
        if(i < selectedWords - 1) { passphrase += sepChar; }
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
