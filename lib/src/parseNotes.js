"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNote = exports.parseRhythmToken = void 0;
const dispatcher_1 = require("./dispatcher");
const parseRhythmToken = (text, context) => {
    const matches = text
        .substring(context.pos)
        .match(/([-1-9]?\/[0-9]+)|([0-9]+)|(\/+)/g);
    if (matches) {
        const compareLength = matches[0].length;
        if (matches[0] === text.substring(context.pos, context.pos + compareLength)) {
            return matches[0];
        }
    }
    return "";
};
exports.parseRhythmToken = parseRhythmToken;
const parseNote = (text, context, transformFunction, tag) => {
    let retString = text.charAt(context.pos);
    let foundLetter = (0, dispatcher_1.isLetter)(retString);
    while (context.pos < text.length) {
        context.pos += 1;
        if ((!foundLetter && (0, dispatcher_1.isLetter)(text.charAt(context.pos))) ||
            (foundLetter && (0, dispatcher_1.isOctaveToken)(text.charAt(context.pos))) ||
            (foundLetter && (0, dispatcher_1.isRhythmToken)(text.charAt(context.pos)))) {
            if (!foundLetter && (0, dispatcher_1.isLetter)(text.charAt(context.pos)))
                foundLetter = true;
            retString += text.charAt(context.pos);
        }
        else
            break;
    }
    return (transformFunction(retString) +
        (0, dispatcher_1.dispatcher)(text, context, transformFunction, tag));
};
exports.parseNote = parseNote;
