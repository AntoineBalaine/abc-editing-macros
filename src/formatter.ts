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
import {
  isLetter,
  isOctaveToken,
  isRest,
  isRhythmToken,
} from "./dispatcherHelpers";
import { separateHeaderAndBody } from "./fileStructureActions";
import { jumpToEndOfNote } from "./parseNotes";
import { contextObj } from "./transformPitches";

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
  //insert space around every nomenclature

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

  const Lines = text.split("\n");

  /**lyrics are written with one syllable per note, or a "_" for syllables that span to the following note
   * they also use barlines
   */
  /**
   * iterate ligns
   * for each lign if the next one  is lyrics, format them together:
   * align bar ligns
   * align syllables with notes
   */

  const lyricLinesIndexs = Lines.map((line, index) =>
    /^w:/.test(line) ? index : -1
  );
  /**
   * subdivide by barlines
   * align syllables with notes.
   * use the dispatcher to find all the indexes of notes
   */
  lyricLinesIndexs.forEach((lyricLineIndex) => {
    const musicLineIndex = findFirstPrecedingMusicLineIndex(
      Lines,
      lyricLineIndex
    );
    if (musicLineIndex === -1) return lyricLineIndex;

    /**
     * assumption: nomenclature & bar lines are separated from the music by
     * spaces, but not the annotations
     */
    //remove voice nomenclature at start of line
    let startMusicBarIdx = 0;
    let startLyricBarIdx = 0;
    let currentVoiceNomenclature = "";
    let currentLyricsNomenclature = "w: ";
    if (/^[V:[^\]]*\]/.test(Lines[musicLineIndex])) {
      startMusicBarIdx = Lines[musicLineIndex].indexOf("]") + 1;
      currentVoiceNomenclature =
        Lines[musicLineIndex].substring(0, startMusicBarIdx + 1) + " ";
    }
    //remove lyrics nomenclature at start of line
    if (/^w:/.test(Lines[lyricLineIndex])) {
      startLyricBarIdx = Lines[lyricLineIndex].indexOf("w:") + 1;
    }
    if (currentVoiceNomenclature.length > currentLyricsNomenclature.length) {
      const fillerSpacesNeeded =
        currentVoiceNomenclature.length - currentLyricsNomenclature.length;
      currentLyricsNomenclature += new Array(fillerSpacesNeeded).join(" ");
    }

    const musicLine = Lines[musicLineIndex].substring(startMusicBarIdx);
    const lyricLine = Lines[lyricLineIndex].substring(startLyricBarIdx);
    /**
     * when putting back together the line, will have to account for the case in which
     * there was a closing barline at the end of it
     */
    const musicBars = musicLine.split("|").filter((n) => n !== "");
    const lyricBars = lyricLine.split("|").filter((n) => n !== "");

    let smallestNumberOfBars =
      lyricBars.length <= musicBars.length
        ? lyricBars.length
        : musicBars.length;

    for (let barIdx = 0; barIdx < smallestNumberOfBars; barIdx++) {
      /**
       * remove start of line nomenclature tags
       * eg. [V:str] and w:
       * in the current bar,
       * split at every space.
       * iterate the musicbar
       * if currentMusicGroup doesn't contain nomenclature or comments
       *    find matching lyric
       *    compare lengths and add missing spaces at the end of the shortest one
       * else
       *    parse
       *      split at every group with annotations included
       *
       */

      const curMusicBar = musicBars[barIdx];
      let unformattedLyricBar = lyricBars[barIdx].split(" ");

      const noteGroups = curMusicBar.split(" "); //split at spaces that are not inside annotations

      /**
       * match noteGroups with the corresponding lyrics,
       * format them together
       */
      let { formattedLyricsBar, formattedNotesBar } = noteGroups
        .map((noteGroup) => {
          let __return;
          ({ __return, noteGroup, unformattedLyricBar } =
            formatNoteGroupsAndCorrespondingLyrics(
              noteGroup,
              unformattedLyricBar
            ));
          return __return;
        })
        .reduce(
          (previous, curr, index, collection) => {
            return {
              formattedNotesBar: (previous.formattedNotesBar +=
                curr.noteGroup + " "),
              formattedLyricsBar: (previous.formattedLyricsBar +=
                curr.lyricGroup + " "),
            };
          },
          { formattedNotesBar: " ", formattedLyricsBar: " " }
        );

      musicBars[barIdx] = formattedNotesBar;
      lyricBars[barIdx] = formattedLyricsBar;
    }
    Lines[musicLineIndex] = currentVoiceNomenclature + musicBars.join("|");
    Lines[lyricLineIndex] = currentLyricsNomenclature + lyricBars.join("|");
  });

  return Lines.join("\n");
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

/**
 * Allowed format:
 * /(note)*(annotation|nomenclature tag|symbol)/
 * @param subGroup
 * @returns
 */
export const countNotesInSubGroup = (subGroup: abcText) => {
  const context: contextObj = { pos: -1 };
  let noteCount = 0;
  const notesStartPosition = -1;

  while (context.pos < subGroup.length) {
    context.pos += 1;
    const tokenType = findTokenType(subGroup, context);
    switch (tokenType) {
      case "chord":
      case "note":
      case "rest": {
        if (notesStartPosition === -1) {
          notesStartPosition === context.pos;
        }
        context.pos =
          tokenType === "chord"
            ? findEndOfChord(subGroup, context) - 1
            : findEndOfNote(subGroup, context) - 1;
        noteCount += 1;
        break;
      }
      case "openingTie":
        break;
      case "articulation":
      case "space":
      case "annotation":
      case "symbol":
      case "nomenclature tag": {
        // jump to end of nomenclature tag, annotation, etc.
        let cursor = context.pos + 1;
        const matchingToken = findClosingToken(tokenType);
        while (cursor < subGroup.length && subGroup[cursor] !== matchingToken) {
          cursor += 1;
          if (subGroup[cursor] === matchingToken) {
            context.pos = cursor;
            break;
          }
        }
        break;
      }

      case "end":
        break;
    }
  }
  return noteCount;
};

