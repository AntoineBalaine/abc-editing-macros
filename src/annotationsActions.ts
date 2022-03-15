import { promises as fs } from "fs";
import path from "path";
import { contextObj, convertToRestTransform, dispatcher, isAlterationToken, isLetter, parseNote, TransformFunction, turnNotesToRests } from "./transpose";

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
  const parsedFamilies =  uniqueFamilyTags.map((tag) => {
    return {[tag]: dispatcher(text, { pos: 0 }, convertToRestTransform, tag as annotationStyle) };
  })
  return parsedFamilies;
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

export function parseAnnotation(text: string, context: contextObj, tag: annotationStyle, transformFunction: TransformFunction): string {
  let retStr = "";
  const sections = text.substring(context.pos).split(/(\"[^\".]*\")/g).filter(n=>n);
  //subdivise le tableau entre sections contenues dans les tags, et les autres

  let subSections = [];

  if (sections[0][0]==="\"" && !sections[0].includes(tag)){
    const purgedSections = removeInstrumentTagsFromAnnotation(sections[0]).replace(/\"(\s*)?\"/g,"");
     context.pos = context.pos + sections[0].length;
     return purgedSections + dispatcher(text, context, transformFunction, tag)
    
  } else { 
  for (let i=0; i<sections.length; i++){
    if (sections[i][0]==="\"" && sections[i].includes(tag)){
      let tagsection = [removeInstrumentTagsFromAnnotation(sections[i])];
      while(i<sections.length){
        i+=1;
        if (sections[i][0]==="\"" && sections[i].includes(`/${tag}`)){
          tagsection.push(removeInstrumentTagsFromAnnotation( sections[i] )); break; 
        } else if (sections[i][0]==="\"" && !sections[i].includes(`/${tag}`)){
          tagsection.push(removeInstrumentTagsFromAnnotation(sections[i]));
        } else tagsection.push(sections[i]);
      }
      subSections.push(tagsection);
    } else {
      subSections.push(sections[i]);
    }
  }
  return subSections.map(subSection=>{
    if (Array.isArray(subSection)){
      return [removeInstrumentTagsFromAnnotation(subSection[0]),
      ...subSection.slice(1, subSection.length-1),
      removeInstrumentTagsFromAnnotation(subSection[subSection.length-1])]
    } else return turnNotesToRests(subSection)
  }).flat().join("").replace(/\"(\s*)?\"/g,"");
 }
}


