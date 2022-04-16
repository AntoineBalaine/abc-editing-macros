import { findTokenType, restDispatcher } from "./dispatcher";
import { contextObj, TransformFunction } from "./transformPitches";

export const parseConsecutiveRests = (
  text: string,
  context: contextObj,
  transformFunction: TransformFunction
): string => {
  //Get chords that carry only rests
  //en ignorant les articulations aux extrémités et dans la suite de silences
  let restSeries = text.charAt(context.pos);
  while (context.pos < text.length) {
    context.pos += 1;
    if (
      findTokenType(text, context) === "note" ||
      findTokenType(text, context) === "barLine" ||
      findTokenType(text, context) === "annotation"
    )
      break;
    else restSeries += text.charAt(context.pos);
  }
  //remove articulations
  //consolidate rests
  let restSeriesContext = { pos: -1 };
  let consecutiveRests = "";

  while (restSeriesContext) {
    restSeriesContext.pos += 1;
    if (findTokenType(text, restSeriesContext) === "rest")
      consecutiveRests += text.charAt(restSeriesContext.pos);
  }
  return (
    transformFunction(consecutiveRests) +
    restDispatcher(text, context, transformFunction)
  );
};
