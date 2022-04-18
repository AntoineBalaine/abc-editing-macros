import { abcText } from "./annotationsActions";
export declare type chordText = `[${abcText}]`;
export declare const reorderChordTransform: (chord: chordText) => string;
export declare const consolidateRestsInChordTransform: (chord: chordText) => string;
