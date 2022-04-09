export declare const isLowerCase: (str: string) => boolean;
export declare const octaviateDownTransform: (note: string) => string;
export declare const octaviateUpTransform: (note: string) => string;
export declare const convertToRestTransform: (note: string) => string;
export declare const noteHeight: string[][];
export declare type KeyIndicationType = `[K:${string}]`;
export declare const convertToEnharmoniaTransform: (note: string, Key?: `[K:${string}]` | undefined) => string;
export declare const transposeHalfStepDownTransform: (note: string) => string;
export declare const transposeHalfStepUpTransform: (note: string) => string;
export declare const transposeStepUpTransform: (note: string, Key?: `[K:${string}]` | undefined) => string;
export declare const transposeStepDownTransform: (note: string, Key?: `[K:${string}]` | undefined) => string;
export declare type contextObj = {
    pos: number;
};
export declare type TransformFunction = (note: string) => string;
