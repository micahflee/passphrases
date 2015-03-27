#!/usr/bin/env python

"""
Creates [language]-wiktionary.wordlist and [language]-wiktionary-short.wordlist 
for each of the languages shown in the dicts dictionary below. The purpose is 
to seed the passphrase project with a large selection of language dictionaries
that users can choose from when generating a new passphrase. This is for

https://github.com/StephenGenusa/passphrases

which is a fork of 

https://github.com/micahflee/passphrases

By Stephen Genusa
http://development.genusa.com
March 23, 2015
"""

import re
import os
from string import Template
import codecs
import pickle
import random
import vulgarity
import sys
reload(sys)
sys.setdefaultencoding('utf8')


wiki_dict_pickled_file = "wiki_dicts.p"


if not os.path.isfile(wiki_dict_pickled_file):
    f = open('enwiktionary-latest-pages-meta-current.xml')

dicts = {'Afar':[], 'Abkhaz':[], 'Avestan' : [], 'Afrikaans' : [], 'Akan' : [], 'Amharic' : [], \
         'Aragonese' : [], 'Arabic' : [], 'Assamese' : [], 'Avar' : [], 'Aymara' : [], 'Azeri' : [], \
         'Bashkir' : [], 'Belarusian' : [], 'Bulgarian' : [], 'Bihari' : [], 'Bislama' : [], \
         'Bambara' : [], 'Bengali' : [], 'Tibetan' : [], 'Breton' : [], 'Catalan' : [], 'Chechen' : [], \
         'Chamorro' : [], 'Corsican' : [], 'Cree' : [], 'Czech' : [], 'OldChurchSlavonic' : [], \
         'Chuvash' : [], 'Welsh' : [], 'Danish' : [], 'German' : [], 'Dhivehi' : [], 'Dzongkha' : [], \
         'Ewe' : [], 'Greek' : [], 'English' : [], 'Esperanto' : [], 'Spanish' : [], 'Estonian' : [], \
         'Basque' : [], 'Persian' : [], 'Fula' : [], 'Finnish' : [], 'Fijian' : [], 'Faroese' : [], \
         'French' : [], 'WestFrisian' : [], 'Irish' : [], 'ScottishGaelic' : [], 'Galician' : [], \
         'Guaraní' : [], 'Gujarati' : [], 'Manx' : [], 'Hausa' : [], 'Hebrew' : [], 'Hindi' : [], \
         'HiriMotu' : [], 'HaitianCreole' : [], 'Hungarian' : [], 'Armenian' : [], 'Herero' : [], \
         'Interlingua' : [], 'Indonesian' : [], 'Interlingue' : [], 'Igbo' : [], 'SichuanYi' : [], \
         'Inupiak' : [], 'Ido' : [], 'Icelandic' : [], 'Italian' : [], 'Inuktitut' : [], 'Japanese' : [], \
         'Javanese' : [], 'Georgian' : [], 'Kongo' : [], 'Kikuyu' : [], 'Kwanyama' : [], 'Kazakh' : [], \
         'Greenlandic' : [], 'Khmer' : [], 'Kannada' : [], 'Korean' : [], 'Kanuri' : [], 'Kashmiri' : [], \
         'Kurdish' : [], 'Cornish' : [], 'Kyrgyz' : [], 'Latin' : [], 'Luxembourgish' : [], 'Luganda' : [], \
         'Limburgish' : [], 'Lingala' : [], 'Lao' : [], 'Lithuanian' : [], 'Luba-Katanga' : [], \
         'Latvian' : [], 'Malagasy' : [], 'Marshallese' : [], 'Maori' : [], 'Macedonian' : [], \
         'Malayalam' : [], 'Mongolian' : [], 'Marathi' : [], 'Malay' : [], 'Maltese' : [], \
         'Burmese' : [], 'Nauruan' : [], 'NorwegianBokmål' : [], 'NorthernNdebele' : [], \
         'Nepali' : [], 'Ndonga' : [], 'Dutch' : [], 'NorwegianNynorsk' : [], 'Norwegian' : [], \
         'SouthernNdebele' : [], 'Navajo' : [], 'Chichewa' : [], 'Occitan' : [], 'Ojibwe' : [], \
         'Oromo' : [], 'Oriya' : [], 'Ossetian' : [], 'Punjabi' : [], 'Pali' : [], 'Polish' : [], \
         'Pashto' : [], 'Portuguese' : [], 'Quechua' : [], 'Romansch' : [], 'Kirundi' : [], \
         'Romanian' : [], 'Russian' : [], 'Kinyarwanda' : [], 'Sanskrit' : [], 'Sardinian' : [], \
         'Sindhi' : [], 'NorthernSami' : [], 'Sango' : [], 'Serbo-Croatian' : [], 'Sinhalese' : [], \
         'Slovak' : [], 'Slovene' : [], 'Samoan' : [], 'Shona' : [], 'Somali' : [], 'Albanian' : [], \
         'Swazi' : [], 'Sotho' : [], 'Sundanese' : [], 'Swedish' : [], 'Swahili' : [], 'Tamil' : [], \
         'Telugu' : [], 'Tajik' : [], 'Thai' : [], 'Tigrinya' : [], 'Turkmen' : [], 'Tagalog' : [], \
         'Tswana' : [], 'Tongan' : [], 'Turkish' : [], 'Tsonga' : [], 'Tatar' : [], 'Twi' : [], \
         'Tahitian' : [], 'Uyghur' : [], 'Ukrainian' : [], 'Urdu' : [], 'Uzbek' : [], 'Venda' : [], \
         'Vietnamese' : [], 'Walloon' : [], 'Wolof' : [], 'Xhosa' : [], 'Yiddish' : [], \
         'Yoruba' : [], 'Zhuang' : [], 'Chinese' : [], 'Zulu' : []}



