import { Option } from "@/components/Selector/Selector";

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

export const ITUNES_REGION_OPTIONS: Option[] = [
  { label: "France", value: "fr" },
  { label: "United States", value: "us" },
  { label: "New Zealand", value: "nz" },
];