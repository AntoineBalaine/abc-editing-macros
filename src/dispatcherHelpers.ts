import { findTokenType, restDispatcher } from "./dispatcher";
import { dispatcherProps } from "./parseNomenclature";
import { abcText } from "./annotationsActions";
import { contextObj } from "./transformPitches";

export const consolidateRestsInTieAndJumpToEndOfTie = ({
  text,
  context,
  transformFunction,
  dispatcherFunction,
  parseFunction,
}: dispatcherProps) => {
  const propsForActionFn = {
    text,
    context,
    transformFunction,
    dispatcherFunction,
    parseFunction,
  };
  const tieContents = findEndOfTie({
    ...propsForActionFn,
    context: { ...context },
  });
  if (
    !tieContainsRests({
      text: tieContents,
      context: { pos: 0 },
      transformFunction,
      dispatcherFunction,
    })
  )
    return tieContents;
  const parsedTieContents = restDispatcher({
    text: tieContents.substring(1, tieContents.length - 1),
    context,
    parseFunction,
    transformFunction,
  });

  return (
    `(${parsedTieContents})` +
    dispatcherFunction({
      ...propsForActionFn,
      context: { pos: context.pos + parsedTieContents.length },
    })
  );
};

export const tieContainsRests = ({
  text,
  context,
  transformFunction,
  dispatcherFunction,
  parseFunction,
}: dispatcherProps): boolean => {
  const propsForActionFn = {
    text,
    context,
    transformFunction,
    dispatcherFunction,
    parseFunction,
  };
  while (context.pos < text.length) {
    context.pos += 1;
    if (isRest(text.charAt(context.pos))) return true;
    if (findTokenType(text, context) === "openingTie") {
      if (tieContainsNotes({ ...propsForActionFn, context: { ...context } })) {
        return true;
      } else {
        context.pos += findEndOfTie(propsForActionFn).length;
        continue;
      }
    }
    if (text.charAt(context.pos) === ")") break;
  }
  return false;
};

export const tieContainsNotes = ({
  text,
  context,
  transformFunction,
  dispatcherFunction,
  parseFunction,
}: dispatcherProps): boolean => {
  const propsForActionFn = {
    text,
    context,
    transformFunction,
    dispatcherFunction,
    parseFunction,
  };
  while (context.pos < text.length) {
    context.pos += 1;
    if (isPitchToken(text.charAt(context.pos))) return true;
    if (findTokenType(text, context) === "openingTie") {
      if (tieContainsNotes({ ...propsForActionFn, context: { ...context } })) {
        return true;
      } else {
        context.pos += findEndOfTie(propsForActionFn).length;
        continue;
      }
    }
    if (text.charAt(context.pos) === ")") break;
  }
  return false;
};

export const findEndOfTie = ({
  text,
  context,
  transformFunction,
  dispatcherFunction,
  parseFunction,
}: dispatcherProps): string => {
  const propsForActionFn = {
    text,
    context,
    transformFunction,
    dispatcherFunction,
    parseFunction,
  };
  let endPos = context.pos;
  while (endPos < text.length) {
    endPos += 1;
    if (text.charAt(endPos) === ")") {
      break;
    }
    if (findTokenType(text, { pos: endPos }) === "openingTie") {
      const curTie = findEndOfTie({
        ...propsForActionFn,
        text: text.substring(endPos),
      });
      endPos += curTie.length - 1;
    }
  }
  return text.substring(context.pos, endPos + 1);
};

export const NOTES_LOWERCASE = ["a", "b", "c", "d", "e", "f", "g", "a"];
export const NOTES_UPPERCASE = ["A", "B", "C", "D", "E", "F", "G", "A"];
export const isLetter = (char: string) => !!char.match(/[a-gz]/i);
export const isNoteToken = (char: string) => /[a-g,']/i.test(char);
export const isOctaveToken = (char: string) => /[,']/i.test(char);
export const isAlterationToken = (char: string) => !!char.match(/[\^=_]/i);
export const isPitchToken = (char: string) => /[a-g,'\^=_]/i.test(char);
export const isRhythmToken = (text: abcText): boolean => /\d|\//g.test(text);
export const isRest = (char: abcText): boolean => /z/i.test(char);
export const isOpeningTie = (char: abcText): boolean => /(\(\D)/i.test(char);
export const isTie = (char: abcText): boolean => /(\(\D)|\)/i.test(char);
export const isDecoration = (char: abcText): boolean =>
  /[.~HLMOPSTuv]/i.test(char);
export const isArticulation = (text: abcText, context: contextObj) => {
  const contextChar = text.charAt(context.pos);
  const sample = text.charAt(context.pos + 1)
    ? text.substring(context.pos, context.pos + 2)
    : contextChar;
  return isTie(sample) || isDecoration(contextChar);
};
