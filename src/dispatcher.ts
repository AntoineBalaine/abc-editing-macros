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
} from "./parseNomenclature";
import { parseNote } from "./parseNotes";
import { parseChord } from "./parseChords";
import { parseConsecutiveRests } from "./parseConsecutiveRests";

export const isLetter = (char: string) => !!char.match(/[a-gz]/i);
export const isNoteToken = (char: string) => /[a-g,']/i.test(char);
export const isOctaveToken = (char: string) => /[,']/i.test(char);
export const isAlterationToken = (char: string) => !!char.match(/[\^=_]/i);
export const isPitchToken = (char: string) => /[a-g,'\^=_]/i.test(char);
export const isRhythmToken = (text: abcText): boolean => /[0-9]|\//g.test(text);
export const isRest = (char: abcText): boolean => /[z]/i.test(char);
export const NOTES_LOWERCASE = ["a", "b", "c", "d", "e", "f", "g", "a"];
export const NOTES_UPPERCASE = ["A", "B", "C", "D", "E", "F", "G", "A"];

export type dispatcherFunction = (
  text: abcText,
  context: contextObj,
  transformFunction: TransformFunction,
  tag?: annotationStyle
) => string;

export const findTokenType = (text: abcText, context: contextObj) => {
  const token = text.charAt(context.pos);
  if (isPitchToken(token)) return "note";
  if (isRest(token)) return "rest";
  if (token === "|") return "barLine";
  if (token === '"') return "annotation";
  if (token === "!") return "symbol";
  if (token === "\n" && isNomenclatureLine(text, { pos: context.pos + 1 }))
    return "nomenclature line";
  if (context.pos === 0 && isNomenclatureLine(text, { pos: context.pos }))
    return "nomenclature line";
  if (token === "[" && isNomenclatureTag(text, context))
    return "nomenclature tag";
  if (token === "[" && !isNomenclatureTag(text, context)) return "chord";
  if (context.pos < text.length) return "unmatched";
  else return "end";
};

export const noteDispatcher: dispatcherFunction = (
  text,
  context,
  transformFunction,
  tag
) => {
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
        contextChar + noteDispatcher(text, context, transformFunction, tag)
      );
    }
  }
};

export const chordDispatcher: dispatcherFunction = (
  text,
  context,
  transformFunction
) => {
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
      return parseChord(text, context, transformFunction);
    case "annotation":
      return jumpToEndOfAnnotation(propsForActionFn);
    case "end":
      return "";
    default: {
      context.pos += 1;
      return contextChar + noteDispatcher(text, context, transformFunction);
    }
  }
};

export const restDispatcher: dispatcherFunction = (
  text,
  context,
  transformFunction
) => {
  const contextChar = text.charAt(context.pos);
  const tokenType = findTokenType(text, context);
  const propsForActionFn = {
    text,
    context,
    transformFunction,
    dispatcherFunction: restDispatcher,
  };
  switch (tokenType) {
    case "rest": {
      return parseConsecutiveRests(text, context, transformFunction);
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
    default: {
      context.pos += 1;
      return contextChar + noteDispatcher(text, context, transformFunction);
    }
  }
};
