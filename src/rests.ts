import { abcText } from "./annotationsActions";
import { dispatcher } from "./transpose";

const isDivided = (rest: string) => /\//i.test(rest);
const isMultiplied = (rest: string) => /[a-gA-G][,']*?[0-9]/i.test(rest);

/*
    This transform function assumes that only consecutive rests will be passed-in
*/
export const consolidateConsecutiveRestsTransform = (text: abcText) => {
  //split text at bar lines

  //split ${chord} into a json array
  const restsJson = dispatcher(
    text,
    { pos: 0 },
    (note: abcText) => `"${note}",`
  );

  //here, need to remove the trailing comma in array for the JSON to parse correctly
  const restsArr = JSON.parse(
    `${restsJson.substring(0, restsJson.length - 2)}]`
  );
  /*
    //separate each note passed-in. 
    // group them by subdivision
    //for each note, find if it's followed by 
        slash and number 
        or number only
    */
  type restValuesType = {
    "1unmarked": number[];
    "2divided": number[];
    "3multiplied": number[][];
  };

  const restValues: restValuesType = {
    "1unmarked": [],
    "2divided": [],
    "3multiplied": [],
  };
  restsArr.forEach((rest: abcText) => {
    let divisionNumber;
    if (isDivided(rest)) {
      //if doesn't contain number, count number of slashes
      if (!/[0-9]/g.test(rest)) {
        divisionNumber = rest?.match(/\//g)?.reduce((prev) => prev * 2, 1) || 0;
        restValues["2divided"].push(divisionNumber);
      } else {
        //if contains number
        divisionNumber = parseInt(
          rest?.match(/[0-9]*/g)?.filter((n) => n)[0] || "0"
        );
        restValues["2divided"].push(divisionNumber);
      }
    } else if (isMultiplied(rest)) {
      divisionNumber = parseInt(
        rest?.match(/[0-9]*/g)?.filter((n) => n)[0] || "0"
      );
      restValues["2divided"].push(divisionNumber);
    } else {
      restValues["1unmarked"].push(1);
    }
  });
  restValues["2divided"]
    .sort((a, b) => a - b)
    .join("")
    .match(/(.)\1*/g);
  // compte le nombre d'entiers (longueur 1) pour chaque subdivision
  // le dénominateur de la fraction (parseInt(subdivisionActuelle[0])) indique la taille du fragment nécessaire pour constituer un entier
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
