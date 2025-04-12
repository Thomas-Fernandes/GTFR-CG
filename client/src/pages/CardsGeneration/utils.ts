import {
  CardsGenerationRequest,
  SingleCardGenerationRequest
} from "@/pages/CardsGeneration/components/CardsGenerationForm/types";

export const generateFormData = (
  body: CardsGenerationRequest | SingleCardGenerationRequest,
  formData: FormData
): void => {
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