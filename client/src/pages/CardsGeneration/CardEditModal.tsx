import React, { useRef, useState } from "react";

import { is2xxSuccessful, sendRequest } from "@common/Requests";
import { hideSpinner, showSpinner } from "@common/Spinner";
import { sendToast } from "@common/Toast";
import { ApiResponse, SingleCardGenerationRequest } from "@common/Types";

import { API, BACKEND_URL } from "@constants/Paths";
import { SPINNER_ID } from "@constants/Spinner";
import { TOAST, TOAST_TYPE } from "@constants/Toast";

import { AutoResizeTextarea } from "@components/AutoResizeTextarea";

import { CardData } from "./CardsGallery";
import { useCardsGalleryContext } from "./context";
import { handleOverlayClick } from "./mouse";
import { generateFormData } from "./utils";

import "./CardsGallery.css";

type GenerationProps = {
  cardMetaname: string;
  bgImg: File | undefined;
  colorPick: string;
  includeCenterArtwork: boolean | undefined;
  generateOutro: boolean;
  includeBackgroundImg: boolean;

  cardBottomColor: string;
};

type Props = {
  generationProps: GenerationProps;
};

const CardEditModal: React.FC<Props> = ({ generationProps }) => {
  const { setIsModalOpen, currentCard, newLyrics, setNewLyrics, setCards } = useCardsGalleryContext();

  const [isModalSaving, setIsModalSaving] = useState(false);

  const closeModal = () => { setIsModalOpen(false); setIsModalSaving(false); };

  const updateCard = (currentCard: CardData, cardFilename: string) => {
    setCards((prevCards) =>
      prevCards.map((img) => img.id === currentCard.id // update only the card that was edited
        ? {
          id: img.id,
          lyrics: newLyrics,
          src: `${cardFilename}?t=${Date.now()}` // busting cached image with the same name thanks to timestamp
        } : img
      )
    );
  };
  const saveText = () => {
    if (currentCard === null) {
      sendToast(TOAST.CARD_EDIT_FAILED, TOAST_TYPE.ERROR);
      return;
    }

    if (isModalSaving) {
      sendToast(TOAST.CARD_EDIT_IN_PROGRESS, TOAST_TYPE.WARN);
      return;
    }

    setIsModalSaving(true);
    showSpinner(SPINNER_ID.CARDS_GENERATE_SINGLE);

    const cardFilename = currentCard.src.split('?')[0] ?? "card";
    const body: SingleCardGenerationRequest = {
      ...generationProps,
      cardsContents: newLyrics.split("\n"),
      cardFilename: cardFilename,
    }
    const formData = new FormData();
    generateFormData(body, formData);

    sendRequest("POST", BACKEND_URL + API.CARDS_GENERATION.GENERATE_SINGLE_CARD, formData).then((response: ApiResponse) => {
      if (!is2xxSuccessful(response.status)) {
        console.error(response.message);
        sendToast(response.message, TOAST_TYPE.ERROR);
        return;
      }

      updateCard(currentCard, cardFilename);

      const toastMsg = TOAST.CARD_EDITED + `: ${(currentCard.id < 10 ? "0" : "")}${currentCard.id}.png`;
      sendToast(toastMsg, TOAST_TYPE.SUCCESS);
    }).catch((error) => {
      console.error("Failed to upload text:", error);
      sendToast(TOAST.CARD_EDIT_FAILED, TOAST_TYPE.ERROR);
    }).finally(() => {
      hideSpinner(SPINNER_ID.CARDS_GENERATE_SINGLE);
      setIsModalSaving(false);
      closeModal();
    });
  };

  const clickedInsideModalRef = useRef(false);

  return (
    <div className="modal-overlay flexbox" onClick={() => handleOverlayClick({ clickedInsideModalRef, closeModal })}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="mv-0">
          {`Edit Lyrics of Card ${currentCard && currentCard.id < 10 ? "0" : ""}${currentCard?.id}`}
        </h3>

        <AutoResizeTextarea title={"card-edit"} disabled={isModalSaving}
          value={newLyrics} onChange={(e) => setNewLyrics(e.target.value)}
          style={{ width: "100%" }}
        />

        <div className="modal-actions flex-row g-1">
          <button type="button" onClick={saveText} disabled={isModalSaving}>
            {isModalSaving ? "Saving..." : "Save"}
          </button>

          <div id={SPINNER_ID.CARDS_GENERATE_SINGLE} />

          <button type="button" onClick={closeModal} disabled={isModalSaving}>
            {"Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardEditModal;
