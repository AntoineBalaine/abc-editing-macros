import { abcText } from "./annotationsActions";
import { noteDispatcher, isPitchToken, isRhythmToken } from "./dispatcher";
import { isLowerCase } from "./transformPitches";

export type chordText = `[${abcText}]`;

const orderOfNotes = "cdefgab".split("");
export const reorderChordTransform = (chord: chordText): string => {
  //split ${chord} into a json array
  const strNotes = noteDispatcher(
    chord,
    { pos: 0 },
    (note: abcText) => `"${note}",`
  );

  //here, need to remove the trailing comma in array for the JSON to parse correctly
  const chordNotes = JSON.parse(
    `${strNotes.substring(0, strNotes.length - 2)}]`
  );
  type octaveOrderType = {
    "1comma": string[][];
    "2upperCase": string[];
    "3lowerCase": string[];
    "4apostrophe": string[][];
  };
  const octaveOrder: octaveOrderType = {
    "1comma": [],
    "2upperCase": [],
    "3lowerCase": [],
    "4apostrophe": [],
  };

  const howMany = (note: string, token: string) => {
    const matcher = new RegExp(`${token}*`, "g");
    const matches = note.match(matcher)?.filter((n) => n)[0].length;
    return matches ? matches : -1;
  };

  chordNotes.forEach((note: abcText) => {
    const noteName = note.match(/[a-zA-Z]/g)?.filter((n) => n)[0];
    if (note.includes(",")) {
      //find the order.1comma subarray that has the matching number of `,` and push to it
      // if unfound, push [note] and order the array so that elements appear in order from the most number of `,` to the least
      const numberOfCommas = howMany(note, ",");
      const foundMatchingOctave = octaveOrder["1comma"].find(
        (subArray) => howMany(subArray[0], ",") === numberOfCommas
      );
      if (foundMatchingOctave) {
        for (let i = 0; i < octaveOrder["1comma"].length; i += 1) {
          if (howMany(octaveOrder["1comma"][i][0], ",") === numberOfCommas) {
            octaveOrder["1comma"][i].push(note);
          }
        }
      } else {
        //push to octaveOrder.1comma, sort array by number of commas
        octaveOrder["1comma"].push([note]);
        octaveOrder["1comma"].sort(
          (a, b) => howMany(a[0][0], ",") - howMany(b[0][0], ",")
        );
      }
    } else if (note.includes(`'`)) {
      //find the order.4apostrophe subarray that has the matching number of `'`
      const numberOfApostrophes = howMany(note, `'`);
      const foundMatchingOctave = octaveOrder["4apostrophe"].find(
        (subArray) => howMany(subArray[0], `'`) === numberOfApostrophes
      );
      if (foundMatchingOctave) {
        for (let i = 0; i < octaveOrder["4apostrophe"].length; i += 1) {
          if (
            howMany(octaveOrder["4apostrophe"][i][0], `'`) ===
            numberOfApostrophes
          ) {
            octaveOrder["4apostrophe"][i].push(note);
          }
        }
      } else {
        //push to octaveOrder.4apostrophe, sort array by number of commas
        octaveOrder["4apostrophe"].push([note]);
        octaveOrder["4apostrophe"].sort(
          (a, b) => howMany(a[0][0], `'`) - howMany(b[0][0], `'`)
        );
      }
    } else if (noteName && isLowerCase(noteName[0])) {
      octaveOrder["3lowerCase"].push(note);
    } else {
      octaveOrder["2upperCase"].push(note);
    }
  });

  return (
    "[" +
    [
      octaveOrder["1comma"].map((subArray) =>
        subArray.sort(
          (a, b) =>
            orderOfNotes.indexOf(a.toLowerCase()) -
            orderOfNotes.indexOf(b.toLowerCase())
        )
      ),
      octaveOrder["2upperCase"].sort(
        (a, b) =>
          orderOfNotes.indexOf(a.toLowerCase()) -
          orderOfNotes.indexOf(b.toLowerCase())
      ),
      octaveOrder["3lowerCase"].sort(
        (a, b) =>
          orderOfNotes.indexOf(a.toLowerCase()) -
          orderOfNotes.indexOf(b.toLowerCase())
      ),
      octaveOrder["4apostrophe"].map((subArray) =>
        subArray.sort(
          (a, b) =>
            orderOfNotes.indexOf(a.toLowerCase()) -
            orderOfNotes.indexOf(b.toLowerCase())
        )
      ),
    ]
      .flat()
      .join("") +
    "]"
  );
};

export const consolidateRestsInChordTransform = (chord: chordText) => {
  let chordPitches = chord
    .split("")
    .filter((e) => !isRhythmToken(e))
    .filter((n) => isPitchToken(n));
  let rhythmTokens = chord.split("").filter((e) => isRhythmToken(e));
  if (chordPitches.every((n) => n === "z")) {
    return "z" + rhythmTokens.join("");
  } else {
    return `[${chordPitches.filter((e) => e !== "z")}]${rhythmTokens.join("")}`;
  }
};
