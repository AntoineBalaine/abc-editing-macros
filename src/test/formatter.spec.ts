import { assert, expect } from "chai";
import { abcText } from "../annotationsActions";
import { formatterDispatch } from "../dispatcher";
import { separateHeaderAndBody } from "../fileStructureActions";
import {
  countNotesInSubGroup,
  findEndOfChord,
  findEndOfNote,
  findFirstPrecedingMusicLineIndex,
  findSubdivisionsInNoteGroup,
  findVoicesHandles,
  formatLineSystem,
  formatNoteGroupsAndCorrespondingLyrics,
  formatScore,
  spliceText,
  startAllNotesAtSameIndexInLine,
} from "../formatter";
const multiVoice_Tune = `X:1
T:Zocharti Loch
C:Louis Lewandowski (1821-1894)
M:C
Q:1/4=76
%%score (T1 T2) (B1 B2)
V:T1           clef=treble-8  name="Tenore I"   snm="T.I"
V:T2           clef=treble-8  name="Tenore II"  snm="T.II"
V:B1  middle=d clef=bass      name="Basso I"    snm="B.I"  transpose=-24
V:B2  middle=d clef=bass      name="Basso II"   snm="B.II" transpose=-24
K:Gm
%            End of header, start of tune body:
% 1
[V:T1]  (B2c2 d2g2)  | f6e2      | (d2c2 d2)e2 | d4 c2z2 |
[V:T2]  (G2A2 B2e2)  | d6c2      | (B2A2 B2)c2 | B4 A2z2 |
[V:B1]       z8      | z2f2 g2a2 | b2z2 z2 e2  | f4 f2z2 |
[V:B2]       x8      |     x8    |      x8     |    x8   |
% 5
[V:T1]  (B2c2 d2g2)  | f8        | d3c (d2fe)  | H d6    ||
[V:T2]       z8      |     z8    | B3A (B2c2)  | H A6    ||
[V:B1]  (d2f2 b2e'2) | d'8       | g3g  g4     | H^f6    ||
[V:B2]       x8      | z2B2 c2d2 | e3e (d2c2)  | H d6    ||
% 9
[V:T1]  (B2c2 d2g2)  | f8        | d3c (d2fe)  | H d6    ||
[V:T2]       z8      |     z8    | B3A (B2c2)  | H A6    ||
[V:B1]  (d2f2 b2e'2) | d'8       | g3g  g4     | H^f6    ||
% 12
[V:B1]  (d2f2 b2e'2) | d'8       | g3g  g4     | H^f6    ||
`;
const multiVoice_Tune_formatted = `X:1
T:Zocharti Loch
C:Louis Lewandowski (1821-1894)
M:C
Q:1/4=76
%%score (T1 T2) (B1 B2)
V:T1           clef=treble-8  name="Tenore I"   snm="T.I"
V:T2           clef=treble-8  name="Tenore II"  snm="T.II"
V:B1  middle=d clef=bass      name="Basso I"    snm="B.I"  transpose=-24
V:B2  middle=d clef=bass      name="Basso II"   snm="B.II" transpose=-24
K:Gm
%            End of header, start of tune body:
% 1
[V:T1] (B2c2 d2g2) | f6e2      | (d2c2 d2)e2 | d4 c2z2 |
[V:T2] (G2A2 B2e2) | d6c2      | (B2A2 B2)c2 | B4 A2z2 |
[V:B1] z8          | z2f2 g2a2 | b2z2 z2 e2  | f4 f2z2 |
[V:B2] x8          | x8        | x8          | x8      |
% 5
[V:T1] (B2c2 d2g2)  | f8        | d3c (d2fe) | H d6 ||
[V:T2] z8           | z8        | B3A (B2c2) | H A6 ||
[V:B1] (d2f2 b2e'2) | d'8       | g3g  g4    | H^f6 ||
[V:B2] x8           | z2B2 c2d2 | e3e (d2c2) | H d6 ||
% 9
[V:T1] (B2c2 d2g2)  | f8        | d3c (d2fe) | H d6 ||
[V:T2] z8           | z8        | B3A (B2c2) | H A6 ||
[V:B1] (d2f2 b2e'2) | d'8       | g3g  g4    | H^f6 ||
% 12
[V:B1] (d2f2 b2e'2) | d'8 | g3g  g4 | H^f6 ||
`;

