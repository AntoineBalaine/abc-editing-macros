"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fileStructureActions_1 = require("../fileStructureActions");
const fs_1 = __importDefault(require("fs"));
const annotationsActions_1 = require("../annotationsActions");
const scoreFilePath = "src/test/test_out/BachCelloSuiteDmin.abc";
const treatedScoreFilePath = "src/test/test_out/BachCelloSuiteDmin.InstrumentFamilies.test.abc";
const sampleScore = fs_1.default.readFileSync(scoreFilePath, "utf-8");
const treatedTestScore = fs_1.default.readFileSync(treatedScoreFilePath, "utf-8");
const scoreHeader = `X: 1
C: Johann Sebastian Bach
T: Suite 2 for Cello
T: Prélude
K: F
V: 1 clef=treble middle=D
L: 1/16`;
describe("Score builder", function () {
    let headerAndBody = (0, fileStructureActions_1.separateHeaderAndBody)(sampleScore, { pos: 0 });
    it("separates header from body of score", () => {
        chai_1.assert.equal(Object.values(headerAndBody).join("\n"), sampleScore);
        chai_1.assert.equal(headerAndBody.headerText, scoreHeader);
    });
    it("adds voices/instruments nomenclature to header of document", function () {
        const parsedInstrumentFamilies = (0, annotationsActions_1.findInstrumentCalls)(headerAndBody.bodyText, { pos: 0 });
        headerAndBody.headerText = (0, fileStructureActions_1.addNomenclatureToHeader)(headerAndBody.headerText, parsedInstrumentFamilies.map((instrument) => Object.keys(instrument)[0]));
        headerAndBody.bodyText = (0, fileStructureActions_1.buildBodyFromInstruments)(parsedInstrumentFamilies);
        /*
            parse header and body
            find tags in file
            add instruments to header, in standard order
          */
        const testHeader = `X: 1
C: Johann Sebastian Bach
T: Suite 2 for Cello
T: Prélude
K: F
V: 1 clef=treble middle=D
L: 1/16
V: wd name="wd"
V: str name="str"`;
        chai_1.assert.equal(headerAndBody.headerText, testHeader);
    });
    it("meshes multiple-line ensemble score into score-systems", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const testBody = (0, fileStructureActions_1.separateHeaderAndBody)(treatedTestScore, {
                pos: 0,
            }).bodyText;
            chai_1.assert.equal(headerAndBody.bodyText, testBody);
        });
    });
});
