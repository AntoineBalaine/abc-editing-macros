import { contextObj, TransformFunction } from "./transformPitches";
import { annotationStyle } from "./annotationsActions";
export declare function parseAnnotation(text: string, context: contextObj, tag: annotationStyle, transformFunction: TransformFunction): string;