let headerAndBody = separateHeaderAndBody(multiVoice_Tune as abcText, {
  pos: 0,
});
describe("Formatter", function () {
  describe("extracts voices names", function () {
    const voicesNames = ["T1", "T2", "B1", "B2"];
    it("extracts multiple voices", function () {
      if (!!voicesNames && voicesNames.length > 0) {
        assert.deepEqual(
          findVoicesHandles(headerAndBody.headerText).map((i) => i?.toString()),
          voicesNames
        );
      }
    });
  });
  describe("formats text", function () {
    it("aligns barlines in score system", function () {
      const unformattedLine = `[V:T1]  (B2c2 d2g2)  | f6e2      | (d2c2 d2)e2 | d4 c2z2 |
[V:T2](G2A2 B2e2)  | d6c2  | (B2A2 B2)c2| B4 A2z2|`;
      const formattedLine = `[V:T1] (B2c2 d2g2) | f6e2 | (d2c2 d2)e2 | d4 c2z2 |
[V:T2] (G2A2 B2e2) | d6c2 | (B2A2 B2)c2 | B4 A2z2 |`;

      assert.equal(
        formatLineSystem(0, unformattedLine.length + 1, unformattedLine),
        formattedLine
      );
    });

    it("removes useless double spaces", function () {
      const unformattedLine = `[V:T1](B2c2 d2g2)  |f6e2      |`;
      const formattedLine = `[V:T1] (B2c2 d2g2) | f6e2 |`;

      assert.equal(
        formatLineSystem(0, unformattedLine.length + 1, unformattedLine),
        formattedLine
      );
    });
    it("inserts spaces around bar lines", function () {
      const unformatted = "[V:T1](B2c2 d2g2)|f6e2|(d2c2 d2)e2|d4 c2z2|";
      const formatted = "[V:T1] (B2c2 d2g2) | f6e2 | (d2c2 d2)e2 | d4 c2z2 |";
      assert.equal(
        formatLineSystem(0, unformatted.length + 1, unformatted),
        formatted
      );
    });
    describe("aligns starts of notes in system", function () {
      it("starts music at the same index for every line in system", function () {
        const unformatted = `
[V: str] abcd |
[V: wd] abcd |
[V:3] abcd |
w: abcd |`;

        const formatted = `
[V: str] abcd |
[V: wd]  abcd |
[V:3]    abcd |
w:       abcd |`;
        assert.equal(startAllNotesAtSameIndexInLine(unformatted), formatted);
      });
      it("inserts spaces between nomenclature tag and start of music", function () {
        const unformatted = `[V:T1](B2c2 d2g2)  |f6e2`;
        const formatted = `[V:T1] (B2c2 d2g2)  |f6e2`;
        assert.equal(startAllNotesAtSameIndexInLine(unformatted), formatted);
      });
    });
  });
  describe("using dispatcher function", function () {
    it("jumps to end of annotations", function () {
      const unformatted = `[V:1] z4 (GFED ^C=B,A,G,) | (de^fg) z8 | "Cmin \\n"z8  | 
[V:2]    z4 (_E_DC_B, A,G,F,_E,)|(de^fg) z8| "Cmin \\n"z8  | `;
      const formatted = `[V:1] z4 (GFED ^C=B,A,G,)     | (de^fg) z8 | "Cmin \\n"z8 | 
[V:2] z4 (_E_DC_B, A,G,F,_E,) | (de^fg) z8 | "Cmin \\n"z8 | `;

      assert.equal(
        formatLineSystem(0, unformatted.length, unformatted),
        formatted
      );
    });
  });

  /*   describe("formats a whole score", function () {
    it("splices chunks of score correctly", function () {
      assert.equal("Hallo", spliceText("hello", 0, 2, "Ha"));
    });
    it("formats the whole score", function () {
      assert.equal(formatScore(multiVoice_Tune), multiVoice_Tune_formatted);
    });
  }); */
  describe("format lyrics", function () {
    describe("using helper functions", function () {
      it("finds ends of chords in string", function () {
        assert.equal(findEndOfChord("[^C=B_E]", { pos: 0 }), 8);
        assert.equal(findEndOfChord("[^C,=B_E]2", { pos: 0 }), 10);
        assert.equal(findEndOfChord("[^C=b''_E]/4", { pos: 0 }), 12);
        assert.equal(findEndOfChord("[^C=B_E]/4", { pos: 0 }), 10);
      });
      it("finds ends of notes in string", function () {
        assert.equal(findEndOfNote("^C///=B", { pos: 0 }), 5);
        assert.equal(findEndOfNote("^c''=B", { pos: 0 }), 4);
        assert.equal(findEndOfNote("^C,,=B", { pos: 0 }), 4);
        assert.equal(findEndOfNote("^C,,/2=B", { pos: 0 }), 6);
        assert.equal(findEndOfNote("^c''///=B", { pos: 0 }), 7);
      });
      it("finds first preceding music line index", function () {
        const text1 = `
[V:1] abcd |
w: a lyric line
[V:2] abcd |
w: a second lyric line`;
        const text2 = `
[V:1] abcd |
K:C a nomenclature line
w: a lyricline`;
        const text3 = `
[V:1] abcd |
w: a lyricline
w: a second lyricline`;
        assert.equal(
          findFirstPrecedingMusicLineIndex(
            text1.split("\n").filter((n) => n),
            3
          ),
          2
        );
        assert.equal(
          findFirstPrecedingMusicLineIndex(
            text2.split("\n").filter((n) => n),
            2
          ),
          0
        );
        assert.equal(
          findFirstPrecedingMusicLineIndex(
            text3.split("\n").filter((n) => n),
            2
          ),
          -1
        );
      });
      it("finds subdivisions in a note group", function () {
        const grp1 = `_a_bc_d!fermata!_A2`;
        const grp1Divisé = [`_a_bc_d!fermata!`, `_A2`];
        const grp2 = `_a_bc_d!fermata!_A2abc"annotation"abdec`;
        const grp2Divisé = [`_a_bc_d!fermata!`, `_A2abc"annotation"`, `abdec`];
        const grp3 = `_a_bc_d!fermata!_A2abc"annotation"abdec[K:C]^C,,adec`;
        const grp3Divisé = [
          `_a_bc_d!fermata!`,
          `_A2abc"annotation"`,
          `abdec[K:C]`,
          `^C,,adec`,
        ];
        assert.deepEqual(findSubdivisionsInNoteGroup(grp1, ""), {
          subdivisionsInNoteGroup: grp1Divisé,
        });
        assert.deepEqual(findSubdivisionsInNoteGroup(grp2, ""), {
          subdivisionsInNoteGroup: grp2Divisé,
        });
        assert.deepEqual(findSubdivisionsInNoteGroup(grp3, ""), {
          subdivisionsInNoteGroup: grp3Divisé,
        });
      });
      it("counts notes in group of notes", function () {
        assert.equal(countNotesInSubGroup("CCGG"), 4);
        assert.equal(countNotesInSubGroup("^C/C_G//=G/2"), 4);
        assert.equal(countNotesInSubGroup("CC!fermata!"), 2);
        assert.equal(countNotesInSubGroup("^C//_B2!fermata!"), 2);
        assert.equal(countNotesInSubGroup('^C//_B2"this is an annotation"'), 2);
      });
      it("formats Note Groups with Corresponding Lyrics", function () {
        const Line1 = `[V:T1]  CC GG AA G2 | FF EE DD C2 |
w: À vous di rai je ma man | Ce qui cau se mon tour ment | `;

        assert.deepEqual(
          formatNoteGroupsAndCorrespondingLyrics(
            `CCGG`,
            `À vous di rai je ma man`.split(" ")
          ).__return,
          {
            noteGroup: "CCGG         ",
            lyricGroup: "À vous di rai",
          }
        );
        assert.deepEqual(
          formatNoteGroupsAndCorrespondingLyrics(
            `CC!fermata!GG`,
            `À vous di rai je ma man`.split(" ")
          ).__return,
          {
            noteGroup: "CC!fermata!GG    ",
            lyricGroup: "À vous     di rai",
          }
        );
      });
    });
  });
});
