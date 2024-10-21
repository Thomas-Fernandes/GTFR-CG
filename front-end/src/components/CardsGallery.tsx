import React, { FormEvent, useState } from "react";

import { ImageDownloadRequest } from "../common/Types";

import "./CardsGallery.css"; // Include your CSS here for styli

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
  const openModal = (card: CardData) => {
    setIsModalOpen(true);
    setCurrentCard(card);
    setNewLyrics(card.lyrics);
  };

  const renderCard = (card: CardData, nb: number): JSX.Element => {
    const cardFileName = (card.src.split('/').pop() ?? "").split('?')[0] ?? "card";
    const alt = "card" + "-" + nb.toString() + "_" + cardFileName;
    return (
      <div key={alt} className="card card-container">
        <div onClick={() => openModal(card)}>
          <img src={card.src} alt={card.lyrics} className="gallery-card" />
        </div>
        {/* <p className="card-text">{card.text}</p> */}
        <form onSubmit={(e) => downloadFn(e, {selectedImage: card.src})}>
          <input type="submit" value={"Download " + cardFileName.replace(".png", "")} className="button" />
        </form>
      </div>
    );
  };

  return (
    <div id={id} className="card-gallery flex-row">
      { cards?.map((card, idx) => renderCard(card, idx)) }

      { isModalOpen && currentCard && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{`Edit Lyrics of Card ${currentCard.id}`}</h3>
            <textarea
              value={newLyrics}
              onChange={(e) => setNewLyrics(e.target.value)}
              className="text-area"
              rows={4}
            />
            <div className="modal-actions">
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
