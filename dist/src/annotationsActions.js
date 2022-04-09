"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAnnotation = exports.parseUniqueTags = exports.createOrUpdateInstrumentationRoutine = exports.createOrUpdateHarmonizationRoutine = exports.findInstrumentCalls = exports.instrumentFamilies = exports.annotationCommandEnum = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const dispatcher_1 = require("./dispatcher");
const transformPitches_1 = require("./transformPitches");
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
const createOrUpdateHarmonizationRoutine = (abcText, annotationCommand, scoreFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    const dirTarget = path_1.default.join(path_1.default.dirname(scoreFilePath), path_1.default.parse(scoreFilePath).name +
        `.${annotationCommandEnum.createHarmonisationFile}.abc`);
    yield fs_1.promises.writeFile(dirTarget, abcText, "utf-8");
    return;
});
exports.createOrUpdateHarmonizationRoutine = createOrUpdateHarmonizationRoutine;
const createOrUpdateInstrumentationRoutine = (abcText, annotationCommand, scoreFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    const dirTarget = path_1.default.join(path_1.default.dirname(scoreFilePath), path_1.default.parse(scoreFilePath).name +
        `.${annotationCommandEnum.createHarmonisationFile}.abc`);
    yield fs_1.promises.writeFile(dirTarget, abcText, "utf-8");
    //read file, turn any sections that are not within instrument tags into rests
    return;
});
exports.createOrUpdateInstrumentationRoutine = createOrUpdateInstrumentationRoutine;
const parseUniqueTags = (text) => {
    let tags = text.match(/(["])(?:(?=(\\?))\2.)*?\1/g);
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
