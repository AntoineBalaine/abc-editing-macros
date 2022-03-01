import { promises as fs } from "fs";
import path from "path";
import { contextObj, convertToRestTransform, dispatcher, isAlterationToken, isLetter, parseNote } from "./transpose";

export type abcText = string;
export enum annotationCommandEnum {
  createHarmonisationFile = "harmonisation",
  createFamiliesFile = "families"
}

export type annotationStyle = harmonisationStyles | instrumentFamilies;

enum harmonisationStyles {
  soli = "soli",
  drp2 = "drp2",
  drp3 = "drp3",
  drp4 = "drp24",
  spread = "sprd",
  cluster = "clstr"
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
type AnnotateDispatcherFunction = (text: abcText, context: contextObj, tag: annotationStyle) => string;

export const findInstrumentCalls = (text: abcText, context: contextObj) => {
  /*
    check if annotation contains tag
    find open and closing tags. 
  */
  let uniqueFamilyTags = parseUniqueTags(text).filter(tag => Object.values(instrumentFamilies).includes(tag as instrumentFamilies));
  uniqueFamilyTags.map((tag) => {
    return dispatcher(text, { pos: 0 }, convertToRestTransform, tag as annotationStyle);
  })
}

const annotateDispatcher: AnnotateDispatcherFunction = (text, context, tag) => {
  const contextChar = text.charAt(context.pos);
  if (isLetter(contextChar) || isAlterationToken(contextChar)) {
    return parseNote(text, context, convertToRestTransform)
  } else if (contextChar === "\"") {
    return parseAnnotation(text, context, tag);
  } else if (context.pos < text.length) {
    context.pos += 1;
    return contextChar + annotateDispatcher(text, context, tag);
  } else return "";
}

export const createOrUpdateHarmonizationRoutine = async (
  abcText: abcText,
  annotationCommand: annotationCommandEnum,
  scoreFilePath: string
) => {
  const dirTarget = path.join(path.dirname(scoreFilePath), path.parse(scoreFilePath).name + `.${annotationCommandEnum.createHarmonisationFile}.abc`)
  await fs.writeFile(dirTarget, abcText, "utf-8");
  return;
};

export const createOrUpdateInstrumentationRoutine = async (
  abcText: abcText,
  annotationCommand: annotationCommandEnum,
  scoreFilePath: string
) => {
  const dirTarget = path.join(path.dirname(scoreFilePath), path.parse(scoreFilePath).name + `.${annotationCommandEnum.createHarmonisationFile}.abc`)
  await fs.writeFile(dirTarget, abcText, "utf-8");
  //read file, turn any sections that are not within instrument tags into rests
  return;
};

export const parseUniqueTags = (text: abcText): string[] => {
  let tags = text.match(/(["])(?:(?=(\\?))\2.)*?\1/g);
  let uniqueTags = [...new Set(tags?.map(tag => tag.split(/[\\n\s]/))
    .flat()
    .filter(tag => tag)
    .map(tag => tag.replace(/["\/]+/g, "")))];
  return uniqueTags;
}

const removeInstrumentTagsFromAnnotation = (annotationText: string): string => {
  const tagsInAnnotation = parseUniqueTags(annotationText).filter(tag=>Object.values(instrumentFamilies).includes(tag as instrumentFamilies));
  //remove only instrumentTags.
  tagsInAnnotation.forEach(tagInAnnotation => annotationText = annotationText.replace(new RegExp('\/?' + tagInAnnotation, 'g'), ""));
  annotationText = JSON.stringify(annotationText.substring(1, annotationText.length-1).trim());
  return annotationText;
}

export function parseAnnotation(text: string, context: contextObj, tag: annotationStyle): string {
  let retStr = "";
  const endOfOpeningTagAnnotation = text.indexOf("\"", context.pos + 1);
  const openingAnnotation = removeInstrumentTagsFromAnnotation(text.substring(context.pos, endOfOpeningTagAnnotation+1));


  if (text.substring(context.pos).indexOf(tag) < endOfOpeningTagAnnotation) {

    const closingTagIndex = text.indexOf(`\/${tag}`, endOfOpeningTagAnnotation);
    const closingTagAnnotationStart = text.lastIndexOf("\"", closingTagIndex);
    const closingTagAnnotationEnd = text.indexOf("\"", closingTagAnnotationStart+1);
    const closingAnnotation = removeInstrumentTagsFromAnnotation(text.substring(closingTagAnnotationStart, closingTagAnnotationEnd+1));

    retStr = openingAnnotation + text.substring(endOfOpeningTagAnnotation+1, closingTagAnnotationStart) + closingAnnotation;
    context.pos = closingTagAnnotationEnd + 1;

  } else {

    retStr = openingAnnotation;
    context.pos = endOfOpeningTagAnnotation + 1;

  }
  return retStr + dispatcher(text, context, convertToRestTransform, tag);
}

