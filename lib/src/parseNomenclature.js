"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jumpToEndOfSymbol = exports.jumpToEndOfNomenclatureLine = exports.jumpToEndOfNomenclatureTag = exports.isNomenclatureLine = exports.isNomenclatureTag = void 0;
const dispatcher_1 = require("./dispatcher");
const isNomenclatureTag = (text, context) => {
    const subTag = text.substring(context.pos, text.indexOf("]", context.pos));
    return /K:.*/i.test(subTag);
};
exports.isNomenclatureTag = isNomenclatureTag;
const isNomenclatureLine = (text, context) => {
    return /(^([a-zA-Z]:)|%)/i.test(text.substring(context.pos));
};
exports.isNomenclatureLine = isNomenclatureLine;
const jumpToEndOfNomenclatureTag = (text, context, transformFunction, tag) => {
    const indexOfTagEnd = text.indexOf("]", context.pos + 1);
    const nomenclatureTag = text.substring(context.pos, indexOfTagEnd + 1);
    context.pos = indexOfTagEnd + 1;
    return nomenclatureTag + (0, dispatcher_1.dispatcher)(text, context, transformFunction, tag);
};
exports.jumpToEndOfNomenclatureTag = jumpToEndOfNomenclatureTag;
const jumpToEndOfNomenclatureLine = (text, context, transformFunction, tag) => {
    const nextLineBreak = text.indexOf("\n", context.pos + 1);
    const nomenclature = text.substring(context.pos, nextLineBreak < 0 ? text.length : nextLineBreak);
    context.pos = nextLineBreak < 0 ? text.length : nextLineBreak;
    return nomenclature + (0, dispatcher_1.dispatcher)(text, context, transformFunction, tag);
};
exports.jumpToEndOfNomenclatureLine = jumpToEndOfNomenclatureLine;
const jumpToEndOfSymbol = (text, context, transformFunction, tag) => {
    const endOfSymbolIndex = text.indexOf("!", context.pos + 1);
    const symbol = text.substring(context.pos, endOfSymbolIndex + 1);
    context.pos = context.pos + symbol.length;
    return symbol + (0, dispatcher_1.dispatcher)(text, context, transformFunction, tag);
};
exports.jumpToEndOfSymbol = jumpToEndOfSymbol;
