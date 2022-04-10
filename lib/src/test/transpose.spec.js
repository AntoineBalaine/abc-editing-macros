"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dispatcher_1 = require("../dispatcher");
const transformPitches_1 = require("../transformPitches");
const testTransposeFunctions_1 = require("./testTransposeFunctions");
const parseNomenclature_1 = require("../parseNomenclature");
const assert_1 = __importDefault(require("assert"));
const annotationsActions_1 = require("../annotationsActions");
const chai_1 = require("chai");
const fullTextLine = "(E,A,^CE) (GFED ^C=B,A,G,) | (F,A,DF) ADFA dBcA | G,DGA B(G^FG) _eGDg | [A,G^C]12 | [A,Fd]12 | [A,Ed]12 | [A,E^c]12 | [D,A,Fd]12 ||";
const fullTextLineDownAHalfStep = "(_E,_A,C_E) (_GE_E_D C_B,_A,_G,) | (E,_A,_DE) _A_DE_A _d_Bb_A | _G,_D_G_A _B(_GF_G) d_G_D_g | [_A,_GC]12 | [_A,E_d]12 | [_A,_E_d]12 | [_A,_Ec]12 | [_D,_A,E_d]12 ||";
const fullTextLineUpAHalfStep = "(F,^A,DF) (^G^FF^D DC,^A,^G,) | (^F,^A,^D^F) ^A^D^F^A ^dC^c^A | ^G,^D^G^A C(^GG^G) e^G^D^g | [^A,^GD]12 | [^A,^F^d]12 | [^A,F^d]12 | [^A,Fd]12 | [^D,^A,^F^d]12 ||";
const fullTextLineUpAStep = "(F,B,^D^F) (AG^FE ^D^C,B,A,) | (G,B,EG) BEGB e^CdB | A,EAB ^C(A^GA) fAEa | [B,A^D]12 | [B,Ge]12 | [B,^Fe]12 | [B,^F^d]12 | [E,B,Ge]12 ||";
const fullTextLineDownAStep = "(D,G,BD) (F_EDC BA,G,F,) | (_E,G,C_E) GC_EG cA_bG | F,CFG A(FEF) _dFEf | [G,FB]12 | [G,_Ec]12 | [G,Dc]12 | [G,Db]12 | [C,G,_Ec]12 ||";
describe("Transpose and rest", function () {
    describe("using letterTransform functions", function () {
        it("octave down single letters", function () {
            assert_1.default.equal((0, transformPitches_1.octaviateDownTransform)("^a''"), "^a'");
            assert_1.default.equal((0, transformPitches_1.octaviateDownTransform)("^a'"), "^a");
            assert_1.default.equal((0, transformPitches_1.octaviateDownTransform)("^a"), "^A");
            assert_1.default.equal((0, transformPitches_1.octaviateDownTransform)("^A"), "^A,");
            assert_1.default.equal((0, transformPitches_1.octaviateDownTransform)("^A,"), "^A,,");
            assert_1.default.equal((0, transformPitches_1.octaviateDownTransform)("^A2"), "^A,2");
            assert_1.default.equal((0, transformPitches_1.octaviateDownTransform)("^A/2"), "^A,/2");
        });
        it("octave up single letters", function () {
            assert_1.default.equal((0, transformPitches_1.octaviateUpTransform)("A,,"), "A,");
            assert_1.default.equal((0, transformPitches_1.octaviateUpTransform)("A,"), "A");
            assert_1.default.equal((0, transformPitches_1.octaviateUpTransform)("A"), "a");
            assert_1.default.equal((0, transformPitches_1.octaviateUpTransform)("a"), "a'");
            assert_1.default.equal((0, transformPitches_1.octaviateUpTransform)("a'"), "a''");
            assert_1.default.equal((0, transformPitches_1.octaviateUpTransform)("^A2"), "^a2");
            assert_1.default.equal((0, transformPitches_1.octaviateUpTransform)("^A/2"), "^a/2");
        });
        it("up a half step", function () {
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepUpTransform)("^e'"), "^f'");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepUpTransform)("^b'"), "^c'");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepUpTransform)("e'"), "f'");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepUpTransform)("E,"), "F,");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepUpTransform)("b'"), "c'");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepUpTransform)("B,"), "C,");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepUpTransform)("g'"), "^g'");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepUpTransform)("^g'"), "a'");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepUpTransform)("G,"), "^G,");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepUpTransform)("_g'"), "g'");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepUpTransform)("_G,"), "G,");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepUpTransform)("_G,/"), "G,/");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepUpTransform)("_G,2"), "G,2");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepUpTransform)("_G,/2"), "G,/2");
        });
        it("down a half step", function () {
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepDownTransform)("_e"), "d");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepDownTransform)("_d"), "c");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepDownTransform)("_a"), "g");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepDownTransform)("^f'"), "f'");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepDownTransform)("^c'"), "c'");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepDownTransform)("f'"), "e'");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepDownTransform)("c'"), "b'");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepDownTransform)("C,"), "B,");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepDownTransform)("^g'"), "g'");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepDownTransform)("a'"), "_a'");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepDownTransform)("^G,"), "G,");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepDownTransform)("g'"), "_g'");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepDownTransform)("G,"), "_G,");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepDownTransform)("G,2"), "_G,2");
            assert_1.default.equal((0, transformPitches_1.transposeHalfStepDownTransform)("G,/2"), "_G,/2");
        });
        it("1 step up", function () {
            assert_1.default.equal((0, transformPitches_1.transposeStepUpTransform)("C,"), "D,");
            assert_1.default.equal((0, transformPitches_1.transposeStepUpTransform)("B,"), "^C");
            assert_1.default.equal((0, transformPitches_1.transposeStepUpTransform)("_B,"), "C");
            assert_1.default.equal((0, transformPitches_1.transposeStepUpTransform)("_B,/"), "C/");
            assert_1.default.equal((0, transformPitches_1.transposeStepUpTransform)("_B,4"), "C4");
            assert_1.default.equal((0, transformPitches_1.transposeStepUpTransform)("_A,", "[K:Bb]"), "_B,");
        });
        it("converts single notes to rest", function () {
            assert_1.default.equal((0, transformPitches_1.convertToRestTransform)("^g'"), "z");
            assert_1.default.equal((0, transformPitches_1.convertToRestTransform)("a'"), "z");
            assert_1.default.equal((0, transformPitches_1.convertToRestTransform)("^G,"), "z");
            assert_1.default.equal((0, transformPitches_1.convertToRestTransform)("g'"), "z");
            assert_1.default.equal((0, transformPitches_1.convertToRestTransform)("G,"), "z");
        });
        it("converts enharmonias without key indication", function () {
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^c"), "_d");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^d"), "_e");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^e"), "f");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^f"), "_g");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^g"), "_a");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^a"), "_b");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^b"), "c'");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("c'"), "^b");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("_c"), "B");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("_f"), "e");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^C"), "_D");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^D"), "_E");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^E"), "F");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^F"), "_G");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^G"), "_A");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^A"), "_B");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^B"), "c");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("C"), "^B,");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("_C,"), "B,,");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("_F"), "E");
        });
        it("converts enharmonias to match the given key", function () {
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^c", `[K: Ab]`), "_d");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^d", `[K: Bb minor]`), "_e");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^e", `[K: C]`), "f");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^f", `[K: Db]`), "_g");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^g", `[K: Bb minor]`), "_a");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^a", `[K: F]`), "_b");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^b", `[K: Ab]`), "c'");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("_c", `[K: C]`), "B");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("_f", `[K: C]`), "e");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^C", `[K: Gb]`), "_D");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^D", `[K: Eb minor]`), "_E");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^E", `[K: Eb minor]`), "F");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^F", `[K: Db]`), "_G");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^G", `[K: Ab]`), "_A");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("^A", `[K: Ab]`), "_B");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("_D", `[K: A]`), "^C");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("_E", `[K: C# minor]`), "^D");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("_G", `[K: C# minor]`), "^F");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("_A", `[K: F# minor]`), "^G");
            assert_1.default.equal((0, transformPitches_1.convertToEnharmoniaTransform)("_B", `[K: B]`), "^A");
        });
    });
    describe("using dispatcher function", function () {
        it("turn notes to rests", function () {
            assert_1.default.equal((0, testTransposeFunctions_1.turnNotesToRests)("C,E,^G,C"), "zzzz");
            assert_1.default.equal((0, testTransposeFunctions_1.turnNotesToRests)("CE^Gc"), "zzzz");
            assert_1.default.equal((0, testTransposeFunctions_1.turnNotesToRests)("ce^gc'"), "zzzz");
            assert_1.default.equal((0, testTransposeFunctions_1.turnNotesToRests)("c'_e'g'c''"), "zzzz");
        });
        it("octave down", function () {
            assert_1.default.equal((0, testTransposeFunctions_1.transposeOctDown)("C,E,^G,C"), "C,,E,,^G,,C,");
            assert_1.default.equal((0, testTransposeFunctions_1.transposeOctDown)("CE^Gc"), "C,E,^G,C");
            assert_1.default.equal((0, testTransposeFunctions_1.transposeOctDown)("ce^gc'"), "CE^Gc");
            assert_1.default.equal((0, testTransposeFunctions_1.transposeOctDown)("c'_e'g'c''"), "c_egc'");
        });
        it("octave up", function () {
            assert_1.default.equal((0, testTransposeFunctions_1.transposeOctUp)("C,,E,,^G,,C,"), "C,E,^G,C");
            assert_1.default.equal((0, testTransposeFunctions_1.transposeOctUp)("C,E,^G,C"), "CE^Gc");
            assert_1.default.equal((0, testTransposeFunctions_1.transposeOctUp)("C_E^Gc"), "c_e^gc'");
            assert_1.default.equal((0, testTransposeFunctions_1.transposeOctUp)("c_e^gc'"), "c'_e'^g'c''");
        });
        it("1/2 step down", function () {
            assert_1.default.equal((0, testTransposeFunctions_1.transposeHalfStepDown)("C,,_F,,^G,,_C,"), "B,,_E,,G,,_B,");
            assert_1.default.equal((0, testTransposeFunctions_1.transposeHalfStepDown)("_b,E,^G,F"), "a,_E,G,E");
        });
        it("1/2 step up", function () {
            assert_1.default.equal((0, testTransposeFunctions_1.transposeHalfStepUp)("^E,,^B,,^G,,^C,"), "^F,,^C,,A,,D,");
            assert_1.default.equal((0, testTransposeFunctions_1.transposeHalfStepUp)("C,E,_G,B,,_e"), "^C,F,G,C,,e");
        });
        it("1 step up", function () {
            assert_1.default.equal((0, dispatcher_1.dispatcher)("C,E,_G,B,,_e", { pos: 0 }, transformPitches_1.transposeStepUpTransform), "D,^F,^G,^C,f");
            assert_1.default.equal((0, dispatcher_1.dispatcher)("C,E,G,B,,e", { pos: 0 }, (note) => (0, transformPitches_1.transposeStepUpTransform)(note, "[K:A]")), "D,^F,A,^C,^f");
        });
        it("1 step down", function () {
            assert_1.default.equal((0, dispatcher_1.dispatcher)("C,E,^F,B,,_e", { pos: 0 }, transformPitches_1.transposeStepDownTransform), "_B,D,E,A,_d");
            assert_1.default.equal((0, dispatcher_1.dispatcher)("^C,E,G,B,,e", { pos: 0 }, (note) => (0, transformPitches_1.transposeStepDownTransform)(note, "[K:A]")), "B,D,^E,A,d");
        });
        it("no notes in string - do not transpose anything", function () {
            assert_1.default.equal((0, testTransposeFunctions_1.transposeHalfStepDown)("(z4|z4|)"), "(z4|z4|)");
        });
        it("transpose a full line", function () {
            assert_1.default.equal((0, testTransposeFunctions_1.transposeHalfStepUp)(fullTextLine), fullTextLineUpAHalfStep);
            assert_1.default.equal((0, testTransposeFunctions_1.transposeHalfStepDown)(fullTextLine), fullTextLineDownAHalfStep);
        });
        /*
    describe('using file structure', function() {
        it('provides courtesy accidentals for the current measure', function(){
          assert.ok(false);
        });
        it('provides enharmonias depending on current key', function(){
          assert.ok(false);
        });
        it('transpose score header', function(){
          assert.ok(false);
        });
        it('transpose key changes in nomenclature brackets', function(){
          assert.ok(false);
        });
        it('transpose full score including the header', function(){
          assert.ok(false);
        });
      });
      */
    });
});
describe("Nomenclature", function () {
    let nomenclature = "% this is a line comment";
    let nomenclature2 = "w: lyrics to a song";
    let nomenclature3 = "K: key change";
    let notNomenclature = "blalbalbala";
    describe("using detector function", function () {
        it("recognizes line comments", function () {
            assert_1.default.ok((0, parseNomenclature_1.isNomenclatureLine)(nomenclature, { pos: 0 }));
            assert_1.default.ok((0, parseNomenclature_1.isNomenclatureLine)(nomenclature2, { pos: 0 }));
            assert_1.default.ok((0, parseNomenclature_1.isNomenclatureLine)(nomenclature3, { pos: 0 }));
            assert_1.default.ok(!(0, parseNomenclature_1.isNomenclatureLine)(notNomenclature, { pos: 0 }));
        });
        it("leave symbols untouched", function () {
            const symbol = "!fermata!";
            assert_1.default.equal((0, parseNomenclature_1.jumpToEndOfSymbol)(symbol, { pos: 0 }, () => "", ""), symbol);
        });
        it("differenciates chord from nomenclature brackets", function () {
            assert_1.default.ok((0, parseNomenclature_1.isNomenclatureTag)("[K: F minor]", { pos: 0 }));
            assert_1.default.ok(!(0, parseNomenclature_1.isNomenclatureTag)("[abcde]", { pos: 0 }));
        });
    });
    describe("using dispatcher function", function () {
        it("recognizes line comments", function () {
            assert_1.default.equal((0, dispatcher_1.dispatcher)(nomenclature, { pos: 0 }, () => "", ""), nomenclature);
            assert_1.default.equal((0, dispatcher_1.dispatcher)(nomenclature2, { pos: 0 }, () => "", ""), nomenclature2);
            assert_1.default.equal((0, dispatcher_1.dispatcher)(nomenclature3, { pos: 0 }, () => "", ""), nomenclature3);
            assert_1.default.notEqual((0, dispatcher_1.dispatcher)(notNomenclature, { pos: 0 }, () => "", ""), notNomenclature);
        });
        it("parses overlapping tags, preserves line comments", function () {
            let annotation = 'Ab"wd"cD,E, |\n% this is a linecomment \n"str soli"A,B,CD |\n EFG"/str /wd "D^FAc';
            (0, chai_1.expect)((0, annotationsActions_1.findInstrumentCalls)(annotation, { pos: 0 })).to.eql([
                {
                    wd: 'zzcD,E, |\n% this is a linecomment \n"soli"A,B,CD |\n EFGzzzz',
                },
                {
                    str: 'zzzzz |\n% this is a linecomment \n"soli"A,B,CD |\n EFGzzzz',
                },
            ]);
        });
        it("parses overlapping tags, preserves lyrics' lines", function () {
            let annotation = 'Ab"wd"cD,E, |\nw: these are some lyrics\n"str soli"A,B,CD |\n EFG"/str /wd "D^FAc';
            (0, chai_1.expect)((0, annotationsActions_1.findInstrumentCalls)(annotation, { pos: 0 })).to.eql([
                {
                    wd: 'zzcD,E, |\nw: these are some lyrics\n"soli"A,B,CD |\n EFGzzzz',
                },
                {
                    str: 'zzzzz |\nw: these are some lyrics\n"soli"A,B,CD |\n EFGzzzz',
                },
            ]);
        });
        it("parses overlapping tags, preserves keychanges", function () {
            let annotation = 'Ab"wd"cD,E, |\nK: this is a key change\n"str soli"A,B,CD |\n EFG"/str /wd "D^FAc';
            (0, chai_1.expect)((0, annotationsActions_1.findInstrumentCalls)(annotation, { pos: 0 })).to.eql([
                {
                    wd: 'zzcD,E, |\nK: this is a key change\n"soli"A,B,CD |\n EFGzzzz',
                },
                {
                    str: 'zzzzz |\nK: this is a key change\n"soli"A,B,CD |\n EFGzzzz',
                },
            ]);
        });
        it("leave symbols untouched", function () {
            const symbol = "abc!fermata!abc";
            assert_1.default.equal((0, dispatcher_1.dispatcher)(symbol, { pos: 0 }, (note) => note, ""), symbol);
        });
        it("differenciates chord from nomenclature brackets", function () {
            assert_1.default.equal((0, dispatcher_1.dispatcher)("[K: F minor]", { pos: 0 }, (n) => ""), "[K: F minor]");
            assert_1.default.equal((0, dispatcher_1.dispatcher)("[abcde]", { pos: 0 }, (n) => ""), "[]");
            assert_1.default.equal((0, dispatcher_1.dispatcher)("[abcde][K: F minor]", { pos: 0 }, (n) => ""), "[][K: F minor]");
        });
    });
});
