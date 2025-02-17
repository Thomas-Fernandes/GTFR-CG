import { IntlShape } from "react-intl";

import { ARTWORK_GENERATION_OPTION_PARENT_CLASS, ArtworkResultProps, REGEX_YOUTUBE_URL } from "./constants";
import FileUploadForm from "./FileUploadForm";
import ItunesForm from "./ItunesForm";
import ItunesResults from "./ItunesResults";
import { ArtworkGenerationOption } from "./types";
import YoutubeForm from "./YoutubeForm";

export const getTitleWithAdjustedLength = (title: string): string => {
  title = title.slice(0, ArtworkResultProps.MaxTitleLength - 3);

  // find the first space before the max length to cut the string there
  let end = title[title.length - 1].endsWith(" ") ? title.length - 1 : title.lastIndexOf(" ", ArtworkResultProps.MaxTitleLength);

  // if the space-determined crop is too intense, just cut the string at the max length
  end = ArtworkResultProps.MaxTitleLength - end > ArtworkResultProps.MaxCropLength ? title.length : end;
  return title.slice(0, end) + "...";
};

export const isValidYoutubeUrl = (url: string): boolean => {
  return REGEX_YOUTUBE_URL.some((pattern: RegExp) => pattern.test(url));
};

const getLocalizedArtgenOptions = (intl: IntlShape): string[] => {
  return [
    intl.formatMessage({ id: "pages.artgen.itunes.header" }),
    intl.formatMessage({ id: "pages.artgen.local.header" }),
    intl.formatMessage({ id: "pages.artgen.youtube.header" }),
  ];
};

export const getArtgenOptions = (intl: IntlShape): ArtworkGenerationOption[] => {
  const artgenOptionHeaders = getLocalizedArtgenOptions(intl);

  return [
    {
      h1: artgenOptionHeaders[0],
      className: `${ARTWORK_GENERATION_OPTION_PARENT_CLASS}--itunes`,
      content: (itunesResults, setItunesResults) => {
        return (
          <>
            <h1>
              {artgenOptionHeaders[0]}
            </h1>

            <ItunesForm setItunesResults={setItunesResults ?? (() => {})} />

            <ItunesResults items={itunesResults ?? []} setItunesResults={setItunesResults ?? (() => {})} />
          </>
        );
      }
    },
    {
      h1: artgenOptionHeaders[1],
      className: `${ARTWORK_GENERATION_OPTION_PARENT_CLASS}--local`,
      content: () => {
        return (
          <>
            <h1>
              {artgenOptionHeaders[1]}
            </h1>

            <FileUploadForm />
          </>
        );
      }
    },
    {
      h1: artgenOptionHeaders[2],
      className: `${ARTWORK_GENERATION_OPTION_PARENT_CLASS}--youtube`,
      content: () => {
        return (
          <>
            <h1>
              {artgenOptionHeaders[2]}
            </h1>

            <YoutubeForm />
          </>
        );
      }
    }
  ];
};