"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jumpToEndOfAnnotation = exports.jumpToEndOfSymbol = exports.jumpToEndOfNomenclatureLine = exports.jumpToEndOfNomenclatureTag = exports.isNomenclatureLine = exports.isNomenclatureTag = void 0;
const isNomenclatureTag = (text, context) => {
    const subTag = text.substring(context.pos, text.indexOf("]", context.pos));
    return /K:.*/i.test(subTag);
};
exports.isNomenclatureTag = isNomenclatureTag;
const isNomenclatureLine = (text, context) => {
    return /(^([a-zA-Z]:)|%)/i.test(text.substring(context.pos));
};
exports.isNomenclatureLine = isNomenclatureLine;
const jumpToEndOfNomenclatureTag = ({ text, context, transformFunction, dispatcherFunction, parseFunction, tag, }) => {
    const indexOfTagEnd = text.indexOf("]", context.pos + 1);
    const nomenclatureTag = text.substring(context.pos, indexOfTagEnd + 1);
    context.pos = indexOfTagEnd + 1;
    return (nomenclatureTag +
        dispatcherFunction({ text, context, transformFunction, parseFunction, tag }));
};
exports.jumpToEndOfNomenclatureTag = jumpToEndOfNomenclatureTag;
const jumpToEndOfNomenclatureLine = ({ text, context, transformFunction, dispatcherFunction, parseFunction, tag, }) => {
    const nextLineBreak = text.indexOf("\n", context.pos + 1);
    const nomenclature = text.substring(context.pos, nextLineBreak < 0 ? text.length : nextLineBreak);
    context.pos = nextLineBreak < 0 ? text.length : nextLineBreak;
    return (nomenclature +
        dispatcherFunction({ text, context, transformFunction, parseFunction, tag }));
};
exports.jumpToEndOfNomenclatureLine = jumpToEndOfNomenclatureLine;
const jumpToEndOfSymbol = ({ text, context, transformFunction, dispatcherFunction, parseFunction, tag, }) => {
    const endOfSymbolIndex = text.indexOf("!", context.pos + 1);
    const symbol = text.substring(context.pos, endOfSymbolIndex + 1);
    context.pos = context.pos + symbol.length;
    return (symbol +
        dispatcherFunction({ text, context, transformFunction, parseFunction, tag }));
};
exports.jumpToEndOfSymbol = jumpToEndOfSymbol;
const jumpToEndOfAnnotation = ({ text, context, transformFunction, dispatcherFunction, parseFunction, }) => {
    const endOfannotationIndex = text.indexOf('"', context.pos + 1);
    const annotation = text.substring(context.pos, endOfannotationIndex + 1);
    context.pos = context.pos + annotation.length;
    return (annotation +
        dispatcherFunction({ text, context, transformFunction, parseFunction }));
};
exports.jumpToEndOfAnnotation = jumpToEndOfAnnotation;
