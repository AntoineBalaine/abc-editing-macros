//const vscode = require('vscode');

const isLetter = (char: string)=> !!char.match(/[a-g]/i);
const isNoteToken = (char: string)=> /[a-g,']/i.test(char);
const isOctaveToken = (char: string)=> /[,']/i.test(char);
const isAlterationToken = (char: string) => !!char.match(/[\^=_]/i);
const isPitchToken = (char: string)=> /[a-g,'\^=_]/i.test(char);

/* 
   parser: 
(E,A,^CE) (GFED ^C=B,A,G,) | (F,A,DF) ADFA dBcA | G,DGA B(G^FG) _eGDg | [A,G^C]12 | [A,Fd]12 | [A,Ed]12 | [A,E^c]12 | [D,A,Fd]12 ||
*/
const isLowerCase = (str: string) => {
    return str == str.toLowerCase() && str != str.toUpperCase();
}
export const octaviateDownTransform = (note: string) => {
   if (/[,']/.test(note)) {
      if (note[note.length-1]==="\'") note = note.substring(0, note.length-1);
      if (note[note.length-1]===",") note +=",";
   } else if (!isLowerCase( note[note.length-1] )) note+=",";
   else note = note.toUpperCase();
   return note;
}
export const octaviateUpTransform = (note: string) => {
   if (/[,']/.test(note)) {
      if (note[note.length-1]==="\'") note += "\'";
      if (note[note.length-1]===",") note = note.substring(0, note.length-1);
   } else if (isLowerCase( note[note.length-1] )) note+="'";
   else note = note.toLowerCase();
   return note;
}
/*
   here, there is the possibility that the returned note might actually already be altered - either previously in the measure, or in the key signature.
   I won't be accomodating these two cases in the context of a macro, I leave it to the responsibility of the composer to proof-read his work.
*/
export const transposeHalfStepUpTransform = (note: string)=> {
   /* is the note alterned?
      if not, alter it, 
   */
   if (isAlterationToken(note.charAt(0))) {
      //is it a sharp or a flat?
      //if is a sharp
         //remove alteration token, move up a step
         //edge cases: ^E & ^B
      //if is a flat
         //remove alteration
   } else {
      //add alteration to note,
      //edge cases: E & B
   }
}

type contextObj = {
   pos: number;
}

type TransformFunction = (note: string)=> string;

const parseNote=(text: string, context: contextObj, transformFunction: TransformFunction): string=>{
   let retString = text.charAt(context.pos);
   let foundLetter = isLetter(retString);
   while (context.pos < text.length) {
     context.pos += 1;
     if ((!foundLetter && isLetter(text.charAt(context.pos))) || (foundLetter && isOctaveToken(text.charAt(context.pos))))
     {
         if (!foundLetter && isLetter(text.charAt(context.pos))) foundLetter = true;
         retString += text.charAt(context.pos);
      } else break;
   }
   return transformFunction(retString) + dispatcher(text, context, transformFunction);
}


const dispatcher = (text: string, context: contextObj, transformFunction: TransformFunction) => {
   const contextChar = text.charAt(context.pos);
   if (isLetter(contextChar) || isAlterationToken(contextChar)) {
      return parseNote(text, context, transformFunction)
   }
   else return "";
}

export const transposeOctUp =(input: string)=>{
   let context = {pos: 0};
   return dispatcher(input, context, octaviateUpTransform);
}

export const transposeOctDown =(input: string)=>{
   let context = {pos: 0};
   return dispatcher(input, context, octaviateDownTransform);
}