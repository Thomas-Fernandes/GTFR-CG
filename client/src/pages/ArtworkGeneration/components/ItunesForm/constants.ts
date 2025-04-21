import { Option } from "@/common/types";

export enum ArtworkResultProps {
  MaxTitleLength = 45,
  MaxCropLength = 12,
}

export enum AutomaticSearchTriggers {
  Length = 7,
  LengthWithoutTerm = 5,
  Space = " ",
}

export const ITUNES_REGION_OPTIONS: Option[] = [
  { label: "France", value: "fr" },
  { label: "United States", value: "us" },
  { label: "New Zealand", value: "nz" },
];
