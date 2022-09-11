const singleBar = "zzzz (zzz)z z/z2z/z";
const singleBarContainingChords = "zzzz (zzz)z z/z2z/z [zzz]12";
const singleBarContainingChordsAndAnnotations =
  'zzzz "soli"(zzz)z z/z2z/z [zzz]12';
const singleBarContainingChordsAnnotationsSymbols =
  'zzzz "soli"(zzz)z !fermata!z/z2z/z [zzz]12';
const singleBarContainingChordsAnnotationsSymbolsNomenclature =
  '[K:F min]zzzz "soli"(zzz)z !fermata!z/z2z/z [zzz]12';
const multipleBarsContainingChordsAnnotationsSymbolsNomenclature =
  '[K:F min]zzzz "soli"(zzz)z !fermata!z/z2z/z [zzz]12| [zzzz]4 (zzz)z !fermata!z/z2z/z [zzz]12';
const multipleBarsContainingChordsAnnotationsSymbolsNomenclatureLineBreaks = `[K:F min]zzzz "soli"(zzz)z !fermata!z/z2z/z [zzz]12| [zzzz]4 (zzz)z !fermata!z/z2z/z [zzz]12 |
zz(zz) z4 [zz]2 zz | zzzz !fermata! zzzz |`;
const multipleBarsContainingChordsAnnotationsSymbolsNomenclatureLineBreaksAndNotes = `[K:F min]zzzz "soli"(zzz)z !fermata!z/z2z/z [zzz]12| [zzzz]4 (zzz)z !fermata!z/z2z/z [zzz]12 |
zz(zz) z4 [zz]2 zz | zzzz !fermata! zzzz | (zzzz) "str"(GBAC DFED)"/str" zzzz`;

export const restsInRoutineSamples = {
  singleBar,
  singleBarContainingChords,
  singleBarContainingChordsAndAnnotations,
  singleBarContainingChordsAnnotationsSymbols,
  singleBarContainingChordsAnnotationsSymbolsNomenclature,
  multipleBarsContainingChordsAnnotationsSymbolsNomenclature,
  multipleBarsContainingChordsAnnotationsSymbolsNomenclatureLineBreaks,
  multipleBarsContainingChordsAnnotationsSymbolsNomenclatureLineBreaksAndNotes,
};
const consolidatedSingleBar = "z12";
const consolidatedSingleBarContainingChords = "z24";
const consolidatedSingleBarContainingChordsAndAnnotations = 'z4 "soli"z20';
const consolidatedSingleBarContainingChordsAnnotationsSymbols =
  'z4 "soli"z4 !fermata!z16';
const consolidatedSingleBarContainingChordsAnnotationsSymbolsNomenclature =
  '[K:F min]z4 "soli"z4 !fermata!z16';
const consolidatedMultipleBarsContainingChordsAnnotationsSymbolsNomenclature =
  '[K:F min]z4 "soli"z4 !fermata!z16| z8 !fermata!z16';
const consolidatedMultipleBarsContainingChordsAnnotationsSymbolsNomenclatureLineBreaks = `[K:F min]z4 "soli"z4 !fermata!z16| z8 !fermata!z16 |
z12 | z4 !fermata! z4 |`;
const consolidatedMultipleBarsContainingChordsAnnotationsSymbolsNomenclatureLineBreaksAndNotes = `[K:F min]z4 "soli"z4 !fermata!z16| z8 !fermata!z16 |
z12 | z4 !fermata! z4 | z4 "str"(GBAC DFED)"/str" z4`;

export const consolidatedRestsInRoutine = {
  consolidatedSingleBar,
  consolidatedSingleBarContainingChords,
  consolidatedSingleBarContainingChordsAndAnnotations,
  consolidatedSingleBarContainingChordsAnnotationsSymbols,
  consolidatedSingleBarContainingChordsAnnotationsSymbolsNomenclature,
  consolidatedMultipleBarsContainingChordsAnnotationsSymbolsNomenclature,
  consolidatedMultipleBarsContainingChordsAnnotationsSymbolsNomenclatureLineBreaks,
  consolidatedMultipleBarsContainingChordsAnnotationsSymbolsNomenclatureLineBreaksAndNotes,
};
