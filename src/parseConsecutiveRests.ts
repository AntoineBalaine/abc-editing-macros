import {
  dispatcherFunction,
  findTokenType,
  isRhythmToken,
  restDispatcher,
} from "./dispatcher";
import { dispatcherProps } from "./parseNomenclature";
import { contextObj, TransformFunction } from "./transformPitches";
import { consolidateConsecutiveNotesTransform } from "./transformRests";

export const parseConsecutiveRests = ({
  text,
  context,
  transformFunction,
  dispatcherFunction,
}: dispatcherProps): string => {
  // si tu rencontres une annotation, compte la quantité d'espace qui la précède.
  /*
  if "rest" && spaces {spaces = ""};
  else if "rest && !spaces {spaces += curToken}
  */
  let consecutiveRests = "";
  let spaces = "";
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
    } else if (curToken === "space") {
      spaces += text.charAt(context.pos);
      context.pos += 1;
    } else if (curToken === "articulation" || curToken === "unmatched") {
      context.pos += 1;
      continue;
    } else if (curToken === "rest") {
      //find if following chars ar rhythm tokens
      if (spaces) {
        spaces = "";
      }
      consecutiveRests += curChar;
      context.pos += 1;
      while (isRhythmToken(text.charAt(context.pos))) {
        consecutiveRests += text.charAt(context.pos);
        context.pos += 1;
      }
    }
  }
  return (
    (consecutiveRests ? transformFunction(consecutiveRests) : "") +
    spaces +
    dispatcherFunction({
      text,
      context,
      transformFunction,
      parseFunction: parseConsecutiveRests,
    })
  );
};
