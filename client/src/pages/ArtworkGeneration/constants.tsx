import { GenerationOptionState } from "./types";

export const REGEX_YOUTUBE_URL = [
  /https?:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}/,
  /https?:\/\/youtu\.be\/[a-zA-Z0-9_-]{11}/,
];

export enum AutomaticSearchTriggers {
  Length = 7,
  LengthWithoutTerm = 5,
  Space = " ",
}

export enum ArtworkResultProps {
  MaxTitleLength = 42,
  MaxCropLength = 12,
}

export const ARTWORK_GENERATION_OPTION_PARENT_CLASS = "artwork-generation--options";

export const DEFAULT_GENERATION_OPTION_STATE: GenerationOptionState = {
  current: 0,
  prevLabel: "",
  nextLabel: "",
};
