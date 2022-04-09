"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const macro1_1 = require("../macro1");
/**
 * à faire:
 *  transpose up/down a step
 *  transpose up/down a 1/2 step
 *  noteLength/2, noteLength*2
 */
var assert = require('assert');
describe('Octaviate', function () {
    describe('transform using letterTransform functions', function () {
        it('should correctly octaviate down single letters', function () {
            assert.equal((0, macro1_1.octaviateDownTransform)("^a\'\'"), "^a'");
            assert.equal((0, macro1_1.octaviateDownTransform)("^a\'"), "^a");
            assert.equal((0, macro1_1.octaviateDownTransform)("^a"), "^A");
            assert.equal((0, macro1_1.octaviateDownTransform)("^A"), "^A,");
            assert.equal((0, macro1_1.octaviateDownTransform)("^A,"), "^A,,");
        });
        it('should correctly octaviate up single letters', function () {
            assert.equal((0, macro1_1.octaviateUpTransform)("A,,"), "A,");
            assert.equal((0, macro1_1.octaviateUpTransform)("A,"), "A");
            assert.equal((0, macro1_1.octaviateUpTransform)("A"), "a");
            assert.equal((0, macro1_1.octaviateUpTransform)("a"), "a\'");
            assert.equal((0, macro1_1.octaviateUpTransform)("a\'"), "a\'\'");
        });
    });
    describe('transpose using dispatcher function', function () {
        it('should correctly octaviate down groups of letters recursively', function () {
            assert.equal((0, macro1_1.transposeOctDown)("C,E,^G,C"), "C,,E,,^G,,C,");
            assert.equal((0, macro1_1.transposeOctDown)("CE^Gc"), "C,E,^G,C");
            assert.equal((0, macro1_1.transposeOctDown)("ce^gc'"), "CE^Gc");
            assert.equal((0, macro1_1.transposeOctDown)("c'_e'g'c''"), "c_egc'");
        });
        it('should correctly octaviate up groups of letters recursively', function () {
            assert.equal((0, macro1_1.transposeOctUp)("C,,E,,^G,,C,"), "C,E,^G,C");
            assert.equal((0, macro1_1.transposeOctUp)("C,E,^G,C"), "CE^Gc");
            assert.equal((0, macro1_1.transposeOctUp)("C_E^Gc"), "c_e^gc'");
            assert.equal((0, macro1_1.transposeOctUp)("c_e^gc'"), "c'_e'^g'c''");
        });
    });
});
