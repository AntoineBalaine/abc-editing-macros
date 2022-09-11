import { assert, expect } from "chai";
import {
  consolidateRestsInTieAndJumpToEndOfTie,
  findEndOfTie,
  tieContainsNotes,
} from "../dispatcherHelpers";
import { restDispatcher } from "../dispatcher";
import { parseConsecutiveRests } from "../parseConsecutiveRests";
import { consolidateConsecutiveNotesTransform } from "../transformRests";

const tieWithoutNotes = "(zzz z/ z/ z2)";
const tieWithNotes = "(zz^a/zz bcde)";
const nestedTieWithoutNotes = "(zz(z)z2)";
const nestedTieWithNotes = "(zz(^a/bc)z/z/)";
const doubleNestedTieWithoutNotes = "(zz(zz(z)))";
const doubleNestedTieWithNotes = "(zz(^a/b(z)))";

const consolidatedTieWithoutNotes = "(z6)";
const consolidatedTieWithNotes = "(z2^a/z2 bcde)";
const consolidatedNestedTieWithoutNotes = "(z5)";
const consolidatedNestedTieWithNotes = "(z2(^a/bc)z)";
const consolidatedDoubleNestedTieWithoutNotes = "(z5)";
const consolidatedDoubleNestedTieWithNotes = "(z2(^a/b(z)))";

describe("dispatcher helpers", function () {
  it("finds if a tie contains notes instead of only rests", function () {
    expect(
      tieContainsNotes({
        text: tieWithoutNotes,
        context: { pos: 0 },
        transformFunction: () => "",
        dispatcherFunction: restDispatcher,
        parseFunction: parseConsecutiveRests,
      })
    ).to.be.false;
    expect(
      tieContainsNotes({
        text: tieWithNotes,
        context: { pos: 0 },
        transformFunction: () => "",
        dispatcherFunction: restDispatcher,
        parseFunction: parseConsecutiveRests,
      })
    ).to.be.true;
    expect(
      tieContainsNotes({
        text: nestedTieWithoutNotes,
        context: { pos: 0 },
        transformFunction: () => "",
        dispatcherFunction: restDispatcher,
        parseFunction: parseConsecutiveRests,
      })
    ).to.be.false;
    expect(
      tieContainsNotes({
        text: nestedTieWithNotes,
        context: { pos: 0 },
        transformFunction: () => "",
        dispatcherFunction: restDispatcher,
        parseFunction: parseConsecutiveRests,
      })
    ).to.be.true;
    expect(
      tieContainsNotes({
        text: doubleNestedTieWithoutNotes,
        context: { pos: 0 },
        transformFunction: () => "",
        dispatcherFunction: restDispatcher,
        parseFunction: parseConsecutiveRests,
      })
    ).to.be.false;
    expect(
      tieContainsNotes({
        text: doubleNestedTieWithNotes,
        context: { pos: 0 },
        transformFunction: () => "",
        dispatcherFunction: restDispatcher,
        parseFunction: parseConsecutiveRests,
      })
    ).to.be.true;
  });
  it("returns the contents of a tie, included nested ties", function () {
    const propsForActionFn = {
      context: { pos: 0 },
      transformFunction: () => "",
      dispatcherFunction: restDispatcher,
      parseFunction: parseConsecutiveRests,
    };
    assert.equal(
      findEndOfTie({ ...propsForActionFn, text: tieWithNotes }),
      tieWithNotes
    );
    assert.equal(
      findEndOfTie({ ...propsForActionFn, text: tieWithoutNotes }),
      tieWithoutNotes
    );
    assert.equal(
      findEndOfTie({ ...propsForActionFn, text: nestedTieWithNotes }),
      nestedTieWithNotes
    );
    assert.equal(
      findEndOfTie({ ...propsForActionFn, text: nestedTieWithoutNotes }),
      nestedTieWithoutNotes
    );
    assert.equal(
      findEndOfTie({ ...propsForActionFn, text: doubleNestedTieWithoutNotes }),
      doubleNestedTieWithoutNotes
    );
  });
  it("consolidates rests in tie and jumps to end of tie", function () {
    const propsForActionFn = {
      transformFunction: consolidateConsecutiveNotesTransform,
      dispatcherFunction: restDispatcher,
      parseFunction: parseConsecutiveRests,
    };
    assert.equal(
      restDispatcher({
        ...propsForActionFn,
        context: { pos: 0 },
        text: tieWithNotes,
      }),
      consolidatedTieWithNotes
    );
    assert.equal(
      restDispatcher({
        ...propsForActionFn,
        context: { pos: 0 },
        text: tieWithoutNotes,
      }),
      consolidatedTieWithoutNotes
    );
    assert.equal(
      restDispatcher({
        ...propsForActionFn,
        context: { pos: 0 },
        text: nestedTieWithoutNotes,
      }),
      consolidatedNestedTieWithoutNotes
    );
    assert.equal(
      restDispatcher({
        ...propsForActionFn,
        context: { pos: 0 },
        text: nestedTieWithNotes,
      }),
      consolidatedNestedTieWithNotes
    );
    assert.equal(
      restDispatcher({
        ...propsForActionFn,
        context: { pos: 0 },
        text: doubleNestedTieWithoutNotes,
      }),
      consolidatedDoubleNestedTieWithoutNotes
    );
    assert.equal(
      restDispatcher({
        ...propsForActionFn,
        context: { pos: 0 },
        text: doubleNestedTieWithNotes,
      }),
      consolidatedDoubleNestedTieWithNotes
    );
  });
});
