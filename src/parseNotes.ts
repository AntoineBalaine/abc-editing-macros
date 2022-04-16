import { abcText, annotationStyle } from "./annotationsActions";
import {
  isLetter,
  isOctaveToken,
  noteDispatcher,
  dispatcherFunction,
  isRhythmToken,
} from "./dispatcher";
import { contextObj, TransformFunction } from "./transformPitches";

export const parseRhythmToken = (text: abcText, context: contextObj) => {
  const matches = text
    .substring(context.pos)
    .match(/([-1-9]?\/[0-9]+)|([0-9]+)|(\/+)/g);
  if (matches) {
    const compareLength = matches[0].length;
    if (
      matches[0] === text.substring(context.pos, context.pos + compareLength)
    ) {
      return matches[0];
    }
  }
  return "";
};

export const parseNote = (
  text: string,
  context: contextObj,
  transformFunction: TransformFunction,
  tag?: annotationStyle
): string => {
  let retString = text.charAt(context.pos);
  let foundLetter = isLetter(retString);
  while (context.pos < text.length) {
    context.pos += 1;
    if (
      (!foundLetter && isLetter(text.charAt(context.pos))) ||
      (foundLetter && isOctaveToken(text.charAt(context.pos))) ||
      (foundLetter && isRhythmToken(text.charAt(context.pos)))
    ) {
      if (!foundLetter && isLetter(text.charAt(context.pos)))
        foundLetter = true;
      retString += text.charAt(context.pos);
    } else break;
  }
  return (
    transformFunction(retString) +
    noteDispatcher(text, context, transformFunction, tag)
  );
};
