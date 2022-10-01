/**
 * Formatter:
 * 1. multiple-voice scores - align bar ligns and note groups
 *  if (score has multiple voices)
 *    split score into systems (array of arrays)
 *    for each system, split at each bar.
 *    iterate whichever voice has the smallest amount of bars,
 *    assumption: no comments in body
 *
 */

import { abcText } from "./annotationsActions";
import {
  findTokenType,
  formatterDispatch,
  removeDoubleSpaces,
} from "./dispatcher";
import { separateHeaderAndBody } from "./fileStructureActions";

export const spliceText = (
  text: abcText,
  start: number,
  end: number,
  replacement: abcText
) => {
  // string to modify, start index, end index, and what to replace that selection with

  let head = text.substring(0, start);
  let tail = text.substring(end, text.length);

  let result = head + replacement + tail;

  return result;
};

export const formatScore = (text: abcText): abcText => {
  let { headerText, bodyText } = separateHeaderAndBody(text as abcText, {
    pos: 0,
  });

  const findVoiceNames = findVoicesHandles(headerText);
  if (!findVoiceNames) return text;
  const voicesNames = findVoiceNames.map((i) => i?.toString());
  /**
   * find the first voice in the sequence,
   * as soon as the sequence breaks,
   * start another sequence
   *
   * which is:
   *    find system break
   *
   */
  let curLinePos = { pos: -1 };

  let currentVoiceName: string | undefined;

  let startPositionInVoicesNames: number = -1;
  let currentPositionInVoicesNames: number = -1;
  let lineNumberOfSequenceStart: number = -1;

  const bodyLines = bodyText.split("\n");
  const outputText = bodyText.slice();
  while (curLinePos.pos < bodyLines.length) {
    curLinePos.pos += 1;
    const curLine = bodyLines[curLinePos.pos];

    const voiceAnnotationType = findVoiceAnnotationType(curLine);

    if (voiceAnnotationType === VoiceAnnotation.inline) {
      currentVoiceName = curLine
        .match(/\[?(?<=V:)[^\]\s]*(?=[^\]]*\]?)/)
        ?.map((i) => i?.toString())[0];
      if (startPositionInVoicesNames === -1) {
        startPositionInVoicesNames = voicesNames.indexOf(currentVoiceName);
        currentPositionInVoicesNames = startPositionInVoicesNames;
        lineNumberOfSequenceStart = curLinePos.pos;
      } else {
        currentPositionInVoicesNames += 1;
        const currentVoiceIndex = voicesNames.indexOf(currentVoiceName);
        if (currentVoiceIndex < currentPositionInVoicesNames) {
          // if the currentVoice is not the next expected voice, then we have changed lines.
          //break the sequence, format the previous sequence

          const formattedLineSystem = formatLineSystem(
            lineNumberOfSequenceStart,
            curLinePos.pos,
            bodyText
          );
          startPositionInVoicesNames = voicesNames.indexOf(currentVoiceName);
          currentPositionInVoicesNames = startPositionInVoicesNames;
          lineNumberOfSequenceStart = curLinePos.pos;
        } else {
          continue;
        }
      }
    } else {
      continue;
    }
  }
  return "";
};

export const findVoicesHandles = (headerText: string) => {
  const text = headerText
    .split("\n")
    //.map((line) => line.match(/\[?(?<=V:)[^\]\s]*(?=[^\]]*\]?)/));
    .map((line) => line.match(/(?<=^V:)[^\]^\s]*(?=.*)/))
    .filter((line) => line)
    .map((match) => match?.toString());
  return text;
};

enum VoiceAnnotation {
  inline = "inline", //inline assumes [V:VoiceName]<abcText>
  outline = "outline", //outline assumes V:VoiceName \n <abcText>
  none = "none",
}
const findVoiceAnnotationType = function (curLine: string): VoiceAnnotation {
  if (/^V:/.test(curLine)) {
    return VoiceAnnotation.outline;
  } else if (/^\[V:[^\]]*\]/.test(curLine)) {
    return VoiceAnnotation.inline;
  } else return VoiceAnnotation.none;
};

export function formatLineSystem(
  lineNumberOfSequenceStart: number,
  pos: number,
  bodyText: abcText
): abcText {
  /**
   * break the system into a matrix of bar lines.
   * find out length of groups and align them
   * no more than one space before and after notes
   */
  let text = bodyText.substring(lineNumberOfSequenceStart, pos);

  //insert space between Nomenclature and notes
  //remove double white spaces outside of comments

  text = formatterDispatch({
    text: text,
    context: { pos: 0 },
    transformFunction: (note: string) => note,
    parseFunction: removeDoubleSpaces,
  });

  //ignore comment lines
  //make the notes start all at the same spot in the music
  text = startAllNotesAtSameIndexInLine(text);

  //insert space around every bar line
  text = text.replace(/(?<=[^\s])\|/g, " |").replace(/\|(?=[^\s])/g, "| ");

  //align lyrics
  text = alignLyrics(text);

  //adjust length of bars accordingly
  return alignBarLines(text);
}

