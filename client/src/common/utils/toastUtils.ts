import { IntlShape } from "react-intl";

import { ACCEPTED_IMG_EXTENSIONS } from "@/constants/files";

export const getLocalizedToasts = (intl: IntlShape) => {
  return {
    UnknownError: intl.formatMessage({ id: "toasts.unknownError" }),
    ServerUnavailable: intl.formatMessage({ id: "toasts.serverUnavailable" }),
    ProcessingInProgress: intl.formatMessage({ id: "toasts.processingInProgress" }),
    Redirect: {
      NoProcessedImage: intl.formatMessage({ id: "toasts.redirect.noProcessedImage" }),
      NoGeniusToken: intl.formatMessage({ id: "toasts.redirect.noGeniusToken" }),
    },
    Home: {
      Welcome: intl.formatMessage({ id: "toasts.home.welcome" }),
      GeniusTokenNotFound: intl.formatMessage({ id: "toasts.home.geniusTokenNotFound" }),
      AddGeniusToken: intl.formatMessage({ id: "toasts.home.addGeniusToken" }),
    },
    ArtGen: {
      NoResultsFound: intl.formatMessage({ id: "toasts.artgen.noResultsFound" }),
      NoImgFile: intl.formatMessage({ id: "toasts.artgen.noImgFile" }),
      InvalidFileType: `${intl.formatMessage({ id: "toasts.artgen.invalidFileType" })}\n`
        + `${intl.formatMessage({ id: "toasts.artgen.invalidFileTypeExtensions" })}: `
        + `${ACCEPTED_IMG_EXTENSIONS.join(", ")}.`,
      InvalidUrl: intl.formatMessage({ id: "toasts.artgen.invalidUrl" }),
    },
    ProcArt: {
      NoImgSelection: intl.formatMessage({ id: "toasts.procart.noImgSelection" }),
    },
    Lyrics: {
      MissingFields: intl.formatMessage({ id: "toasts.lyrics.missingFields" }),
      FetchInProgress: intl.formatMessage({ id: "toasts.lyrics.fetchInProgress" }),
      LyricsNotFound: intl.formatMessage({ id: "toasts.lyrics.lyricsNotFound" }),
      SavingInProgress: intl.formatMessage({ id: "toasts.lyrics.savingInProgress" }),
      NoLastGeneration: intl.formatMessage({ id: "toasts.lyrics.noLastGeneration" }),
    },
    CardGen: {
      NoCardsGenerated: intl.formatMessage({ id: "toasts.cardgen.noCardsGenerated" }),
      UnauthorizedOutro: intl.formatMessage({ id: "toasts.cardgen.unauthorizedOutro" }),
      NoCardsContents: intl.formatMessage({ id: "toasts.cardgen.noCardsContents" }),
      CardsGenerated: intl.formatMessage({ id: "toasts.cardgen.cardsGenerated" }),
      CardNotEditable: intl.formatMessage({ id: "toasts.cardgen.cardNotEditable" }),
      CardEditInProgress: intl.formatMessage({ id: "toasts.cardgen.cardEditInProgress" }),
      CardEditFailed: intl.formatMessage({ id: "toasts.cardgen.cardEditFailed" }),
      CardEdited: intl.formatMessage({ id: "toasts.cardgen.cardEdited" }),
    },
    Components: {
      NoSpinnerId: intl.formatMessage({ id: "toasts.noSpinnerId" }),
      NoSpinnerContainer: intl.formatMessage({ id: "toasts.noSpinnerContainer" }),
      NoLatestColor: intl.formatMessage({ id: "toasts.noLatestColor" }),
    },
  };
};