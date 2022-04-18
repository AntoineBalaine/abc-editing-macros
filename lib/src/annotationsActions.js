"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeInstrumentTagsFromAnnotation = exports.parseUniqueTags = exports.createInstrumentationRoutine = exports.consolidateRestsInRoutine = exports.createOrUpdateHarmonizationRoutine = exports.findInstrumentCalls = exports.instrumentFamilies = exports.annotationCommandEnum = void 0;
const path_1 = __importDefault(require("path"));
const dispatcher_1 = require("./dispatcher");
const transformPitches_1 = require("./transformPitches");
const fileStructureActions_1 = require("./fileStructureActions");
const transformChords_1 = require("./transformChords");
const transformRests_1 = require("./transformRests");
const parseConsecutiveRests_1 = require("./parseConsecutiveRests");
var annotationCommandEnum;
(function (annotationCommandEnum) {
    annotationCommandEnum["createHarmonisationFile"] = "harmonisation";
    annotationCommandEnum["createFamiliesFile"] = "families";
})(annotationCommandEnum = exports.annotationCommandEnum || (exports.annotationCommandEnum = {}));
var harmonisationStyles;
(function (harmonisationStyles) {
    harmonisationStyles["soli"] = "soli";
    harmonisationStyles["drp2"] = "drp2";
    harmonisationStyles["drp3"] = "drp3";
    harmonisationStyles["drp4"] = "drp24";
    harmonisationStyles["spread"] = "sprd";
    harmonisationStyles["cluster"] = "clstr";
})(harmonisationStyles || (harmonisationStyles = {}));
var instrumentFamilies;
(function (instrumentFamilies) {
    instrumentFamilies["brass"] = "br";
    instrumentFamilies["woodwinds"] = "wd";
    instrumentFamilies["percussion"] = "prc";
    instrumentFamilies["keys"] = "pn";
    instrumentFamilies["strings"] = "str";
    instrumentFamilies["pluckStrings"] = "plk";
})(instrumentFamilies = exports.instrumentFamilies || (exports.instrumentFamilies = {}));
const findInstrumentCalls = (text, context) => {
    /*
      check if annotation contains tag
      find open and closing tags.
    */
    let uniqueFamilyTags = (0, exports.parseUniqueTags)(text).filter((tag) => Object.values(instrumentFamilies).includes(tag));
    const parsedFamilies = uniqueFamilyTags.map((tag) => {
        return {
            [tag]: (0, dispatcher_1.noteDispatcher)({
                text,
                context: { pos: 0 },
                transformFunction: transformPitches_1.convertToRestTransform,
                tag: tag,
            }),
        };
    });
    return parsedFamilies;
};
exports.findInstrumentCalls = findInstrumentCalls;
const createOrUpdateHarmonizationRoutine = (abcText, annotationCommand, scoreFilePath) => {
    const dirTarget = path_1.default.join(path_1.default.dirname(scoreFilePath), path_1.default.parse(scoreFilePath).name +
        `.${annotationCommandEnum.createHarmonisationFile}.abc`);
    return;
};
exports.createOrUpdateHarmonizationRoutine = createOrUpdateHarmonizationRoutine;
const consolidateRestsInRoutine = (tuneBody) => {
    //split song at every bar,
    const splitLines = tuneBody.split("\n");
    const linesWithNestedBars = splitLines
        .map((line) => line
        .split("|")
        .map((bar) => (0, dispatcher_1.chordDispatcher)({
        text: bar,
        context: { pos: 0 },
        transformFunction: transformChords_1.consolidateRestsInChordTransform,
    }))
        .map((bar) => 
    /*           parseConsecutiveRests({
      text: bar,
      context: { pos: 0 },
      transformFunction: consolidateConsecutiveNotesTransform,
      dispatcherFunction: restDispatcher,
    }) */
    (0, dispatcher_1.restDispatcher)({
        text: bar,
        context: { pos: 0 },
        transformFunction: transformRests_1.consolidateConsecutiveNotesTransform,
        parseFunction: parseConsecutiveRests_1.parseConsecutiveRests,
    }))
        .join("|"))
        .join("\n");
    return linesWithNestedBars;
    /*   const splitBars = tuneBody.split(/[|]/g);
    //remove rests in chords that also have notes
    //consolidate chords that only carry rests
    const consolidatedRestsInChordsInBars = splitBars.map((bar) =>
      chordDispatcher(
        bar,
        { pos: 0 },
        consolidateRestsInChordTransform as TransformFunction
      )
    );
    //consolidateRests for each bar
    const consolidatedRestsInBars = consolidatedRestsInChordsInBars.map((bar) =>
      restDispatcher(bar, { pos: 0 }, consolidateConsecutiveNotesTransform)
    );
    return consolidatedRestsInBars.join("|"); */
};
exports.consolidateRestsInRoutine = consolidateRestsInRoutine;
const createInstrumentationRoutine = (abcText) => {
    const headerAndBody = (0, fileStructureActions_1.separateHeaderAndBody)(abcText, { pos: 0 });
    let parsedInstrumentFamilies = (0, exports.findInstrumentCalls)(headerAndBody.bodyText, {
        pos: 0,
    });
    headerAndBody.headerText = (0, fileStructureActions_1.addNomenclatureToHeader)(headerAndBody.headerText, parsedInstrumentFamilies.map((instrument) => Object.keys(instrument)[0]));
    headerAndBody.bodyText = (0, fileStructureActions_1.buildBodyFromInstruments)(parsedInstrumentFamilies);
    return Object.values(headerAndBody).join("\n");
};
exports.createInstrumentationRoutine = createInstrumentationRoutine;
const parseUniqueTags = (text) => {
    let pos = -1;
    let hasStartedComment = false;
    let tags = [];
    let curComment = "";
    while (pos < text.length) {
        pos += 1;
        if (hasStartedComment) {
            curComment += text.charAt(pos);
        }
        if (text.charAt(pos) === '"') {
            if (!hasStartedComment) {
                pos += 1;
                hasStartedComment = true;
                curComment += text.charAt(pos);
            }
            else {
                tags.push(curComment.slice());
                curComment = "";
                hasStartedComment = false;
            }
        }
    }
    //let tags = text.match(/(["])(?:(?=(\\?))\2.)*?\1/g);
    let uniqueTags = [
        ...new Set(tags === null || tags === void 0 ? void 0 : tags.map((tag) => tag.split(/[\\n\s]/)).flat().filter((tag) => tag).map((tag) => tag.replace(/["\/]+/g, ""))),
    ];
    return uniqueTags;
};
exports.parseUniqueTags = parseUniqueTags;
const removeInstrumentTagsFromAnnotation = (annotationText) => {
    const tagsInAnnotation = (0, exports.parseUniqueTags)(annotationText).filter((tag) => Object.values(instrumentFamilies).includes(tag));
    //remove only instrumentTags.
    tagsInAnnotation.forEach((tagInAnnotation) => (annotationText = annotationText.replace(new RegExp("/?" + tagInAnnotation, "g"), "")));
    annotationText = JSON.stringify(annotationText.substring(1, annotationText.length - 1).trim());
    return annotationText;
};
exports.removeInstrumentTagsFromAnnotation = removeInstrumentTagsFromAnnotation;
