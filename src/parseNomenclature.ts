import { abcText, annotationStyle } from "./annotationsActions";
import {
  chordDispatcher,
  noteDispatcher,
  dispatcherFunction,
} from "./dispatcher";
import { contextObj, TransformFunction } from "./transformPitches";

export const isNomenclatureTag = (text: abcText, context: contextObj) => {
  const subTag = text.substring(context.pos, text.indexOf("]", context.pos));
  return /K:.*/i.test(subTag);
};
export const isNomenclatureLine = (text: abcText, context: contextObj) => {
  return /(^([a-zA-Z]:)|%)/i.test(text.substring(context.pos));
};
export const jumpToEndOfNomenclatureTag = (
  text: abcText,
  context: contextObj,
  transformFunction: TransformFunction,
  tag?: annotationStyle
) => {
  const indexOfTagEnd = text.indexOf("]", context.pos + 1);
  const nomenclatureTag = text.substring(context.pos, indexOfTagEnd + 1);
  context.pos = indexOfTagEnd + 1;
  return (
    nomenclatureTag + noteDispatcher(text, context, transformFunction, tag)
  );
};

export const jumpToEndOfNomenclatureLine = (
  text: abcText,
  context: contextObj,
  transformFunction: TransformFunction,
  tag?: annotationStyle
) => {
  const nextLineBreak = text.indexOf("\n", context.pos + 1);
  const nomenclature = text.substring(
    context.pos,
    nextLineBreak < 0 ? text.length : nextLineBreak
  );
  context.pos = nextLineBreak < 0 ? text.length : nextLineBreak;
  return nomenclature + noteDispatcher(text, context, transformFunction, tag);
};

export const jumpToEndOfSymbol: dispatcherFunction = (
  text,
  context,
  transformFunction,
  tag
) => {
  const endOfSymbolIndex = text.indexOf("!", context.pos + 1);
  const symbol = text.substring(context.pos, endOfSymbolIndex + 1);
  context.pos = context.pos + symbol.length;
  return symbol + noteDispatcher(text, context, transformFunction, tag);
};

export const jumpToEndOfAnnotation: dispatcherFunction = (
  text,
  context,
  transformFunction
) => {
  const endOfannotationIndex = text.indexOf('"', context.pos + 1);
  const annotation = text.substring(context.pos, endOfannotationIndex + 1);
  context.pos = context.pos + annotation.length;
  return annotation + chordDispatcher(text, context, transformFunction);
};
