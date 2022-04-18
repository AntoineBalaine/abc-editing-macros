"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restDispatcher = exports.chordDispatcher = exports.noteDispatcher = exports.findTokenType = exports.isArticulation = exports.isDecoration = exports.isTie = exports.isRest = exports.isRhythmToken = exports.isPitchToken = exports.isAlterationToken = exports.isOctaveToken = exports.isNoteToken = exports.isLetter = exports.NOTES_UPPERCASE = exports.NOTES_LOWERCASE = void 0;
const parseAnnotation_1 = require("./parseAnnotation");
const parseNomenclature_1 = require("./parseNomenclature");
const parseNotes_1 = require("./parseNotes");
const parseChords_1 = require("./parseChords");
exports.NOTES_LOWERCASE = ["a", "b", "c", "d", "e", "f", "g", "a"];
exports.NOTES_UPPERCASE = ["A", "B", "C", "D", "E", "F", "G", "A"];
const isLetter = (char) => !!char.match(/[a-gz]/i);
exports.isLetter = isLetter;
const isNoteToken = (char) => /[a-g,']/i.test(char);
exports.isNoteToken = isNoteToken;
const isOctaveToken = (char) => /[,']/i.test(char);
exports.isOctaveToken = isOctaveToken;
const isAlterationToken = (char) => !!char.match(/[\^=_]/i);
exports.isAlterationToken = isAlterationToken;
const isPitchToken = (char) => /[a-g,'\^=_]/i.test(char);
exports.isPitchToken = isPitchToken;
const isRhythmToken = (text) => /[0-9]|\//g.test(text);
exports.isRhythmToken = isRhythmToken;
const isRest = (char) => /[z]/i.test(char);
exports.isRest = isRest;
const isTie = (char) => /(\([^0-9])|\)/i.test(char);
exports.isTie = isTie;
const isDecoration = (char) => /[.~HLMOPSTuv]/i.test(char);
exports.isDecoration = isDecoration;
const isArticulation = (text, context) => {
    const contextChar = text.charAt(context.pos);
    const sample = text.charAt(context.pos + 1)
        ? text.substring(context.pos, context.pos + 2)
        : contextChar;
    return (0, exports.isTie)(sample) || (0, exports.isDecoration)(contextChar);
};
exports.isArticulation = isArticulation;
const findTokenType = (text, context) => {
    const token = text.charAt(context.pos);
    if ((0, exports.isPitchToken)(token))
        return "note";
    if ((0, exports.isRest)(token))
        return "rest";
    if ((0, exports.isArticulation)(text, context))
        return "articulation";
    if (token === " ")
        return "space";
    if (token === "|")
        return "barLine";
    if (token === '"')
        return "annotation";
    if (token === "!")
        return "symbol";
    if (token === "\n" && (0, parseNomenclature_1.isNomenclatureLine)(text, { pos: context.pos + 1 }))
        return "nomenclature line";
    if (context.pos === 0 && (0, parseNomenclature_1.isNomenclatureLine)(text, { pos: context.pos }))
        return "nomenclature line";
    if (token)
        if (token === "[" && (0, parseNomenclature_1.isNomenclatureTag)(text, context))
            return "nomenclature tag";
    if (token === "[" && !(0, parseNomenclature_1.isNomenclatureTag)(text, context))
        return "chord";
    if (context.pos < text.length)
        return "unmatched";
    else
        return "end";
};
exports.findTokenType = findTokenType;
const noteDispatcher = ({ text, context, transformFunction, tag, }) => {
    const contextChar = text.charAt(context.pos);
    const tokenType = (0, exports.findTokenType)(text, context);
    const propsForActionFn = {
        text,
        context,
        transformFunction,
        dispatcherFunction: exports.noteDispatcher,
        tag,
    };
    switch (tokenType) {
        case "note":
            return (0, parseNotes_1.parseNote)(text, context, transformFunction, tag);
        case "rest":
            return (0, parseNotes_1.parseNote)(text, context, transformFunction, tag);
        case "annotation":
            if (tag) {
                return (0, parseAnnotation_1.parseAnnotation)(text, context, tag, transformFunction);
            }
        case "symbol":
            return (0, parseNomenclature_1.jumpToEndOfSymbol)(propsForActionFn);
        case "nomenclature line":
            return (0, parseNomenclature_1.jumpToEndOfNomenclatureLine)(propsForActionFn);
        case "nomenclature tag":
            return (0, parseNomenclature_1.jumpToEndOfNomenclatureTag)(propsForActionFn);
        case "end":
            return "";
        default: {
            context.pos += 1;
            return (contextChar + (0, exports.noteDispatcher)({ text, context, transformFunction, tag }));
        }
    }
};
exports.noteDispatcher = noteDispatcher;
const chordDispatcher = ({ text, context, transformFunction, }) => {
    const contextChar = text.charAt(context.pos);
    const tokenType = (0, exports.findTokenType)(text, context);
    const propsForActionFn = {
        text,
        context,
        transformFunction,
        dispatcherFunction: exports.chordDispatcher,
    };
    switch (tokenType) {
        case "chord":
            return (0, parseChords_1.parseChord)({ text, context, transformFunction });
        case "annotation":
            return (0, parseNomenclature_1.jumpToEndOfAnnotation)(propsForActionFn);
        case "symbol":
            return (0, parseNomenclature_1.jumpToEndOfSymbol)(propsForActionFn);
        case "nomenclature line":
            return (0, parseNomenclature_1.jumpToEndOfNomenclatureLine)(propsForActionFn);
        case "nomenclature tag":
            return (0, parseNomenclature_1.jumpToEndOfNomenclatureTag)(propsForActionFn);
        case "note":
            return (0, parseNotes_1.jumpToEndOfNote)(propsForActionFn);
        case "end":
            return "";
        default: {
            context.pos += 1;
            return (contextChar + (0, exports.chordDispatcher)({ text, context, transformFunction }));
        }
    }
};
exports.chordDispatcher = chordDispatcher;
const restDispatcher = ({ text, context, transformFunction, parseFunction, }) => {
    const contextChar = text.charAt(context.pos);
    const tokenType = (0, exports.findTokenType)(text, context);
    const propsForActionFn = {
        text,
        context,
        transformFunction,
        dispatcherFunction: exports.restDispatcher,
        parseFunction,
    };
    switch (tokenType) {
        case "rest": {
            return parseFunction
                ? parseFunction(propsForActionFn)
                : transformFunction(contextChar);
        }
        case "annotation":
            return (0, parseNomenclature_1.jumpToEndOfAnnotation)(propsForActionFn);
        case "symbol":
            return (0, parseNomenclature_1.jumpToEndOfSymbol)(propsForActionFn);
        case "nomenclature line":
            return (0, parseNomenclature_1.jumpToEndOfNomenclatureLine)(propsForActionFn);
        case "nomenclature tag":
            return (0, parseNomenclature_1.jumpToEndOfNomenclatureTag)(propsForActionFn);
        case "end":
            return "";
        case "articulation":
            context.pos += 1;
            return (0, exports.restDispatcher)(propsForActionFn);
        default: {
            context.pos += 1;
            return contextChar + (0, exports.restDispatcher)(propsForActionFn);
        }
    }
};
exports.restDispatcher = restDispatcher;
