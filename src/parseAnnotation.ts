import { noteDispatcher } from "./dispatcher";
import { contextObj, TransformFunction } from "./transformPitches";
import {
  annotationStyle,
  removeInstrumentTagsFromAnnotation,
} from "./annotationsActions";

export function parseAnnotation(
  text: string,
  context: contextObj,
  tag: annotationStyle,
  transformFunction: TransformFunction
): string {
  let retStr = "";
  const sections = text
    .substring(context.pos)
    .split(/(\"[^\".]*\")/g)
    .filter((n) => n);
  //subdivise le tableau entre sections contenues dans les tags, et les autres
  let subSections = [];

  if (sections[0][0] === '"' && !sections[0].includes(tag)) {
    const purgedSections = removeInstrumentTagsFromAnnotation(
      sections[0]
    ).replace(/\"(\s*)?\"/g, "");
    context.pos = context.pos + sections[0].length;
    return (
      purgedSections + noteDispatcher(text, context, transformFunction, tag)
    );
  } else {
    for (let i = 0; i < sections.length; i++) {
      if (sections[i][0] === '"' && sections[i].includes(tag)) {
        let tagsection = [removeInstrumentTagsFromAnnotation(sections[i])];
        while (i < sections.length) {
          i += 1;
          if (sections[i][0] === '"' && sections[i].includes(`/${tag}`)) {
            tagsection.push(removeInstrumentTagsFromAnnotation(sections[i]));
            break;
          } else if (
            sections[i][0] === '"' &&
            !sections[i].includes(`/${tag}`)
          ) {
            tagsection.push(removeInstrumentTagsFromAnnotation(sections[i]));
          } else tagsection.push(sections[i]);
        }
        subSections.push(tagsection);
      } else {
        subSections.push(sections[i]);
      }
    }
    return subSections
      .map((subSection) => {
        if (Array.isArray(subSection)) {
          return [
            removeInstrumentTagsFromAnnotation(subSection[0]),
            ...subSection.slice(1, subSection.length - 1),
            removeInstrumentTagsFromAnnotation(
              subSection[subSection.length - 1]
            ),
          ];
        } else
          return noteDispatcher(subSection, { pos: 0 }, transformFunction, tag);
      })
      .flat()
      .join("")
      .replace(/\"(\s*)?\"/g, "");
  }
}
