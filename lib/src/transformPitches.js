"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transposeStepDownTransform = exports.transposeStepUpTransform = exports.transposeHalfStepUpTransform = exports.transposeHalfStepDownTransform = exports.convertToEnharmoniaTransform = exports.noteHeight = exports.convertToRestTransform = exports.octaviateUpTransform = exports.octaviateDownTransform = exports.isLowerCase = void 0;
const parsekeySignature_1 = require("./parsekeySignature");
const dispatcher_1 = require("./dispatcher");
const testTransposeFunctions_1 = require("./test/testTransposeFunctions");
const isLowerCase = (str) => {
    return str == str.toLowerCase() && str != str.toUpperCase();
};
exports.isLowerCase = isLowerCase;
const octaviateDownTransform = (note) => {
    if (note.replace(/[\^_=,'0-9]/g, "").toLowerCase() === "z")
        return note;
    //sépare les rhythmes des hauteurs
    const lengthToken = note.replace(/[^(\/0-9)]/g, "");
    note = note.replace(/[(\/0-9)]/g, "");
    if (/[,']/.test(note)) {
        if (note[note.length - 1] === "'")
            note = note.substring(0, note.length - 1);
        if (note[note.length - 1] === ",")
            note += ",";
    }
    else if (!(0, exports.isLowerCase)(note[note.length - 1]))
        note += ",";
    else
        note = note.toUpperCase();
    return note + lengthToken;
};
exports.octaviateDownTransform = octaviateDownTransform;
const octaviateUpTransform = (note) => {
    if (note.replace(/[\^_=,'0-9]/g, "").toLowerCase() === "z")
        return note;
    const lengthToken = note.replace(/[^(\/0-9)]/g, "");
    note = note.replace(/[(\/0-9)]/g, "");
    if (/[,']/.test(note)) {
        if (note[note.length - 1] === "'")
            note += "'";
        if (note[note.length - 1] === ",")
            note = note.substring(0, note.length - 1);
    }
    else if ((0, exports.isLowerCase)(note[note.length - 1]))
        note += "'";
    else
        note = note.toLowerCase();
    return note + lengthToken;
};
exports.octaviateUpTransform = octaviateUpTransform;
const convertToRestTransform = (note) => {
    note = note.replace(/[\^_,'=]/g, "");
    note = note.replace(/[a-gA-G]/g, "z");
    return note;
};
exports.convertToRestTransform = convertToRestTransform;
exports.noteHeight = [
    ["c", "^b", "__d"],
    ["^c", "_d", "^^b"],
    ["d", "^^c", "__e"],
    ["^d", "_e", "__f"],
    ["e", "_f", "^^d"],
    ["f", "^e", "__g"],
    ["^f", "_g", "^^e"],
    ["g", "^^f", "__a"],
    ["^g", "_a"],
    ["a", "^^g", "__b"],
    ["^a", "_b", "__c"],
    ["b", "_c", "^^a"],
];
const convertToEnharmoniaTransform = (note, Key) => {
    const pitch = note.replace(/[=,']/g, "").toLowerCase();
    const matchingEnharmoniaList = exports.noteHeight.find((noteSpellings) => noteSpellings.includes(pitch));
    const enharmoniaList = matchingEnharmoniaList && matchingEnharmoniaList.length
        ? [...matchingEnharmoniaList]
        : [];
    if (enharmoniaList.includes(pitch)) {
        const index = enharmoniaList.indexOf(pitch);
        enharmoniaList.splice(index, 1);
    }
    let enharmoniaNote;
    if (Key) {
        //if note is in Key, then do not enharmonise it.
        //else, find closest match in enharmoniaList
        const notesInKey = (0, parsekeySignature_1.findNotesInKey)(Key);
        if (notesInKey.includes(pitch)) {
            enharmoniaNote = notesInKey[notesInKey.indexOf(pitch)];
        }
        else {
            let correspondingNoteInKey = enharmoniaList.find((enharmNote) => (0, parsekeySignature_1.findNotesInKey)(Key).includes(enharmNote));
            if (correspondingNoteInKey !== undefined &&
                correspondingNoteInKey !== enharmoniaList[0]) {
                enharmoniaNote = correspondingNoteInKey;
            }
            else {
                enharmoniaNote = enharmoniaList[0];
            }
        }
        let octaveToken = note.match(/[,']+/g);
        if (octaveToken && octaveToken.length)
            enharmoniaNote += octaveToken[0];
    }
    else {
        enharmoniaNote =
            enharmoniaList[0] + note.split(/[\^_=]?[a-zA-Z]/g).filter((n) => n);
    }
    const noteName = note.match(/[a-zA-Z]/g);
    const enharmoniaName = enharmoniaNote.match(/[a-zA-Z]/g);
    if (noteName && !(0, exports.isLowerCase)(noteName[0]))
        enharmoniaNote = enharmoniaNote.toUpperCase();
    if (noteName &&
        enharmoniaName &&
        noteName[0].toLowerCase() === "b" &&
        enharmoniaName[0] === "c") {
        enharmoniaNote = (0, exports.octaviateUpTransform)(enharmoniaNote);
    }
    else if (noteName &&
        enharmoniaName &&
        noteName[0].toLowerCase() === "c" &&
        enharmoniaName[0] === "b") {
        enharmoniaNote = (0, exports.octaviateDownTransform)(enharmoniaNote);
    }
    return enharmoniaNote;
};
exports.convertToEnharmoniaTransform = convertToEnharmoniaTransform;
/*
   here, there is the possibility that the returned note might actually already be altered - either previously in the measure, or in the key signature.
   I won't be accomodating these two cases in the context of a macro, I leave it to the responsibility of the composer to proof-read his work.
*/
const transposeHalfStepDownTransform = (note) => {
    if (note.replace(/[\^_=,'0-9]/g, "").toLowerCase() === "z")
        return note;
    if (note[0] === "=") {
        note = note.slice(1);
    }
    let firstChar = note.charAt(0);
    if ((0, dispatcher_1.isAlterationToken)(firstChar)) {
        if (firstChar === "_") {
            switch (note.charAt(1).toLowerCase()) {
                case "c":
                    note = ((0, exports.isLowerCase)(note.charAt(1)) ? "_b" : "_B") + note.slice(2);
                    break;
                case "f":
                    note = ((0, exports.isLowerCase)(note.charAt(1)) ? "_e" : "_E") + note.slice(2);
                    break;
                default: {
                    note = (0, exports.isLowerCase)(note.charAt(1))
                        ? [...dispatcher_1.NOTES_LOWERCASE].reverse()[[...dispatcher_1.NOTES_LOWERCASE].reverse().indexOf(note.charAt(1)) + 1] + note.slice(2)
                        : [...dispatcher_1.NOTES_UPPERCASE].reverse()[[...dispatcher_1.NOTES_UPPERCASE].reverse().indexOf(note.charAt(1)) + 1] + note.slice(2);
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
                note = ((0, exports.isLowerCase)(note.charAt(0)) ? "e" : "E") + note.slice(1);
                break;
            case "c":
                note = ((0, exports.isLowerCase)(note.charAt(0)) ? "b" : "B") + note.slice(1);
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
    if (note.replace(/[\^_=,'0-9]/g, "").toLowerCase() === "z")
        return note;
    if (note[0] === "=") {
        note = note.slice(1);
    }
    let firstChar = note.charAt(0);
    if ((0, dispatcher_1.isAlterationToken)(firstChar)) {
        if (firstChar === "^") {
            switch (note.charAt(1).toLowerCase()) {
                case "e":
                    note = ((0, exports.isLowerCase)(note.charAt(1)) ? "^f" : "^F") + note.slice(2);
                    break;
                case "b":
                    note = ((0, exports.isLowerCase)(note.charAt(1)) ? "^c" : "^C") + note.slice(2);
                    break;
                default: {
                    note = (0, exports.isLowerCase)(note.charAt(1))
                        ? dispatcher_1.NOTES_LOWERCASE[dispatcher_1.NOTES_LOWERCASE.indexOf(note.charAt(1)) + 1] +
                            note.slice(2)
                        : dispatcher_1.NOTES_UPPERCASE[dispatcher_1.NOTES_UPPERCASE.indexOf(note.charAt(1)) + 1] +
                            note.slice(2);
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
                note = ((0, exports.isLowerCase)(note.charAt(0)) ? "f" : "F") + note.slice(1);
                break;
            case "b":
                note = ((0, exports.isLowerCase)(note.charAt(0)) ? "c" : "C") + note.slice(1);
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
const transposeStepUpTransform = (note, Key) => {
    if (note.replace(/[\^_=,'0-9]/g, "").toLowerCase() === "z")
        return note;
    const lengthToken = note.replace(/[^(\/0-9)]/g, "");
    note = note.replace(/[(\/0-9)]/g, "");
    /*
      transpose note half step up two times.
      if note is b, transpose up an octave
    */
    let transposedStepUpNote = note;
    for (let i = 0; i < 2; i++) {
        transposedStepUpNote = (0, exports.transposeHalfStepUpTransform)(transposedStepUpNote);
    }
    if (note.replace(/[\^_=,'0-9]/g, "").toLowerCase() === "b") {
        transposedStepUpNote = (0, testTransposeFunctions_1.transposeOctUp)(transposedStepUpNote);
    }
    /*
    if transposedStepUpNote is not in current key signature,
      transposedStepUpNote = enharmonise(transposedStepUpNote, currentKeySignature)
  
    */
    if (Key) {
        const enharmonisedTransposedStepUpNote = (0, exports.convertToEnharmoniaTransform)(transposedStepUpNote, Key);
        if (enharmonisedTransposedStepUpNote)
            transposedStepUpNote = enharmonisedTransposedStepUpNote;
    }
    return transposedStepUpNote + lengthToken;
};
exports.transposeStepUpTransform = transposeStepUpTransform;
const transposeStepDownTransform = (note, Key) => {
    if (note.replace(/[\^_=,'0-9]/g, "").toLowerCase() === "z")
        return note;
    /*
      transpose note half step up two times.
      if note is b, transpose up an octave
    */
    let transposedStepDownNote = note;
    for (let i = 0; i < 2; i++) {
        transposedStepDownNote = (0, exports.transposeHalfStepDownTransform)(transposedStepDownNote);
    }
    if (note.replace(/[\^_=,'0-9]/g, "").toLowerCase() === "b") {
        transposedStepDownNote = (0, testTransposeFunctions_1.transposeOctUp)(transposedStepDownNote);
    }
    /*
    if transposedStepUpNote is not in current key signature,
      transposedStepUpNote = enharmonise(transposedStepUpNote, currentKeySignature)
  
    */
    if (Key) {
        const enharmonisedTransposedStepUpNote = (0, exports.convertToEnharmoniaTransform)(transposedStepDownNote, Key);
        if (enharmonisedTransposedStepUpNote)
            transposedStepDownNote = enharmonisedTransposedStepUpNote;
    }
    return transposedStepDownNote;
};
exports.transposeStepDownTransform = transposeStepDownTransform;
