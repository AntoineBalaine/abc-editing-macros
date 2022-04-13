import assert from "assert";
import { expect } from "chai";
import fs from "fs";
import {
  annotationCommandEnum,
  createOrUpdateHarmonizationRoutine,
  createInstrumentationRoutine,
  parseUniqueTags,
  instrumentFamilies,
  findInstrumentCalls,
} from "../annotationsActions";
import path from "path";
import { dispatcher } from "../dispatcher";
import { convertToRestTransform } from "../transformPitches";
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
describe("Annotate", function () {
  it("correctly parses unique tags in score", function () {
    expect(parseUniqueTags('abC,d"str"ddDD"/str"')).to.eql(["str"]);
    expect(parseUniqueTags('abC,d"str \\n soli"ddDD"/str \\n /soli"')).to.eql([
      "str",
      "soli",
    ]);
  });
  it("doesn't allow multiple harmonisation techniques, but does allow multiple instruments/instrument families", function () {});
  it("accepts self closing tags for single hit notes", function () {});
});
describe("Arrange", function () {
  describe("using harmony annotations in score", function () {
    /*     it("returns contents of tagged parts", function () {});
    it("returns tagged harmony parts", function () {});
    it("creates harmonisation file with matching file name", async function () {
      createOrUpdateHarmonizationRoutine(
        sampleScore,
        annotationCommandEnum.createHarmonisationFile,
        scoreFilePath
      );

      const targetFile = path.join(
        path.dirname(scoreFilePath),
        path.parse(scoreFilePath).name +
          `.${annotationCommandEnum.createHarmonisationFile}.abc`
      );

      assert.ok(fs.existsSync(targetFile));
    }); */
    /*     it('writes harmonisation-tagged sections to file', function() {
      //check that file contains harmony tags
      //in the case that some chords symbols are not provided for either curNote/curBar, do not harmonise

    }); */
  });
  describe("using annotations in score", function () {
    it("strips annotations of any instrument references", function () {
      let annotation = '"str soli"A,B,CDEFG"/str"';
      assert.equal(
        dispatcher(
          annotation,
          { pos: 0 },
          () => "",
          instrumentFamilies.strings
        ),
        '"soli"A,B,CDEFG'
      );
    });
    it("turns all parts outside of instrument tags into rests", function () {
      let annotation = 'AbcD,E,"str soli"A,B,CDEFG"/str"D^FAc';
      assert.equal(
        dispatcher(
          annotation,
          { pos: 0 },
          convertToRestTransform,
          instrumentFamilies.strings
        ),
        'zzzzz"soli"A,B,CDEFGzzzz'
      );
    });
    it("parses multiple instruments into separate voices", function () {
      let annotation = 'AbcD,E,"str wd soli"A,B,CDEFG"/str /wd "D^FAc';
      expect(findInstrumentCalls(annotation, { pos: 0 })).to.eql([
        { str: 'zzzzz"soli"A,B,CDEFGzzzz' },
        { wd: 'zzzzz"soli"A,B,CDEFGzzzz' },
      ]);
    });
    it("parses overlapping tags for multiple instruments", function () {
      let annotation = 'Ab"wd"cD,E,"str soli"A,B,CDEFG"/str /wd "D^FAc';
      expect(findInstrumentCalls(annotation, { pos: 0 })).to.eql([
        { wd: 'zzcD,E,"soli"A,B,CDEFGzzzz' },
        { str: 'zzzzz"soli"A,B,CDEFGzzzz' },
      ]);
    });
    it("parses overlapping tags containing bar lines", function () {
      let annotation = 'Ab"wd"cD,E, | "str soli"A,B,CD | EFG"/str /wd "D^FAc';
      expect(findInstrumentCalls(annotation, { pos: 0 })).to.eql([
        { wd: 'zzcD,E, | "soli"A,B,CD | EFGzzzz' },
        { str: 'zzzzz | "soli"A,B,CD | EFGzzzz' },
      ]);
    });
    it("parses overlapping tags over line breaks", function () {
      let annotation =
        'Ab"wd"cD,E, | "str soli"A,B,CD | \n EFG"/str /wd "D^FAc';
      expect(findInstrumentCalls(annotation, { pos: 0 })).to.eql([
        { wd: 'zzcD,E, | "soli"A,B,CD | \n EFGzzzz' },
        { str: 'zzzzz | "soli"A,B,CD | \n EFGzzzz' },
      ]);
    });
    it("creates contents of instrumentFamilies file", function () {
      let text = `X:1
(E,A,^CE) "wd"(GFED ^C=B,A,G,) |"/wd" (F,A,DF) ADFA dBcA | G,DGA B(G^FG) _eGDg | "Cmin \n str"[A,G^C]12  |"/str" "Dmin/A \n drop24"[A,Fd]12 | [A,Ed]12 | [A,E^c]12 | [D,A,Fd]12 ||
 `;
      let treatedText = `X:1
V: wd name="wd"
V: str name="str"
[V: wd] (zzzz) (GFED ^C=B,A,G,) | (zzzz) zzzz zzzz | zzzz z(zzz) zzzz | "Cmin"[zzz]12  | "Dmin/A \\n drop24"[zzz]12 | [zzz]12 | [zzz]12 | [zzzz]12 ||
[V: str] (zzzz) (zzzz zzzz) | (zzzz) zzzz zzzz | zzzz z(zzz) zzzz | "Cmin"[A,G^C]12  | "Dmin/A \\n drop24"[zzz]12 | [zzz]12 | [zzz]12 | [zzzz]12 ||
%`;

      assert.equal(createInstrumentationRoutine(text), treatedText);
    });
  });
});
