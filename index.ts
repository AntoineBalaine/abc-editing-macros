import {
  consolidateRestsInRoutine,
  createInstrumentationRoutine,
} from "./src/annotationsActions";
import { noteDispatcher } from "./src/dispatcher";
import { reorderChordTransform } from "./src/transformChords";
import {
  convertToEnharmoniaTransform,
  convertToRestTransform,
  octaviateDownTransform,
  octaviateUpTransform,
  transposeHalfStepDownTransform,
  transposeHalfStepUpTransform,
  transposeStepDownTransform,
  transposeStepUpTransform,
} from "./src/transformPitches";
import {
  consolidateConsecutiveNotesTransform,
  divideLengthTransform,
  duplicateLengthTransform,
} from "./src/transformRests";

import { formatScore, formatLineSystem } from "./src/formatter";
export {
  consolidateConsecutiveNotesTransform,
  consolidateRestsInRoutine,
  convertToEnharmoniaTransform,
  convertToRestTransform,
  createInstrumentationRoutine,
  noteDispatcher,
  divideLengthTransform,
  duplicateLengthTransform,
  octaviateDownTransform,
  octaviateUpTransform,
  reorderChordTransform,
  transposeHalfStepDownTransform,
  transposeHalfStepUpTransform,
  transposeStepDownTransform,
  transposeStepUpTransform,
  formatScore,
  formatLineSystem,
};
