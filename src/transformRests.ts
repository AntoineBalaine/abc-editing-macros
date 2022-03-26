import { abcText } from "./annotationsActions";
import { dispatcher } from "./dispatcher";

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

export const consolidateConsecutiveRestsTransform = (
  text: abcText
): abcText => {
  const pitch = dispatcher(text, { pos: 0 }, (note: abcText) => note)[0];
  const restsJson = dispatcher(
    text,
    { pos: 0 },
    (note: abcText) => `","${note}`
  );

  const restsArr = JSON.parse(
    `[${restsJson.substring(3, restsJson.length - 1)}"]`
  );
  type restValuesType = {
    "1unmarked": number;
    "2divided": string[];
    "3multiplied": number;
  };

  const restValues: restValuesType = {
    "1unmarked": 0,
    "2divided": [],
    "3multiplied": 0,
  };
  restsArr.forEach((rest: abcText) => {
    let divisionNumber;
    if (isDivided(rest)) {
      if (!/[0-9]/g.test(rest)) {
        rest =
          rest.substring(0, rest.indexOf("/")) +
          (rest.match(/\//g)?.length || 0) * 2;
      }
      restValues["2divided"].push(rest);
    } else if (isMultiplied(rest)) {
      restValues["3multiplied"] += parseInt(
        rest?.match(/[0-9]/g)?.filter((n) => n)[0] || "0"
      );
    } else {
      restValues["1unmarked"] += 1;
      //how to keep track of the pitch itself?
      /*

      */
    }
  });
  restValues["2divided"]
    .sort(
      (a, b) =>
        parseInt(a.match(/[0-9]*/g)?.filter((n) => n)[0] || "0") -
        parseInt(b.match(/[0-9]*/g)?.filter((n) => n)[0] || "0")
    )
    .join("")
    .match(/(.)\1*/g);

  if (restValues["2divided"].length > 0) {
    const newVal = restValues["2divided"]
      ?.reduce(groupNotesByLength, [])
      .flatMap(consolidateNotesByPairs);
    restValues["2divided"] = newVal;
  }

  let consolidatedValues = [
    restValues["1unmarked"] === 0 ? "" : restValues["1unmarked"],
    restValues["3multiplied"] === 0 ? "" : restValues["3multiplied"],
    restValues["2divided"].length > 0 ? restValues["2divided"].slice() : "",
  ]
    .flat()
    .join("");

  if (restValues["2divided"].some((subArr) => subArr.length > 1)) {
    return consolidateConsecutiveRestsTransform(`[${consolidatedValues}]`);
  } else {
    return `${consolidatedValues}`;
  }
};

export const consolidateRests = (text: abcText) => {
  const consecutiveRestsList = text.split("|");

  consecutiveRestsList.map((restsInBar) => {
    //split ${chord} into a json array
    const strNotes = dispatcher(
      text,
      { pos: 0 },
      (note: abcText) => `"${note}",`
    );

    //here, need to remove the trailing comma in array for the JSON to parse correctly
    const chordNotes = JSON.parse(
      `${strNotes.substring(0, strNotes.length - 2)}]`
    );
  });
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
