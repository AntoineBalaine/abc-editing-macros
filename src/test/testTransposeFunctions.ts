import { noteDispatcher } from "../dispatcher";
import {
  octaviateUpTransform,
  octaviateDownTransform,
  transposeHalfStepUpTransform,
  transposeHalfStepDownTransform,
  convertToRestTransform,
} from "../transformPitches";

export const transposeOctUp = (input: string) => {
  let context = { pos: 0 };
  return noteDispatcher({
    text: input,
    context,
    transformFunction: octaviateUpTransform,
  });
};

export const transposeOctDown = (input: string) => {
  let context = { pos: 0 };
  return noteDispatcher({
    text: input,
    context,
    transformFunction: octaviateDownTransform,
  });
};

export const transposeHalfStepUp = (input: string) => {
  let context = { pos: 0 };
  return noteDispatcher({
    text: input,
    context,
    transformFunction: transposeHalfStepUpTransform,
  });
};
export const transposeHalfStepDown = (input: string) => {
  let context = { pos: 0 };
  return noteDispatcher({
    text: input,
    context,
    transformFunction: transposeHalfStepDownTransform,
  });
};
export const turnNotesToRests = (input: string) => {
  let context = { pos: 0 };
  return noteDispatcher({
    text: input,
    context,
    transformFunction: convertToRestTransform,
  });
};
