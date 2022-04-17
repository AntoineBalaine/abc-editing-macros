import { abcText, annotationStyle } from "./annotationsActions";
import {
  chordDispatcher,
  noteDispatcher,
  dispatcherFunction,
} from "./dispatcher";
import { contextObj, TransformFunction } from "./transformPitches";
export type dispatcherProps = {
  text: abcText;
  context: contextObj;
  transformFunction: TransformFunction;
  dispatcherFunction: dispatcherFunction;
  parseFunction?: ParseFunction;
  tag?: annotationStyle;
};

export type ParseFunction = ({}: dispatcherProps) => string;

export const isNomenclatureTag = (text: abcText, context: contextObj) => {
  const subTag = text.substring(context.pos, text.indexOf("]", context.pos));
  return /K:.*/i.test(subTag);
};
export const isNomenclatureLine = (text: abcText, context: contextObj) => {
  return /(^([a-zA-Z]:)|%)/i.test(text.substring(context.pos));
};
export const jumpToEndOfNomenclatureTag = ({
  text,
  context,
  transformFunction,
  dispatcherFunction,
  parseFunction,
  tag,
}: dispatcherProps) => {
  const indexOfTagEnd = text.indexOf("]", context.pos + 1);
  const nomenclatureTag = text.substring(context.pos, indexOfTagEnd + 1);
  context.pos = indexOfTagEnd + 1;
  return (
    nomenclatureTag +
    dispatcherFunction({ text, context, transformFunction, parseFunction, tag })
  );
};

export const jumpToEndOfNomenclatureLine = ({
  text,
  context,
  transformFunction,
  dispatcherFunction,
  parseFunction,
  tag,
}: dispatcherProps) => {
  const nextLineBreak = text.indexOf("\n", context.pos + 1);
  const nomenclature = text.substring(
    context.pos,
    nextLineBreak < 0 ? text.length : nextLineBreak
  );
  context.pos = nextLineBreak < 0 ? text.length : nextLineBreak;
  return (
    nomenclature +
    dispatcherFunction({ text, context, transformFunction, parseFunction, tag })
  );
};

export const jumpToEndOfSymbol = ({
  text,
  context,
  transformFunction,
  dispatcherFunction,
  parseFunction,
  tag,
}: dispatcherProps) => {
  const endOfSymbolIndex = text.indexOf("!", context.pos + 1);
  const symbol = text.substring(context.pos, endOfSymbolIndex + 1);
  context.pos = context.pos + symbol.length;
  return (
    symbol +
    dispatcherFunction({ text, context, transformFunction, parseFunction, tag })
  );
};

export const jumpToEndOfAnnotation = ({
  text,
  context,
  transformFunction,
  dispatcherFunction,
  parseFunction,
}: dispatcherProps) => {
  const endOfannotationIndex = text.indexOf('"', context.pos + 1);
  const annotation = text.substring(context.pos, endOfannotationIndex + 1);
  context.pos = context.pos + annotation.length;
  return (
    annotation +
    dispatcherFunction({ text, context, transformFunction, parseFunction })
  );
};
