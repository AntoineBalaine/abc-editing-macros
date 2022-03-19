import { assert } from "chai";
import { expect } from "chai";
import { findKeySignature } from "../cycleOfFifths";

it('gets correct key signature alterations', function() {
  expect(findKeySignature("[K:C]")).to.eql( []);
  expect(findKeySignature("[K:A minor]")).to.eql( []);
  expect(findKeySignature("[K:G]")).to.eql( ["^F"]);
  expect(findKeySignature("[K:E minor]")).to.eql( ["^F"]);
  expect(findKeySignature("[K:D]")).to.eql( ["^F", "^C"]);
  expect(findKeySignature("[K:B minor]")).to.eql( ["^F", "^C"]);
  expect(findKeySignature("[K:A]")).to.eql( ["^F", "^C", "^G"]);
  expect(findKeySignature("[K:F# minor]")).to.eql( ["^F", "^C", "^G"]);
  expect(findKeySignature("[K:F]")).to.eql( ["_B"]);
  expect(findKeySignature("[K:Bb]")).to.eql( ["_B", "_E"]);
  expect(findKeySignature("[K:G minor]")).to.eql( ["_B", "_E"]);
  expect(findKeySignature("[K:Eb]")).to.eql( ["_B", "_E", "_A"]);
  expect(findKeySignature("[K:C minor]")).to.eql( ["_B", "_E", "_A"]);
  expect(findKeySignature("[K:Ab]")).to.eql( ["_B", "_E", "_A", "_D"]);
  expect(findKeySignature("[K:F minor]")).to.eql( ["_B", "_E", "_A", "_D"]);
  expect(findKeySignature("[K:Gb]")).to.eql( ["_B", "_E", "_A", "_D", "_G", "_C"]);
  expect(findKeySignature("[K:Eb minor]")).to.eql( ["_B", "_E", "_A", "_D", "_G", "_C"]);
});

