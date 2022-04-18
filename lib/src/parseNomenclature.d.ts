import { abcText, annotationStyle } from "./annotationsActions";
import { dispatcherFunction } from "./dispatcher";
import { contextObj, TransformFunction } from "./transformPitches";
export declare type dispatcherProps = {
    text: abcText;
    context: contextObj;
    transformFunction: TransformFunction;
    dispatcherFunction: dispatcherFunction;
    parseFunction?: ParseFunction;
    tag?: annotationStyle;
};
export declare type ParseFunction = ({}: dispatcherProps) => string;
export declare const isNomenclatureTag: (text: abcText, context: contextObj) => boolean;
export declare const isNomenclatureLine: (text: abcText, context: contextObj) => boolean;
export declare const jumpToEndOfNomenclatureTag: ({ text, context, transformFunction, dispatcherFunction, parseFunction, tag, }: dispatcherProps) => string;
export declare const jumpToEndOfNomenclatureLine: ({ text, context, transformFunction, dispatcherFunction, parseFunction, tag, }: dispatcherProps) => string;
export declare const jumpToEndOfSymbol: ({ text, context, transformFunction, dispatcherFunction, parseFunction, tag, }: dispatcherProps) => string;
export declare const jumpToEndOfAnnotation: ({ text, context, transformFunction, dispatcherFunction, parseFunction, }: dispatcherProps) => string;
