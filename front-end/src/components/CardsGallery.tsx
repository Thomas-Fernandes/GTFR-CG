import React, { FormEvent, useRef, useState } from "react";

import { sendToast } from "../common/Toast";
import { ImageDownloadRequest } from "../common/Types";

import { TOAST, TOAST_TYPE } from "../constants/Common";

import { AutoResizeTextarea } from "./AutoResizeTextarea";

import "./CardsGallery.css";

export interface CardData {
  id: number;
  lyrics: string;
  src: string; // Img source path
}

type Props = {
  id: string;
  initialCards: CardData[];
  downloadFn: (e: FormEvent<HTMLFormElement> | undefined, body: ImageDownloadRequest) => void;
};

const CardsGallery: React.FC<Props> = ({ id, initialCards, downloadFn }) => {
  const [cards, setCards] = useState<CardData[]>(initialCards);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState<CardData | null>(null);
  const [newLyrics, setNewLyrics] = useState("");

  const closeModal = () => { setIsModalOpen(false); };
  const saveText = () => {
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
        {/* <p className="card-text">{card.text}</p> */}
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
              <button onClick={saveText}>{"Save"}</button>
              <button onClick={closeModal}>{"Cancel"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardsGallery;
