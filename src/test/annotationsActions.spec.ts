import assert from "assert";
import fs from "fs";
import { annotationCommandEnum, createOrUpdateHarmonizationRoutine, createOrUpdateInstrumentationRoutine } from "../annotationsActions";
import path from "path";

const scoreFilePath = "src/test/test_out/BachCelloSuiteDmin.abc";
const sampleScore = fs.readFileSync(scoreFilePath, "utf-8");

/* à faire:
- crée un fichier à partir du contenu en annotations dans un string ABC .
-copie les parties qui y sont indiquées
Serait-il pertinent de garder la synchro entre les sous-parties? harmo, instruments…

Couches d'arrangement:
    1. routine
    2. harmonisations
    3. familles d'instruments
*/
describe('Annotate', function() {
  it("doesn't allow multiple harmonisation techniques, but does allow multiple instruments/instrument families", function() { });
  it('accepts self closing tags for single hit notes', function() { });
});
describe('Arrange', function() {
  describe('using harmony annotations in score', function() {
    it('returns contents of tagged parts', function() { });
    it('returns tagged harmony parts', function() { });
    it('creates harmonisation file with matching file name', async function() {
      createOrUpdateHarmonizationRoutine(sampleScore, annotationCommandEnum.createHarmonisationFile, scoreFilePath);

      const targetFile = path.join(path.dirname(scoreFilePath), path.parse(scoreFilePath).name + `.${annotationCommandEnum.createHarmonisationFile}.abc`)

      assert.ok(fs.existsSync(targetFile))
    });
    it('writes harmonisation-tagged sections to file', function() {
      //check that file contains harmony tags

    });
    //in the case that some chords symbols are not provided for either curNote/curBar, do not harmonise
  });
  describe('using instruments annotations in score', function() {
    //distribute to instruments
    //fill with slashes or rests, depending if this is a leadsheet or a score.
    it('creates instrumentFamilies file with indicated families', function() {
      createOrUpdateInstrumentationRoutine(sampleScore, annotationCommandEnum.createFamiliesFile, scoreFilePath);
      const targetFile = path.join(path.dirname(scoreFilePath), path.parse(scoreFilePath).name + `.${annotationCommandEnum.createFamiliesFile}.abc`)

      assert.ok(fs.existsSync(targetFile))
    });
    it('writes instrument-tagged sections to file', function() {
      //check that file contains instrument tags & their content
    });

  });
});

describe('Harmonise', function() {
  describe('parse chord symbols in annotations', function() {
    it('extract triad chords symbols from annotations', function() { });
    it('extract 7th/9th chords from annotations', function() { });
    it('extract chorssOverBassNote from annotations', function() { });
    it('builds chord harmonisation from extracted chord symbols', function() { });
    it('builds chord harmonisation under indicated top notes', function() { });
  });
});
