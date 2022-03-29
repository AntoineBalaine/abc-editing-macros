import { assert } from "chai";
import { expect } from "chai";
import { findKeySignature, findNotesInKey } from "../parsekeySignature";
import { KeyIndicationType } from "../transformPitches";

describe("finds key signatures", function () {
  it("gets correct key signature alterations", function () {
    expect(findKeySignature("[K:C]")).to.eql([]);
    expect(findKeySignature("[K:A minor]")).to.eql([]);
    expect(findKeySignature("[K:G]")).to.eql(["^F"]);
    expect(findKeySignature("[K:E minor]")).to.eql(["^F"]);
    expect(findKeySignature("[K:D]")).to.eql(["^F", "^C"]);
    expect(findKeySignature("[K:B minor]")).to.eql(["^F", "^C"]);
    expect(findKeySignature("[K:A]")).to.eql(["^F", "^C", "^G"]);
    expect(findKeySignature("[K:F# minor]")).to.eql(["^F", "^C", "^G"]);
    expect(findKeySignature("[K:F]")).to.eql(["_B"]);
    expect(findKeySignature("[K:Bb]")).to.eql(["_B", "_E"]);
    expect(findKeySignature("[K:G minor]")).to.eql(["_B", "_E"]);
    expect(findKeySignature("[K:Eb]")).to.eql(["_B", "_E", "_A"]);
    expect(findKeySignature("[K:C minor]")).to.eql(["_B", "_E", "_A"]);
    expect(findKeySignature("[K:Ab]")).to.eql(["_B", "_E", "_A", "_D"]);
    expect(findKeySignature("[K:F minor]")).to.eql(["_B", "_E", "_A", "_D"]);
    expect(findKeySignature("[K:Gb]")).to.eql([
      "_B",
      "_E",
      "_A",
      "_D",
      "_G",
      "_C",
    ]);
    expect(findKeySignature("[K:Eb minor]")).to.eql([
      "_B",
      "_E",
      "_A",
      "_D",
      "_G",
      "_C",
    ]);
  });
  it("finds notes in major key", function () {
    expect(findNotesInKey("[K:C]" as KeyIndicationType)).to.eql([
      "c",
      "d",
      "e",
      "f",
      "g",
      "a",
      "b",
    ]);
    expect(findNotesInKey("[K:Db]" as KeyIndicationType)).to.eql([
      "c",
      "_d",
      "_e",
      "f",
      "_g",
      "_a",
      "_b",
    ]);
    expect(findNotesInKey("[K:D]" as KeyIndicationType)).to.eql([
      "^c",
      "d",
      "e",
      "^f",
      "g",
      "a",
      "b",
    ]);
    expect(findNotesInKey("[K:Eb]" as KeyIndicationType)).to.eql([
      "c",
      "d",
      "_e",
      "f",
      "g",
      "_a",
      "_b",
    ]);
    expect(findNotesInKey("[K:E]" as KeyIndicationType)).to.eql([
      "^c",
      "^d",
      "e",
      "^f",
      "^g",
      "a",
      "b",
    ]);
    expect(findNotesInKey("[K:F]" as KeyIndicationType)).to.eql([
      "c",
      "d",
      "e",
      "f",
      "g",
      "a",
      "_b",
    ]);
    expect(findNotesInKey("[K:Gb]" as KeyIndicationType)).to.eql([
      "_c",
      "_d",
      "_e",
      "f",
      "_g",
      "_a",
      "_b",
    ]);
    expect(findNotesInKey("[K:G]" as KeyIndicationType)).to.eql([
      "c",
      "d",
      "e",
      "^f",
      "g",
      "a",
      "b",
    ]);
    expect(findNotesInKey("[K:Ab]" as KeyIndicationType)).to.eql([
      "c",
      "_d",
      "_e",
      "f",
      "g",
      "_a",
      "_b",
    ]);
    expect(findNotesInKey("[K:A]" as KeyIndicationType)).to.eql([
      "^c",
      "d",
      "e",
      "^f",
      "^g",
      "a",
      "b",
    ]);
    expect(findNotesInKey("[K:Bb]" as KeyIndicationType)).to.eql([
      "c",
      "d",
      "_e",
      "f",
      "g",
      "a",
      "_b",
    ]);
    expect(findNotesInKey("[K:B]" as KeyIndicationType)).to.eql([
      "^c",
      "^d",
      "e",
      "^f",
      "^g",
      "^a",
      "b",
    ]);
  });
  it("finds notes in minor key", function () {
    expect(findNotesInKey("[K:C minor]" as KeyIndicationType)).to.eql([
      "c",
      "d",
      "_e",
      "f",
      "g",
      "_a",
      "_b",
    ]);
    expect(findNotesInKey("[K:C# minor]" as KeyIndicationType)).to.eql([
      "^c",
      "^d",
      "e",
      "^f",
      "^g",
      "a",
      "b",
    ]);
    expect(findNotesInKey("[K:D minor]" as KeyIndicationType)).to.eql([
      "c",
      "d",
      "e",
      "f",
      "g",
      "a",
      "_b",
    ]);
    expect(findNotesInKey("[K:Eb minor]" as KeyIndicationType)).to.eql([
      "_c",
      "_d",
      "_e",
      "f",
      "_g",
      "_a",
      "_b",
    ]);
    expect(findNotesInKey("[K:E minor]" as KeyIndicationType)).to.eql([
      "c",
      "d",
      "e",
      "^f",
      "g",
      "a",
      "b",
    ]);
    expect(findNotesInKey("[K:F minor]" as KeyIndicationType)).to.eql([
      "c",
      "_d",
      "_e",
      "f",
      "g",
      "_a",
      "_b",
    ]);
    expect(findNotesInKey("[K:F# minor]" as KeyIndicationType)).to.eql([
      "^c",
      "d",
      "e",
      "^f",
      "^g",
      "a",
      "b",
    ]);
    expect(findNotesInKey("[K:G minor]" as KeyIndicationType)).to.eql([
      "c",
      "d",
      "_e",
      "f",
      "g",
      "a",
      "_b",
    ]);
    expect(findNotesInKey("[K:G# minor]" as KeyIndicationType)).to.eql([
      "^c",
      "^d",
      "e",
      "^f",
      "^g",
      "^a",
      "b",
    ]);
    expect(findNotesInKey("[K:A minor]" as KeyIndicationType)).to.eql([
      "c",
      "d",
      "e",
      "f",
      "g",
      "a",
      "b",
    ]);
    expect(findNotesInKey("[K:Bb minor]" as KeyIndicationType)).to.eql([
      "c",
      "_d",
      "_e",
      "f",
      "_g",
      "_a",
      "_b",
    ]);
    expect(findNotesInKey("[K:B minor]" as KeyIndicationType)).to.eql([
      "^c",
      "d",
      "e",
      "^f",
      "g",
      "a",
      "b",
    ]);
  });
});
