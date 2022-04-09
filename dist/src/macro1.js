"use strict";
//const vscode = require('vscode');
Object.defineProperty(exports, "__esModule", { value: true });
exports.transposeOctDown = exports.transposeOctUp = exports.transposeHalfStepUpTransform = exports.octaviateUpTransform = exports.octaviateDownTransform = void 0;
const isLetter = (char) => !!char.match(/[a-g]/i);
const isNoteToken = (char) => /[a-g,']/i.test(char);
const isOctaveToken = (char) => /[,']/i.test(char);
const isAlterationToken = (char) => !!char.match(/[\^=_]/i);
const isPitchToken = (char) => /[a-g,'\^=_]/i.test(char);
/*
   parser:
(E,A,^CE) (GFED ^C=B,A,G,) | (F,A,DF) ADFA dBcA | G,DGA B(G^FG) _eGDg | [A,G^C]12 | [A,Fd]12 | [A,Ed]12 | [A,E^c]12 | [D,A,Fd]12 ||
*/
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
/*
   here, there is the possibility that the returned note might actually already be altered - either previously in the measure, or in the key signature.
   I won't be accomodating these two cases in the context of a macro, I leave it to the responsibility of the composer to proof-read his work.
*/
const transposeHalfStepUpTransform = (note) => {
    /* is the note alterned?
       if not, alter it,
    */
    if (isAlterationToken(note.charAt(0))) {
        //is it a sharp or a flat?
        //if is a sharp
        //remove alteration token, move up a step
        //edge cases: ^E & ^B
        //if is a flat
        //remove alteration
    }
    else {
        //add alteration to note,
        //edge cases: E & B
    }
};
exports.transposeHalfStepUpTransform = transposeHalfStepUpTransform;
const parseNote = (text, context, transformFunction) => {
    let retString = text.charAt(context.pos);
    let foundLetter = isLetter(retString);
    while (context.pos < text.length) {
        context.pos += 1;
        if ((!foundLetter && isLetter(text.charAt(context.pos))) || (foundLetter && isOctaveToken(text.charAt(context.pos)))) {
            if (!foundLetter && isLetter(text.charAt(context.pos)))
                foundLetter = true;
            retString += text.charAt(context.pos);
        }
        else
            break;
    }
    return transformFunction(retString) + dispatcher(text, context, transformFunction);
};
const dispatcher = (text, context, transformFunction) => {
    const contextChar = text.charAt(context.pos);
    if (isLetter(contextChar) || isAlterationToken(contextChar)) {
        return parseNote(text, context, transformFunction);
    }
    else
        return "";
};
const transposeOctUp = (input) => {
    let context = { pos: 0 };
    return dispatcher(input, context, exports.octaviateUpTransform);
};
exports.transposeOctUp = transposeOctUp;
const transposeOctDown = (input) => {
    let context = { pos: 0 };
    return dispatcher(input, context, exports.octaviateDownTransform);
};
exports.transposeOctDown = transposeOctDown;
