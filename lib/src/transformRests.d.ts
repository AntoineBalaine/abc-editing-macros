import { abcText } from "./annotationsActions";
export declare const consolidateConsecutiveNotesTransform: (text: abcText) => abcText;
export declare const duplicateLengthTransform: (note: abcText) => string;
export declare const divideLengthTransform: (note: abcText) => string;
export declare type sortedLengthsObj = {
    "1unmarked": number;
    "2divided": string[];
    "3multiplied": number;
};
