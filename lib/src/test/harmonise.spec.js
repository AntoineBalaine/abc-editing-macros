"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const transformChords_1 = require("../transformChords");
describe("Harmonise", function () {
    it("Re-orders chords from lowest to highest notes", function () {
        assert_1.default.equal((0, transformChords_1.reorderChord)("[acbe]"), "[ceab]");
        assert_1.default.equal((0, transformChords_1.reorderChord)("[AcBe]"), "[ABce]");
        assert_1.default.equal((0, transformChords_1.reorderChord)("[fA,c'G]"), "[A,Gfc']");
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
