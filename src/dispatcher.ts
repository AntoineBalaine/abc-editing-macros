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

export const isLetter = (char: string) => !!char.match(/[a-gz]/i);
export const isNoteToken = (char: string) => /[a-g,']/i.test(char);
export const isOctaveToken = (char: string) => /[,']/i.test(char);
export const isAlterationToken = (char: string) => !!char.match(/[\^=_]/i);
export const isPitchToken = (char: string) => /[a-gz,'\^=_]/i.test(char);
export const isRhythmToken = (text: abcText): boolean => /[0-9]|\//g.test(text);
export const NOTES_LOWERCASE = ["a", "b", "c", "d", "e", "f", "g", "a"];
export const NOTES_UPPERCASE = ["A", "B", "C", "D", "E", "F", "G", "A"];

export type dispatcherFunction = (
  text: abcText,
  context: contextObj,
  transformFunction: TransformFunction,
  tag?: annotationStyle
) => string;

const findTokenType = (text: abcText, context: contextObj) => {
  const token = text.charAt(context.pos);
  if (isPitchToken(token)) return "note";
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

  switch (tokenType) {
    case "note":
      return parseNote(text, context, transformFunction, tag);
    case "annotation":
      if (tag) {
        return parseAnnotation(text, context, tag, transformFunction);
      }
    case "symbol":
      return jumpToEndOfSymbol(text, context, transformFunction, tag);
    case "nomenclature line":
      return jumpToEndOfNomenclatureLine(text, context, transformFunction, tag);
    case "nomenclature tag":
      return jumpToEndOfNomenclatureTag(text, context, transformFunction, tag);
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
  switch (tokenType) {
    case "chord":
      return parseChord(text, context, transformFunction);
    case "annotation":
      return jumpToEndOfAnnotation(text, context, transformFunction);
    case "end":
      return "";
    default: {
      context.pos += 1;
      return contextChar + noteDispatcher(text, context, transformFunction);
    }
  }
};
