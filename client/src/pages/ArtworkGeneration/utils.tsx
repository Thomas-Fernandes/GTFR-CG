import { IntlShape } from "react-intl";

import FileUploadForm from "./components/FileUploadForm/FileUploadForm";
import ItunesForm from "./components/ItunesForm/ItunesForm";
import ItunesResults from "./components/ItunesResults/ItunesResults";
import YoutubeForm from "./components/YoutubeForm/YoutubeForm";
import { ARTWORK_GENERATION_OPTION_PARENT_CLASS } from "./constants";
import { ArtworkGenerationOption } from "./types";

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
            <h1>{artgenOptionHeaders[0]}</h1>

            <ItunesForm setItunesResults={setItunesResults ?? (() => {})} />

            <ItunesResults items={itunesResults ?? []} setItunesResults={setItunesResults ?? (() => {})} />
          </>
        );
      },
    },
    {
      h1: artgenOptionHeaders[1],
      className: `${ARTWORK_GENERATION_OPTION_PARENT_CLASS}--local`,
      content: () => {
        return (
          <>
            <h1>{artgenOptionHeaders[1]}</h1>

            <FileUploadForm />
          </>
        );
      },
    },
    {
      h1: artgenOptionHeaders[2],
      className: `${ARTWORK_GENERATION_OPTION_PARENT_CLASS}--youtube`,
      content: () => {
        return (
          <>
            <h1>{artgenOptionHeaders[2]}</h1>

            <YoutubeForm />
          </>
        );
      },
    },
  ];
};
