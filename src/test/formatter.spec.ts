import { assert } from "chai";
import { abcText } from "../annotationsActions";
import { formatterDispatch, insertSpaceAtStartOfText } from "../dispatcher";
import { separateHeaderAndBody } from "../fileStructureActions";
import { findVoicesHandles, format, formatLineSystem } from "../formatter";
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
  /*   
  describe("finds score-systems", function () {
    //mock function call to format using sinon (probably)
    format(headerAndBody.bodyText, headerAndBody.headerText, () => {
      return "";
    });
  });
  describe("add spaces in between music and annotations", function () {
    const unformattedLine = "[V:T1](B2c2 d2g2)|f6e2|(d2c2 d2)e2 | d4 c2z2|";
    const formattedLine = "[V:T1] (B2c2 d2g2) | f6e2 | (d2c2 d2)e2 | d4 c2z2 |";

    assert.equal(
      formattedLine,
      formatLineSystem(0, unformattedLine.length + 1, unformattedLine)
    );
  }); */
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
  });
  describe("using dispatcher function", function () {
    it("inserts spaces between nomenclature tag and start of music", function () {
      const unformatted = `[V:T1](B2c2 d2g2)  |f6e2`;
      const formatted = `[V:T1] (B2c2 d2g2) |f6e2`;
      assert.equal(
        formatterDispatch({
          text: unformatted,
          context: { pos: 0 },
          transformFunction: (note: string) => note,
        }),
        formatted
      );
    });
  });
});
