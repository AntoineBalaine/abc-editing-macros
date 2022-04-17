import assert from "assert";
import { abcText } from "../annotationsActions";
import { noteDispatcher } from "../dispatcher";
import { parseNote } from "../parseNotes";
import {
  consolidateConsecutiveNotesTransform,
  divideLengthTransform,
  duplicateLengthTransform,
} from "../transformRests";

describe("Rhythms", function () {
  describe("Parse Notes with Rhythms", function () {
    it("returns notes with rhythms", function () {
      assert.equal(
        parseNote("^A,,", { pos: 0 }, (n) => n),
        "^A,,"
      );
      assert.equal(
        parseNote("^A,,2", { pos: 0 }, (n) => n),
        "^A,,2"
      );
      assert.equal(
        parseNote("^A,,2/12", { pos: 0 }, (n) => n),
        "^A,,2/12"
      );
      assert.equal(
        parseNote("^A,,2/12", { pos: 0 }, (n) => n),
        "^A,,2/12"
      );
    });
  });
  describe("consolidate", function () {
    it("consolidates consecutive notes", function () {
      assert.equal(
        consolidateConsecutiveNotesTransform("a4a2a2a2a4" as abcText),
        "a14"
      );
      assert.equal(
        consolidateConsecutiveNotesTransform("a/4a/2a/2a/2a/4" as abcText),
        "a2"
      );
      assert.equal(
        consolidateConsecutiveNotesTransform("aaaaa" as abcText),
        "a5"
      );
    });
    it("consolidates consecutive rests", function () {
      assert.equal(
        consolidateConsecutiveNotesTransform("z4z2z2z2z4" as abcText),
        "z14"
      );
      assert.equal(
        consolidateConsecutiveNotesTransform("z/4z/2z/2z/2z/4" as abcText),
        "z2"
      );
      assert.equal(
        consolidateConsecutiveNotesTransform("zzzzz" as abcText),
        "z5"
      );
    });
  });
  describe("transform function", function () {
    //todo, account for broken rhythms
    it("duplicates note's length", function () {
      assert.equal(duplicateLengthTransform("a"), "a2");
      assert.equal(duplicateLengthTransform("a2"), "a4");
      assert.equal(duplicateLengthTransform("a/2"), "a");
      assert.equal(duplicateLengthTransform("a//"), "a");
      assert.equal(duplicateLengthTransform("a/4"), "a/2");
    });
    it("divides note's length", function () {
      assert.equal(divideLengthTransform("a,2"), "a,");
      assert.equal(divideLengthTransform("a4"), "a2");
      assert.equal(divideLengthTransform("a/2"), "a/4");
      assert.equal(divideLengthTransform("a//"), "a/4");
      assert.equal(divideLengthTransform("a"), "a/");
      assert.equal(divideLengthTransform("^a''"), "^a''/");
    });
  });

  describe("using dispatcher", function () {
    //todo, account for broken rhythms
    it("duplicates note's length", function () {
      assert.equal(
        noteDispatcher({
          text: "a/2",
          context: { pos: 0 },
          transformFunction: duplicateLengthTransform,
        }),
        "a"
      );
    });
    it("divides note's length", function () {
      assert.equal(
        noteDispatcher({
          text: "a",
          context: { pos: 0 },
          transformFunction: divideLengthTransform,
        }),
        "a/"
      );
    });
    it("duplicates and divides broken rhythms", function () {
      assert.equal(
        noteDispatcher({
          text: "a/2>a/2",
          context: { pos: 0 },
          transformFunction: duplicateLengthTransform,
        }),
        "a>a"
      );
      assert.equal(
        noteDispatcher({
          text: "a>a",
          context: { pos: 0 },
          transformFunction: divideLengthTransform,
        }),
        "a/>a/"
      );
    });
  });
});
