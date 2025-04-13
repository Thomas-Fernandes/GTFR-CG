import { REGEX_YOUTUBE_URL } from "./constants";

export const isValidYoutubeUrl = (url: string): boolean => {
  return REGEX_YOUTUBE_URL.some((pattern: RegExp) => pattern.test(url));
};
