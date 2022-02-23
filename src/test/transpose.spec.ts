import { octaviateDownTransform, octaviateUpTransform, transposeHalfStepDown, transposeHalfStepDownTransform, transposeHalfStepUp, transposeHalfStepUpTransform, transposeOctDown, transposeOctUp } from "../transpose";
import assert from "assert";

describe('Transpose', function() {
  describe('using letterTransform functions', function() {
    it('octave down single letters', function() {
      assert.equal(octaviateDownTransform("^a\'\'"), "^a'");
      assert.equal(octaviateDownTransform("^a\'"), "^a");
      assert.equal(octaviateDownTransform("^a"), "^A");
      assert.equal(octaviateDownTransform("^A"), "^A,");
      assert.equal(octaviateDownTransform("^A,"), "^A,,");
    });
    it('octave up single letters', function() {
      assert.equal(octaviateUpTransform("A,,"), "A,");
      assert.equal(octaviateUpTransform("A,"), "A");
      assert.equal(octaviateUpTransform("A"), "a");
      assert.equal(octaviateUpTransform("a"), "a\'");
      assert.equal(octaviateUpTransform("a\'"), "a\'\'");
    });
    it('up a half step', function() {
      assert.equal(transposeHalfStepUpTransform("^e\'"), "^f\'");
      assert.equal(transposeHalfStepUpTransform("^b\'"), "^c\'");
      assert.equal(transposeHalfStepUpTransform("e\'"), "f\'");
      assert.equal(transposeHalfStepUpTransform("E,"), "F,");
      assert.equal(transposeHalfStepUpTransform("b\'"), "c\'");
      assert.equal(transposeHalfStepUpTransform("B,"), "C,");
      assert.equal(transposeHalfStepUpTransform("g\'"), "^g\'");
      assert.equal(transposeHalfStepUpTransform("^g\'"), "a\'");
      assert.equal(transposeHalfStepUpTransform("G,"), "^G,");
      assert.equal(transposeHalfStepUpTransform("_g\'"), "g\'");
      assert.equal(transposeHalfStepUpTransform("_G,"), "G,");
    });
    it('down a half step', function() {
      assert.equal(transposeHalfStepDownTransform("^f\'"), "f\'");
      assert.equal(transposeHalfStepDownTransform("^c\'"), "c\'");
      assert.equal(transposeHalfStepDownTransform("f\'"), "e\'");
      assert.equal(transposeHalfStepDownTransform("F,"), "E,");
      assert.equal(transposeHalfStepDownTransform("c\'"), "b\'");
      assert.equal(transposeHalfStepDownTransform("C,"), "B,");
      assert.equal(transposeHalfStepDownTransform("^g\'"), "g\'");
      assert.equal(transposeHalfStepDownTransform("a\'"), "_a\'");
      assert.equal(transposeHalfStepDownTransform("^G,"), "G,");
      assert.equal(transposeHalfStepDownTransform("g\'"), "_g\'");
      assert.equal(transposeHalfStepDownTransform("G,"), "_G,");
    });
  });
  describe('using dispatcher function', function() {

    const fullTextLine = "(E,A,^CE) (GFED ^C=B,A,G,) | (F,A,DF) ADFA dBcA | G,DGA B(G^FG) _eGDg | [A,G^C]12 | [A,Fd]12 | [A,Ed]12 | [A,E^c]12 | [D,A,Fd]12 ||";
    const fullTextLineUpAHalfStep = "(F,^A,DF) (^G^F=F^D DC,^A,^G,) | (^F,^A,^D^F) ^A^D^F^A ^dC^c^A | ^G,^D^G^A C(^GG^G) e^G^D^g | [^A,^GD]12 | [^A,^F^d]12 | [^A,F^d]12 | [^A,Fd]12 | [^D,^A,^F^d]12 ||";
    const fullTextLineUpAStep = "(E,A,^CE) (GFED ^C=B,A,G,) | (F,A,DF) ADFA dBcA | G,DGA B(G^FG) _eGDg | [A,G^C]12 | [A,Fd]12 | [A,Ed]12 | [A,E^c]12 | [D,A,Fd]12 ||";
    const fullTextLineDownAHalfStep = "(E,A,^CE) (GFED ^C=B,A,G,) | (F,A,DF) ADFA dBcA | G,DGA B(G^FG) _eGDg | [A,G^C]12 | [A,Fd]12 | [A,Ed]12 | [A,E^c]12 | [D,A,Fd]12 ||";
    const fullTextLineDownAStep = "(E,A,^CE) (GFED ^C=B,A,G,) | (F,A,DF) ADFA dBcA | G,DGA B(G^FG) _eGDg | [A,G^C]12 | [A,Fd]12 | [A,Ed]12 | [A,E^c]12 | [D,A,Fd]12 ||";

    it('octave down', function() {
      assert.equal(transposeOctDown("C,E,^G,C"), "C,,E,,^G,,C,");
      assert.equal(transposeOctDown("CE^Gc"), "C,E,^G,C");
      assert.equal(transposeOctDown("ce^gc'"), "CE^Gc");
      assert.equal(transposeOctDown("c'_e'g'c''"), "c_egc'");
    });
    it('octave up', function() {
      assert.equal(transposeOctUp("C,,E,,^G,,C,"), "C,E,^G,C");
      assert.equal(transposeOctUp("C,E,^G,C"), "CE^Gc");
      assert.equal(transposeOctUp("C_E^Gc"), "c_e^gc'");
      assert.equal(transposeOctUp("c_e^gc'"), "c'_e'^g'c''");
    });
    it('1/2 step down', function() {
      assert.equal(transposeHalfStepDown("C,,_F,,^G,,_C,"), "B,,_E,,G,,_B,");
      assert.equal(transposeHalfStepDown("_b,E,^G,F"), "a,_E,G,E");
    });
    it('1/2 step up', function() {
      assert.equal(transposeHalfStepUp("^E,,^B,,^G,,^C,"), "^F,,^C,,A,,D,");
      assert.equal(transposeHalfStepUp("C,E,_G,B,,_e"), "^C,F,G,C,,e");
    });
    it('no notes in string - do not transpose anything', function() {
      assert.equal(transposeHalfStepDown("(z4|z4|)"), "(z4|z4|)")
    });
    it('transpose a full line', function() {
      assert.equal(transposeHalfStepUp(fullTextLine), fullTextLineUpAHalfStep);
      // assert.equal(transposeStepUp(fullTextLine), fullTextLineUpAStep);
      assert.equal(transposeHalfStepDown(fullTextLine), fullTextLineDownAHalfStep);
      //assert.equal(transposeStepDown(fullTextLine), fullTextLineDownAStep);
    })
  });
});
