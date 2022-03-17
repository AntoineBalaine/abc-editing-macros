import { assert } from "chai";
import { addNomenclatureToHeader, buildBodyFromInstruments, separateHeaderAndBody } from "../fileStructure";
import fs from "fs";
import { abcText, findInstrumentCalls, InstrumentCalls } from "../annotationsActions";
const scoreFilePath = "src/test/test_out/BachCelloSuiteDmin.abc";
const treatedScoreFilePath = "src/test/test_out/BachCelloSuiteDmin.InstrumentFamilies.test.abc";
const sampleScore = fs.readFileSync(scoreFilePath, "utf-8");
const treatedTestScore = fs.readFileSync(treatedScoreFilePath, "utf-8");
const scoreHeader = 
`X: 1
C: Johann Sebastian Bach
T: Suite 2 for Cello
T: Prélude
K: F
V: 1 clef=treble middle=D
L: 1/16`

  describe('', function() {
    let headerAndBody = separateHeaderAndBody(sampleScore as abcText, {pos:0})
    
    it('separates header from body of score', ()=>{
      assert.equal(Object.values(headerAndBody).join("\n"), sampleScore);
      assert.equal(headerAndBody.headerText, scoreHeader);
    })
    it('adds voices/instruments nomenclature to header of document', function(){
      const parsedInstrumentFamilies = findInstrumentCalls(headerAndBody.bodyText, {pos:0});
      headerAndBody.headerText = addNomenclatureToHeader(headerAndBody.headerText, parsedInstrumentFamilies.map(instrument=>Object.keys(instrument)[0]))
      headerAndBody.bodyText = buildBodyFromInstruments(parsedInstrumentFamilies);
        /*
         parse header and body
         find tags in file
         add instruments to header, in standard order
        */
      const testHeader = `X: 1
C: Johann Sebastian Bach
T: Suite 2 for Cello
T: Prélude
K: F
V: 1 clef=treble middle=D
L: 1/16
V: wd name="wd"
V: str name="str"`;
      assert.equal(headerAndBody.headerText, testHeader);
    });
    it('meshes multiple-line ensemble score into score-systems', async function(){
      const testBody = separateHeaderAndBody(treatedTestScore as abcText, {pos:0}).bodyText;

      assert.equal(headerAndBody.bodyText, testBody);
    }); 
/*     it('writes instrument-tagged sections to file', function() {
      //check that file contains instrument tags & their content
    });  */

  });
