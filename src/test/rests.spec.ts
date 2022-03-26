import assert from "assert";
import { abcText } from "../annotationsActions";
import { dispatcher } from "../dispatcher";
import {
  consolidateConsecutiveNotesTransform,
  divideLengthTransform,
  duplicateLengthTransform,
} from "../transformRests";

describe("Rhythms", function () {
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
  describe("using transform function", function () {
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
        dispatcher("a/2", { pos: 0 }, duplicateLengthTransform),
        "a"
      );
    });
    it("divides note's length", function () {
      assert.equal(dispatcher("a", { pos: 0 }, divideLengthTransform), "a/");
    });
  });
});
