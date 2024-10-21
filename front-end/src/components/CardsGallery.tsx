import React, { FormEvent, useRef, useState } from "react";

import { sendRequest } from "../common/Requests";
import { sendToast } from "../common/Toast";
import { ApiResponse, ImageDownloadRequest, SingleCardGenerationRequest, StateSetter } from "../common/Types";

import { API, BACKEND_URL, HTTP_STATUS, TOAST, TOAST_TYPE } from "../constants/Common";

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

  bgColor: string;

  cardPaths: string[];
  setCardPaths: StateSetter<string[]>;
};

type Props = {
  id: string;
  initialCards: CardData[];
  downloadFn: (e: FormEvent<HTMLFormElement> | undefined, body: ImageDownloadRequest) => void;
  generationProps: GenerationProps;
};

const CardsGallery: React.FC<Props> = ({
  id, initialCards, downloadFn, generationProps
}) => {
  const [cards, setCards] = useState<CardData[]>(initialCards);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSaving, setIsModalSaving] = useState(false);
  const [currentCard, setCurrentCard] = useState<CardData | null>(null);
  const [newLyrics, setNewLyrics] = useState("");

  const closeModal = () => { setIsModalOpen(false); };
  const saveText = async () => {
    if (currentCard === null) {
      sendToast(TOAST.CARD_EDIT_FAILED, TOAST_TYPE.ERROR);
      return;
    }

    setIsModalSaving(true);
    // TODO showSpinner(SPINNER_ID.CARDS_GENERATE);

    const cardFilename = currentCard.src.split('?')[0] ?? "card";
    const body: SingleCardGenerationRequest = {
      ...generationProps,

      cardsContents: currentCard.lyrics.split("\n"),
      cardFilename: cardFilename,
    }

    const formData = new FormData();
    if (body.bgImg) {
      formData.append("enforceBackgroundImage", body.bgImg);
      formData.append("includeCenterArtwork", (body.includeCenterArtwork ?? "").toString());
    }
    if (body.colorPick !== "")
      formData.append("enforceBottomColor", body.colorPick);
    formData.append("cardMetaname", body.cardMetaname);
    formData.append("generateOutro", body.generateOutro.toString());
    formData.append("includeBackgroundImg", body.includeBackgroundImg.toString());
    formData.append("backgroundColor", body.bgColor);
    formData.append("cardsContents", JSON.stringify(body.cardsContents));
    formData.append("cardFilename", body.cardFilename);

    await sendRequest("POST", BACKEND_URL + API.CARDS_GENERATION.GENERATE_SINGLE_CARD, formData).then((response: ApiResponse) => {
      if (response.status !== HTTP_STATUS.OK) {
        console.error(response.message);
        sendToast(response.message, TOAST_TYPE.ERROR);
        return;
      }
      const newCardPaths = [...generationProps.cardPaths];
      newCardPaths[currentCard.id] = `${cardFilename}?t=${Date.now()}`;
      generationProps.setCardPaths(newCardPaths);
      sendToast(TOAST.CARD_EDITED, TOAST_TYPE.SUCCESS);
    }).catch((error) => {
      console.error("Failed to upload text:", error);
      sendToast(TOAST.CARD_EDIT_FAILED, TOAST_TYPE.ERROR);
    }).finally(() => {
      setIsModalSaving(false);
    });

    if (currentCard !== null) {
      setCards((prevCards) =>
        prevCards.map((img) =>
          img.id === currentCard.id ? { ...img, lyrics: newLyrics } : img
        )
      );
    }

    closeModal();
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
    clickedInsideModalRef.current = modalContent?.contains(e.target as Node) ?? false; // Mouse down inside modal
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
        <form onSubmit={(e) => downloadFn(e, {selectedImage: card.src})}>
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
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="mv-0">
              {`Edit Lyrics of Card ${currentCard.id < 10 ? "0" : ""}${currentCard.id}`}
            </h3>
            <AutoResizeTextarea value={newLyrics} onChange={(e) => setNewLyrics(e.target.value)}
              name={"card-edit"} style={{ width: "100%" }}
            />
            <div className="modal-actions flex-row g-1">
              <button onClick={saveText} disabled={isModalSaving}>
                {"Save"}
              </button>
              <button onClick={closeModal} disabled={isModalSaving}>
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
