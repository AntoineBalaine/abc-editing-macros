import { findTokenType, isRhythmToken, restDispatcher } from "./dispatcher";
import { dispatcherProps } from "./parseNomenclature";
import { contextObj, TransformFunction } from "./transformPitches";
import { consolidateConsecutiveNotesTransform } from "./transformRests";

export const parseConsecutiveRests = ({
  text,
  context,
  transformFunction,
  dispatcherFunction,
}: dispatcherProps): string => {
  // lire les silences consécutifs en ignorant les articulations,
  //mais sans ignorer les symboles, les annotations, les nomenclatures et les notes
  // consolidateRests()
  let consecutiveRests = "";
  while (context.pos < text.length) {
    let curChar = text.charAt(context.pos);
    let curToken = findTokenType(text, context);
    if (
      curToken === "annotation" ||
      curToken === "nomenclature line" ||
      curToken === "nomenclature tag" ||
      curToken === "note" ||
      curToken === "symbol"
    ) {
      break;
    } else if (curToken === "articulation" || curToken === "unmatched") {
      context.pos += 1;
      continue;
    } else if (curToken === "rest") {
      //find if following chars ar rhythm tokens
      consecutiveRests += curChar;
      context.pos += 1;
      while (isRhythmToken(text.charAt(context.pos))) {
        consecutiveRests += text.charAt(context.pos);
        context.pos += 1;
      }
    }
  }
  return (
    transformFunction(consecutiveRests) +
    dispatcherFunction(text, context, transformFunction)
  );
};
