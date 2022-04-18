import { contextObj } from "./transformPitches";
export declare type abcText = string;
export declare enum annotationCommandEnum {
    createHarmonisationFile = "harmonisation",
    createFamiliesFile = "families"
}
export declare type annotationStyle = harmonisationStyles | instrumentFamilies;
declare enum harmonisationStyles {
    soli = "soli",
    drp2 = "drp2",
    drp3 = "drp3",
    drp4 = "drp24",
    spread = "sprd",
    cluster = "clstr"
}
export declare enum instrumentFamilies {
    brass = "br",
    woodwinds = "wd",
    percussion = "prc",
    keys = "pn",
    strings = "str",
    pluckStrings = "plk"
}
export declare type InstrumentCalls = {
    [key in instrumentFamilies]: abcText;
};
export declare const findInstrumentCalls: (text: abcText, context: contextObj) => InstrumentCalls[];
export declare const createOrUpdateHarmonizationRoutine: (abcText: string, annotationCommand: annotationCommandEnum, scoreFilePath: string) => void;
export declare const consolidateRestsInRoutine: (tuneBody: abcText) => string;
export declare const createInstrumentationRoutine: (abcText: string) => string;
export declare const parseUniqueTags: (text: abcText) => string[];
export declare const removeInstrumentTagsFromAnnotation: (annotationText: string) => string;
export {};
