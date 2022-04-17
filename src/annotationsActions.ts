import { promises as fs } from "fs";
import path from "path";
import {
  noteDispatcher,
  isAlterationToken,
  isLetter,
  isPitchToken,
  isRhythmToken,
  chordDispatcher,
  restDispatcher,
} from "./dispatcher";
import {
  contextObj,
  convertToRestTransform,
  TransformFunction,
} from "./transformPitches";
import { turnNotesToRests } from "./test/testTransposeFunctions";
import {
  addNomenclatureToHeader,
  buildBodyFromInstruments,
  separateHeaderAndBody,
} from "./fileStructureActions";
import { chordText, consolidateRestsInChordTransform } from "./transformChords";
import { consolidateConsecutiveNotesTransform } from "./transformRests";
import { parseConsecutiveRests } from "./parseConsecutiveRests";

export type abcText = string;
export enum annotationCommandEnum {
  createHarmonisationFile = "harmonisation",
  createFamiliesFile = "families",
}

export type annotationStyle = harmonisationStyles | instrumentFamilies;

enum harmonisationStyles {
  soli = "soli",
  drp2 = "drp2",
  drp3 = "drp3",
  drp4 = "drp24",
  spread = "sprd",
  cluster = "clstr",
}

export enum instrumentFamilies {
  brass = "br",
  woodwinds = "wd",
  percussion = "prc",
  keys = "pn",
  strings = "str",
  pluckStrings = "plk",
}

/*
    if a tag is a harmony enum, 
        copy the contents to the harmony file
        filenaming convention: songTitle.harmony.abc
    if a tag is an instrumentFamily type, 
        copy the contents to instrumentFamilies file || copy the instrument tags to the harmony file
test: expect(fs.existsSync('file.txt')).to.be.true
*/

/*
  dispatcherFunction: 
  parse through contents, 
 */
type AnnotateDispatcherFunction = (
  text: abcText,
  context: contextObj,
  tag: annotationStyle
) => string;

export type InstrumentCalls = { [key in instrumentFamilies]: abcText };
export const findInstrumentCalls = (
  text: abcText,
  context: contextObj
): InstrumentCalls[] => {
  /*
    check if annotation contains tag
    find open and closing tags. 
  */
  let uniqueFamilyTags = parseUniqueTags(text).filter((tag) =>
    Object.values(instrumentFamilies).includes(tag as instrumentFamilies)
  );
  const parsedFamilies = uniqueFamilyTags.map((tag) => {
    return {
      [tag]: noteDispatcher(
        text,
        { pos: 0 },
        convertToRestTransform,
        tag as annotationStyle
      ),
    };
  });
  return parsedFamilies as InstrumentCalls[];
};

export const createOrUpdateHarmonizationRoutine = (
  abcText: abcText,
  annotationCommand: annotationCommandEnum,
  scoreFilePath: string
) => {
  const dirTarget = path.join(
    path.dirname(scoreFilePath),
    path.parse(scoreFilePath).name +
      `.${annotationCommandEnum.createHarmonisationFile}.abc`
  );
  return;
};

export const consolidateRestsInRoutine = (tuneBody: abcText) => {
  //split song at every bar,
  const splitLines = tuneBody.split("\n");
  const linesWithNestedBars = splitLines
    .map((line) =>
      line
        .split("|")
        .map((bar) =>
          chordDispatcher(
            bar,
            { pos: 0 },
            consolidateRestsInChordTransform as TransformFunction
          )
        )
        .map((bar) =>
          parseConsecutiveRests({
            text: bar,
            context: { pos: 0 },
            transformFunction: consolidateConsecutiveNotesTransform,
            dispatcherFunction: restDispatcher,
          })
        )
        .join("|")
    )
    .join("\n");

  return linesWithNestedBars;

  /*   const splitBars = tuneBody.split(/[|]/g);
  //remove rests in chords that also have notes
  //consolidate chords that only carry rests
  const consolidatedRestsInChordsInBars = splitBars.map((bar) =>
    chordDispatcher(
      bar,
      { pos: 0 },
      consolidateRestsInChordTransform as TransformFunction
    )
  );
  //consolidateRests for each bar
  const consolidatedRestsInBars = consolidatedRestsInChordsInBars.map((bar) =>
    restDispatcher(bar, { pos: 0 }, consolidateConsecutiveNotesTransform)
  );
  return consolidatedRestsInBars.join("|"); */
};

export const createInstrumentationRoutine = (abcText: abcText) => {
  const headerAndBody = separateHeaderAndBody(abcText, { pos: 0 });

  let parsedInstrumentFamilies = findInstrumentCalls(headerAndBody.bodyText, {
    pos: 0,
  });
  headerAndBody.headerText = addNomenclatureToHeader(
    headerAndBody.headerText,
    parsedInstrumentFamilies.map((instrument) => Object.keys(instrument)[0])
  );
  headerAndBody.bodyText = buildBodyFromInstruments(parsedInstrumentFamilies);
  return Object.values(headerAndBody).join("\n");
};

export const parseUniqueTags = (text: abcText): string[] => {
  let pos = -1;
  let hasStartedComment = false;
  let tags = [];
  let curComment = "";
  while (pos < text.length) {
    pos += 1;
    if (hasStartedComment) {
      curComment += text.charAt(pos);
    }
    if (text.charAt(pos) === '"') {
      if (!hasStartedComment) {
        pos += 1;
        hasStartedComment = true;
        curComment += text.charAt(pos);
      } else {
        tags.push(curComment.slice());
        curComment = "";
        hasStartedComment = false;
      }
    }
  }
  //let tags = text.match(/(["])(?:(?=(\\?))\2.)*?\1/g);
  let uniqueTags = [
    ...new Set(
      tags
        ?.map((tag) => tag.split(/[\\n\s]/))
        .flat()
        .filter((tag) => tag)
        .map((tag) => tag.replace(/["\/]+/g, ""))
    ),
  ];
  return uniqueTags;
};

export const removeInstrumentTagsFromAnnotation = (
  annotationText: string
): string => {
  const tagsInAnnotation = parseUniqueTags(annotationText).filter((tag) =>
    Object.values(instrumentFamilies).includes(tag as instrumentFamilies)
  );
  //remove only instrumentTags.
  tagsInAnnotation.forEach(
    (tagInAnnotation) =>
      (annotationText = annotationText.replace(
        new RegExp("/?" + tagInAnnotation, "g"),
        ""
      ))
  );
  annotationText = JSON.stringify(
    annotationText.substring(1, annotationText.length - 1).trim()
  );
  return annotationText;
};
