const sharps = ["", "^F", "^C", "^G", "^D", "^A", "^E", "^B"];

const upMajorKeys = ["C", "G", "D", "A", "E", "B", ]
const upMinorKeys = ["A", "E", "B", "F#", "C#", "G#", "D#"]

const flats = [ "_B", "_E", "_A", "_D", "_G", "_C", "_F"]

const downMajorKeys = ["F", "Bb", "Eb", "Ab", "Db", "Gb"]
const downMinorKeys = ["D", "G", "C", "F", "Bb", "Eb"];


export const findKeySignature = (keyHeader: string): string[] => {
  const keyTokens = keyHeader.replace(/\[K:\s?/g, "").replace(/[\]]/g, "").split(" ");

  if (keyTokens.length === 1 || keyTokens[1].toLowerCase() === "major") {
    if (upMajorKeys.includes(keyTokens[0])) return sharps.slice(0, upMajorKeys.indexOf(keyTokens[0])+1).filter(alteration => alteration);
    else return flats.slice(0, downMajorKeys.indexOf(keyTokens[0])+1).filter(alteration => alteration);

  } else if (keyTokens[1].toLowerCase() === "minor") {
    if (upMinorKeys.includes(keyTokens[0])) return sharps.slice(0, upMinorKeys.indexOf(keyTokens[0])+1).filter(alteration => alteration);
    else return flats.slice(0, downMinorKeys.indexOf(keyTokens[0])+1).filter(alteration => alteration);

  }
  return [""];
}


