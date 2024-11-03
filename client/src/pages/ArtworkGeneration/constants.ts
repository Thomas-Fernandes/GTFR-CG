import { Option } from "@/components/Selector/Selector";

export const REGEX_YOUTUBE_URL = [
  /https?:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}/,
  /https?:\/\/youtu\.be\/[a-zA-Z0-9_-]{11}/,
];

export enum AUTOMATIC_SEARCH_TRIGGERS {
  LENGTH = 7,
  LENGTH_WITHOUT_TERM = 5,
  SPACE = " ",
}

export enum ARTWORK_RESULT_PROPS {
  MAX_TITLE_LENGTH = 42,
  MAX_CROP_LENGTH = 12,
}

export const ITUNES_REGION_OPTIONS: Option[] = [
  { label: "France", value: "fr" },
  { label: "United States", value: "us" },
  { label: "New Zealand", value: "nz" },
];