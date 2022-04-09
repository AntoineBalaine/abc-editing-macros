"use strict";
//const vscode = require('vscode');
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatcher = exports.NOTES_UPPERCASE = exports.NOTES_LOWERCASE = exports.isRhythmToken = exports.isPitchToken = exports.isAlterationToken = exports.isOctaveToken = exports.isNoteToken = exports.isLetter = void 0;
const annotationsActions_1 = require("./annotationsActions");
const parseNomenclature_1 = require("./parseNomenclature");
const parseNotes_1 = require("./parseNotes");
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
exports.NOTES_LOWERCASE = ["a", "b", "c", "d", "e", "f", "g", "a"];
exports.NOTES_UPPERCASE = ["A", "B", "C", "D", "E", "F", "G", "A"];
const dispatcher = (text, context, transformFunction, tag) => {
    const contextChar = text.charAt(context.pos);
    if ((0, exports.isLetter)(contextChar) || (0, exports.isAlterationToken)(contextChar)) {
        return (0, parseNotes_1.parseNote)(text, context, transformFunction, tag);
    }
    else if (contextChar === '"' && tag) {
        return (0, annotationsActions_1.parseAnnotation)(text, context, tag, transformFunction);
    }
    else if (contextChar === "!") {
        return (0, parseNomenclature_1.jumpToEndOfSymbol)(text, context, transformFunction, tag);
    }
    else if (contextChar === "\n" &&
        (0, parseNomenclature_1.isNomenclatureLine)(text, { pos: context.pos + 1 })) {
        //skip to next line
        return (0, parseNomenclature_1.jumpToEndOfNomenclatureLine)(text, context, transformFunction, tag);
    }
    else if (context.pos === 0 &&
        (0, parseNomenclature_1.isNomenclatureLine)(text, { pos: context.pos })) {
        //skip to next line
        return (0, parseNomenclature_1.jumpToEndOfNomenclatureLine)(text, context, transformFunction, tag);
    }
    else if (contextChar === "[" &&
        (0, parseNomenclature_1.isNomenclatureTag)(text, { pos: context.pos })) {
        //skip to next end of nomenclature tag
        return (0, parseNomenclature_1.jumpToEndOfNomenclatureTag)(text, context, transformFunction, tag);
    }
    else if (context.pos < text.length) {
        context.pos += 1;
        return contextChar + (0, exports.dispatcher)(text, context, transformFunction, tag);
    }
    else
        return "";
};
exports.dispatcher = dispatcher;
