import { chordDispatcher, dispatcherFunction } from "./dispatcher";

export const parseChord: dispatcherFunction = ({
  text,
  context,
  transformFunction,
}) => {
  //find start and end of chord
  //pass chord to transformFunction and return rest
  let chord = text.charAt(context.pos);
  while (context.pos < text.length) {
    context.pos += 1;
    chord += text.charAt(context.pos);
    if (text.charAt(context.pos) === "]") {
      context.pos += 1;
      break;
    }
  }
  return (
    transformFunction(chord) +
    chordDispatcher({ text, context, transformFunction })
  );
};
