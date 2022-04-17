import { noteDispatcher, isNoteToken } from "../dispatcher";
import {
  convertToEnharmoniaTransform,
  convertToRestTransform,
  KeyIndicationType,
  octaviateDownTransform,
  octaviateUpTransform,
  transposeHalfStepDownTransform,
  transposeHalfStepUpTransform,
  transposeStepDownTransform,
  transposeStepUpTransform,
} from "../transformPitches";
import {
  transposeHalfStepDown,
  transposeHalfStepUp,
  transposeOctDown,
  transposeOctUp,
  turnNotesToRests,
} from "./testTransposeFunctions";
import {
  dispatcherProps,
  isNomenclatureLine,
  isNomenclatureTag,
  jumpToEndOfSymbol,
} from "../parseNomenclature";
import assert from "assert";
import {
  abcText,
  annotationStyle,
  findInstrumentCalls,
} from "../annotationsActions";
import { expect } from "chai";

const fullTextLine =
  "(E,A,^CE) (GFED ^C=B,A,G,) | (F,A,DF) ADFA dBcA | G,DGA B(G^FG) _eGDg | [A,G^C]12 | [A,Fd]12 | [A,Ed]12 | [A,E^c]12 | [D,A,Fd]12 ||";
const fullTextLineDownAHalfStep =
  "(_E,_A,C_E) (_GE_E_D C_B,_A,_G,) | (E,_A,_DE) _A_DE_A _d_Bb_A | _G,_D_G_A _B(_GF_G) d_G_D_g | [_A,_GC]12 | [_A,E_d]12 | [_A,_E_d]12 | [_A,_Ec]12 | [_D,_A,E_d]12 ||";
const fullTextLineUpAHalfStep =
  "(F,^A,DF) (^G^FF^D DC,^A,^G,) | (^F,^A,^D^F) ^A^D^F^A ^dC^c^A | ^G,^D^G^A C(^GG^G) e^G^D^g | [^A,^GD]12 | [^A,^F^d]12 | [^A,F^d]12 | [^A,Fd]12 | [^D,^A,^F^d]12 ||";
const fullTextLineUpAStep =
  "(F,B,^D^F) (AG^FE ^D^C,B,A,) | (G,B,EG) BEGB e^CdB | A,EAB ^C(A^GA) fAEa | [B,A^D]12 | [B,Ge]12 | [B,^Fe]12 | [B,^F^d]12 | [E,B,Ge]12 ||";
const fullTextLineDownAStep =
  "(D,G,BD) (F_EDC BA,G,F,) | (_E,G,C_E) GC_EG cA_bG | F,CFG A(FEF) _dFEf | [G,FB]12 | [G,_Ec]12 | [G,Dc]12 | [G,Db]12 | [C,G,_Ec]12 ||";

