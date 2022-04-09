"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.turnNotesToRests = exports.transposeHalfStepDown = exports.transposeHalfStepUp = exports.transposeOctDown = exports.transposeOctUp = void 0;
const dispatcher_1 = require("../dispatcher");
const transformPitches_1 = require("../transformPitches");
const transposeOctUp = (input) => {
    let context = { pos: 0 };
    return (0, dispatcher_1.dispatcher)(input, context, transformPitches_1.octaviateUpTransform);
};
exports.transposeOctUp = transposeOctUp;
const transposeOctDown = (input) => {
    let context = { pos: 0 };
    return (0, dispatcher_1.dispatcher)(input, context, transformPitches_1.octaviateDownTransform);
};
exports.transposeOctDown = transposeOctDown;
const transposeHalfStepUp = (input) => {
    let context = { pos: 0 };
    return (0, dispatcher_1.dispatcher)(input, context, transformPitches_1.transposeHalfStepUpTransform);
};
exports.transposeHalfStepUp = transposeHalfStepUp;
const transposeHalfStepDown = (input) => {
    let context = { pos: 0 };
    return (0, dispatcher_1.dispatcher)(input, context, transformPitches_1.transposeHalfStepDownTransform);
};
exports.transposeHalfStepDown = transposeHalfStepDown;
const turnNotesToRests = (input) => {
    let context = { pos: 0 };
    return (0, dispatcher_1.dispatcher)(input, context, transformPitches_1.convertToRestTransform);
};
exports.turnNotesToRests = turnNotesToRests;