const alignBarLines = (text: string) => {
  const lines = text.split("\n");
  const lines_bars = lines.map((line) => line.split("|"));
  for (let barIdx = 0; barIdx < lines_bars[0].length; barIdx++) {
    //for each bar, find the longuest one in the system, and adjust the length accordingly.
    //what to do if one of the lines has less bars than the others, or no music at all?
    const lines_curBar = lines_bars.map((bars) => bars[barIdx]);
    let longuestBarIndex = -1;
    let lengthOflonguestBar = -1;
    lines_curBar.forEach((bar, index) => {
      if (bar.length > lengthOflonguestBar) {
        longuestBarIndex = index;
        lengthOflonguestBar = bar.length;
      }
    });
    //ajoute les espaces blancs
    lines_curBar
      .map((bar, index) => {
        if (bar.length === lengthOflonguestBar) {
          return bar;
        } else {
          let spaceToAdd: number = lengthOflonguestBar - bar.length;
          return bar + Array(spaceToAdd).fill(" ").join("");
        }
      })
      //rentre la mesure actuelle dans les lines_bars à chaque ligne
      .forEach((bar, lineIndex) => {
        lines_bars[lineIndex][barIdx] = bar;
      });
    //réunifie et renvoie le tout en un string
  }
  return lines_bars.map((line_bar) => line_bar.join("|")).join("\n");
};

function alignLyrics(text: string): string {
  //insert space after lyric nomenclature
  text = text.replace(/^w:(?=[^\s])/, "w: ");

  const lines = text.split("\n");
  const lines_bars = lines.map((line) => line.split("|"));
  //one syllable per note, or a "_" for syllables that span to the following note
  // uses barlines
  /**
   * iterate ligns
   * for each lign if the next one  is lyrics, format them together:
   * align bar ligns
   * align syllables with notes
   */

  const Lines = text.split("\n");
  const indexOfLyricLines = Lines.map((line, index) =>
    /^w:/.test(line) ? index : -1
  );
  /**
   * subdivide by barlines
   * align syllables with notes.
   * use the dispatcher to find all the indexes of notes
   */
  indexOfLyricLines.map((lineIndex, positionInList) => {
    const formattingReferenceLine = findFirstPrecedingMusicLineIndex(
      Lines,
      indexOfLyricLines[positionInList]
    );
    // find indexes of notes.
  });
  for (
    let lyricLineIdx = 0;
    lyricLineIdx < indexOfLyricLines.length;
    lyricLineIdx++
  ) {
    const precedingLine = indexOfLyricLines[lyricLineIdx] - 1;
  }

  return text;
  //return lines_bars.map((line_bar) => line_bar.join("|")).join("\n");
}

export const startAllNotesAtSameIndexInLine = (text: string): string => {
  // add a space between voice nomenclatures and notes if there isn't one already
  // add a space between lyric nomenclature and notes if there isn't one already
  text = text
    .split("\n")
    .map((line) =>
      line
        .replace(/(?<=^\[V:[^\]]*\])(?=[^\s])/, " ")
        .replace(/(?<=^w:)(?=[^\s])/, " ")
    )
    .join("\n");
  //inline and lyrics
  if (
    text.split("\n").some((line) => /^w:/.test(line)) &&
    text
      .split("\n")
      .some((line) => findVoiceAnnotationType(line) === VoiceAnnotation.inline)
  ) {
    /**
     * which of the lyrics or the annotation is the longuest.
     * start the music after that spot.
     */
    const Lines = text.split("\n");
    const lyricLineIdx = Lines.findIndex((line) => /^w:/.test(line));
    /**
     * find longuest voice nomenclature
     * eg: [V:(str|wd|brass|voice|etc.)]
     */
    let longuestVoiceNomenclature = Lines.map((line) => {
      return line.match(/^\[V:[^\]]*\]/)?.filter((n) => n)[0] ?? "";
    }).sort((a, b) => b.length - a.length)[0];

    const startAllNotesAtThisIndex = longuestVoiceNomenclature.length + 1;

    return Lines.map((Line) => {
      const rgx = new RegExp(/(^(\[V:[^\]]*\]|w:)\s+)(?=[^\s])/);
      const match = Line.match(rgx);
      const length = match ? match[0]?.length : undefined;
      if (match && length && length < startAllNotesAtThisIndex) {
        // count amount of missing spaces and insert it before start of music
        const missingSpaces = startAllNotesAtThisIndex - length + 1;
        return (
          match[0] + new Array(missingSpaces).join(" ") + Line.substring(length)
        );
      } else return Line;
    }).join("\n");
  } else {
    // outline and lyrics
    return text;
  }
};

function findFirstPrecedingMusicLineIndex(
  Lines: string[],
  lyricLineIndex: number
) {
  const context = { pos: lyricLineIndex };
  while (context.pos >= 0) {
    context.pos -= 1;
    /**
     * if is not a nomenclature line or a comment line, return current position
     */
    const currentToken = findTokenType(Lines[context.pos], { pos: 0 });
    switch (currentToken) {
      case "nomenclature line":
      case "comment line":
        break;
      default:
        return context.pos;
    }
  }
  return -1;
}
