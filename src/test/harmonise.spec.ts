import assert from "assert";
import { expect } from "chai";
import { abcText } from "../annotationsActions";
import { chordDispatcher } from "../dispatcher";
import {
  chordText,
  consolidateRestsInChordTransform,
  reorderChordTransform,
} from "../transformChords";
import { TransformFunction } from "../transformPitches";

describe("Harmonise", function () {
  describe("using transform functions", function () {
    it("Re-orders chords from lowest to highest notes", function () {
      assert.equal(reorderChordTransform("[acbe]" as chordText), "[ceab]");
      assert.equal(reorderChordTransform("[AcBe]" as chordText), "[ABce]");
      assert.equal(reorderChordTransform("[fA,c'G]" as chordText), "[A,Gfc']");
    });

    it("consolidates chord's multiple rests into a single value", function () {
      consolidateRestsInChordTransform("[A,F,,Bc'zd'']/2" as chordText),
        "[abcd]/2";
      consolidateRestsInChordTransform("[zzz]/2" as chordText), "z/2";
    });
  });
  describe("using chordDispatcher", function () {
    it("Re-orders chords from lowest to highest notes", function () {
      assert.equal(
        chordDispatcher(
          "[acbe]" as chordText,
          { pos: 0 },
          reorderChordTransform as TransformFunction
        ),
        "[ceab]"
      );
      assert.equal(
        chordDispatcher(
          "[AcBe]" as chordText,
          { pos: 0 },
          reorderChordTransform as TransformFunction
        ),
        "[ABce]"
      );
      assert.equal(
        chordDispatcher(
          "[fA,c'G]" as chordText,
          { pos: 0 },
          reorderChordTransform as TransformFunction
        ),
        "[A,Gfc']"
      );
    });

    it("consolidates chord's multiple rests into a single value", function () {
      chordDispatcher(
        "[A,F,,Bc'zd'']/2" as chordText,
        { pos: 0 },
        consolidateRestsInChordTransform as TransformFunction
      ),
        "[abcd]/2";
      chordDispatcher(
        "[zzz]/2" as chordText,
        { pos: 0 },
        consolidateRestsInChordTransform as TransformFunction
      ),
        "z/2";
    });
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
