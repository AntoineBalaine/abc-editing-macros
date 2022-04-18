"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAnnotation = void 0;
const dispatcher_1 = require("./dispatcher");
const annotationsActions_1 = require("./annotationsActions");
function parseAnnotation(text, context, tag, transformFunction) {
    let retStr = "";
    const sections = text
        .substring(context.pos)
        .split(/(\"[^\".]*\")/g)
        .filter((n) => n);
    //subdivise le tableau entre sections contenues dans les tags, et les autres
    let subSections = [];
    if (sections[0][0] === '"' && !sections[0].includes(tag)) {
        const purgedSections = (0, annotationsActions_1.removeInstrumentTagsFromAnnotation)(sections[0]).replace(/\"(\s*)?\"/g, "");
        context.pos = context.pos + sections[0].length;
        return (purgedSections + (0, dispatcher_1.noteDispatcher)({ text, context, transformFunction, tag }));
    }
    else {
        for (let i = 0; i < sections.length; i++) {
            if (sections[i][0] === '"' && sections[i].includes(tag)) {
                let tagsection = [(0, annotationsActions_1.removeInstrumentTagsFromAnnotation)(sections[i])];
                while (i < sections.length) {
                    i += 1;
                    if (sections[i][0] === '"' && sections[i].includes(`/${tag}`)) {
                        tagsection.push((0, annotationsActions_1.removeInstrumentTagsFromAnnotation)(sections[i]));
                        break;
                    }
                    else if (sections[i][0] === '"' &&
                        !sections[i].includes(`/${tag}`)) {
                        tagsection.push((0, annotationsActions_1.removeInstrumentTagsFromAnnotation)(sections[i]));
                    }
                    else
                        tagsection.push(sections[i]);
                }
                subSections.push(tagsection);
            }
            else {
                subSections.push(sections[i]);
            }
        }
        return subSections
            .map((subSection) => {
            if (Array.isArray(subSection)) {
                return [
                    (0, annotationsActions_1.removeInstrumentTagsFromAnnotation)(subSection[0]),
                    ...subSection.slice(1, subSection.length - 1),
                    (0, annotationsActions_1.removeInstrumentTagsFromAnnotation)(subSection[subSection.length - 1]),
                ];
            }
            else
                return (0, dispatcher_1.noteDispatcher)({
                    text: subSection,
                    context: { pos: 0 },
                    transformFunction,
                    tag,
                });
        })
            .flat()
            .join("")
            .replace(/\"(\s*)?\"/g, "");
    }
}
exports.parseAnnotation = parseAnnotation;
