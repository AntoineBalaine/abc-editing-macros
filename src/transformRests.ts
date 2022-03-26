import { abcText } from "./annotationsActions";
import { dispatcher } from "./dispatcher";
import { noteHeight } from "./transformPitches";

const isDivided = (rest: string) => /\//i.test(rest);
const isMultiplied = (rest: string) => /[a-gA-G][,']*?[0-9]/i.test(rest);

const consolidateNotesByPairs = (noteLengthArr: string | string[]): any[] => {
  const duplicatedLength = duplicateLengthTransform(noteLengthArr[0]);

  const duplicationAmount = Math.trunc(noteLengthArr.length / 2);
  const resulting = new Array(duplicationAmount).fill(duplicatedLength);
  return [...resulting, ...noteLengthArr.slice(0, noteLengthArr.length % 2)];
};

const groupNotesByLength = (res: any[], curr: abcText) => {
  const parsedRes: string[] = res;
  if (parsedRes.some((subArr: abcText) => subArr.includes(curr))) {
    const mappedRes = parsedRes.map((item: string) => {
      if (item.includes(curr)) {
        return [...item, curr];
      } else {
        return item;
      }
    });
    return mappedRes;
  } else {
    return [...parsedRes, [curr]];
  }
};

export const consolidateConsecutiveNotesTransform = (
  text: abcText
): abcText => {
  const notesJson = dispatcher(
    text,
    { pos: 0 },
    (note: abcText) => `"${note}",`
  );

  const notesArr = JSON.parse(
    `[${notesJson.substring(0, notesJson.length - 1)}]`
  );

  const pitch = notesArr[0].replace(/[\/0-9]/g, "");
  const noteLengths: sortedLengthsObj = sortLengths(notesArr, pitch);

  let unsortedConsolidatedValues = buildConsolidatedValues(noteLengths, pitch);

  const sortedConsolidatedValues = sortLengths(
    unsortedConsolidatedValues,
    pitch
  );
  /*
if more values need to be collapsed, call the recursion
if unmarked and multiplied need collapsing, and
*/

  if (
    sortedConsolidatedValues["2divided"].some((subArr) => subArr.length > 1)
  ) {
    return consolidateConsecutiveNotesTransform(
      buildConsolidatedValues(sortedConsolidatedValues, pitch).join("")
    );
  } else {
    return buildConsolidatedValues(sortedConsolidatedValues, pitch).join("");
  }
};

const isFloat = (number: number) => number % 1 !== 0;

export const duplicateLengthTransform = (note: abcText) => {
  const pitch: string = note.replace(/[\/0-9]/g, "");
  const lengthToken: string = note.replace(/[^(\/0-9)]/g, "");
  if (isDivided(note)) {
    const slashIndex = lengthToken.indexOf("/");
    const denominator = lengthToken.substring(slashIndex);
    const numerator = lengthToken.substring(0, slashIndex);
    let returnDenominator;
    if (!/[0-9]/i.test(denominator)) {
      //lengthToken = number of slashes
      returnDenominator = Math.trunc(
        (denominator.match(/\//g)?.length || 1) / 2
      );
    } else {
      returnDenominator = parseInt(denominator.substring(1)) / 2;
    }
    return returnDenominator === 1
      ? `${pitch}${numerator}`
      : `${pitch}${numerator}/${returnDenominator}`;
  } else if (isMultiplied(note)) {
    let multiplier = parseInt(lengthToken) * 2;
    return `${pitch}${multiplier}`;
  } else return `${note}2`;
};

export const divideLengthTransform = (note: abcText) => {
  const pitch: string = note.replace(/[\/0-9]/g, "");
  const lengthToken: string = note.replace(/[^(\/0-9)]/g, "");
  if (isDivided(note)) {
    /*
      denominator *2
     */
    const slashIndex = lengthToken.indexOf("/");
    const denominator = lengthToken.substring(slashIndex);
    const numerator = lengthToken.substring(0, slashIndex);
    let returnDenominator;
    if (!/[0-9]/i.test(denominator)) {
      //lengthToken = number of slashes
      returnDenominator = Math.trunc(
        (denominator.match(/\//g)?.length || 1) * 2
      );
    } else {
      returnDenominator = parseInt(denominator.substring(1)) * 2;
    }
    return returnDenominator === 1
      ? `${pitch}${numerator}`
      : `${pitch}${numerator}/${returnDenominator}`;
  } else if (isMultiplied(note)) {
    /*
     divide dénom par 2, 
     si division est un float, tronque
    */
    let multiplier = parseInt(lengthToken) / 2;
    return multiplier === 1 ? `${pitch}` : `${pitch}${multiplier}`;
  } else return `${note}/`;
};

export type sortedLengthsObj = {
  "1unmarked": number;
  "2divided": string[];
  "3multiplied": number;
};

const sortLengths = (notesArr: abcText[], pitch: abcText): sortedLengthsObj => {
  let noteValues: sortedLengthsObj = {
    "1unmarked": 0,
    "2divided": [],
    "3multiplied": 0,
  };
  notesArr.forEach((note: abcText) => {
    let divisionNumber;
    if (isDivided(note)) {
      if (!/[0-9]/g.test(note)) {
        note =
          note.substring(0, note.indexOf("/")) +
          (note.match(/\//g)?.length || 0) * 2;
      }
      noteValues["2divided"].push(note);
    } else if (isMultiplied(note)) {
      noteValues["3multiplied"] += parseInt(
        note?.match(/[0-9]+/g)?.filter((n) => n)[0] || "0"
      );
    } else {
      noteValues["1unmarked"] += 1;
    }
  });

  noteValues["2divided"]
    .sort(
      (a, b) =>
        parseInt(a.match(/[0-9]*/g)?.filter((n) => n)[0] || "0") -
        parseInt(b.match(/[0-9]*/g)?.filter((n) => n)[0] || "0")
    )
    .join("")
    .match(/(.)\1*/g);

  if (noteValues["2divided"].length > 0) {
    const newVal = noteValues["2divided"]
      ?.reduce(groupNotesByLength, [])
      .flatMap(consolidateNotesByPairs);
    noteValues["2divided"] = newVal;
    //check if there are some non-divided values in object and redistribute them
    if (noteValues["2divided"].some((note) => !isDivided(note))) {
      noteValues = sortLengths(
        buildConsolidatedValues(noteValues, pitch),
        pitch
      );
    }
  }

  return noteValues;
};
function buildConsolidatedValues(
  restValues: sortedLengthsObj,
  pitch: abcText
): abcText[] {
  return [
    restValues["1unmarked"] === 0
      ? ""
      : restValues["1unmarked"] === 1
      ? pitch
      : pitch + restValues["1unmarked"],
    restValues["2divided"].length > 0 ? restValues["2divided"].slice() : "",
    restValues["3multiplied"] === 0 ? "" : pitch + restValues["3multiplied"],
  ]
    .filter((n) => n)
    .flat();
}
