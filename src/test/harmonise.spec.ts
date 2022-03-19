import assert from "assert";
import { expect } from "chai";
import { chordText, reorderChord } from "../harmonise";

describe('Harmonise', function() {

    it('Re-orders chords from lowest to highest notes', function(){
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
*/
});