import { CardsGenerationRequest, SingleCardGenerationRequest, SongPartsCards } from "@common/types";

import { CardData } from "@pages/CardsGeneration/CardsGallery";

export const deduceNewCards = (paths: string[], cardsLyrics: SongPartsCards, hasOutro: boolean): CardData[] => {
  return paths.map((path, idx) => ({
    id: idx, src: path,
    lyrics: idx === 0 || (hasOutro && idx === paths.length - 1) // card 00 and outro card have no lyrics
      ? ""
      : cardsLyrics[idx - 1].join("\n")
  }));
};

export const generateFormData = (body: CardsGenerationRequest | SingleCardGenerationRequest, formData: FormData): void => {
  if (body.bgImg) {
    formData.append("enforceBackgroundImage", body.bgImg);
    formData.append("includeCenterArtwork", (body.includeCenterArtwork ?? "").toString());
  }
  if (body.colorPick !== "")
    formData.append("enforceBottomColor", body.colorPick);
  formData.append("cardMetaname", body.cardMetaname);
  formData.append("generateOutro", (body.generateOutro ?? false).toString());
  if (body.generateOutro === true)
    formData.append("outroContributors", body.outroContributors ?? "");
  formData.append("includeBackgroundImg", body.includeBackgroundImg.toString());

  if ((body as SingleCardGenerationRequest).cardsContents) {
    formData.append("cardsContents", JSON.stringify((body as SingleCardGenerationRequest).cardsContents));
  }
  if ((body as SingleCardGenerationRequest).cardFilename) {
    formData.append("cardFilename", (body as SingleCardGenerationRequest).cardFilename);
  }
};