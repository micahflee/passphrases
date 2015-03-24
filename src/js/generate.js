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
    'abkhaz-wiktionary': {
      'name': 'Abkhaz Wiktionary',
      'description': 'Abkhaz Wiktionary Words -- CC BY-SA'
    },
    'abkhaz-wiktionary-short': {
      'name': 'Abkhaz Short-Word Wiktionary',
      'description': 'Abkhaz Wiktionary Words -- CC BY-SA'
    },
    'afrikaans-wiktionary': {
      'name': 'Afrikaans Wiktionary',
      'description': 'Afrikaans Wiktionary Words -- CC BY-SA'
    },
    'afrikaans-wiktionary-short': {
      'name': 'Afrikaans Short-Word Wiktionary',
      'description': 'Afrikaans Wiktionary Words -- CC BY-SA'
    },
    'albanian-wiktionary': {
      'name': 'Albanian Wiktionary',
      'description': 'Albanian Wiktionary Words -- CC BY-SA'
    },
    'albanian-wiktionary-short': {
      'name': 'Albanian Short-Word Wiktionary',
      'description': 'Albanian Wiktionary Words -- CC BY-SA'
    },
    'amharic-wiktionary': {
      'name': 'Amharic Wiktionary',
      'description': 'Amharic Wiktionary Words -- CC BY-SA'
    },
    'amharic-wiktionary-short': {
      'name': 'Amharic Short-Word Wiktionary',
      'description': 'Amharic Wiktionary Words -- CC BY-SA'
    },
    'arabic-wiktionary': {
      'name': 'Arabic Wiktionary',
      'description': 'Arabic Wiktionary Words -- CC BY-SA'
    },
    'arabic-wiktionary-short': {
      'name': 'Arabic Short-Word Wiktionary',
      'description': 'Arabic Wiktionary Words -- CC BY-SA'
    },
    'aragonese-wiktionary': {
      'name': 'Aragonese Wiktionary',
      'description': 'Aragonese Wiktionary Words -- CC BY-SA'
    },
    'aragonese-wiktionary-short': {
      'name': 'Aragonese Short-Word Wiktionary',
      'description': 'Aragonese Wiktionary Words -- CC BY-SA'
    },
    'armenian-wiktionary': {
      'name': 'Armenian Wiktionary',
      'description': 'Armenian Wiktionary Words -- CC BY-SA'
    },
    'armenian-wiktionary-short': {
      'name': 'Armenian Short-Word Wiktionary',
      'description': 'Armenian Wiktionary Words -- CC BY-SA'
    },
    'avar-wiktionary': {
      'name': 'Avar Wiktionary',
      'description': 'Avar Wiktionary Words -- CC BY-SA'
    },
    'avar-wiktionary-short': {
      'name': 'Avar Short-Word Wiktionary',
      'description': 'Avar Wiktionary Words -- CC BY-SA'
    },
    'azeri-wiktionary': {
      'name': 'Azeri Wiktionary',
      'description': 'Azeri Wiktionary Words -- CC BY-SA'
    },
    'azeri-wiktionary-short': {
      'name': 'Azeri Short-Word Wiktionary',
      'description': 'Azeri Wiktionary Words -- CC BY-SA'
    },
    'bashkir-wiktionary': {
      'name': 'Bashkir Wiktionary',
      'description': 'Bashkir Wiktionary Words -- CC BY-SA'
    },
    'bashkir-wiktionary-short': {
      'name': 'Bashkir Short-Word Wiktionary',
      'description': 'Bashkir Wiktionary Words -- CC BY-SA'
    },
    'basque-wiktionary': {
      'name': 'Basque Wiktionary',
      'description': 'Basque Wiktionary Words -- CC BY-SA'
    },
    'basque-wiktionary-short': {
      'name': 'Basque Short-Word Wiktionary',
      'description': 'Basque Wiktionary Words -- CC BY-SA'
    },
    'belarusian-wiktionary': {
      'name': 'Belarusian Wiktionary',
      'description': 'Belarusian Wiktionary Words -- CC BY-SA'
    },
    'belarusian-wiktionary-short': {
      'name': 'Belarusian Short-Word Wiktionary',
      'description': 'Belarusian Wiktionary Words -- CC BY-SA'
    },
    'bengali-wiktionary': {
      'name': 'Bengali Wiktionary',
      'description': 'Bengali Wiktionary Words -- CC BY-SA'
    },
    'bengali-wiktionary-short': {
      'name': 'Bengali Short-Word Wiktionary',
      'description': 'Bengali Wiktionary Words -- CC BY-SA'
    },
    'breton-wiktionary': {
      'name': 'Breton Wiktionary',
      'description': 'Breton Wiktionary Words -- CC BY-SA'
    },
    'breton-wiktionary-short': {
      'name': 'Breton Short-Word Wiktionary',
      'description': 'Breton Wiktionary Words -- CC BY-SA'
    },
    'bulgarian-wiktionary': {
      'name': 'Bulgarian Wiktionary',
      'description': 'Bulgarian Wiktionary Words -- CC BY-SA'
    },
    'bulgarian-wiktionary-short': {
      'name': 'Bulgarian Short-Word Wiktionary',
      'description': 'Bulgarian Wiktionary Words -- CC BY-SA'
    },
    'burmese-wiktionary': {
      'name': 'Burmese Wiktionary',
      'description': 'Burmese Wiktionary Words -- CC BY-SA'
    },
    'burmese-wiktionary-short': {
      'name': 'Burmese Short-Word Wiktionary',
      'description': 'Burmese Wiktionary Words -- CC BY-SA'
    },
    'catalan-wiktionary': {
      'name': 'Catalan Wiktionary',
      'description': 'Catalan Wiktionary Words -- CC BY-SA'
    },
    'catalan-wiktionary-short': {
      'name': 'Catalan Short-Word Wiktionary',
      'description': 'Catalan Wiktionary Words -- CC BY-SA'
    },
    'chechen-wiktionary': {
      'name': 'Chechen Wiktionary',
      'description': 'Chechen Wiktionary Words -- CC BY-SA'
    },
    'chechen-wiktionary-short': {
      'name': 'Chechen Short-Word Wiktionary',
      'description': 'Chechen Wiktionary Words -- CC BY-SA'
    },
    'chinese-wiktionary': {
      'name': 'Chinese Wiktionary',
      'description': 'Chinese Wiktionary Words -- CC BY-SA'
    },
    'chinese-wiktionary-short': {
      'name': 'Chinese Short-Word Wiktionary',
      'description': 'Chinese Wiktionary Words -- CC BY-SA'
    },
    'cornish-wiktionary': {
      'name': 'Cornish Wiktionary',
      'description': 'Cornish Wiktionary Words -- CC BY-SA'
    },
    'cornish-wiktionary-short': {
      'name': 'Cornish Short-Word Wiktionary',
      'description': 'Cornish Wiktionary Words -- CC BY-SA'
    },
    'corsican-wiktionary': {
      'name': 'Corsican Wiktionary',
      'description': 'Corsican Wiktionary Words -- CC BY-SA'
    },
    'corsican-wiktionary-short': {
      'name': 'Corsican Short-Word Wiktionary',
      'description': 'Corsican Wiktionary Words -- CC BY-SA'
    },
    'czech-wiktionary': {
      'name': 'Czech Wiktionary',
      'description': 'Czech Wiktionary Words -- CC BY-SA'
    },
    'czech-wiktionary-short': {
      'name': 'Czech Short-Word Wiktionary',
      'description': 'Czech Wiktionary Words -- CC BY-SA'
    },
    'danish-wiktionary': {
      'name': 'Danish Wiktionary',
      'description': 'Danish Wiktionary Words -- CC BY-SA'
    },
    'danish-wiktionary-short': {
      'name': 'Danish Short-Word Wiktionary',
      'description': 'Danish Wiktionary Words -- CC BY-SA'
    },
    'dutch-wiktionary': {
      'name': 'Dutch Wiktionary',
      'description': 'Dutch Wiktionary Words -- CC BY-SA'
    },
    'dutch-wiktionary-short': {
      'name': 'Dutch Short-Word Wiktionary',
      'description': 'Dutch Wiktionary Words -- CC BY-SA'
    },
    'english-wiktionary': {
      'name': 'English Wiktionary',
      'description': 'English Wiktionary Words -- CC BY-SA'
    },
    'english-wiktionary-short': {
      'name': 'English Short-Word Wiktionary',
      'description': 'English Wiktionary Words -- CC BY-SA'
    },
    'esperanto-wiktionary': {
      'name': 'Esperanto Wiktionary',
      'description': 'Esperanto Wiktionary Words -- CC BY-SA'
    },
    'esperanto-wiktionary-short': {
      'name': 'Esperanto Short-Word Wiktionary',
      'description': 'Esperanto Wiktionary Words -- CC BY-SA'
    },
    'estonian-wiktionary': {
      'name': 'Estonian Wiktionary',
      'description': 'Estonian Wiktionary Words -- CC BY-SA'
    },
    'estonian-wiktionary-short': {
      'name': 'Estonian Short-Word Wiktionary',
      'description': 'Estonian Wiktionary Words -- CC BY-SA'
    },
    'ewe-wiktionary': {
      'name': 'Ewe Wiktionary',
      'description': 'Ewe Wiktionary Words -- CC BY-SA'
    },
    'ewe-wiktionary-short': {
      'name': 'Ewe Short-Word Wiktionary',
      'description': 'Ewe Wiktionary Words -- CC BY-SA'
    },
    'faroese-wiktionary': {
      'name': 'Faroese Wiktionary',
      'description': 'Faroese Wiktionary Words -- CC BY-SA'
    },
    'faroese-wiktionary-short': {
      'name': 'Faroese Short-Word Wiktionary',
      'description': 'Faroese Wiktionary Words -- CC BY-SA'
    },
    'finnish-wiktionary': {
      'name': 'Finnish Wiktionary',
      'description': 'Finnish Wiktionary Words -- CC BY-SA'
    },
    'finnish-wiktionary-short': {
      'name': 'Finnish Short-Word Wiktionary',
      'description': 'Finnish Wiktionary Words -- CC BY-SA'
    },
    'french-wiktionary': {
      'name': 'French Wiktionary',
      'description': 'French Wiktionary Words -- CC BY-SA'
    },
    'french-wiktionary-short': {
      'name': 'French Short-Word Wiktionary',
      'description': 'French Wiktionary Words -- CC BY-SA'
    },
    'galician-wiktionary': {
      'name': 'Galician Wiktionary',
      'description': 'Galician Wiktionary Words -- CC BY-SA'
    },
    'galician-wiktionary-short': {
      'name': 'Galician Short-Word Wiktionary',
      'description': 'Galician Wiktionary Words -- CC BY-SA'
    },
    'georgian-wiktionary': {
      'name': 'Georgian Wiktionary',
      'description': 'Georgian Wiktionary Words -- CC BY-SA'
    },
    'georgian-wiktionary-short': {
      'name': 'Georgian Short-Word Wiktionary',
      'description': 'Georgian Wiktionary Words -- CC BY-SA'
    },
    'german-wiktionary': {
      'name': 'German Wiktionary',
      'description': 'German Wiktionary Words -- CC BY-SA'
    },
    'german-wiktionary-short': {
      'name': 'German Short-Word Wiktionary',
      'description': 'German Wiktionary Words -- CC BY-SA'
    },
    'greek-wiktionary': {
      'name': 'Greek Wiktionary',
      'description': 'Greek Wiktionary Words -- CC BY-SA'
    },
    'greek-wiktionary-short': {
      'name': 'Greek Short-Word Wiktionary',
      'description': 'Greek Wiktionary Words -- CC BY-SA'
    },
    'greenlandic-wiktionary': {
      'name': 'Greenlandic Wiktionary',
      'description': 'Greenlandic Wiktionary Words -- CC BY-SA'
    },
    'greenlandic-wiktionary-short': {
      'name': 'Greenlandic Short-Word Wiktionary',
      'description': 'Greenlandic Wiktionary Words -- CC BY-SA'
    },
    'gujarati-wiktionary': {
      'name': 'Gujarati Wiktionary',
      'description': 'Gujarati Wiktionary Words -- CC BY-SA'
    },
    'gujarati-wiktionary-short': {
      'name': 'Gujarati Short-Word Wiktionary',
      'description': 'Gujarati Wiktionary Words -- CC BY-SA'
    },
    'hausa-wiktionary': {
      'name': 'Hausa Wiktionary',
      'description': 'Hausa Wiktionary Words -- CC BY-SA'
    },
    'hausa-wiktionary-short': {
      'name': 'Hausa Short-Word Wiktionary',
      'description': 'Hausa Wiktionary Words -- CC BY-SA'
    },
    'hebrew-wiktionary': {
      'name': 'Hebrew Wiktionary',
      'description': 'Hebrew Wiktionary Words -- CC BY-SA'
    },
    'hebrew-wiktionary-short': {
      'name': 'Hebrew Short-Word Wiktionary',
      'description': 'Hebrew Wiktionary Words -- CC BY-SA'
    },
    'hindi-wiktionary': {
      'name': 'Hindi Wiktionary',
      'description': 'Hindi Wiktionary Words -- CC BY-SA'
    },
    'hindi-wiktionary-short': {
      'name': 'Hindi Short-Word Wiktionary',
      'description': 'Hindi Wiktionary Words -- CC BY-SA'
    },
    'hungarian-wiktionary': {
      'name': 'Hungarian Wiktionary',
      'description': 'Hungarian Wiktionary Words -- CC BY-SA'
    },
    'hungarian-wiktionary-short': {
      'name': 'Hungarian Short-Word Wiktionary',
      'description': 'Hungarian Wiktionary Words -- CC BY-SA'
    },
    'icelandic-wiktionary': {
      'name': 'Icelandic Wiktionary',
      'description': 'Icelandic Wiktionary Words -- CC BY-SA'
    },
    'icelandic-wiktionary-short': {
      'name': 'Icelandic Short-Word Wiktionary',
      'description': 'Icelandic Wiktionary Words -- CC BY-SA'
    },
    'ido-wiktionary': {
      'name': 'Ido Wiktionary',
      'description': 'Ido Wiktionary Words -- CC BY-SA'
    },
    'ido-wiktionary-short': {
      'name': 'Ido Short-Word Wiktionary',
      'description': 'Ido Wiktionary Words -- CC BY-SA'
    },
    'indonesian-wiktionary': {
      'name': 'Indonesian Wiktionary',
      'description': 'Indonesian Wiktionary Words -- CC BY-SA'
    },
    'indonesian-wiktionary-short': {
      'name': 'Indonesian Short-Word Wiktionary',
      'description': 'Indonesian Wiktionary Words -- CC BY-SA'
    },
    'interlingua-wiktionary': {
      'name': 'Interlingua Wiktionary',
      'description': 'Interlingua Wiktionary Words -- CC BY-SA'
    },
    'interlingua-wiktionary-short': {
      'name': 'Interlingua Short-Word Wiktionary',
      'description': 'Interlingua Wiktionary Words -- CC BY-SA'
    },
    'inuktitut-wiktionary': {
      'name': 'Inuktitut Wiktionary',
      'description': 'Inuktitut Wiktionary Words -- CC BY-SA'
    },
    'inuktitut-wiktionary-short': {
      'name': 'Inuktitut Short-Word Wiktionary',
      'description': 'Inuktitut Wiktionary Words -- CC BY-SA'
    },
    'irish-wiktionary': {
      'name': 'Irish Wiktionary',
      'description': 'Irish Wiktionary Words -- CC BY-SA'
    },
    'irish-wiktionary-short': {
      'name': 'Irish Short-Word Wiktionary',
      'description': 'Irish Wiktionary Words -- CC BY-SA'
    },
    'italian-wiktionary': {
      'name': 'Italian Wiktionary',
      'description': 'Italian Wiktionary Words -- CC BY-SA'
    },
    'italian-wiktionary-short': {
      'name': 'Italian Short-Word Wiktionary',
      'description': 'Italian Wiktionary Words -- CC BY-SA'
    },
    'japanese-wiktionary': {
      'name': 'Japanese Wiktionary',
      'description': 'Japanese Wiktionary Words -- CC BY-SA'
    },
    'japanese-wiktionary-short': {
      'name': 'Japanese Short-Word Wiktionary',
      'description': 'Japanese Wiktionary Words -- CC BY-SA'
    },
    'kannada-wiktionary': {
      'name': 'Kannada Wiktionary',
      'description': 'Kannada Wiktionary Words -- CC BY-SA'
    },
    'kannada-wiktionary-short': {
      'name': 'Kannada Short-Word Wiktionary',
      'description': 'Kannada Wiktionary Words -- CC BY-SA'
    },
    'kazakh-wiktionary': {
      'name': 'Kazakh Wiktionary',
      'description': 'Kazakh Wiktionary Words -- CC BY-SA'
    },
    'kazakh-wiktionary-short': {
      'name': 'Kazakh Short-Word Wiktionary',
      'description': 'Kazakh Wiktionary Words -- CC BY-SA'
    },
    'khmer-wiktionary': {
      'name': 'Khmer Wiktionary',
      'description': 'Khmer Wiktionary Words -- CC BY-SA'
    },
    'khmer-wiktionary-short': {
      'name': 'Khmer Short-Word Wiktionary',
      'description': 'Khmer Wiktionary Words -- CC BY-SA'
    },
    'korean-wiktionary': {
      'name': 'Korean Wiktionary',
      'description': 'Korean Wiktionary Words -- CC BY-SA'
    },
    'korean-wiktionary-short': {
      'name': 'Korean Short-Word Wiktionary',
      'description': 'Korean Wiktionary Words -- CC BY-SA'
    },
    'kurdish-wiktionary': {
      'name': 'Kurdish Wiktionary',
      'description': 'Kurdish Wiktionary Words -- CC BY-SA'
    },
    'kurdish-wiktionary-short': {
      'name': 'Kurdish Short-Word Wiktionary',
      'description': 'Kurdish Wiktionary Words -- CC BY-SA'
    },
    'kyrgyz-wiktionary': {
      'name': 'Kyrgyz Wiktionary',
      'description': 'Kyrgyz Wiktionary Words -- CC BY-SA'
    },
    'kyrgyz-wiktionary-short': {
      'name': 'Kyrgyz Short-Word Wiktionary',
      'description': 'Kyrgyz Wiktionary Words -- CC BY-SA'
    },
    'lao-wiktionary': {
      'name': 'Lao Wiktionary',
      'description': 'Lao Wiktionary Words -- CC BY-SA'
    },
    'lao-wiktionary-short': {
      'name': 'Lao Short-Word Wiktionary',
      'description': 'Lao Wiktionary Words -- CC BY-SA'
    },
    'latin-wiktionary': {
      'name': 'Latin Wiktionary',
      'description': 'Latin Wiktionary Words -- CC BY-SA'
    },
    'latin-wiktionary-short': {
      'name': 'Latin Short-Word Wiktionary',
      'description': 'Latin Wiktionary Words -- CC BY-SA'
    },
    'latvian-wiktionary': {
      'name': 'Latvian Wiktionary',
      'description': 'Latvian Wiktionary Words -- CC BY-SA'
    },
    'latvian-wiktionary-short': {
      'name': 'Latvian Short-Word Wiktionary',
      'description': 'Latvian Wiktionary Words -- CC BY-SA'
    },
    'limburgish-wiktionary': {
      'name': 'Limburgish Wiktionary',
      'description': 'Limburgish Wiktionary Words -- CC BY-SA'
    },
    'limburgish-wiktionary-short': {
      'name': 'Limburgish Short-Word Wiktionary',
      'description': 'Limburgish Wiktionary Words -- CC BY-SA'
    },
    'lithuanian-wiktionary': {
      'name': 'Lithuanian Wiktionary',
      'description': 'Lithuanian Wiktionary Words -- CC BY-SA'
    },
    'lithuanian-wiktionary-short': {
      'name': 'Lithuanian Short-Word Wiktionary',
      'description': 'Lithuanian Wiktionary Words -- CC BY-SA'
    },
    'luxembourgish-wiktionary': {
      'name': 'Luxembourgish Wiktionary',
      'description': 'Luxembourgish Wiktionary Words -- CC BY-SA'
    },
    'luxembourgish-wiktionary-short': {
      'name': 'Luxembourgish Short-Word Wiktionary',
      'description': 'Luxembourgish Wiktionary Words -- CC BY-SA'
    },
    'macedonian-wiktionary': {
      'name': 'Macedonian Wiktionary',
      'description': 'Macedonian Wiktionary Words -- CC BY-SA'
    },
    'macedonian-wiktionary-short': {
      'name': 'Macedonian Short-Word Wiktionary',
      'description': 'Macedonian Wiktionary Words -- CC BY-SA'
    },
    'malagasy-wiktionary': {
      'name': 'Malagasy Wiktionary',
      'description': 'Malagasy Wiktionary Words -- CC BY-SA'
    },
    'malagasy-wiktionary-short': {
      'name': 'Malagasy Short-Word Wiktionary',
      'description': 'Malagasy Wiktionary Words -- CC BY-SA'
    },
    'malay-wiktionary': {
      'name': 'Malay Wiktionary',
      'description': 'Malay Wiktionary Words -- CC BY-SA'
    },
    'malay-wiktionary-short': {
      'name': 'Malay Short-Word Wiktionary',
      'description': 'Malay Wiktionary Words -- CC BY-SA'
    },
    'malayalam-wiktionary': {
      'name': 'Malayalam Wiktionary',
      'description': 'Malayalam Wiktionary Words -- CC BY-SA'
    },
    'malayalam-wiktionary-short': {
      'name': 'Malayalam Short-Word Wiktionary',
      'description': 'Malayalam Wiktionary Words -- CC BY-SA'
    },
    'maltese-wiktionary': {
      'name': 'Maltese Wiktionary',
      'description': 'Maltese Wiktionary Words -- CC BY-SA'
    },
    'maltese-wiktionary-short': {
      'name': 'Maltese Short-Word Wiktionary',
      'description': 'Maltese Wiktionary Words -- CC BY-SA'
    },
    'manx-wiktionary': {
      'name': 'Manx Wiktionary',
      'description': 'Manx Wiktionary Words -- CC BY-SA'
    },
    'manx-wiktionary-short': {
      'name': 'Manx Short-Word Wiktionary',
      'description': 'Manx Wiktionary Words -- CC BY-SA'
    },
    'maori-wiktionary': {
      'name': 'Maori Wiktionary',
      'description': 'Maori Wiktionary Words -- CC BY-SA'
    },
    'maori-wiktionary-short': {
      'name': 'Maori Short-Word Wiktionary',
      'description': 'Maori Wiktionary Words -- CC BY-SA'
    },
    'marathi-wiktionary': {
      'name': 'Marathi Wiktionary',
      'description': 'Marathi Wiktionary Words -- CC BY-SA'
    },
    'marathi-wiktionary-short': {
      'name': 'Marathi Short-Word Wiktionary',
      'description': 'Marathi Wiktionary Words -- CC BY-SA'
    },
    'marshallese-wiktionary': {
      'name': 'Marshallese Wiktionary',
      'description': 'Marshallese Wiktionary Words -- CC BY-SA'
    },
    'marshallese-wiktionary-short': {
      'name': 'Marshallese Short-Word Wiktionary',
      'description': 'Marshallese Wiktionary Words -- CC BY-SA'
    },
    'mongolian-wiktionary': {
      'name': 'Mongolian Wiktionary',
      'description': 'Mongolian Wiktionary Words -- CC BY-SA'
    },
    'mongolian-wiktionary-short': {
      'name': 'Mongolian Short-Word Wiktionary',
      'description': 'Mongolian Wiktionary Words -- CC BY-SA'
    },
    'navajo-wiktionary': {
      'name': 'Navajo Wiktionary',
      'description': 'Navajo Wiktionary Words -- CC BY-SA'
    },
    'navajo-wiktionary-short': {
      'name': 'Navajo Short-Word Wiktionary',
      'description': 'Navajo Wiktionary Words -- CC BY-SA'
    },
    'norwegian-wiktionary': {
      'name': 'Norwegian Wiktionary',
      'description': 'Norwegian Wiktionary Words -- CC BY-SA'
    },
    'norwegian-wiktionary-short': {
      'name': 'Norwegian Short-Word Wiktionary',
      'description': 'Norwegian Wiktionary Words -- CC BY-SA'
    },
    'occitan-wiktionary': {
      'name': 'Occitan Wiktionary',
      'description': 'Occitan Wiktionary Words -- CC BY-SA'
    },
    'occitan-wiktionary-short': {
      'name': 'Occitan Short-Word Wiktionary',
      'description': 'Occitan Wiktionary Words -- CC BY-SA'
    },
    'ojibwe-wiktionary': {
      'name': 'Ojibwe Wiktionary',
      'description': 'Ojibwe Wiktionary Words -- CC BY-SA'
    },
    'ojibwe-wiktionary-short': {
      'name': 'Ojibwe Short-Word Wiktionary',
      'description': 'Ojibwe Wiktionary Words -- CC BY-SA'
    },
    'ossetian-wiktionary': {
      'name': 'Ossetian Wiktionary',
      'description': 'Ossetian Wiktionary Words -- CC BY-SA'
    },
    'ossetian-wiktionary-short': {
      'name': 'Ossetian Short-Word Wiktionary',
      'description': 'Ossetian Wiktionary Words -- CC BY-SA'
    },
    'pashto-wiktionary': {
      'name': 'Pashto Wiktionary',
      'description': 'Pashto Wiktionary Words -- CC BY-SA'
    },
    'pashto-wiktionary-short': {
      'name': 'Pashto Short-Word Wiktionary',
      'description': 'Pashto Wiktionary Words -- CC BY-SA'
    },
    'persian-wiktionary': {
      'name': 'Persian Wiktionary',
      'description': 'Persian Wiktionary Words -- CC BY-SA'
    },
    'persian-wiktionary-short': {
      'name': 'Persian Short-Word Wiktionary',
      'description': 'Persian Wiktionary Words -- CC BY-SA'
    },
    'polish-wiktionary': {
      'name': 'Polish Wiktionary',
      'description': 'Polish Wiktionary Words -- CC BY-SA'
    },
    'polish-wiktionary-short': {
      'name': 'Polish Short-Word Wiktionary',
      'description': 'Polish Wiktionary Words -- CC BY-SA'
    },
    'portuguese-wiktionary': {
      'name': 'Portuguese Wiktionary',
      'description': 'Portuguese Wiktionary Words -- CC BY-SA'
    },
    'portuguese-wiktionary-short': {
      'name': 'Portuguese Short-Word Wiktionary',
      'description': 'Portuguese Wiktionary Words -- CC BY-SA'
    },
    'punjabi-wiktionary': {
      'name': 'Punjabi Wiktionary',
      'description': 'Punjabi Wiktionary Words -- CC BY-SA'
    },
    'punjabi-wiktionary-short': {
      'name': 'Punjabi Short-Word Wiktionary',
      'description': 'Punjabi Wiktionary Words -- CC BY-SA'
    },
    'quechua-wiktionary': {
      'name': 'Quechua Wiktionary',
      'description': 'Quechua Wiktionary Words -- CC BY-SA'
    },
    'quechua-wiktionary-short': {
      'name': 'Quechua Short-Word Wiktionary',
      'description': 'Quechua Wiktionary Words -- CC BY-SA'
    },
    'romanian-wiktionary': {
      'name': 'Romanian Wiktionary',
      'description': 'Romanian Wiktionary Words -- CC BY-SA'
    },
    'romanian-wiktionary-short': {
      'name': 'Romanian Short-Word Wiktionary',
      'description': 'Romanian Wiktionary Words -- CC BY-SA'
    },
    'romansch-wiktionary': {
      'name': 'Romansch Wiktionary',
      'description': 'Romansch Wiktionary Words -- CC BY-SA'
    },
    'romansch-wiktionary-short': {
      'name': 'Romansch Short-Word Wiktionary',
      'description': 'Romansch Wiktionary Words -- CC BY-SA'
    },
    'russian-wiktionary': {
      'name': 'Russian Wiktionary',
      'description': 'Russian Wiktionary Words -- CC BY-SA'
    },
    'russian-wiktionary-short': {
      'name': 'Russian Short-Word Wiktionary',
      'description': 'Russian Wiktionary Words -- CC BY-SA'
    },
    'sanskrit-wiktionary': {
      'name': 'Sanskrit Wiktionary',
      'description': 'Sanskrit Wiktionary Words -- CC BY-SA'
    },
    'sanskrit-wiktionary-short': {
      'name': 'Sanskrit Short-Word Wiktionary',
      'description': 'Sanskrit Wiktionary Words -- CC BY-SA'
    },
    'serbo-croatian-wiktionary': {
      'name': 'Serbo-Croatian Wiktionary',
      'description': 'Serbo-Croatian Wiktionary Words -- CC BY-SA'
    },
    'serbo-croatian-wiktionary-short': {
      'name': 'Serbo-Croatian Short-Word Wiktionary',
      'description': 'Serbo-Croatian Wiktionary Words -- CC BY-SA'
    },
    'sinhalese-wiktionary': {
      'name': 'Sinhalese Wiktionary',
      'description': 'Sinhalese Wiktionary Words -- CC BY-SA'
    },
    'sinhalese-wiktionary-short': {
      'name': 'Sinhalese Short-Word Wiktionary',
      'description': 'Sinhalese Wiktionary Words -- CC BY-SA'
    },
    'slovak-wiktionary': {
      'name': 'Slovak Wiktionary',
      'description': 'Slovak Wiktionary Words -- CC BY-SA'
    },
    'slovak-wiktionary-short': {
      'name': 'Slovak Short-Word Wiktionary',
      'description': 'Slovak Wiktionary Words -- CC BY-SA'
    },
    'slovene-wiktionary': {
      'name': 'Slovene Wiktionary',
      'description': 'Slovene Wiktionary Words -- CC BY-SA'
    },
    'slovene-wiktionary-short': {
      'name': 'Slovene Short-Word Wiktionary',
      'description': 'Slovene Wiktionary Words -- CC BY-SA'
    },
    'spanish-wiktionary': {
      'name': 'Spanish Wiktionary',
      'description': 'Spanish Wiktionary Words -- CC BY-SA'
    },
    'spanish-wiktionary-short': {
      'name': 'Spanish Short-Word Wiktionary',
      'description': 'Spanish Wiktionary Words -- CC BY-SA'
    },
    'sundanese-wiktionary': {
      'name': 'Sundanese Wiktionary',
      'description': 'Sundanese Wiktionary Words -- CC BY-SA'
    },
    'sundanese-wiktionary-short': {
      'name': 'Sundanese Short-Word Wiktionary',
      'description': 'Sundanese Wiktionary Words -- CC BY-SA'
    },
    'swahili-wiktionary': {
      'name': 'Swahili Wiktionary',
      'description': 'Swahili Wiktionary Words -- CC BY-SA'
    },
    'swahili-wiktionary-short': {
      'name': 'Swahili Short-Word Wiktionary',
      'description': 'Swahili Wiktionary Words -- CC BY-SA'
    },
    'swedish-wiktionary': {
      'name': 'Swedish Wiktionary',
      'description': 'Swedish Wiktionary Words -- CC BY-SA'
    },
    'swedish-wiktionary-short': {
      'name': 'Swedish Short-Word Wiktionary',
      'description': 'Swedish Wiktionary Words -- CC BY-SA'
    },
    'tagalog-wiktionary': {
      'name': 'Tagalog Wiktionary',
      'description': 'Tagalog Wiktionary Words -- CC BY-SA'
    },
    'tagalog-wiktionary-short': {
      'name': 'Tagalog Short-Word Wiktionary',
      'description': 'Tagalog Wiktionary Words -- CC BY-SA'
    },
    'tahitian-wiktionary': {
      'name': 'Tahitian Wiktionary',
      'description': 'Tahitian Wiktionary Words -- CC BY-SA'
    },
    'tahitian-wiktionary-short': {
      'name': 'Tahitian Short-Word Wiktionary',
      'description': 'Tahitian Wiktionary Words -- CC BY-SA'
    },
    'tajik-wiktionary': {
      'name': 'Tajik Wiktionary',
      'description': 'Tajik Wiktionary Words -- CC BY-SA'
    },
    'tajik-wiktionary-short': {
      'name': 'Tajik Short-Word Wiktionary',
      'description': 'Tajik Wiktionary Words -- CC BY-SA'
    },
    'tamil-wiktionary': {
      'name': 'Tamil Wiktionary',
      'description': 'Tamil Wiktionary Words -- CC BY-SA'
    },
    'tamil-wiktionary-short': {
      'name': 'Tamil Short-Word Wiktionary',
      'description': 'Tamil Wiktionary Words -- CC BY-SA'
    },
    'tatar-wiktionary': {
      'name': 'Tatar Wiktionary',
      'description': 'Tatar Wiktionary Words -- CC BY-SA'
    },
    'tatar-wiktionary-short': {
      'name': 'Tatar Short-Word Wiktionary',
      'description': 'Tatar Wiktionary Words -- CC BY-SA'
    },
    'telugu-wiktionary': {
      'name': 'Telugu Wiktionary',
      'description': 'Telugu Wiktionary Words -- CC BY-SA'
    },
    'telugu-wiktionary-short': {
      'name': 'Telugu Short-Word Wiktionary',
      'description': 'Telugu Wiktionary Words -- CC BY-SA'
    },
    'thai-wiktionary': {
      'name': 'Thai Wiktionary',
      'description': 'Thai Wiktionary Words -- CC BY-SA'
    },
    'thai-wiktionary-short': {
      'name': 'Thai Short-Word Wiktionary',
      'description': 'Thai Wiktionary Words -- CC BY-SA'
    },
    'tibetan-wiktionary': {
      'name': 'Tibetan Wiktionary',
      'description': 'Tibetan Wiktionary Words -- CC BY-SA'
    },
    'tibetan-wiktionary-short': {
      'name': 'Tibetan Short-Word Wiktionary',
      'description': 'Tibetan Wiktionary Words -- CC BY-SA'
    },
    'tigrinya-wiktionary': {
      'name': 'Tigrinya Wiktionary',
      'description': 'Tigrinya Wiktionary Words -- CC BY-SA'
    },
    'tigrinya-wiktionary-short': {
      'name': 'Tigrinya Short-Word Wiktionary',
      'description': 'Tigrinya Wiktionary Words -- CC BY-SA'
    },
    'turkish-wiktionary': {
      'name': 'Turkish Wiktionary',
      'description': 'Turkish Wiktionary Words -- CC BY-SA'
    },
    'turkish-wiktionary-short': {
      'name': 'Turkish Short-Word Wiktionary',
      'description': 'Turkish Wiktionary Words -- CC BY-SA'
    },
    'turkmen-wiktionary': {
      'name': 'Turkmen Wiktionary',
      'description': 'Turkmen Wiktionary Words -- CC BY-SA'
    },
    'turkmen-wiktionary-short': {
      'name': 'Turkmen Short-Word Wiktionary',
      'description': 'Turkmen Wiktionary Words -- CC BY-SA'
    },
    'ukrainian-wiktionary': {
      'name': 'Ukrainian Wiktionary',
      'description': 'Ukrainian Wiktionary Words -- CC BY-SA'
    },
    'ukrainian-wiktionary-short': {
      'name': 'Ukrainian Short-Word Wiktionary',
      'description': 'Ukrainian Wiktionary Words -- CC BY-SA'
    },
    'urdu-wiktionary': {
      'name': 'Urdu Wiktionary',
      'description': 'Urdu Wiktionary Words -- CC BY-SA'
    },
    'urdu-wiktionary-short': {
      'name': 'Urdu Short-Word Wiktionary',
      'description': 'Urdu Wiktionary Words -- CC BY-SA'
    },
    'uyghur-wiktionary': {
      'name': 'Uyghur Wiktionary',
      'description': 'Uyghur Wiktionary Words -- CC BY-SA'
    },
    'uyghur-wiktionary-short': {
      'name': 'Uyghur Short-Word Wiktionary',
      'description': 'Uyghur Wiktionary Words -- CC BY-SA'
    },
    'uzbek-wiktionary': {
      'name': 'Uzbek Wiktionary',
      'description': 'Uzbek Wiktionary Words -- CC BY-SA'
    },
    'uzbek-wiktionary-short': {
      'name': 'Uzbek Short-Word Wiktionary',
      'description': 'Uzbek Wiktionary Words -- CC BY-SA'
    },
    'vietnamese-wiktionary': {
      'name': 'Vietnamese Wiktionary',
      'description': 'Vietnamese Wiktionary Words -- CC BY-SA'
    },
    'vietnamese-wiktionary-short': {
      'name': 'Vietnamese Short-Word Wiktionary',
      'description': 'Vietnamese Wiktionary Words -- CC BY-SA'
    },
    'walloon-wiktionary': {
      'name': 'Walloon Wiktionary',
      'description': 'Walloon Wiktionary Words -- CC BY-SA'
    },
    'walloon-wiktionary-short': {
      'name': 'Walloon Short-Word Wiktionary',
      'description': 'Walloon Wiktionary Words -- CC BY-SA'
    },
    'welsh-wiktionary': {
      'name': 'Welsh Wiktionary',
      'description': 'Welsh Wiktionary Words -- CC BY-SA'
    },
    'welsh-wiktionary-short': {
      'name': 'Welsh Short-Word Wiktionary',
      'description': 'Welsh Wiktionary Words -- CC BY-SA'
    },
    'yiddish-wiktionary': {
      'name': 'Yiddish Wiktionary',
      'description': 'Yiddish Wiktionary Words -- CC BY-SA'
    },
    'yiddish-wiktionary-short': {
      'name': 'Yiddish Short-Word Wiktionary',
      'description': 'Yiddish Wiktionary Words -- CC BY-SA'
    },
    'yoruba-wiktionary': {
      'name': 'Yoruba Wiktionary',
      'description': 'Yoruba Wiktionary Words -- CC BY-SA'
    },
    'yoruba-wiktionary-short': {
      'name': 'Yoruba Short-Word Wiktionary',
      'description': 'Yoruba Wiktionary Words -- CC BY-SA'
    },
    'zulu-wiktionary': {
      'name': 'Zulu Wiktionary',
      'description': 'Zulu Wiktionary Words -- CC BY-SA'
    },
    'zulu-wiktionary-short': {
      'name': 'Zulu Short-Word Wiktionary',
      'description': 'Zulu Wiktionary Words -- CC BY-SA'
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
