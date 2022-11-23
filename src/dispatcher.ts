import { abcText, annotationStyle } from "./annotationsActions";
import { parseAnnotation } from "./parseAnnotation";
import { contextObj, TransformFunction } from "./transformPitches";
import {
  isNomenclatureLine,
  isNomenclatureTag,
  jumpToEndOfAnnotation,
  jumpToEndOfNomenclatureLine,
  jumpToEndOfNomenclatureTag,
  jumpToEndOfSymbol,
  ParseFunction as ParseFunction,
} from "./parseNomenclature";
import { jumpToEndOfNote, parseNote } from "./parseNotes";
import { parseChord } from "./parseChords";
import {
  consolidateRestsInTieAndJumpToEndOfTie,
  isArticulation,
  isOpeningTie,
  isPitchToken,
  isRest,
  tieContainsNotes,
} from "./dispatcherHelpers";

export type noteDispatcherProps = {
  text: abcText;
  context: contextObj;
  transformFunction: TransformFunction;
  parseFunction?: ParseFunction;
  tag?: annotationStyle;
};

export type dispatcherFunction = ({
  text,
  context,
  transformFunction,
  tag,
}: noteDispatcherProps) => string;

/**
 * To do:
 * replace findTokenType's response strings with the enum instead
 */
enum tokenTypes {
  note = "note",
  rest = "rest",
  openingTie = "openingTie",
  articulation = "articulation",
  space = "space",
  barLine = "barLine",
  annotation = "annotation",
  symbol = "symbol",
  lyric = "lyric line",
  nomenclatureLine = "nomenclature line",
  nomenclatureTag = "nomenclature tag",
  chord = "chord",
  unmatched = "unmatched",
  comment = "comment line",
  end = "end",
}

export const findTokenType = (
  text: abcText,
  context: contextObj
): tokenTypes => {
  const token = text.charAt(context.pos);
  if (isPitchToken(token)) return tokenTypes.note;
  if (isRest(token)) return tokenTypes.rest;
  if (isOpeningTie(token + text.charAt(context.pos + 1)))
    return tokenTypes.openingTie;
  if (isArticulation(text, context)) return tokenTypes.articulation;
  if (token === " ") return tokenTypes.space;
  if (token === "|") return tokenTypes.barLine;
  if (token === '"') return tokenTypes.annotation;
  if (token === "!") return tokenTypes.symbol;
  if (token === "w" && /^w:/.test(text.substring(context.pos)))
    return tokenTypes.lyric;
  if (token === "\n" && isNomenclatureLine(text, { pos: context.pos + 1 }))
    return tokenTypes.nomenclatureLine;
  if (context.pos === 0 && isNomenclatureLine(text, { pos: context.pos }))
    return tokenTypes.nomenclatureLine;
  if (token === "[" && isNomenclatureTag(text, context))
    return tokenTypes.nomenclatureTag;
  if (token === "[" && !isNomenclatureTag(text, context))
    return tokenTypes.chord;
  if (context.pos < text.length) return tokenTypes.unmatched;
  if (/^%/.test(text.substring(context.pos))) return tokenTypes.comment;
  else return tokenTypes.end;
};

export const noteDispatcher: dispatcherFunction = ({
  text,
  context,
  transformFunction,
  tag,
}: noteDispatcherProps) => {
  const contextChar = text.charAt(context.pos);
  const tokenType = findTokenType(text, context);
  const propsForActionFn = {
    text,
    context,
    transformFunction,
    dispatcherFunction: noteDispatcher,
    tag,
  };

  switch (tokenType) {
    case tokenTypes.note:
      return parseNote(text, context, transformFunction, tag);
    case tokenTypes.rest:
      return parseNote(text, context, transformFunction, tag);
    case tokenTypes.annotation:
      if (tag) {
        return parseAnnotation(text, context, tag, transformFunction);
      }
    case tokenTypes.symbol:
      return jumpToEndOfSymbol(propsForActionFn);
    case tokenTypes.lyric:
    case tokenTypes.nomenclatureLine:
      return jumpToEndOfNomenclatureLine(propsForActionFn);
    case tokenTypes.nomenclatureTag:
      return jumpToEndOfNomenclatureTag(propsForActionFn);
    case tokenTypes.end:
      return "";
    default: {
      context.pos += 1;
      return (
        contextChar + noteDispatcher({ text, context, transformFunction, tag })
      );
    }
  }
};

export const chordDispatcher: dispatcherFunction = ({
  text,
  context,
  transformFunction,
}) => {
  const contextChar = text.charAt(context.pos);
  const tokenType = findTokenType(text, context);
  const propsForActionFn = {
    text,
    context,
    transformFunction,
    dispatcherFunction: chordDispatcher,
  };
  switch (tokenType) {
    case tokenTypes.chord:
      return parseChord({ text, context, transformFunction });
    case tokenTypes.annotation:
      return jumpToEndOfAnnotation(propsForActionFn);
    case tokenTypes.symbol:
      return jumpToEndOfSymbol(propsForActionFn);
    case tokenTypes.nomenclatureLine:
      return jumpToEndOfNomenclatureLine(propsForActionFn);
    case tokenTypes.nomenclatureTag:
      return jumpToEndOfNomenclatureTag(propsForActionFn);
    case tokenTypes.note:
      return jumpToEndOfNote(propsForActionFn);
    case tokenTypes.end:
      return "";
    default: {
      context.pos += 1;
      return (
        contextChar + chordDispatcher({ text, context, transformFunction })
      );
    }
  }
};

