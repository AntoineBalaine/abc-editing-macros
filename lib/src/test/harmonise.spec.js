"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const dispatcher_1 = require("../dispatcher");
const transformChords_1 = require("../transformChords");
describe("Harmonise", function () {
    describe("using transform functions", function () {
        it("Re-orders chords from lowest to highest notes", function () {
            assert_1.default.equal((0, transformChords_1.reorderChordTransform)("[acbe]"), "[ceab]");
            assert_1.default.equal((0, transformChords_1.reorderChordTransform)("[AcBe]"), "[ABce]");
            assert_1.default.equal((0, transformChords_1.reorderChordTransform)("[fA,c'G]"), "[A,Gfc']");
        });
        it("consolidates chord's multiple rests into a single value", function () {
            (0, transformChords_1.consolidateRestsInChordTransform)("[A,F,,Bc'zd'']/2"),
                "[abcd]/2";
            (0, transformChords_1.consolidateRestsInChordTransform)("[zzz]/2"), "z/2";
        });
    });
    describe("using chordDispatcher", function () {
        it("Re-orders chords from lowest to highest notes", function () {
            assert_1.default.equal((0, dispatcher_1.chordDispatcher)({
                text: "[acbe]",
                context: { pos: 0 },
                transformFunction: transformChords_1.reorderChordTransform,
            }), "[ceab]");
            assert_1.default.equal((0, dispatcher_1.chordDispatcher)({
                text: "[AcBe]",
                context: { pos: 0 },
                transformFunction: transformChords_1.reorderChordTransform,
            }), "[ABce]");
            assert_1.default.equal((0, dispatcher_1.chordDispatcher)({
                text: "[fA,c'G]",
                context: { pos: 0 },
                transformFunction: transformChords_1.reorderChordTransform,
            }), "[A,Gfc']");
        });
        it("consolidates chord's multiple rests into a single value", function () {
            (0, dispatcher_1.chordDispatcher)({
                text: "[A,F,,Bc'zd'']/2",
                context: { pos: 0 },
                transformFunction: transformChords_1.consolidateRestsInChordTransform,
            }),
                "[abcd]/2";
            (0, dispatcher_1.chordDispatcher)({
                text: "[zzz]/2",
                context: { pos: 0 },
                transformFunction: transformChords_1.consolidateRestsInChordTransform,
            }),
                "z/2";
            (0, dispatcher_1.chordDispatcher)({
                text: "[zaz]/2",
                context: { pos: 0 },
                transformFunction: transformChords_1.consolidateRestsInChordTransform,
            }),
                "a/2";
            (0, dispatcher_1.chordDispatcher)({
                text: "[zazb]/2",
                context: { pos: 0 },
                transformFunction: transformChords_1.consolidateRestsInChordTransform,
            }),
                "[ab]/2";
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
