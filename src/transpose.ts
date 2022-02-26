//const vscode = require('vscode');

const isLetter = (char: string) => !!char.match(/[a-g]/i);
const isNoteToken = (char: string) => /[a-g,']/i.test(char);
const isOctaveToken = (char: string) => /[,']/i.test(char);
const isAlterationToken = (char: string) => !!char.match(/[\^=_]/i);
const isPitchToken = (char: string) => /[a-g,'\^=_]/i.test(char);
const NOTES_LOWERCASE = ["a", "b", "c", "d", "e", "f", "g", "a"]
const NOTES_UPPERCASE = ["A", "B", "C", "D", "E", "F", "G", "A"]

/* 
   parser: 
(E,A,^CE) (GFED ^C=B,A,G,) | (F,A,DF) ADFA dBcA | G,DGA B(G^FG) _eGDg | [A,G^C]12 | [A,Fd]12 | [A,Ed]12 | [A,E^c]12 | [D,A,Fd]12 ||
*/
const isLowerCase = (str: string) => {
  return str == str.toLowerCase() && str != str.toUpperCase();
}
export const octaviateDownTransform = (note: string) => {
  if (/[,']/.test(note)) {
    if (note[note.length - 1] === "\'") note = note.substring(0, note.length - 1);
    if (note[note.length - 1] === ",") note += ",";
  } else if (!isLowerCase(note[note.length - 1])) note += ",";
  else note = note.toUpperCase();
  return note;
}
export const octaviateUpTransform = (note: string) => {
  if (/[,']/.test(note)) {
    if (note[note.length - 1] === "\'") note += "\'";
    if (note[note.length - 1] === ",") note = note.substring(0, note.length - 1);
  } else if (isLowerCase(note[note.length - 1])) note += "'";
  else note = note.toLowerCase();
  return note;
}
export const convertToRestTransform = (note:string) =>{
  note = note.replace(/[\^_,']/g, "");
  note = note.replace(/[a-gA-G]/g, "z");
  return note;
}

/*
   here, there is the possibility that the returned note might actually already be altered - either previously in the measure, or in the key signature.
   I won't be accomodating these two cases in the context of a macro, I leave it to the responsibility of the composer to proof-read his work.
*/

export const transposeHalfStepDownTransform = (note: string) => {
  /* is the note alterned?
     if not, alter it, 
  */
  let firstChar = note.charAt(0);
  if (isAlterationToken(firstChar)) {
    //is it a sharp or a flat?
    //if is a sharp
    //remove the sharp
    //if is a flat
    //go to note below
    //edge cases _C=>Bb _F=>Eb
    if (firstChar === "_") {
      switch (note.charAt(1).toLowerCase()) {
        case "c": note = (isLowerCase(note.charAt(1)) ? "_b" : "_B") + note.slice(2); break;
        case "f": note = (isLowerCase(note.charAt(1)) ? "_e" : "_E") + note.slice(2); break;
        default: {
          note = isLowerCase(note.charAt(1))
            ? NOTES_LOWERCASE[NOTES_LOWERCASE.reverse().indexOf(note.charAt(1)) + 1] + note.slice(2)
            : NOTES_UPPERCASE[NOTES_UPPERCASE.reverse().indexOf(note.charAt(1)) + 1] + note.slice(2);
          break;
        }
      }
    } else if (firstChar === "^") {
      note = note.slice(1);
    }
  } else {
    //add alteration to note,
    //edge cases: F & C
    switch (note.charAt(0).toLowerCase()) {
      case "f": note = (isLowerCase(note.charAt(0)) ? "e" : "E") + note.slice(1); break;
      case "c": note = (isLowerCase(note.charAt(0)) ? "b" : "B") + note.slice(1); break;
      default: {
        note = "_" + note;
        break;
      }
    }

  }
  return note;
}
export const transposeHalfStepUpTransform = (note: string) => {
  /* is the note alterned?
     if not, alter it, 
  */
  let firstChar = note.charAt(0);
  if (isAlterationToken(firstChar)) {
    //is it a sharp or a flat?
    //if is a sharp
    //remove alteration token, move up a step
    //edge cases: ^E & ^B
    //if is a flat
    //remove alteration
    if (firstChar === "^") {
      switch (note.charAt(1).toLowerCase()) {
        case "e": note = (isLowerCase(note.charAt(1)) ? "^f" : "^F") + note.slice(2); break;
        case "b": note = (isLowerCase(note.charAt(1)) ? "^c" : "^C") + note.slice(2); break;
        default: {
          note = isLowerCase(note.charAt(1))
            ? NOTES_LOWERCASE[NOTES_LOWERCASE.indexOf(note.charAt(1)) + 1] + note.slice(2)
            : NOTES_UPPERCASE[NOTES_UPPERCASE.indexOf(note.charAt(1)) + 1] + note.slice(2);
          break;
        }
      }
    } else if (firstChar === "_") {
      note = note.slice(1);
    }
  } else {
    //add alteration to note,
    //edge cases: E & B
    switch (note.charAt(0).toLowerCase()) {
      case "e": note = (isLowerCase(note.charAt(0)) ? "f" : "F") + note.slice(1); break;
      case "b": note = (isLowerCase(note.charAt(0)) ? "c" : "C") + note.slice(1); break;
      default: {
        note = "^" + note;
        break;
      }
    }

  }
  return note;
}

type contextObj = {
  pos: number;
}

type TransformFunction = (note: string) => string;

const parseNote = (text: string, context: contextObj, transformFunction: TransformFunction): string => {
  let retString = text.charAt(context.pos);
  let foundLetter = isLetter(retString);
  while (context.pos < text.length) {
    context.pos += 1;
    if ((!foundLetter && isLetter(text.charAt(context.pos))) || (foundLetter && isOctaveToken(text.charAt(context.pos)))) {
      if (!foundLetter && isLetter(text.charAt(context.pos))) foundLetter = true;
      retString += text.charAt(context.pos);
    } else break;
  }
  return transformFunction(retString) + dispatcher(text, context, transformFunction);
}


type dispatcherFunction = (text: string, context: contextObj, transformFunction: TransformFunction) => string;

const dispatcher: dispatcherFunction = (text: string, context: contextObj, transformFunction: TransformFunction) => {
  const contextChar = text.charAt(context.pos);
  if (isLetter(contextChar) || isAlterationToken(contextChar)) {
    return parseNote(text, context, transformFunction)
  } else if (context.pos < text.length) {
    context.pos += 1;
    return contextChar + dispatcher(text, context, transformFunction);
  } else return "";
}

export const transposeOctUp = (input: string) => {
  let context = { pos: 0 };
  return dispatcher(input, context, octaviateUpTransform);
}

export const transposeOctDown = (input: string) => {
  let context = { pos: 0 };
  return dispatcher(input, context, octaviateDownTransform);
}

export const transposeHalfStepUp = (input: string) => {
  let context = { pos: 0 };
  return dispatcher(input, context, transposeHalfStepUpTransform);
}
export const transposeHalfStepDown = (input: string) => {
  let context = { pos: 0 };
  return dispatcher(input, context, transposeHalfStepDownTransform);
}

export const turnNotesToRests = (input: string) => {
  let context = { pos: 0 };
  return dispatcher(input, context, convertToRestTransform);
}