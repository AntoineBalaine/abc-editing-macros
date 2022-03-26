import assert from "assert";
import { parseNote } from "../parseNotes";

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
