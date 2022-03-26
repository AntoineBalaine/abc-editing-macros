//const vscode = require('vscode');

import {
  abcText,
  annotationCommandEnum,
  annotationStyle,
  parseAnnotation,
} from "./annotationsActions";
import { contextObj, TransformFunction } from "./transformPitches";
import {
  isNomenclatureLine,
  jumpToEndOfNomenclatureLine,
  isNomenclatureTag,
  jumpToEndOfNomenclatureTag,
  jumpToEndOfSymbol,
} from "./parseNomenclature";
import { parseNote } from "./parseNotes";

export const isLetter = (char: string) => !!char.match(/[a-g]/i);
export const isNoteToken = (char: string) => /[a-g,']/i.test(char);
export const isOctaveToken = (char: string) => /[,']/i.test(char);
export const isAlterationToken = (char: string) => !!char.match(/[\^=_]/i);
export const isPitchToken = (char: string) => /[a-g,'\^=_]/i.test(char);
export const isRhythmToken = (text: abcText): boolean => /[0-9]|\//g.test(text);
export const NOTES_LOWERCASE = ["a", "b", "c", "d", "e", "f", "g", "a"];
export const NOTES_UPPERCASE = ["A", "B", "C", "D", "E", "F", "G", "A"];

export type dispatcherFunction = (
  text: abcText,
  context: contextObj,
  transformFunction: TransformFunction,
  tag?: annotationStyle
) => string;

export const dispatcher: dispatcherFunction = (
  text,
  context,
  transformFunction,
  tag
) => {
  const contextChar = text.charAt(context.pos);
  if (isLetter(contextChar) || isAlterationToken(contextChar)) {
    return parseNote(text, context, transformFunction, tag);
  } else if (contextChar === '"' && tag) {
    return parseAnnotation(text, context, tag, transformFunction);
  } else if (contextChar === "!") {
    return jumpToEndOfSymbol(text, context, transformFunction, tag);
  } else if (
    contextChar === "\n" &&
    isNomenclatureLine(text, { pos: context.pos + 1 })
  ) {
    //skip to next line
    return jumpToEndOfNomenclatureLine(text, context, transformFunction, tag);
  } else if (
    context.pos === 0 &&
    isNomenclatureLine(text, { pos: context.pos })
  ) {
    //skip to next line
    return jumpToEndOfNomenclatureLine(text, context, transformFunction, tag);
  } else if (
    contextChar === "[" &&
    isNomenclatureTag(text, { pos: context.pos })
  ) {
    //skip to next end of nomenclature tag
    return jumpToEndOfNomenclatureTag(text, context, transformFunction, tag);
  } else if (context.pos < text.length) {
    context.pos += 1;
    return contextChar + dispatcher(text, context, transformFunction, tag);
  } else return "";
};
