import { promises as fs } from "fs";
import path from "path";
import { contextObj, convertToRestTransform, isAlterationToken, isLetter, parseNote } from "./transpose";
type abcText = string;
export enum annotationCommandEnum {
  createHarmonisationFile = "harmonisation",
  createFamiliesFile = "families"
}

enum harmonisationStyles {
  soli = "soli",
  drp2 = "drp2",
  drp3 = "drp3",
  drp4 = "drp24",
  spread = "sprd",
  cluster = "clstr"
}

enum instrumentFamilies {
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
type AnnotateDispatcherFunction = (text: abcText, context: contextObj, tag: annotationCommandEnum) => string;

export const findInstrumentCalls = (text: abcText, context: contextObj)=>{
  /*
    check if annotation contains tag
    find open and closing tags. 
  */
  let uniqueTags = parseUniqueTags(text).filter(tag=>Object.values(instrumentFamilies).includes(tag as instrumentFamilies));
  uniqueTags.map(( tag)=>{
    return annotateDispatcher(text, {pos: 0}, tag as annotationCommandEnum);
  })
}

const transformFromTag:AnnotateDispatcherFunction = (text, context, tag)=>{
  /**
   * convert any notes to silences until we find a tag
   * when find a tag, if foundTag===tag, copy text as is until end of closing tag
   * do not include the tag in the return sring
   */
  return "";
};

const annotateDispatcher: AnnotateDispatcherFunction = (text: abcText, context: contextObj, tag: annotationCommandEnum) => {
  const contextChar = text.charAt(context.pos);
  /**
   * check if
   * isNote
   * isAnnotation
   */
  if (isLetter(contextChar) || isAlterationToken(contextChar)) {
    return parseNote(text, context, convertToRestTransform)
  } else if (contextChar==="\"") {
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
  let uniqueTags = [...new Set(tags?.map(tag=>tag.split(/[\\n\s]/))
    .flat()
    .filter(tag=>tag)
    .map(tag => tag.replace(/["\/]+/g, "")))];
  return uniqueTags;
}

const parseTags = (text: abcText) => {
  let uniqueTags = parseUniqueTags(text);

  // TODO à changer
  let harmonyTechniquesFile = "";
  let familyFile = ""

  for (let i = 0; i < uniqueTags.length; i++) {

    if (harmonyTechniquesFile && familyFile) break;

    if (Object.values(harmonisationStyles).includes(uniqueTags[i] as harmonisationStyles) && !harmonyTechniquesFile) {
      //create harmonyTechniquesFile
    }

    if (Object.values(instrumentFamilies).includes(uniqueTags[i] as instrumentFamilies) && !familyFile) {
      //create familyFile;
    }
    /**
     * write harmony to files:
     * copy all the file, replace all the pitches that are outside of tags by rests
     * consolidate slurred note's lengths (for midi conversion)
     * realize chord symbols
     * apply harmony techniques
     */
  }
}
function parseAnnotation(text: string, context: contextObj, tag: annotationCommandEnum): string {
  throw new Error("Function not implemented.");
}

