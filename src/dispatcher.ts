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

export const findTokenType = (text: abcText, context: contextObj) => {
  const token = text.charAt(context.pos);
  if (isPitchToken(token)) return "note";
  if (isRest(token)) return "rest";
  if (isOpeningTie(token + text.charAt(context.pos + 1))) return "openingTie";
  if (isArticulation(text, context)) return "articulation";
  if (token === " ") return "space";
  if (token === "|") return "barLine";
  if (token === '"') return "annotation";
  if (token === "!") return "symbol";
  if (token === "\n" && isNomenclatureLine(text, { pos: context.pos + 1 }))
    return "nomenclature line";
  if (context.pos === 0 && isNomenclatureLine(text, { pos: context.pos }))
    return "nomenclature line";
  if (token === "[" && isNomenclatureTag(text, context))
    return "nomenclature tag";
  if (token === "[" && !isNomenclatureTag(text, context)) return "chord";
  if (context.pos < text.length) return "unmatched";
  if (/^%/.test(text.substring(context.pos))) return "comment line";
  else return "end";
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
    case "note":
      return parseNote(text, context, transformFunction, tag);
    case "rest":
      return parseNote(text, context, transformFunction, tag);
    case "annotation":
      if (tag) {
        return parseAnnotation(text, context, tag, transformFunction);
      }
    case "symbol":
      return jumpToEndOfSymbol(propsForActionFn);
    case "nomenclature line":
      return jumpToEndOfNomenclatureLine(propsForActionFn);
    case "nomenclature tag":
      return jumpToEndOfNomenclatureTag(propsForActionFn);
    case "end":
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
    case "chord":
      return parseChord({ text, context, transformFunction });
    case "annotation":
      return jumpToEndOfAnnotation(propsForActionFn);
    case "symbol":
      return jumpToEndOfSymbol(propsForActionFn);
    case "nomenclature line":
      return jumpToEndOfNomenclatureLine(propsForActionFn);
    case "nomenclature tag":
      return jumpToEndOfNomenclatureTag(propsForActionFn);
    case "note":
      return jumpToEndOfNote(propsForActionFn);
    case "end":
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
    case "annotation":
      return jumpToEndOfAnnotation(propsForActionFn);
    case "symbol":
      return jumpToEndOfSymbol(propsForActionFn);
    case "nomenclature line":
      return jumpToEndOfNomenclatureLine(propsForActionFn);
    case "nomenclature tag":
      return jumpToEndOfNomenclatureTag(propsForActionFn);
    case "end":
      return "";
    case "openingTie": {
      if (tieContainsNotes({ ...propsForActionFn, context: { ...context } })) {
        return consolidateRestsInTieAndJumpToEndOfTie(propsForActionFn);
      } else {
        return parseFunction
          ? parseFunction(propsForActionFn)
          : transformFunction(contextChar);
      }
    }
    case "articulation":
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
    case "rest":
    case "openingTie":
    case "note": {
      if (parseFunction) {
        return parseFunction(propsForActionFn);
      } else {
        context.pos += 1;
        return contextChar + formatterDispatch(propsForActionFn);
      }
    }
    case "annotation":
      return jumpToEndOfAnnotation(propsForActionFn);
    case "space":
      return parseFunction
        ? parseFunction(propsForActionFn)
        : (() => {
            context.pos += 1;
            return contextChar + formatterDispatch(propsForActionFn);
          })();
    case "symbol":
      return jumpToEndOfSymbol(propsForActionFn);
    case "nomenclature line":
      return jumpToEndOfNomenclatureLine(propsForActionFn);
    case "nomenclature tag":
      return jumpToEndOfNomenclatureTag(propsForActionFn);
    case "end":
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