/**
 * subdivide the bar into groups of notes divided by spaces (eg. "abcd dbca")
 * divide these noteGroups into subgroups containing notes followed by anything that isn't notes
 * eg 'abce"this is an annotation"dbca' will become ['abce"this is an annotation"', 'dbca']
 * once these are all separated,
 * for each note subGroup
 *    count number of notes in subGroup
 *    pull corresponding amount of syllables
 *    compare the string length of subGroup and syllable subGroup
 *    if syllable subGroup is shorter, make it the same length with filler spaces
 *    append the resulting syllable subGroup to a lyricsGroup that corresponds to the noteGroup
 * then back at the noteGroup level,
 * compare the full noteGroup with the corresponding lyricsGroup
 * if the noteGroup is shorter, make them the same length with filler spaces
 * return both joined() in format
 * { noteBar, lyricsBar }
 */
export const formatNoteGroupsAndCorrespondingLyrics = (
  noteGroup: string,
  unformattedLyricBar: string[]
) => {
  let lyricGroup: string = "";

  let subdivisionsInNoteGroup: string[] | undefined;
  ({ subdivisionsInNoteGroup } = findSubdivisionsInNoteGroup(noteGroup, ""));
  subdivisionsInNoteGroup?.forEach((subGroup) => {
    /**
     * count number of notes in group
     * pull corresponding amount of syllables
     * add spaces at the end of the group of lyrics if their length is shorter than subGroup
     */
    const noteCount = countNotesInSubGroup(subGroup);
    let subGrpLyrics = unformattedLyricBar.slice(0, noteCount).join(" ");
    unformattedLyricBar = unformattedLyricBar.slice(noteCount);

    if (subGrpLyrics.length < subGroup.length) {
      const fillerSpacesNeeded = subGroup.length - subGrpLyrics.length;
      subGrpLyrics += new Array(fillerSpacesNeeded).fill(" ").join("");
    }
    lyricGroup += subGrpLyrics;
  });

  if (lyricGroup.length > noteGroup.length) {
    const fillerSpacesNeeded = lyricGroup.length - noteGroup.length;
    noteGroup += new Array(fillerSpacesNeeded).fill(" ").join("");
  }
  return {
    __return: {
      noteGroup,
      lyricGroup,
    },
    noteGroup,
    unformattedLyricBar,
  };
};

export function findSubdivisionsInNoteGroup(
  noteGroup: string,
  curString: string
) {
  const context: contextObj = {
    pos: -1,
  };
  const subdivisionsInNoteGroup: string[] = [];

  while (context.pos < noteGroup.length) {
    context.pos += 1;
    const contextChar = noteGroup.charAt(context.pos);
    const tokenType = findTokenType(noteGroup, context);
    switch (tokenType) {
      case "annotation":
      case "symbol":
      case "nomenclature tag": {
        // jump to end of nomenclature tag, annotation, etc.
        let cursor = context.pos + 1;
        const matchingToken = findClosingToken(tokenType);
        while (
          cursor < noteGroup.length &&
          noteGroup[cursor] !== matchingToken
        ) {
          cursor += 1;
          if (noteGroup[cursor] === matchingToken) {
            curString += noteGroup.substring(context.pos, cursor + 1);
            subdivisionsInNoteGroup.push(curString);
            curString = "";
            context.pos = cursor;
            break;
          }
        }
        break;
      }
      case "end": {
        curString += noteGroup.substring(context.pos);
        subdivisionsInNoteGroup.push(curString);
        curString = "";
        break;
      }
      default: {
        curString += contextChar;
        break;
      }
    }
  }
  return { subdivisionsInNoteGroup };
}

export const findFirstPrecedingMusicLineIndex = (
  Lines: string[],
  lyricLineIndex: number
) => {
  const context = { pos: lyricLineIndex };
  while (context.pos >= 0) {
    context.pos -= 1;
    /**
     * if is not a nomenclature line or a comment line, return current position
     */
    const currentToken = findTokenType(Lines[context.pos], { pos: 0 });
    switch (currentToken) {
      case "lyric line":
        return -1;
      case "nomenclature line":
      case "comment line":
        break;
      default:
        return context.pos;
    }
  }
  return -1;
};

function findClosingToken(tokenType: string) {
  switch (tokenType) {
    case "annotation":
      return '"';
    case "space":
      return " ";
    case "symbol":
      return "!";
    case "nomenclature tag":
      return "]";
    default:
      return "";
  }
}

export function findEndOfChord(text: string, context: contextObj) {
  while (text.charAt(context.pos) !== "]") {
    context.pos += 1;
  }
  context.pos += 1;
  while (isRhythmToken(text.charAt(context.pos))) {
    context.pos += 1;
  }
  return context.pos;
}

export function findEndOfNote(text: string, context: contextObj) {
  let note = text.charAt(context.pos);
  let foundLetter = isLetter(note);

  while (context.pos < text.length) {
    context.pos += 1;
    const contextChar = text.charAt(context.pos);
    if (
      (!foundLetter && isLetter(contextChar)) ||
      (foundLetter && isOctaveToken(contextChar)) ||
      (foundLetter && isRhythmToken(contextChar)) ||
      (!foundLetter && isRest(contextChar))
    ) {
      if (!foundLetter && (isLetter(contextChar) || isRest(contextChar)))
        foundLetter = true;
      note += text.charAt(context.pos);
    } else break;
  }
  return context.pos;
}
