import { ARTWORK_RESULT_PROPS, REGEX_YOUTUBE_URL } from "./constants";

export const getTitleWithAdjustedLength = (title: string): string => {
  title = title.slice(0, ARTWORK_RESULT_PROPS.MAX_TITLE_LENGTH - 3);

  // find the first space before the max length to cut the string there
  let end = title[title.length - 1].endsWith(" ") ? title.length - 1 : title.lastIndexOf(" ", ARTWORK_RESULT_PROPS.MAX_TITLE_LENGTH);

  // if the space-determined crop is too intense, just cut the string at the max length
  end = ARTWORK_RESULT_PROPS.MAX_TITLE_LENGTH - end > ARTWORK_RESULT_PROPS.MAX_CROP_LENGTH ? title.length : end;
  return title.slice(0, end) + "...";
};

export const isValidYoutubeUrl = (url: string): boolean => {
  return REGEX_YOUTUBE_URL.some((pattern: RegExp) => pattern.test(url));
};
