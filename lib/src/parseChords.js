"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseChord = void 0;
const dispatcher_1 = require("./dispatcher");
const parseChord = ({ text, context, transformFunction, }) => {
    //find start and end of chord
    //pass chord to transformFunction and return rest
    let chord = text.charAt(context.pos);
    while (context.pos < text.length) {
        context.pos += 1;
        chord += text.charAt(context.pos);
        if (text.charAt(context.pos) === "]") {
            context.pos += 1;
            break;
        }
    }
    return (transformFunction(chord) +
        (0, dispatcher_1.chordDispatcher)({ text, context, transformFunction }));
};
exports.parseChord = parseChord;
