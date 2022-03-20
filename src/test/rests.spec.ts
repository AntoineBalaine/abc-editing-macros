import assert from "assert";
import { abcText } from "../annotationsActions";
import {
  consolidateConsecutiveRestsTransform,
  divideLengthTransform,
  duplicateLengthTransform,
} from "../rests";

describe("Rests", function () {
  it("consolidates consecutive rests", function () {
    assert.equal(
      consolidateConsecutiveRestsTransform("[acbe]" as abcText),
      "[ceab]"
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
      assert.equal(divideLengthTransform("a2"), "a");
      assert.equal(divideLengthTransform("a4"), "a2");
      assert.equal(divideLengthTransform("a/2"), "a/4");
      assert.equal(divideLengthTransform("a//"), "a/4");
      assert.equal(divideLengthTransform("a"), "a/");
    });
  });
});
