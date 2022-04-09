import { abcText, annotationStyle } from "./annotationsActions";
import { contextObj, TransformFunction } from "./transformPitches";
export declare const parseRhythmToken: (text: abcText, context: contextObj) => string;
export declare const parseNote: (text: string, context: contextObj, transformFunction: TransformFunction, tag?: annotationStyle | undefined) => string;
