"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.divideLengthTransform = exports.duplicateLengthTransform = exports.consolidateConsecutiveNotesTransform = void 0;
const dispatcher_1 = require("./dispatcher");
const isDivided = (rest) => /\//i.test(rest);
const isMultiplied = (rest) => /[a-gA-Gz][,']*?[0-9]/i.test(rest);
const consolidateNotesByPairs = (noteLengthArr) => {
    const duplicatedLength = (0, exports.duplicateLengthTransform)(noteLengthArr[0]);
    const duplicationAmount = Math.trunc(noteLengthArr.length / 2);
    const resulting = new Array(duplicationAmount).fill(duplicatedLength);
    return [...resulting, ...noteLengthArr.slice(0, noteLengthArr.length % 2)];
};
const groupNotesByLength = (res, curr) => {
    const parsedRes = res;
    if (parsedRes.some((subArr) => subArr.includes(curr))) {
        const mappedRes = parsedRes.map((item) => {
            if (item.includes(curr)) {
                return [...item, curr];
            }
            else {
                return item;
            }
        });
        return mappedRes;
    }
    else {
        return [...parsedRes, [curr]];
    }
};
const consolidateConsecutiveNotesTransform = (text) => {
    const notesJson = (0, dispatcher_1.dispatcher)(text, { pos: 0 }, (note) => `"${note}",`);
    const notesArr = JSON.parse(`[${notesJson.substring(0, notesJson.length - 1)}]`);
    const pitch = notesArr[0].replace(/[\/0-9]/g, "");
    const noteLengths = sortLengths(notesArr, pitch);
    let unsortedConsolidatedValues = buildConsolidatedValues(noteLengths, pitch);
    const sortedConsolidatedValues = sortLengths(unsortedConsolidatedValues, pitch);
    /*
  if more values need to be collapsed, call the recursion
  if unmarked and multiplied need collapsing, and
  */
    if (sortedConsolidatedValues["2divided"].some((subArr) => subArr.length > 1)) {
        return (0, exports.consolidateConsecutiveNotesTransform)(buildConsolidatedValues(sortedConsolidatedValues, pitch).join(""));
    }
    else {
        return buildConsolidatedValues(sortedConsolidatedValues, pitch).join("");
    }
};
exports.consolidateConsecutiveNotesTransform = consolidateConsecutiveNotesTransform;
const isFloat = (number) => number % 1 !== 0;
const duplicateLengthTransform = (note) => {
    var _a;
    const pitch = note.replace(/[\/0-9]/g, "");
    const lengthToken = note.replace(/[^(\/0-9)]/g, "");
    if (isDivided(note)) {
        const slashIndex = lengthToken.indexOf("/");
        const denominator = lengthToken.substring(slashIndex);
        const numerator = lengthToken.substring(0, slashIndex);
        let returnDenominator;
        if (!/[0-9]/i.test(denominator)) {
            //lengthToken = number of slashes
            returnDenominator = Math.trunc((((_a = denominator.match(/\//g)) === null || _a === void 0 ? void 0 : _a.length) || 1) / 2);
        }
        else {
            returnDenominator = parseInt(denominator.substring(1)) / 2;
        }
        return returnDenominator === 1
            ? `${pitch}${numerator}`
            : `${pitch}${numerator}/${returnDenominator}`;
    }
    else if (isMultiplied(note)) {
        let multiplier = parseInt(lengthToken) * 2;
        return `${pitch}${multiplier}`;
    }
    else
        return `${note}2`;
};
exports.duplicateLengthTransform = duplicateLengthTransform;
const divideLengthTransform = (note) => {
    var _a;
    const pitch = note.replace(/[\/0-9]/g, "");
    const lengthToken = note.replace(/[^(\/0-9)]/g, "");
    if (isDivided(note)) {
        /*
          denominator *2
         */
        const slashIndex = lengthToken.indexOf("/");
        const denominator = lengthToken.substring(slashIndex);
        const numerator = lengthToken.substring(0, slashIndex);
        let returnDenominator;
        if (!/[0-9]/i.test(denominator)) {
            //lengthToken = number of slashes
            returnDenominator = Math.trunc((((_a = denominator.match(/\//g)) === null || _a === void 0 ? void 0 : _a.length) || 1) * 2);
        }
        else {
            returnDenominator = parseInt(denominator.substring(1)) * 2;
        }
        return returnDenominator === 1
            ? `${pitch}${numerator}`
            : `${pitch}${numerator}/${returnDenominator}`;
    }
    else if (isMultiplied(note)) {
        /*
         divide dénom par 2,
         si division est un float, tronque
        */
        let multiplier = parseInt(lengthToken) / 2;
        return multiplier === 1 ? `${pitch}` : `${pitch}${multiplier}`;
    }
    else
        return `${note}/`;
};
exports.divideLengthTransform = divideLengthTransform;
const sortLengths = (notesArr, pitch) => {
    var _a;
    let noteValues = {
        "1unmarked": 0,
        "2divided": [],
        "3multiplied": 0,
    };
    notesArr.forEach((note) => {
        var _a, _b;
        let divisionNumber;
        if (isDivided(note)) {
            if (!/[0-9]/g.test(note)) {
                note =
                    note.substring(0, note.indexOf("/")) +
                        (((_a = note.match(/\//g)) === null || _a === void 0 ? void 0 : _a.length) || 0) * 2;
            }
            noteValues["2divided"].push(note);
        }
        else if (isMultiplied(note)) {
            noteValues["3multiplied"] += parseInt(((_b = note === null || note === void 0 ? void 0 : note.match(/[0-9]+/g)) === null || _b === void 0 ? void 0 : _b.filter((n) => n)[0]) || "0");
        }
        else {
            noteValues["1unmarked"] += 1;
        }
    });
    noteValues["2divided"]
        .sort((a, b) => {
        var _a, _b;
        return parseInt(((_a = a.match(/[0-9]*/g)) === null || _a === void 0 ? void 0 : _a.filter((n) => n)[0]) || "0") -
            parseInt(((_b = b.match(/[0-9]*/g)) === null || _b === void 0 ? void 0 : _b.filter((n) => n)[0]) || "0");
    })
        .join("")
        .match(/(.)\1*/g);
    if (noteValues["2divided"].length > 0) {
        const newVal = (_a = noteValues["2divided"]) === null || _a === void 0 ? void 0 : _a.reduce(groupNotesByLength, []).flatMap(consolidateNotesByPairs);
        noteValues["2divided"] = newVal;
        //check if there are some non-divided values in object and redistribute them
        if (noteValues["2divided"].some((note) => !isDivided(note))) {
            noteValues = sortLengths(buildConsolidatedValues(noteValues, pitch), pitch);
        }
    }
    return noteValues;
};
function buildConsolidatedValues(restValues, pitch) {
    return [
        restValues["1unmarked"] === 0
            ? ""
            : restValues["1unmarked"] === 1
                ? pitch
                : pitch + restValues["1unmarked"],
        restValues["2divided"].length > 0 ? restValues["2divided"].slice() : "",
        restValues["3multiplied"] === 0 ? "" : pitch + restValues["3multiplied"],
    ]
        .filter((n) => n)
        .flat();
}
