import { assert } from "chai";
import { separateHeaderAndBody } from "../fileStructure";
import fs from "fs";
import { abcText } from "../annotationsActions";
const scoreFilePath = "src/test/test_out/BachCelloSuiteDmin.abc";
const sampleScore = fs.readFileSync(scoreFilePath, "utf-8");
const scoreHeader = 
`X: 1
C: Johann Sebastian Bach
T: Suite 2 for Cello
T: Prélude
K: F
V: 1 clef=treble middle=D
L: 1/16`

  describe('', function() {
    it('separates header from body of score', ()=>{
      const headerAndBody = separateHeaderAndBody(sampleScore as abcText, {pos:0})
      assert.equal(Object.values(headerAndBody).join("\n"), sampleScore);
      assert.equal(headerAndBody.headerText, scoreHeader);
    })
    it('adds voices/instruments nomenclature to header of document', function(){
        /*
         parse header and body
         find tags in file
         add instruments to header, in standard order
        */
    });
    it('meshes multiple-line ensemble score into score-systems', function(){
    });
    it('writes instrument-tagged sections to file', function() {
      //check that file contains instrument tags & their content
    }); 
  });
