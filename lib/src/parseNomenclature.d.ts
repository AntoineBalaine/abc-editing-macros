import { abcText, annotationStyle } from "./annotationsActions";
import { dispatcherFunction } from "./dispatcher";
import { contextObj, TransformFunction } from "./transformPitches";
export declare const isNomenclatureTag: (text: abcText, context: contextObj) => boolean;
export declare const isNomenclatureLine: (text: abcText, context: contextObj) => boolean;
export declare const jumpToEndOfNomenclatureTag: (text: abcText, context: contextObj, transformFunction: TransformFunction, tag?: annotationStyle | undefined) => string;
export declare const jumpToEndOfNomenclatureLine: (text: abcText, context: contextObj, transformFunction: TransformFunction, tag?: annotationStyle | undefined) => string;
export declare const jumpToEndOfSymbol: dispatcherFunction;
