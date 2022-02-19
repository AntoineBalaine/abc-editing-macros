import { octaviateDownTransform, octaviateUpTransform, transposeOctDown, transposeOctUp } from "../macro1";

/**
 * à faire: 
 *  transpose up/down a step
 *  transpose up/down a 1/2 step
 *  noteLength/2, noteLength*2
 */

var assert = require('assert');

describe('Octaviate', function(){
    describe('transform using letterTransform functions', function() {
        it ('should correctly octaviate down single letters', function(){
          assert.equal(octaviateDownTransform("^a\'\'"), "^a'");
          assert.equal(octaviateDownTransform("^a\'"), "^a");
          assert.equal(octaviateDownTransform("^a"), "^A");
          assert.equal(octaviateDownTransform("^A"), "^A,");
          assert.equal(octaviateDownTransform("^A,"), "^A,,");
        });
        it ('should correctly octaviate up single letters', function(){
          assert.equal(octaviateUpTransform("A,,"), "A,");
          assert.equal(octaviateUpTransform("A,"), "A");
          assert.equal(octaviateUpTransform("A"), "a");
          assert.equal(octaviateUpTransform("a"), "a\'");
          assert.equal(octaviateUpTransform("a\'"), "a\'\'");
        });
    });
    describe('transpose using dispatcher function', function(){
      it ('should correctly octaviate down groups of letters recursively', function(){
          assert.equal(transposeOctDown("C,E,^G,C"), "C,,E,,^G,,C,");
          assert.equal(transposeOctDown("CE^Gc"), "C,E,^G,C");
          assert.equal(transposeOctDown("ce^gc'"), "CE^Gc");
          assert.equal(transposeOctDown("c'_e'g'c''"), "c_egc'");
      });
      it ('should correctly octaviate up groups of letters recursively', function(){
          assert.equal(transposeOctUp("C,,E,,^G,,C,"), "C,E,^G,C");
          assert.equal(transposeOctUp("C,E,^G,C"), "CE^Gc");
          assert.equal(transposeOctUp("C_E^Gc"), "c_e^gc'");
          assert.equal(transposeOctUp("c_e^gc'"), "c'_e'^g'c''");
      });
    });
});