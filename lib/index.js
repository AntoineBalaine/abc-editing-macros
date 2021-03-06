"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transposeStepUpTransform = exports.transposeStepDownTransform = exports.transposeHalfStepUpTransform = exports.transposeHalfStepDownTransform = exports.reorderChordTransform = exports.octaviateUpTransform = exports.octaviateDownTransform = exports.duplicateLengthTransform = exports.divideLengthTransform = exports.noteDispatcher = exports.createInstrumentationRoutine = exports.convertToRestTransform = exports.convertToEnharmoniaTransform = exports.consolidateRestsInRoutine = exports.consolidateConsecutiveNotesTransform = void 0;
const annotationsActions_1 = require("./src/annotationsActions");
Object.defineProperty(exports, "consolidateRestsInRoutine", { enumerable: true, get: function () { return annotationsActions_1.consolidateRestsInRoutine; } });
Object.defineProperty(exports, "createInstrumentationRoutine", { enumerable: true, get: function () { return annotationsActions_1.createInstrumentationRoutine; } });
const dispatcher_1 = require("./src/dispatcher");
Object.defineProperty(exports, "noteDispatcher", { enumerable: true, get: function () { return dispatcher_1.noteDispatcher; } });
const transformChords_1 = require("./src/transformChords");
Object.defineProperty(exports, "reorderChordTransform", { enumerable: true, get: function () { return transformChords_1.reorderChordTransform; } });
const transformPitches_1 = require("./src/transformPitches");
Object.defineProperty(exports, "convertToEnharmoniaTransform", { enumerable: true, get: function () { return transformPitches_1.convertToEnharmoniaTransform; } });
Object.defineProperty(exports, "convertToRestTransform", { enumerable: true, get: function () { return transformPitches_1.convertToRestTransform; } });
Object.defineProperty(exports, "octaviateDownTransform", { enumerable: true, get: function () { return transformPitches_1.octaviateDownTransform; } });
Object.defineProperty(exports, "octaviateUpTransform", { enumerable: true, get: function () { return transformPitches_1.octaviateUpTransform; } });
Object.defineProperty(exports, "transposeHalfStepDownTransform", { enumerable: true, get: function () { return transformPitches_1.transposeHalfStepDownTransform; } });
Object.defineProperty(exports, "transposeHalfStepUpTransform", { enumerable: true, get: function () { return transformPitches_1.transposeHalfStepUpTransform; } });
Object.defineProperty(exports, "transposeStepDownTransform", { enumerable: true, get: function () { return transformPitches_1.transposeStepDownTransform; } });
Object.defineProperty(exports, "transposeStepUpTransform", { enumerable: true, get: function () { return transformPitches_1.transposeStepUpTransform; } });
const transformRests_1 = require("./src/transformRests");
Object.defineProperty(exports, "consolidateConsecutiveNotesTransform", { enumerable: true, get: function () { return transformRests_1.consolidateConsecutiveNotesTransform; } });
Object.defineProperty(exports, "divideLengthTransform", { enumerable: true, get: function () { return transformRests_1.divideLengthTransform; } });
Object.defineProperty(exports, "duplicateLengthTransform", { enumerable: true, get: function () { return transformRests_1.duplicateLengthTransform; } });
