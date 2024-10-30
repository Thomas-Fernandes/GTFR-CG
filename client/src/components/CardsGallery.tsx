import React, { FormEvent, useRef, useState } from "react";

import { is2xxSuccessful, sendRequest } from "../common/Requests";
import { hideSpinner, showSpinner } from "../common/Spinner";
import { sendToast } from "../common/Toast";
import { ApiResponse, ImageDownloadRequest, SingleCardGenerationRequest } from "../common/Types";

import { API, BACKEND_URL } from "../constants/Paths";
import { SPINNER_ID } from "../constants/Spinner";
import { TOAST, TOAST_TYPE } from "../constants/Toast";

import { AutoResizeTextarea } from "./AutoResizeTextarea";

import "./CardsGallery.css";

export interface CardData {
  id: number;
  lyrics: string;
  src: string; // Img source path
}

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
  id: string;
  initialCards: CardData[];
  handleDownloadCard: (e: FormEvent<HTMLFormElement> | undefined, body: ImageDownloadRequest) => void;
  generationProps: GenerationProps;
};

const CardsGallery: React.FC<Props> = ({ id, initialCards, handleDownloadCard, generationProps }) => {
  const [cards, setCards] = useState<CardData[]>(initialCards);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSaving, setIsModalSaving] = useState(false);
  const [currentCard, setCurrentCard] = useState<CardData | null>(null);
  const [newLyrics, setNewLyrics] = useState("");

  const closeModal = () => { setIsModalOpen(false); setIsModalSaving(false); };

  const generateFormData = (body: SingleCardGenerationRequest, formData: FormData): void => {
    if (body.bgImg) {
      formData.append("enforceBackgroundImage", body.bgImg);
      formData.append("includeCenterArtwork", (body.includeCenterArtwork ?? "").toString());
    }
    if (body.colorPick !== "")
      formData.append("enforceBottomColor", body.colorPick);
    formData.append("cardMetaname", body.cardMetaname);
    formData.append("includeBackgroundImg", body.includeBackgroundImg.toString());
    formData.append("cardsContents", JSON.stringify(body.cardsContents));
    formData.append("cardFilename", body.cardFilename);
  };

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
  const openModal = (card: CardData, cardFileName: string) => {
    if (cardFileName === "00" || cardFileName === "outro") {
      sendToast(TOAST.CARD_NOT_EDITABLE, TOAST_TYPE.WARN);
      return;
    }

    setIsModalOpen(true);
    setCurrentCard(card);
    setNewLyrics(card.lyrics);
  };

  // used to prevent the modal from closing when click&dragging from inside it
  const isMouseDownRef = useRef(false);
  const clickedInsideModalRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isMouseDownRef.current = true;

    const modalContent = document.querySelector('.modal-content');
    clickedInsideModalRef.current = modalContent?.contains(e.target as Node) ?? false; // click inside modal?
  };
  const handleMouseUp = () => { isMouseDownRef.current = false; };
  const handleOverlayClick = () => { !clickedInsideModalRef.current && closeModal() };

  const renderCard = (card: CardData, nb: number): JSX.Element => {
    const cardFileName = (card.src.split('/').pop() ?? "").split('?')[0] ?? "card";
    const shortCardFileName = cardFileName.replace(".png", "");
    const alt = "card" + "-" + nb.toString() + "_" + cardFileName;

    return (
      <div key={alt} className="card card-container">
        <div onClick={() => openModal(card, shortCardFileName)}>
          <img src={card.src} alt={card.lyrics} className="gallery-card" />
        </div>
        <form onSubmit={(e) => handleDownloadCard(e, {selectedImage: card.src})}>
          <input type="submit" value={"Download " + shortCardFileName} className="button" />
        </form>
      </div>
    );
  };

  return (
    <div id={id} className="card-gallery flex-row" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      { cards?.map((card, idx) =>
        renderCard(card, idx))
      }

      { isModalOpen && currentCard && (
        <div className="modal-overlay flexbox" onClick={handleOverlayClick}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="mv-0">
              {`Edit Lyrics of Card ${currentCard.id < 10 ? "0" : ""}${currentCard.id}`}
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
      )}
    </div>
  );
};

export default CardsGallery;
