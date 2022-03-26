import assert from "assert";
import { expect } from "chai";
import { chordText, reorderChord } from "../transformChords";

describe("Harmonise", function () {
  it("Re-orders chords from lowest to highest notes", function () {
    assert.equal(reorderChord("[acbe]" as chordText), "[ceab]");
    assert.equal(reorderChord("[AcBe]" as chordText), "[ABce]");
    assert.equal(reorderChord("[fA,c'G]" as chordText), "[A,Gfc']");
  });
  /*     
    it('Can build chords from chord symbol', function(){
        assert.ok(false);
    });
    it('detects whether a note is a chord tone', function(){
        assert.ok(false);
    });
    it('builds closed position chord under melody chord tone', function(){
        assert.ok(false);
    }); 
  describe('parse chord symbols in annotations', function() {
    it('extract triad chords symbols from annotations', function() { });
    it('extract 7th/9th chords from annotations', function() { });
    it('extract chorssOverBassNote from annotations', function() { });
    it('builds chord harmonisation from extracted chord symbols', function() { });
    it('builds chord harmonisation under indicated top notes', function() { });
  });
  */
});
