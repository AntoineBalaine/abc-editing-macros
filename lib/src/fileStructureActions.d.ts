import { abcText, InstrumentCalls } from "./annotationsActions";
import { contextObj } from "./transformPitches";
export declare const isHeaderLine: (line: abcText) => boolean;
export declare const separateHeaderAndBody: (text: abcText, context: contextObj) => {
    headerText: string;
    bodyText: string;
};
export declare const addNomenclatureToHeader: (headerText: string, tags: string[]) => string;
export declare const buildBodyFromInstruments: (bodyText: InstrumentCalls[]) => string;
