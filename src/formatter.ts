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
import { findTokenType, formatterDispatch } from "./dispatcher";

export const format = (
  bodyText: abcText,
  headerText: string,
  formatLineSystem: (
    lineNumberOfSequenceStart: number,
    pos: number,
    bodyText: abcText
  ) => abcText
) => {
  const findVoiceNames = findVoicesHandles(headerText);
  if (!findVoiceNames) return;
  const voicesNames = findVoiceNames.map((i) => i?.toString());
  /**
   * trouve la première voix de la séquence,
   * dès que la séquence se brise,
   * redémarre une séquence
   *
   * càd:
   *    find system break
   *
   */
  let curLinePos = { pos: -1 };

  let currentVoiceName: string | undefined;

  let startPositionInVoicesNames: number = -1;
  let currentPositionInVoicesNames: number = -1;
  let lineNumberOfSequenceStart: number = -1;

  const bodyLines = bodyText.split("\n");
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
          formatLineSystem(lineNumberOfSequenceStart, curLinePos.pos, bodyText);
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

const isMatchingVoice = (
  curLine: string,
  voiceName: string | undefined
): VoiceAnnotation | false => {
  const voiceAnnotation = findVoiceAnnotationType(curLine);
  if (
    voiceAnnotation === VoiceAnnotation.inline ||
    voiceAnnotation === VoiceAnnotation.outline
  ) {
    const lineVoice = curLine?.match(/(?<=^V:)[^\s]*(?=\s*.*)/);
    if (lineVoice && lineVoice[0] === voiceName) {
      return voiceAnnotation;
    } else return false;
  } else return false;
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
  const context = { pos: -1 };

  //ignore comment lines

  //insert space between Nomenclature and notes
  text = formatterDispatch({
    text: text,
    context: { pos: 0 },
    transformFunction: (note: string) => note,
  });

  //remove double white spaces outside of comments
  //make the notes start all at the same spot in the music
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
