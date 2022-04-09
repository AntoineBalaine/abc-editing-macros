"use strict";
//const vscode = require('vscode');
Object.defineProperty(exports, "__esModule", { value: true });
exports.turnNotesToRests = exports.transposeHalfStepDown = exports.transposeHalfStepUp = exports.transposeOctDown = exports.transposeOctUp = exports.dispatcher = exports.consolidateRests = exports.parseNote = exports.transposeHalfStepUpTransform = exports.transposeHalfStepDownTransform = exports.convertToRestTransform = exports.octaviateUpTransform = exports.octaviateDownTransform = exports.isPitchToken = exports.isAlterationToken = exports.isOctaveToken = exports.isNoteToken = exports.isLetter = void 0;
const annotationsActions_1 = require("./annotationsActions");
const isLetter = (char) => !!char.match(/[a-g]/i);
exports.isLetter = isLetter;
const isNoteToken = (char) => /[a-g,']/i.test(char);
exports.isNoteToken = isNoteToken;
const isOctaveToken = (char) => /[,']/i.test(char);
exports.isOctaveToken = isOctaveToken;
const isAlterationToken = (char) => !!char.match(/[\^=_]/i);
exports.isAlterationToken = isAlterationToken;
const isPitchToken = (char) => /[a-g,'\^=_]/i.test(char);
exports.isPitchToken = isPitchToken;
const NOTES_LOWERCASE = ["a", "b", "c", "d", "e", "f", "g", "a"];
const NOTES_UPPERCASE = ["A", "B", "C", "D", "E", "F", "G", "A"];
const isLowerCase = (str) => {
    return str == str.toLowerCase() && str != str.toUpperCase();
};
const octaviateDownTransform = (note) => {
    if (/[,']/.test(note)) {
        if (note[note.length - 1] === "\'")
            note = note.substring(0, note.length - 1);
        if (note[note.length - 1] === ",")
            note += ",";
    }
    else if (!isLowerCase(note[note.length - 1]))
        note += ",";
    else
        note = note.toUpperCase();
    return note;
};
exports.octaviateDownTransform = octaviateDownTransform;
const octaviateUpTransform = (note) => {
    if (/[,']/.test(note)) {
        if (note[note.length - 1] === "\'")
            note += "\'";
        if (note[note.length - 1] === ",")
            note = note.substring(0, note.length - 1);
    }
    else if (isLowerCase(note[note.length - 1]))
        note += "'";
    else
        note = note.toLowerCase();
    return note;
};
exports.octaviateUpTransform = octaviateUpTransform;
const convertToRestTransform = (note) => {
    note = note.replace(/[\^_,']/g, "");
    note = note.replace(/[a-gA-G]/g, "z");
    return note;
};
exports.convertToRestTransform = convertToRestTransform;
/*
   here, there is the possibility that the returned note might actually already be altered - either previously in the measure, or in the key signature.
   I won't be accomodating these two cases in the context of a macro, I leave it to the responsibility of the composer to proof-read his work.
*/
const transposeHalfStepDownTransform = (note) => {
    if (note[0] === "=") {
        note = note.slice(1);
    }
    let firstChar = note.charAt(0);
    if ((0, exports.isAlterationToken)(firstChar)) {
        if (firstChar === "_") {
            switch (note.charAt(1).toLowerCase()) {
                case "c":
                    note = (isLowerCase(note.charAt(1)) ? "_b" : "_B") + note.slice(2);
                    break;
                case "f":
                    note = (isLowerCase(note.charAt(1)) ? "_e" : "_E") + note.slice(2);
                    break;
                default: {
                    note = (isLowerCase(note.charAt(1))
                        ? [...NOTES_LOWERCASE].reverse()[[...NOTES_LOWERCASE].reverse().indexOf(note.charAt(1)) + 1] + note.slice(2)
                        : [...NOTES_UPPERCASE].reverse()[[...NOTES_UPPERCASE].reverse().indexOf(note.charAt(1)) + 1] + note.slice(2));
                    break;
                }
            }
        }
        else if (firstChar === "^") {
            note = note.slice(1);
        }
    }
    else {
        switch (note.charAt(0).toLowerCase()) {
            case "f":
                note = (isLowerCase(note.charAt(0)) ? "e" : "E") + note.slice(1);
                break;
            case "c":
                note = (isLowerCase(note.charAt(0)) ? "b" : "B") + note.slice(1);
                break;
            default: {
                note = "_" + note;
                break;
            }
        }
    }
    return note;
};
exports.transposeHalfStepDownTransform = transposeHalfStepDownTransform;
const transposeHalfStepUpTransform = (note) => {
    if (note[0] === "=") {
        note = note.slice(1);
    }
    let firstChar = note.charAt(0);
    if ((0, exports.isAlterationToken)(firstChar)) {
        if (firstChar === "^") {
            switch (note.charAt(1).toLowerCase()) {
                case "e":
                    note = (isLowerCase(note.charAt(1)) ? "^f" : "^F") + note.slice(2);
                    break;
                case "b":
                    note = (isLowerCase(note.charAt(1)) ? "^c" : "^C") + note.slice(2);
                    break;
                default: {
                    note = isLowerCase(note.charAt(1))
                        ? NOTES_LOWERCASE[NOTES_LOWERCASE.indexOf(note.charAt(1)) + 1] + note.slice(2)
                        : NOTES_UPPERCASE[NOTES_UPPERCASE.indexOf(note.charAt(1)) + 1] + note.slice(2);
                    break;
                }
            }
        }
        else if (firstChar === "_") {
            note = note.slice(1);
        }
    }
    else {
        switch (note.charAt(0).toLowerCase()) {
            case "e":
                note = (isLowerCase(note.charAt(0)) ? "f" : "F") + note.slice(1);
                break;
            case "b":
                note = (isLowerCase(note.charAt(0)) ? "c" : "C") + note.slice(1);
                break;
            default: {
                note = "^" + note;
                break;
            }
        }
    }
    return note;
};
exports.transposeHalfStepUpTransform = transposeHalfStepUpTransform;
const parseNote = (text, context, transformFunction, tag) => {
    let retString = text.charAt(context.pos);
    let foundLetter = (0, exports.isLetter)(retString);
    while (context.pos < text.length) {
        context.pos += 1;
        if ((!foundLetter && (0, exports.isLetter)(text.charAt(context.pos))) || (foundLetter && (0, exports.isOctaveToken)(text.charAt(context.pos)))) {
            if (!foundLetter && (0, exports.isLetter)(text.charAt(context.pos)))
                foundLetter = true;
            retString += text.charAt(context.pos);
        }
        else
            break;
    }
    return transformFunction(retString) + (0, exports.dispatcher)(text, context, transformFunction, tag);
};
exports.parseNote = parseNote;
const consolidateRests = (text) => {
    const rests = text.split(/(?=z\/?\d?)/);
    /*
      total timeLength of string?
      en fractions
      assemble en fractions de même ordre/similaires
    */
    return "";
};
exports.consolidateRests = consolidateRests;
const dispatcher = (text, context, transformFunction, tag) => {
    const contextChar = text.charAt(context.pos);
    if ((0, exports.isLetter)(contextChar) || (0, exports.isAlterationToken)(contextChar)) {
        return (0, exports.parseNote)(text, context, transformFunction, tag);
    }
    else if (contextChar === "\"" && tag) {
        return (0, annotationsActions_1.parseAnnotation)(text, context, tag);
    }
    else if (context.pos < text.length) {
        context.pos += 1;
        return contextChar + (0, exports.dispatcher)(text, context, transformFunction);
    }
    else
        return "";
};
exports.dispatcher = dispatcher;
const transposeOctUp = (input) => {
    let context = { pos: 0 };
    return (0, exports.dispatcher)(input, context, exports.octaviateUpTransform);
};
exports.transposeOctUp = transposeOctUp;
const transposeOctDown = (input) => {
    let context = { pos: 0 };
    return (0, exports.dispatcher)(input, context, exports.octaviateDownTransform);
};
exports.transposeOctDown = transposeOctDown;
const transposeHalfStepUp = (input) => {
    let context = { pos: 0 };
    return (0, exports.dispatcher)(input, context, exports.transposeHalfStepUpTransform);
};
exports.transposeHalfStepUp = transposeHalfStepUp;
const transposeHalfStepDown = (input) => {
    let context = { pos: 0 };
    return (0, exports.dispatcher)(input, context, exports.transposeHalfStepDownTransform);
};
exports.transposeHalfStepDown = transposeHalfStepDown;
const turnNotesToRests = (input) => {
    let context = { pos: 0 };
    return (0, exports.dispatcher)(input, context, exports.convertToRestTransform);
};
exports.turnNotesToRests = turnNotesToRests;