export const restDispatcher: dispatcherFunction = ({
  text,
  context,
  transformFunction,
  parseFunction,
}): string => {
  const contextChar = text.charAt(context.pos);
  const tokenType = findTokenType(text, context);
  const propsForActionFn = {
    text,
    context,
    transformFunction,
    dispatcherFunction: restDispatcher,
    parseFunction,
  };
  switch (tokenType) {
    case "rest": {
      return parseFunction
        ? parseFunction(propsForActionFn)
        : transformFunction(contextChar);
    }
    case tokenTypes.annotation:
      return jumpToEndOfAnnotation(propsForActionFn);
    case tokenTypes.symbol:
      return jumpToEndOfSymbol(propsForActionFn);
    case tokenTypes.nomenclatureLine:
      return jumpToEndOfNomenclatureLine(propsForActionFn);
    case tokenTypes.nomenclatureTag:
      return jumpToEndOfNomenclatureTag(propsForActionFn);
    case tokenTypes.end:
      return "";
    case tokenTypes.openingTie: {
      if (tieContainsNotes({ ...propsForActionFn, context: { ...context } })) {
        return consolidateRestsInTieAndJumpToEndOfTie(propsForActionFn);
      } else {
        return parseFunction
          ? parseFunction(propsForActionFn)
          : transformFunction(contextChar);
      }
    }
    case tokenTypes.articulation:
      context.pos += 1;
      return restDispatcher(propsForActionFn);
    default: {
      context.pos += 1;
      return contextChar + restDispatcher(propsForActionFn);
    }
  }
};

export const formatterDispatch: dispatcherFunction = ({
  text,
  context,
  transformFunction,
  parseFunction,
}): string => {
  const contextChar = text.charAt(context.pos);
  const tokenType = findTokenType(text, context);
  const propsForActionFn = {
    text,
    context,
    transformFunction,
    dispatcherFunction: formatterDispatch,
    parseFunction,
  };
  switch (tokenType) {
    case tokenTypes.rest:
    case tokenTypes.openingTie:
    case tokenTypes.note: {
      if (parseFunction) {
        return parseFunction(propsForActionFn);
      } else {
        context.pos += 1;
        return contextChar + formatterDispatch(propsForActionFn);
      }
    }
    case tokenTypes.annotation:
      return jumpToEndOfAnnotation(propsForActionFn);
    case tokenTypes.space:
      return parseFunction
        ? parseFunction(propsForActionFn)
        : (() => {
            context.pos += 1;
            return contextChar + formatterDispatch(propsForActionFn);
          })();
    case tokenTypes.symbol:
      return jumpToEndOfSymbol(propsForActionFn);
    case tokenTypes.nomenclatureLine:
      return jumpToEndOfNomenclatureLine(propsForActionFn);
    case tokenTypes.nomenclatureTag:
      return jumpToEndOfNomenclatureTag(propsForActionFn);
    case tokenTypes.end:
      return "";
    default: {
      context.pos += 1;
      return contextChar + formatterDispatch(propsForActionFn);
    }
  }
};

export const removeDoubleSpaces: ParseFunction = ({
  text,
  context,
  transformFunction,
  dispatcherFunction,
  parseFunction,
}) => {
  const propsForActionFn = {
    text,
    context,
    transformFunction,
    dispatcherFunction: formatterDispatch,
    parseFunction,
  };
  const contextChar = text.charAt(context.pos);
  context.pos += 1;
  if (contextChar === " ") {
    while (text.charAt(context.pos) === " ") {
      context.pos += 1;
    }
  }
  return contextChar + dispatcherFunction(propsForActionFn);
};

export const musicSplitter_lyricFormatter: dispatcherFunction = ({
  text,
  context,
  transformFunction,
  parseFunction,
}) => {
  const contextChar = text.charAt(context.pos);
  const tokenType = findTokenType(text, context);
  const propsForActionFn = {
    text,
    context,
    transformFunction,
    dispatcherFunction: formatterDispatch,
    parseFunction,
  };
  switch (tokenType) {
    case tokenTypes.rest:
    case tokenTypes.openingTie:
    case tokenTypes.note: {
      context.pos += 1;
      return contextChar + musicSplitter_lyricFormatter(propsForActionFn);
    }
    case tokenTypes.annotation:
    case tokenTypes.space:
    case tokenTypes.symbol:
    case tokenTypes.nomenclatureTag:
      return jumpToEndOfNomenclatureTag(propsForActionFn);
    case tokenTypes.end:
      return "";
    default: {
      context.pos += 1;
      return contextChar + formatterDispatch(propsForActionFn);
    }
  }
};
