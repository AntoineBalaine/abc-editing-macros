"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const parsekeySignature_1 = require("../parsekeySignature");
describe("finds key signatures", function () {
    it("gets correct key signature alterations", function () {
        (0, chai_1.expect)((0, parsekeySignature_1.findKeySignature)("[K:C]")).to.eql([]);
        (0, chai_1.expect)((0, parsekeySignature_1.findKeySignature)("[K:A minor]")).to.eql([]);
        (0, chai_1.expect)((0, parsekeySignature_1.findKeySignature)("[K:G]")).to.eql(["^F"]);
        (0, chai_1.expect)((0, parsekeySignature_1.findKeySignature)("[K:E minor]")).to.eql(["^F"]);
        (0, chai_1.expect)((0, parsekeySignature_1.findKeySignature)("[K:D]")).to.eql(["^F", "^C"]);
        (0, chai_1.expect)((0, parsekeySignature_1.findKeySignature)("[K:B minor]")).to.eql(["^F", "^C"]);
        (0, chai_1.expect)((0, parsekeySignature_1.findKeySignature)("[K:A]")).to.eql(["^F", "^C", "^G"]);
        (0, chai_1.expect)((0, parsekeySignature_1.findKeySignature)("[K:F# minor]")).to.eql(["^F", "^C", "^G"]);
        (0, chai_1.expect)((0, parsekeySignature_1.findKeySignature)("[K:F]")).to.eql(["_B"]);
        (0, chai_1.expect)((0, parsekeySignature_1.findKeySignature)("[K:Bb]")).to.eql(["_B", "_E"]);
        (0, chai_1.expect)((0, parsekeySignature_1.findKeySignature)("[K:G minor]")).to.eql(["_B", "_E"]);
        (0, chai_1.expect)((0, parsekeySignature_1.findKeySignature)("[K:Eb]")).to.eql(["_B", "_E", "_A"]);
        (0, chai_1.expect)((0, parsekeySignature_1.findKeySignature)("[K:C minor]")).to.eql(["_B", "_E", "_A"]);
        (0, chai_1.expect)((0, parsekeySignature_1.findKeySignature)("[K:Ab]")).to.eql(["_B", "_E", "_A", "_D"]);
        (0, chai_1.expect)((0, parsekeySignature_1.findKeySignature)("[K:F minor]")).to.eql(["_B", "_E", "_A", "_D"]);
        (0, chai_1.expect)((0, parsekeySignature_1.findKeySignature)("[K:Gb]")).to.eql([
            "_B",
            "_E",
            "_A",
            "_D",
            "_G",
            "_C",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findKeySignature)("[K:Eb minor]")).to.eql([
            "_B",
            "_E",
            "_A",
            "_D",
            "_G",
            "_C",
        ]);
    });
    it("finds notes in major key", function () {
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:C]")).to.eql([
            "c",
            "d",
            "e",
            "f",
            "g",
            "a",
            "b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:Db]")).to.eql([
            "c",
            "_d",
            "_e",
            "f",
            "_g",
            "_a",
            "_b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:D]")).to.eql([
            "^c",
            "d",
            "e",
            "^f",
            "g",
            "a",
            "b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:Eb]")).to.eql([
            "c",
            "d",
            "_e",
            "f",
            "g",
            "_a",
            "_b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:E]")).to.eql([
            "^c",
            "^d",
            "e",
            "^f",
            "^g",
            "a",
            "b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:F]")).to.eql([
            "c",
            "d",
            "e",
            "f",
            "g",
            "a",
            "_b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:Gb]")).to.eql([
            "_c",
            "_d",
            "_e",
            "f",
            "_g",
            "_a",
            "_b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:G]")).to.eql([
            "c",
            "d",
            "e",
            "^f",
            "g",
            "a",
            "b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:Ab]")).to.eql([
            "c",
            "_d",
            "_e",
            "f",
            "g",
            "_a",
            "_b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:A]")).to.eql([
            "^c",
            "d",
            "e",
            "^f",
            "^g",
            "a",
            "b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:Bb]")).to.eql([
            "c",
            "d",
            "_e",
            "f",
            "g",
            "a",
            "_b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:B]")).to.eql([
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
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:C minor]")).to.eql([
            "c",
            "d",
            "_e",
            "f",
            "g",
            "_a",
            "_b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:C# minor]")).to.eql([
            "^c",
            "^d",
            "e",
            "^f",
            "^g",
            "a",
            "b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:D minor]")).to.eql([
            "c",
            "d",
            "e",
            "f",
            "g",
            "a",
            "_b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:Eb minor]")).to.eql([
            "_c",
            "_d",
            "_e",
            "f",
            "_g",
            "_a",
            "_b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:E minor]")).to.eql([
            "c",
            "d",
            "e",
            "^f",
            "g",
            "a",
            "b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:F minor]")).to.eql([
            "c",
            "_d",
            "_e",
            "f",
            "g",
            "_a",
            "_b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:F# minor]")).to.eql([
            "^c",
            "d",
            "e",
            "^f",
            "^g",
            "a",
            "b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:G minor]")).to.eql([
            "c",
            "d",
            "_e",
            "f",
            "g",
            "a",
            "_b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:G# minor]")).to.eql([
            "^c",
            "^d",
            "e",
            "^f",
            "^g",
            "^a",
            "b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:A minor]")).to.eql([
            "c",
            "d",
            "e",
            "f",
            "g",
            "a",
            "b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:Bb minor]")).to.eql([
            "c",
            "_d",
            "_e",
            "f",
            "_g",
            "_a",
            "_b",
        ]);
        (0, chai_1.expect)((0, parsekeySignature_1.findNotesInKey)("[K:B minor]")).to.eql([
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
