"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNotesInKey = exports.findUnalteredPitch = exports.findKeySignature = void 0;
const sharps = ["", "^F", "^C", "^G", "^D", "^A", "^E", "^B"];
const upMajorKeys = ["C", "G", "D", "A", "E", "B"];
const upMinorKeys = ["A", "E", "B", "F#", "C#", "G#", "D#"];
const flats = ["_B", "_E", "_A", "_D", "_G", "_C", "_F"];
const downMajorKeys = ["F", "Bb", "Eb", "Ab", "Db", "Gb"];
const downMinorKeys = ["D", "G", "C", "F", "Bb", "Eb"];
const findKeySignature = (keyHeader) => {
    const keyTokens = keyHeader
        .replace(/\[K:\s?/g, "")
        .replace(/[\]]/g, "")
        .split(" ");
    if (keyTokens.length === 1 || keyTokens[1].toLowerCase() === "major") {
        if (upMajorKeys.includes(keyTokens[0]))
            return sharps
                .slice(0, upMajorKeys.indexOf(keyTokens[0]) + 1)
                .filter((alteration) => alteration);
        else
            return flats
                .slice(0, downMajorKeys.indexOf(keyTokens[0]) + 1)
                .filter((alteration) => alteration);
    }
    else if (keyTokens[1].toLowerCase() === "minor") {
        if (upMinorKeys.includes(keyTokens[0]))
            return sharps
                .slice(0, upMinorKeys.indexOf(keyTokens[0]) + 1)
                .filter((alteration) => alteration);
        else
            return flats
                .slice(0, downMinorKeys.indexOf(keyTokens[0]) + 1)
                .filter((alteration) => alteration);
    }
    return [""];
};
exports.findKeySignature = findKeySignature;
const findUnalteredPitch = (note) => note.replace(/[\^_=,']/g, "").toLowerCase();
exports.findUnalteredPitch = findUnalteredPitch;
const findNotesInKey = (Key) => {
    /*
    find key signature for Key
    iterate list of notes
    if note.replace(/[=,']/g, "").toLowerCase() is in key signature
      return key signature note
    else return note
    */
    const keySignature = (0, exports.findKeySignature)(Key);
    const notes = ["c", "d", "e", "f", "g", "a", "b"];
    const noteList = notes.map((note) => {
        let keySignaturePitches = keySignature.map((alteration) => (0, exports.findUnalteredPitch)(alteration));
        if (keySignaturePitches.includes(note)) {
            return keySignature[keySignaturePitches.indexOf(note)].toLowerCase();
        }
        else
            return note;
    });
    return noteList;
};
exports.findNotesInKey = findNotesInKey;
