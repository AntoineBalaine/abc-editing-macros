import {
  abcText,
  InstrumentCalls,
  instrumentFamilies,
} from "./annotationsActions";
import { contextObj } from "./transformPitches";
import { isNomenclatureLine } from "./parseNomenclature";
export const isHeaderLine = (line: abcText) => /[A-Z]:/i.test(line);

export const separateHeaderAndBody = (text: abcText, context: contextObj) => {
  const lines = text.split(/\n/g);
  let header = [];
  let i = -1;
  while (true) {
    i += 1;
    if (isHeaderLine(lines[i])) {
      header.push(lines[i]);
    } else break;
  }
  const headerText = header.join("\n");
  const bodyText = lines.slice(i).join("\n");

  return { headerText, bodyText };
};

export const addNomenclatureToHeader = (
  headerText: string,
  tags: string[]
): string => {
  tags.forEach((tag) => (headerText += `\nV: ${tag} name="${tag}"`));
  return headerText;
};

export const buildBodyFromInstruments = (
  bodyText: InstrumentCalls[]
): string => {
  //split each instrument call into lines
  //[{tag: [lines]}, {tag: [lines]}]
  bodyText = bodyText.map((instrumentCall: any) => {
    Object.keys(instrumentCall).forEach(
      (instrumentKey) =>
        (instrumentCall[instrumentKey] =
          instrumentCall[instrumentKey].split("\n"))
    );
    return instrumentCall;
  });
  const numberOfLinesInText = Object.values(bodyText[0])[0].length;
  const numberOfInstruments = bodyText.length;
  const meshedScoreArray = [];
  for (let i = 0; i < numberOfLinesInText - 1; i += 1) {
    const firstInstrument = 0;
    const currentLine = Object.values(bodyText[firstInstrument]).flat()[i];

    if (isNomenclatureLine(currentLine, { pos: 0 })) {
      meshedScoreArray.push(currentLine);
      continue;
    } else {
      //push all the lines at the current index
      //and a "%"
      for (let j = 0; j < numberOfInstruments; j += 1) {
        meshedScoreArray.push(
          `[V: ${Object.keys(bodyText[j])[0]}] ${
            Object.values(bodyText[j]).flat()[i]
          }`
        );
      }
      meshedScoreArray.push("%");
    }
  }
  return meshedScoreArray.join("\n");
};
