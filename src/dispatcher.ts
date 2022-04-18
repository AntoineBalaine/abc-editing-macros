import {
  abcText,
  annotationCommandEnum,
  annotationStyle,
} from "./annotationsActions";
import { parseAnnotation } from "./parseAnnotation";
import { contextObj, TransformFunction } from "./transformPitches";
import {
  isNomenclatureLine,
  jumpToEndOfNomenclatureLine,
  isNomenclatureTag,
  jumpToEndOfNomenclatureTag,
  jumpToEndOfSymbol,
  jumpToEndOfAnnotation,
  dispatcherProps,
  ParseFunction as ParseFunction,
} from "./parseNomenclature";
import { jumpToEndOfNote, parseNote } from "./parseNotes";
import { parseChord } from "./parseChords";
import { parseConsecutiveRests } from "./parseConsecutiveRests";

export const NOTES_LOWERCASE = ["a", "b", "c", "d", "e", "f", "g", "a"];
export const NOTES_UPPERCASE = ["A", "B", "C", "D", "E", "F", "G", "A"];

export const isLetter = (char: string) => !!char.match(/[a-gz]/i);
export const isNoteToken = (char: string) => /[a-g,']/i.test(char);
export const isOctaveToken = (char: string) => /[,']/i.test(char);
export const isAlterationToken = (char: string) => !!char.match(/[\^=_]/i);
export const isPitchToken = (char: string) => /[a-g,'\^=_]/i.test(char);
export const isRhythmToken = (text: abcText): boolean => /[0-9]|\//g.test(text);
export const isRest = (char: abcText): boolean => /[z]/i.test(char);
export const isTie = (char: abcText): boolean => /(\([^0-9])|\)/i.test(char);
export const isDecoration = (char: abcText): boolean =>
  /[.~HLMOPSTuv]/i.test(char);
export const isArticulation = (text: abcText, context: contextObj) => {
  const contextChar = text.charAt(context.pos);
  const sample = text.charAt(context.pos + 1)
    ? text.substring(context.pos, context.pos + 2)
    : contextChar;
  return isTie(sample) || isDecoration(contextChar);
};

export type noteDispatcherProps = {
  text: abcText;
  context: contextObj;
  transformFunction: TransformFunction;
  parseFunction?: ParseFunction;
  tag?: annotationStyle;
};

export type dispatcherFunction = ({
  text,
  context,
  transformFunction,
  tag,
}: noteDispatcherProps) => string;

export const findTokenType = (text: abcText, context: contextObj) => {
  const token = text.charAt(context.pos);
  if (isPitchToken(token)) return "note";
  if (isRest(token)) return "rest";
  if (isArticulation(text, context)) return "articulation";
  if (token === " ") return "space";
  if (token === "|") return "barLine";
  if (token === '"') return "annotation";
  if (token === "!") return "symbol";
  if (token === "\n" && isNomenclatureLine(text, { pos: context.pos + 1 }))
    return "nomenclature line";
  if (context.pos === 0 && isNomenclatureLine(text, { pos: context.pos }))
    return "nomenclature line";
  if (token)
    if (token === "[" && isNomenclatureTag(text, context))
      return "nomenclature tag";
  if (token === "[" && !isNomenclatureTag(text, context)) return "chord";
  if (context.pos < text.length) return "unmatched";
  else return "end";
};

export const noteDispatcher: dispatcherFunction = ({
  text,
  context,
  transformFunction,
  tag,
}: noteDispatcherProps) => {
  const contextChar = text.charAt(context.pos);
  const tokenType = findTokenType(text, context);
  const propsForActionFn = {
    text,
    context,
    transformFunction,
    dispatcherFunction: noteDispatcher,
    tag,
  };

  switch (tokenType) {
    case "note":
      return parseNote(text, context, transformFunction, tag);
    case "rest":
      return parseNote(text, context, transformFunction, tag);
    case "annotation":
      if (tag) {
        return parseAnnotation(text, context, tag, transformFunction);
      }
    case "symbol":
      return jumpToEndOfSymbol(propsForActionFn);
    case "nomenclature line":
      return jumpToEndOfNomenclatureLine(propsForActionFn);
    case "nomenclature tag":
      return jumpToEndOfNomenclatureTag(propsForActionFn);
    case "end":
      return "";
    default: {
      context.pos += 1;
      return (
        contextChar + noteDispatcher({ text, context, transformFunction, tag })
      );
    }
  }
};

export const chordDispatcher: dispatcherFunction = ({
  text,
  context,
  transformFunction,
}) => {
  const contextChar = text.charAt(context.pos);
  const tokenType = findTokenType(text, context);
  const propsForActionFn = {
    text,
    context,
    transformFunction,
    dispatcherFunction: chordDispatcher,
  };
  switch (tokenType) {
    case "chord":
      return parseChord({ text, context, transformFunction });
    case "annotation":
      return jumpToEndOfAnnotation(propsForActionFn);
    case "symbol":
      return jumpToEndOfSymbol(propsForActionFn);
    case "nomenclature line":
      return jumpToEndOfNomenclatureLine(propsForActionFn);
    case "nomenclature tag":
      return jumpToEndOfNomenclatureTag(propsForActionFn);
    case "note":
      return jumpToEndOfNote(propsForActionFn);
    case "end":
      return "";
    default: {
      context.pos += 1;
      return (
        contextChar + chordDispatcher({ text, context, transformFunction })
      );
    }
  }
};

export const restDispatcher: dispatcherFunction = ({
  text,
  context,
  transformFunction,
  parseFunction,
}): string => {
  const contextChar = text.charAt(context.pos);
  const tokenType = findTokenType(text, context);
  const propsForActionFn = {
    text,
    context,
    transformFunction,
    dispatcherFunction: restDispatcher,
    parseFunction,
  };
  switch (tokenType) {
    case "rest": {
      return parseFunction
        ? parseFunction(propsForActionFn)
        : transformFunction(contextChar);
    }
    case "annotation":
      return jumpToEndOfAnnotation(propsForActionFn);
    case "symbol":
      return jumpToEndOfSymbol(propsForActionFn);
    case "nomenclature line":
      return jumpToEndOfNomenclatureLine(propsForActionFn);
    case "nomenclature tag":
      return jumpToEndOfNomenclatureTag(propsForActionFn);
    case "end":
      return "";
    case "articulation":
      context.pos += 1;
      return restDispatcher(propsForActionFn);
    default: {
      context.pos += 1;
      return contextChar + restDispatcher(propsForActionFn);
    }
  }
};
