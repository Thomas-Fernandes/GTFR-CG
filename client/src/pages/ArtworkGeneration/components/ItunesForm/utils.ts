import { ArtworkResultProps } from "./constants";

export const getTitleWithAdjustedLength = (title: string): string => {
  title = title.slice(0, ArtworkResultProps.MaxTitleLength - 3);

  // find the first space before the max length to cut the string there
  let end = title[title.length - 1].endsWith(" ") ? title.length - 1 : title.lastIndexOf(" ", ArtworkResultProps.MaxTitleLength);

  // if the space-determined crop is too intense, just cut the string at the max length
  end = ArtworkResultProps.MaxTitleLength - end > ArtworkResultProps.MaxCropLength ? title.length : end;
  return title.slice(0, end) + "...";
};