def getNextXMLBlock():
    """The English Wiktionary XML file is current 4.1 GB, and that's before
    you try and load it into some parser module. My workaround is to pull a
    <page> at a time, because that's the basic container of information for
    each word in the database.
    """
    lines = ""
    while True:
        line = f.readline()
        lines += line
        if line.find('</page>') > -1:
            break
        if line == '</mediawiki>':
            return None
    return lines


def randomize_list(the_list):
    """Take a standard Python list and randomize the entries. Routine not
    currently used.
    """
    print "randomizing list"
    randomized_list = []
    for i in range(len(the_list)):
        element = random.choice(the_list)
        the_list.remove(element)
        randomized_list.append(element)
    print "done randomizing list"
    return randomized_list


def main():
    global dicts
    wordcount = 0
    # Since my XML pages may or may not be syntactically correct for XML 
    # parsing -- rather than face that battle -- I use a few regular 
    # expressions to pick out the information I need.
    #
    # Once an entire file has been parsed, the entire dict of languages and 
    # words is saved to a pickled file so that I don't have to reparse all of
    # the XML when I make minor changes to the post-XML parsing phase of 
    # the code.
    #
    # If the pickled dictionary file does not exist parse the XML
    if not os.path.isfile(wiki_dict_pickled_file):
        lines = getNextXMLBlock()
        while lines != None:
            # Get the page title and <ns> entity which appears to be 0 for actual words and their definitions
            match = re.search("<page>\n....<title>(.{4,30}?)</title>\n....<ns>(\d){1,3}</ns", lines, re.DOTALL | re.MULTILINE)
            if match:
                word = match.groups(0)[0]
                x_id = match.groups(0)[1]
                # Dump combination words, acronymns and some known english vulgarities
                if word.find(' ') > -1 or \
                   word in vulgarity.vulgarities or \
                   re.search("context\|Braille\|", lines, re.DOTALL | re.MULTILINE) or \
                   len([i for i in word if i in "!\"#$%&'()*+,-./:;<=>?@[\]^_{|}~"]) > 0 or \
                   re.search("[A-Z]{1,3}", word, re.DOTALL | re.MULTILINE):
                        word = None
                        x_id = None
                        language = None
                else:
                    word = word.lower()
                    # Find the language of the word
                    match = re.search("preserve.{1,500}?==(.{1,30}?)==", lines, re.DOTALL | re.MULTILINE)
                    if match:
                        language = match.groups(0)[0]
                    else:
                        language = None
            else:
                word = None
                x_id = None
        
        
            if x_id == '0' and language in dicts:    
                wordcount += 1
                print word, language, wordcount
                if word not in dicts[language]:
                    dicts[language].append(word)
            lines = getNextXMLBlock()
        f.close()    
        pickle.dump(dicts, open(wiki_dict_pickled_file, 'wb'))    
    else:
        print "Loading dictionaries"
        dicts = pickle.load(open(wiki_dict_pickled_file, 'rb'))
        print "Done loading dictionaries"
        
        
    # setup the template text for the JavaScript dictionary entries 
    js_dict_descriptors = ''
    dict_template = Template("""    '$dict': {
        'name': '$dictname Short-Word Wiktionary',
        'description': '$dictname Wiktionary Words -- CC BY-SA'
        },
    """)
    
    # make sure the output path exists
    output_path = os.path.join(os.getcwd(), "WordList Files")
    if not os.path.exists(output_path):
        os.mkdir(output_path)
    # get the dicts in alphabetical order
    for dict in sorted(dicts.iterkeys()):
        if len(dicts[dict]) > 100: 
            print "Preparing to save", dict, "language words"
            # randomize the list before saving it  
            #rand_word_list = randomize_list(dicts[dict])
            # save two version for each language: a list with all words and a short-word list
            print "Saving", dict, "language words"
            f_long = codecs.open(os.path.join(output_path, dict.lower() + '-wiktionary.wordlist'), "w", encoding='utf-8')
            f_short = codecs.open(os.path.join(output_path, dict.lower() + '-wiktionary-short.wordlist'), "w", encoding='utf-8')
            # save each of the words to their respective files
            for word in dicts[dict]:
                #word = word.encode('UTF-8')
                f_long.write(word + '\n')
                if len(word) < 8:
                    f_short.write(word + '\n')
            # close the files        
            f_long.close()
            f_short.close()
            print "Preparing JavaScript code for", dict, "dictionary"
            # Save the templated dictionary descriptors to put into generate.js
            js_dict_descriptors += dict_template.substitute(dict=dict.lower() + '-wiktionary', dictname=dict)
            js_dict_descriptors += dict_template.substitute(dict=dict.lower() + '-wiktionary-short', dictname=dict)
    print js_dict_descriptors


if __name__ == "__main__":
    main()
