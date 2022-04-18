"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseConsecutiveRests = void 0;
const dispatcher_1 = require("./dispatcher");
const parseConsecutiveRests = ({ text, context, transformFunction, dispatcherFunction, }) => {
    // si tu rencontres une annotation, compte la quantité d'espace qui la précède.
    /*
    if "rest" && spaces {spaces = ""};
    else if "rest && !spaces {spaces += curToken}
    */
    let consecutiveRests = "";
    let spaces = "";
    while (context.pos < text.length) {
        let curChar = text.charAt(context.pos);
        let curToken = (0, dispatcher_1.findTokenType)(text, context);
        if (curToken === "annotation" ||
            curToken === "nomenclature line" ||
            curToken === "nomenclature tag" ||
            curToken === "note" ||
            curToken === "symbol") {
            break;
        }
        else if (curToken === "space") {
            spaces += text.charAt(context.pos);
            context.pos += 1;
        }
        else if (curToken === "articulation" || curToken === "unmatched") {
            context.pos += 1;
            continue;
        }
        else if (curToken === "rest") {
            //find if following chars ar rhythm tokens
            if (spaces) {
                spaces = "";
            }
            consecutiveRests += curChar;
            context.pos += 1;
            while ((0, dispatcher_1.isRhythmToken)(text.charAt(context.pos))) {
                consecutiveRests += text.charAt(context.pos);
                context.pos += 1;
            }
        }
    }
    return ((consecutiveRests ? transformFunction(consecutiveRests) : "") +
        spaces +
        dispatcherFunction({
            text,
            context,
            transformFunction,
            parseFunction: exports.parseConsecutiveRests,
        }));
};
exports.parseConsecutiveRests = parseConsecutiveRests;
