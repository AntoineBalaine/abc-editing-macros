"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const dispatcher_1 = require("../dispatcher");
const parseNotes_1 = require("../parseNotes");
const transformRests_1 = require("../transformRests");
describe("Rhythms", function () {
    describe("Parse Notes with Rhythms", function () {
        it("returns notes with rhythms", function () {
            assert_1.default.equal((0, parseNotes_1.parseNote)("^A,,", { pos: 0 }, (n) => n), "^A,,");
            assert_1.default.equal((0, parseNotes_1.parseNote)("^A,,2", { pos: 0 }, (n) => n), "^A,,2");
            assert_1.default.equal((0, parseNotes_1.parseNote)("^A,,2/12", { pos: 0 }, (n) => n), "^A,,2/12");
            assert_1.default.equal((0, parseNotes_1.parseNote)("^A,,2/12", { pos: 0 }, (n) => n), "^A,,2/12");
        });
    });
    describe("consolidate", function () {
        it("consolidates consecutive notes", function () {
            assert_1.default.equal((0, transformRests_1.consolidateConsecutiveNotesTransform)("a4a2a2a2a4"), "a14");
            assert_1.default.equal((0, transformRests_1.consolidateConsecutiveNotesTransform)("a/4a/2a/2a/2a/4"), "a2");
            assert_1.default.equal((0, transformRests_1.consolidateConsecutiveNotesTransform)("aaaaa"), "a5");
        });
        it("consolidates consecutive rests", function () {
            assert_1.default.equal((0, transformRests_1.consolidateConsecutiveNotesTransform)("z4z2z2z2z4"), "z14");
            assert_1.default.equal((0, transformRests_1.consolidateConsecutiveNotesTransform)("z/4z/2z/2z/2z/4"), "z2");
            assert_1.default.equal((0, transformRests_1.consolidateConsecutiveNotesTransform)("zzzzz"), "z5");
        });
    });
    describe("transform function", function () {
        //todo, account for broken rhythms
        it("duplicates note's length", function () {
            assert_1.default.equal((0, transformRests_1.duplicateLengthTransform)("a"), "a2");
            assert_1.default.equal((0, transformRests_1.duplicateLengthTransform)("a2"), "a4");
            assert_1.default.equal((0, transformRests_1.duplicateLengthTransform)("a/2"), "a");
            assert_1.default.equal((0, transformRests_1.duplicateLengthTransform)("a//"), "a");
            assert_1.default.equal((0, transformRests_1.duplicateLengthTransform)("a/4"), "a/2");
        });
        it("divides note's length", function () {
            assert_1.default.equal((0, transformRests_1.divideLengthTransform)("a,2"), "a,");
            assert_1.default.equal((0, transformRests_1.divideLengthTransform)("a4"), "a2");
            assert_1.default.equal((0, transformRests_1.divideLengthTransform)("a/2"), "a/4");
            assert_1.default.equal((0, transformRests_1.divideLengthTransform)("a//"), "a/4");
            assert_1.default.equal((0, transformRests_1.divideLengthTransform)("a"), "a/");
            assert_1.default.equal((0, transformRests_1.divideLengthTransform)("^a''"), "^a''/");
        });
    });
    describe("using dispatcher", function () {
        //todo, account for broken rhythms
        it("duplicates note's length", function () {
            assert_1.default.equal((0, dispatcher_1.noteDispatcher)({
                text: "a/2",
                context: { pos: 0 },
                transformFunction: transformRests_1.duplicateLengthTransform,
            }), "a");
        });
        it("divides note's length", function () {
            assert_1.default.equal((0, dispatcher_1.noteDispatcher)({
                text: "a",
                context: { pos: 0 },
                transformFunction: transformRests_1.divideLengthTransform,
            }), "a/");
        });
        it("duplicates and divides broken rhythms", function () {
            assert_1.default.equal((0, dispatcher_1.noteDispatcher)({
                text: "a/2>a/2",
                context: { pos: 0 },
                transformFunction: transformRests_1.duplicateLengthTransform,
            }), "a>a");
            assert_1.default.equal((0, dispatcher_1.noteDispatcher)({
                text: "a>a",
                context: { pos: 0 },
                transformFunction: transformRests_1.divideLengthTransform,
            }), "a/>a/");
        });
    });
});
