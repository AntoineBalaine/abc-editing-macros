"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAnnotation = exports.parseUniqueTags = exports.createInstrumentationRoutine = exports.createOrUpdateHarmonizationRoutine = exports.findInstrumentCalls = exports.instrumentFamilies = exports.annotationCommandEnum = void 0;
const path_1 = __importDefault(require("path"));
const dispatcher_1 = require("./dispatcher");
const transformPitches_1 = require("./transformPitches");
const fileStructureActions_1 = require("./fileStructureActions");
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
            [tag]: (0, dispatcher_1.dispatcher)(text, { pos: 0 }, transformPitches_1.convertToRestTransform, tag),
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
function parseAnnotation(text, context, tag, transformFunction) {
    let retStr = "";
    const sections = text
        .substring(context.pos)
        .split(/(\"[^\".]*\")/g)
        .filter((n) => n);
    //subdivise le tableau entre sections contenues dans les tags, et les autres
    let subSections = [];
    if (sections[0][0] === '"' && !sections[0].includes(tag)) {
        const purgedSections = removeInstrumentTagsFromAnnotation(sections[0]).replace(/\"(\s*)?\"/g, "");
        context.pos = context.pos + sections[0].length;
        return purgedSections + (0, dispatcher_1.dispatcher)(text, context, transformFunction, tag);
    }
    else {
        for (let i = 0; i < sections.length; i++) {
            if (sections[i][0] === '"' && sections[i].includes(tag)) {
                let tagsection = [removeInstrumentTagsFromAnnotation(sections[i])];
                while (i < sections.length) {
                    i += 1;
                    if (sections[i][0] === '"' && sections[i].includes(`/${tag}`)) {
                        tagsection.push(removeInstrumentTagsFromAnnotation(sections[i]));
                        break;
                    }
                    else if (sections[i][0] === '"' &&
                        !sections[i].includes(`/${tag}`)) {
                        tagsection.push(removeInstrumentTagsFromAnnotation(sections[i]));
                    }
                    else
                        tagsection.push(sections[i]);
                }
                subSections.push(tagsection);
            }
            else {
                subSections.push(sections[i]);
            }
        }
        return subSections
            .map((subSection) => {
            if (Array.isArray(subSection)) {
                return [
                    removeInstrumentTagsFromAnnotation(subSection[0]),
                    ...subSection.slice(1, subSection.length - 1),
                    removeInstrumentTagsFromAnnotation(subSection[subSection.length - 1]),
                ];
            }
            else
                return (0, dispatcher_1.dispatcher)(subSection, { pos: 0 }, transformFunction, tag);
        })
            .flat()
            .join("")
            .replace(/\"(\s*)?\"/g, "");
    }
}
exports.parseAnnotation = parseAnnotation;
