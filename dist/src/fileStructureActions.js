"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildBodyFromInstruments = exports.addNomenclatureToHeader = exports.separateHeaderAndBody = exports.isHeaderLine = void 0;
const parseNomenclature_1 = require("./parseNomenclature");
const isHeaderLine = (line) => /[A-Z]:/i.test(line);
exports.isHeaderLine = isHeaderLine;
const separateHeaderAndBody = (text, context) => {
    const lines = text.split(/\n/g);
    let header = [];
    let i = -1;
    while (true) {
        i += 1;
        if ((0, exports.isHeaderLine)(lines[i])) {
            header.push(lines[i]);
        }
        else
            break;
    }
    const headerText = header.join("\n");
    const bodyText = lines.slice(i).join("\n");
    return { headerText, bodyText };
};
exports.separateHeaderAndBody = separateHeaderAndBody;
const addNomenclatureToHeader = (headerText, tags) => {
    tags.forEach((tag) => (headerText += `\nV: ${tag} name="${tag}"`));
    return headerText;
};
exports.addNomenclatureToHeader = addNomenclatureToHeader;
const buildBodyFromInstruments = (bodyText) => {
    //split each instrument call into lines
    //[{tag: [lines]}, {tag: [lines]}]
    bodyText = bodyText.map((instrumentCall) => {
        Object.keys(instrumentCall).forEach((instrumentKey) => (instrumentCall[instrumentKey] =
            instrumentCall[instrumentKey].split("\n")));
        return instrumentCall;
    });
    const numberOfLinesInText = Object.values(bodyText[0])[0].length;
    const numberOfInstruments = bodyText.length;
    const meshedScoreArray = [];
    for (let i = 0; i < numberOfLinesInText - 1; i += 1) {
        const firstInstrument = 0;
        const currentLine = Object.values(bodyText[firstInstrument]).flat()[i];
        if ((0, parseNomenclature_1.isNomenclatureLine)(currentLine, { pos: 0 })) {
            meshedScoreArray.push(currentLine);
            continue;
        }
        else {
            //push all the lines at the current index
            //and a "%"
            for (let j = 0; j < numberOfInstruments; j += 1) {
                meshedScoreArray.push(`[V: ${Object.keys(bodyText[j])[0]}] ${Object.values(bodyText[j]).flat()[i]}`);
            }
            meshedScoreArray.push("%");
        }
    }
    return meshedScoreArray.join("\n");
};
exports.buildBodyFromInstruments = buildBodyFromInstruments;
