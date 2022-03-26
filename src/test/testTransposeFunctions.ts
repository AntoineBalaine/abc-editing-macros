import { dispatcher } from "../dispatcher";
import {
  octaviateUpTransform,
  octaviateDownTransform,
  transposeHalfStepUpTransform,
  transposeHalfStepDownTransform,
  convertToRestTransform,
} from "../transformPitches";

export const transposeOctUp = (input: string) => {
  let context = { pos: 0 };
  return dispatcher(input, context, octaviateUpTransform);
};

export const transposeOctDown = (input: string) => {
  let context = { pos: 0 };
  return dispatcher(input, context, octaviateDownTransform);
};

export const transposeHalfStepUp = (input: string) => {
  let context = { pos: 0 };
  return dispatcher(input, context, transposeHalfStepUpTransform);
};
export const transposeHalfStepDown = (input: string) => {
  let context = { pos: 0 };
  return dispatcher(input, context, transposeHalfStepDownTransform);
};
export const turnNotesToRests = (input: string) => {
  let context = { pos: 0 };
  return dispatcher(input, context, convertToRestTransform);
};
