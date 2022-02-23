//var assert = require('assert');
import assert from "assert";
import fs from "fs";
const sampleScore = fs.readFileSync("src/test/BachCelloSuiteDmin.abc", "utf-8");

/* à faire:
- crée un fichier à partir du contenu en annotations dans un string ABC .
-copie les parties qui y sont indiquées
Serait-il pertinent de garder la synchro entre les sous-parties? harmo, instruments…

Couches d'arrangement:
    1. routine
    2. harmonisations
    3. familles d'instruments
*/
describe('Annotate', function(){
    it('wraps the provided text in annotation tags', function(){});
    it('inserts new tags in annotation if annotation exists right at edges of current selection, separates each tag with a \\n', function(){});
    it("doesn't allow multiple harmonisation techniques, but does allow multiple instruments/instrument families", function(){});
    it('accepts self closing tags for single hit notes', function(){});
});
describe('Arrange', function(){
    describe('using harmony annotations in score', function(){
        it('returns contents of tagged parts', function(){});
        it('returns tagged harmony parts', function(){});
        it('creates harmonisation file with matching file name', function(){});
        it('writes harmonisation-tagged sections to file', function(){});
        //in the case that some chords symbols are not provided for either curNote/curBar, do not harmonise
    });
    describe('using instruments annotations in score', function(){
        //distribute to instruments
        //fill with slashes or rests, depending if this is a leadsheet or a score.
    });
});

describe('Harmonise', function(){
    describe('parse chord symbols in annotations', function(){
        it ('extract triad chords symbols from annotations', function(){});
        it ('extract 7th/9th chords from annotations', function(){});
        it ('extract chorssOverBassNote from annotations', function(){});
        it ('builds chord harmonisation from extracted chord symbols', function(){});
        it ('builds chord harmonisation under indicated top notes', function(){});
    });
});