describe("Transpose and rest", function () {
  describe("using letterTransform functions", function () {
    it("octave down single letters", function () {
      assert.equal(octaviateDownTransform("^a''"), "^a'");
      assert.equal(octaviateDownTransform("^a'"), "^a");
      assert.equal(octaviateDownTransform("^a"), "^A");
      assert.equal(octaviateDownTransform("^A"), "^A,");
      assert.equal(octaviateDownTransform("^A,"), "^A,,");
      assert.equal(octaviateDownTransform("^A2"), "^A,2");
      assert.equal(octaviateDownTransform("^A/2"), "^A,/2");
    });
    it("octave up single letters", function () {
      assert.equal(octaviateUpTransform("A,,"), "A,");
      assert.equal(octaviateUpTransform("A,"), "A");
      assert.equal(octaviateUpTransform("A"), "a");
      assert.equal(octaviateUpTransform("a"), "a'");
      assert.equal(octaviateUpTransform("a'"), "a''");
      assert.equal(octaviateUpTransform("^A2"), "^a2");
      assert.equal(octaviateUpTransform("^A/2"), "^a/2");
    });
    it("up a half step", function () {
      assert.equal(transposeHalfStepUpTransform("^e'"), "^f'");
      assert.equal(transposeHalfStepUpTransform("^b'"), "^c'");
      assert.equal(transposeHalfStepUpTransform("e'"), "f'");
      assert.equal(transposeHalfStepUpTransform("E,"), "F,");
      assert.equal(transposeHalfStepUpTransform("b'"), "c'");
      assert.equal(transposeHalfStepUpTransform("B,"), "C,");
      assert.equal(transposeHalfStepUpTransform("g'"), "^g'");
      assert.equal(transposeHalfStepUpTransform("^g'"), "a'");
      assert.equal(transposeHalfStepUpTransform("G,"), "^G,");
      assert.equal(transposeHalfStepUpTransform("_g'"), "g'");
      assert.equal(transposeHalfStepUpTransform("_G,"), "G,");
      assert.equal(transposeHalfStepUpTransform("_G,/"), "G,/");
      assert.equal(transposeHalfStepUpTransform("_G,2"), "G,2");
      assert.equal(transposeHalfStepUpTransform("_G,/2"), "G,/2");
    });
    it("down a half step", function () {
      assert.equal(transposeHalfStepDownTransform("_e"), "d");
      assert.equal(transposeHalfStepDownTransform("_d"), "c");
      assert.equal(transposeHalfStepDownTransform("_a"), "g");
      assert.equal(transposeHalfStepDownTransform("^f'"), "f'");
      assert.equal(transposeHalfStepDownTransform("^c'"), "c'");
      assert.equal(transposeHalfStepDownTransform("f'"), "e'");
      assert.equal(transposeHalfStepDownTransform("c'"), "b'");
      assert.equal(transposeHalfStepDownTransform("C,"), "B,");
      assert.equal(transposeHalfStepDownTransform("^g'"), "g'");
      assert.equal(transposeHalfStepDownTransform("a'"), "_a'");
      assert.equal(transposeHalfStepDownTransform("^G,"), "G,");
      assert.equal(transposeHalfStepDownTransform("g'"), "_g'");
      assert.equal(transposeHalfStepDownTransform("G,"), "_G,");
      assert.equal(transposeHalfStepDownTransform("G,2"), "_G,2");
      assert.equal(transposeHalfStepDownTransform("G,/2"), "_G,/2");
    });
    it("1 step up", function () {
      assert.equal(transposeStepUpTransform("C,"), "D,");
      assert.equal(transposeStepUpTransform("B,"), "^C");
      assert.equal(transposeStepUpTransform("_B,"), "C");
      assert.equal(transposeStepUpTransform("_B,/"), "C/");
      assert.equal(transposeStepUpTransform("_B,4"), "C4");
      assert.equal(
        transposeStepUpTransform("_A,", "[K:Bb]" as KeyIndicationType),
        "_B,"
      );
    });
    it("converts single notes to rest", function () {
      assert.equal(convertToRestTransform("^g'"), "z");
      assert.equal(convertToRestTransform("a'"), "z");
      assert.equal(convertToRestTransform("^G,"), "z");
      assert.equal(convertToRestTransform("g'"), "z");
      assert.equal(convertToRestTransform("G,"), "z");
    });
    it("converts enharmonias without key indication", function () {
      assert.equal(convertToEnharmoniaTransform("^c"), "_d");
      assert.equal(convertToEnharmoniaTransform("^d"), "_e");
      assert.equal(convertToEnharmoniaTransform("^e"), "f");
      assert.equal(convertToEnharmoniaTransform("^f"), "_g");
      assert.equal(convertToEnharmoniaTransform("^g"), "_a");
      assert.equal(convertToEnharmoniaTransform("^a"), "_b");
      assert.equal(convertToEnharmoniaTransform("^b"), "c'");
      assert.equal(convertToEnharmoniaTransform("c'"), "^b");
      assert.equal(convertToEnharmoniaTransform("_c"), "B");
      assert.equal(convertToEnharmoniaTransform("_f"), "e");

      assert.equal(convertToEnharmoniaTransform("^C"), "_D");
      assert.equal(convertToEnharmoniaTransform("^D"), "_E");
      assert.equal(convertToEnharmoniaTransform("^E"), "F");
      assert.equal(convertToEnharmoniaTransform("^F"), "_G");
      assert.equal(convertToEnharmoniaTransform("^G"), "_A");
      assert.equal(convertToEnharmoniaTransform("^A"), "_B");
      assert.equal(convertToEnharmoniaTransform("^B"), "c");
      assert.equal(convertToEnharmoniaTransform("C"), "^B,");
      assert.equal(convertToEnharmoniaTransform("_C,"), "B,,");
      assert.equal(convertToEnharmoniaTransform("_F"), "E");
    });
    it("converts enharmonias to match the given key", function () {
      assert.equal(
        convertToEnharmoniaTransform("^c", `[K: Ab]` as const),
        "_d"
      );
      assert.equal(
        convertToEnharmoniaTransform("^d", `[K: Bb minor]` as const),
        "_e"
      );
      assert.equal(convertToEnharmoniaTransform("^e", `[K: C]` as const), "f");
      assert.equal(
        convertToEnharmoniaTransform("^f", `[K: Db]` as const),
        "_g"
      );
      assert.equal(
        convertToEnharmoniaTransform("^g", `[K: Bb minor]` as const),
        "_a"
      );
      assert.equal(convertToEnharmoniaTransform("^a", `[K: F]` as const), "_b");
      assert.equal(
        convertToEnharmoniaTransform("^b", `[K: Ab]` as const),
        "c'"
      );
      assert.equal(convertToEnharmoniaTransform("_c", `[K: C]` as const), "B");
      assert.equal(convertToEnharmoniaTransform("_f", `[K: C]` as const), "e");

      assert.equal(
        convertToEnharmoniaTransform("^C", `[K: Gb]` as const),
        "_D"
      );
      assert.equal(
        convertToEnharmoniaTransform("^D", `[K: Eb minor]` as const),
        "_E"
      );
      assert.equal(
        convertToEnharmoniaTransform("^E", `[K: Eb minor]` as const),
        "F"
      );
      assert.equal(
        convertToEnharmoniaTransform("^F", `[K: Db]` as const),
        "_G"
      );
      assert.equal(
        convertToEnharmoniaTransform("^G", `[K: Ab]` as const),
        "_A"
      );
      assert.equal(
        convertToEnharmoniaTransform("^A", `[K: Ab]` as const),
        "_B"
      );

      assert.equal(convertToEnharmoniaTransform("_D", `[K: A]` as const), "^C");
      assert.equal(
        convertToEnharmoniaTransform("_E", `[K: C# minor]` as const),
        "^D"
      );
      assert.equal(
        convertToEnharmoniaTransform("_G", `[K: C# minor]` as const),
        "^F"
      );
      assert.equal(
        convertToEnharmoniaTransform("_A", `[K: F# minor]` as const),
        "^G"
      );
      assert.equal(convertToEnharmoniaTransform("_B", `[K: B]` as const), "^A");
    });
  });
  describe("using dispatcher function", function () {
    it("turn notes to rests", function () {
      assert.equal(turnNotesToRests("C,E,^G,C"), "zzzz");
      assert.equal(turnNotesToRests("CE^Gc"), "zzzz");
      assert.equal(turnNotesToRests("ce^gc'"), "zzzz");
      assert.equal(turnNotesToRests("c'_e'g'c''"), "zzzz");
    });
    it("octave down", function () {
      assert.equal(transposeOctDown("C,E,^G,C"), "C,,E,,^G,,C,");
      assert.equal(transposeOctDown("CE^Gc"), "C,E,^G,C");
      assert.equal(transposeOctDown("ce^gc'"), "CE^Gc");
      assert.equal(transposeOctDown("c'_e'g'c''"), "c_egc'");
    });
    it("octave up", function () {
      assert.equal(transposeOctUp("C,,E,,^G,,C,"), "C,E,^G,C");
      assert.equal(transposeOctUp("C,E,^G,C"), "CE^Gc");
      assert.equal(transposeOctUp("C_E^Gc"), "c_e^gc'");
      assert.equal(transposeOctUp("c_e^gc'"), "c'_e'^g'c''");
    });
    it("1/2 step down", function () {
      assert.equal(transposeHalfStepDown("C,,_F,,^G,,_C,"), "B,,_E,,G,,_B,");
      assert.equal(transposeHalfStepDown("_b,E,^G,F"), "a,_E,G,E");
    });
    it("1/2 step up", function () {
      assert.equal(transposeHalfStepUp("^E,,^B,,^G,,^C,"), "^F,,^C,,A,,D,");
      assert.equal(transposeHalfStepUp("C,E,_G,B,,_e"), "^C,F,G,C,,e");
    });
    it("1 step up", function () {
      assert.equal(
        noteDispatcher({
          text: "C,E,_G,B,,_e",
          context: { pos: 0 },
          transformFunction: transposeStepUpTransform,
        }),
        "D,^F,^G,^C,f"
      );
      assert.equal(
        noteDispatcher({
          text: "C,E,G,B,,e",
          context: { pos: 0 },
          transformFunction: (note: string) =>
            transposeStepUpTransform(note, "[K:A]"),
        }),
        "D,^F,A,^C,^f"
      );
    });
    it("1 step down", function () {
      assert.equal(
        noteDispatcher({
          text: "C,E,^F,B,,_e",
          context: { pos: 0 },
          transformFunction: transposeStepDownTransform,
        }),
        "_B,D,E,A,_d"
      );
      assert.equal(
        noteDispatcher({
          text: "^C,E,G,B,,e",
          context: { pos: 0 },
          transformFunction: (note: string) =>
            transposeStepDownTransform(note, "[K:A]"),
        }),
        "B,D,^E,A,d"
      );
    });
    it("no notes in string - do not transpose anything", function () {
      assert.equal(transposeHalfStepDown("(z4|z4|)"), "(z4|z4|)");
    });
    it("transpose a full line", function () {
      assert.equal(transposeHalfStepUp(fullTextLine), fullTextLineUpAHalfStep);
      assert.equal(
        transposeHalfStepDown(fullTextLine),
        fullTextLineDownAHalfStep
      );
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
      assert.ok(isNomenclatureLine(nomenclature as abcText, { pos: 0 }));
      assert.ok(isNomenclatureLine(nomenclature2 as abcText, { pos: 0 }));
      assert.ok(isNomenclatureLine(nomenclature3 as abcText, { pos: 0 }));
      assert.ok(!isNomenclatureLine(notNomenclature as abcText, { pos: 0 }));
    });
    it("leave symbols untouched", function () {
      const symbol = "!fermata!";
      assert.equal(
        jumpToEndOfSymbol({
          text: symbol,
          context: { pos: 0 },
          transformFunction: () => "",
          dispatcherFunction: noteDispatcher,
        } as dispatcherProps),
        symbol
      );
    });
    it("differenciates chord from nomenclature brackets", function () {
      assert.ok(isNomenclatureTag("[K: F minor]", { pos: 0 }));
      assert.ok(!isNomenclatureTag("[abcde]", { pos: 0 }));
    });
  });
  describe("using dispatcher function", function () {
    it("recognizes line comments", function () {
      assert.equal(
        noteDispatcher({
          text: nomenclature as abcText,
          context: { pos: 0 },
          transformFunction: () => "",
          tag: "" as annotationStyle,
        }),
        nomenclature
      );
      assert.equal(
        noteDispatcher({
          text: nomenclature2 as abcText,
          context: { pos: 0 },
          transformFunction: () => "",
          tag: "" as annotationStyle,
        }),
        nomenclature2
      );
      assert.equal(
        noteDispatcher({
          text: nomenclature3 as abcText,
          context: { pos: 0 },
          transformFunction: () => "",
          tag: "" as annotationStyle,
        }),
        nomenclature3
      );
      assert.notEqual(
        noteDispatcher({
          text: notNomenclature as abcText,
          context: { pos: 0 },
          transformFunction: () => "",
          tag: "" as annotationStyle,
        }),
        notNomenclature
      );
    });
    it("parses overlapping tags, preserves line comments", function () {
      let annotation =
        'Ab"wd"cD,E, |\n% this is a linecomment \n"str soli"A,B,CD |\n EFG"/str /wd "D^FAc';
      expect(findInstrumentCalls(annotation, { pos: 0 })).to.eql([
        {
          wd: 'zzcD,E, |\n% this is a linecomment \n"soli"A,B,CD |\n EFGzzzz',
        },
        {
          str: 'zzzzz |\n% this is a linecomment \n"soli"A,B,CD |\n EFGzzzz',
        },
      ]);
    });
    it("parses overlapping tags, preserves lyrics' lines", function () {
      let annotation =
        'Ab"wd"cD,E, |\nw: these are some lyrics\n"str soli"A,B,CD |\n EFG"/str /wd "D^FAc';
      expect(findInstrumentCalls(annotation, { pos: 0 })).to.eql([
        {
          wd: 'zzcD,E, |\nw: these are some lyrics\n"soli"A,B,CD |\n EFGzzzz',
        },
        {
          str: 'zzzzz |\nw: these are some lyrics\n"soli"A,B,CD |\n EFGzzzz',
        },
      ]);
    });
    it("parses overlapping tags, preserves keychanges", function () {
      let annotation =
        'Ab"wd"cD,E, |\nK: this is a key change\n"str soli"A,B,CD |\n EFG"/str /wd "D^FAc';
      expect(findInstrumentCalls(annotation, { pos: 0 })).to.eql([
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
      assert.equal(
        noteDispatcher({
          text: symbol as abcText,
          context: { pos: 0 },
          transformFunction: (note: string) => note,
          tag: "" as annotationStyle,
        }),
        symbol
      );
    });
    it("dispatcher: differenciates chord from nomenclature brackets", function () {
      assert.equal(
        noteDispatcher({
          text: "[K: F minor]",
          context: { pos: 0 },
          transformFunction: (n) => "",
        }),
        "[K: F minor]"
      );
      assert.equal(
        noteDispatcher({
          text: "[abcde]",
          context: { pos: 0 },
          transformFunction: (n) => "",
        }),
        "[]"
      );
      assert.equal(
        noteDispatcher({
          text: "[abcde][K: F minor]",
          context: { pos: 0 },
          transformFunction: (n) => "",
        }),
        "[][K: F minor]"
      );
    });
  });
});
