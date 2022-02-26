import {isFile, isDirectory} from 'path-type';
import { promises as fs } from "fs";
import path from "path";
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

export const createOrUpdateHarmonizationRoutine = async (
    abcText: abcText, 
    annotationCommand: annotationCommandEnum,  
    scoreFilePath: string
) => {
    let dirTarget = "";
    if (await isFile(scoreFilePath)) {
        // extract directory
        dirTarget = `${path.basename(path.dirname(scoreFilePath))}.${annotationCommand}`;
    } else if (await isDirectory(scoreFilePath)){
        dirTarget = `${scoreFilePath}.${annotationCommand}` 
    }
    await fs.writeFile(dirTarget, abcText, "utf-8");
    return;
};

const parseTags = (text: abcText)=>{
    let tags = text.match(/(["])(?:(?=(\\?))\2.)*?\1/g);
    const uniqueTags = [ ...new Set(tags?.map(tag=>tag.replace(/["\/]+/g, "")))];

    // TODO à changer
    let harmonyTechniquesFile = "";
    let familyFile = ""

    for (let i=0; i<uniqueTags.length; i++){

        if (harmonyTechniquesFile && familyFile) break;

        if ( Object.values(harmonisationStyles).includes(uniqueTags[i] as harmonisationStyles) && !harmonyTechniquesFile) {
            //create harmonyTechniquesFile
        }

        if (Object.values(instrumentFamilies).includes(uniqueTags[i] as instrumentFamilies) && !familyFile){
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