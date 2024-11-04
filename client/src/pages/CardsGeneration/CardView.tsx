import React from "react";

import { sendToast } from "@common/toast";

import { Toast, ToastType } from "@constants/toasts";

import { useCardsGalleryContext } from "./contexts";
import { handleSubmitDownloadCard } from "./handlers";
import { CardData, CardViewProps } from "./types";

import "./CardView.css";

const CardView: React.FC<CardViewProps> = ({ card, cardIdx }): JSX.Element => {
  const { setIsModalOpen, setCurrentCard, setNewLyrics } = useCardsGalleryContext();

  const cardFileName = (card.src.split('/').pop() ?? "").split('?')[0] ?? "card";
  const shortCardFileName = cardFileName.replace(".png", "");
  const alt = `card-${cardIdx.toString()}_${cardFileName}`;

  const openModal = (card: CardData, cardFileName: string) => {
    if (cardFileName === "00" || cardFileName === "outro") {
      sendToast(Toast.CardNotEditable, ToastType.Warn);
      return;
    }

    setIsModalOpen(true);
    setCurrentCard(card);
    setNewLyrics(card.lyrics);
  };

  return (
    <div key={alt} className="card card-container">
      <div onClick={() => openModal(card, shortCardFileName)}>
        <img src={card.src} alt={card.lyrics} className="gallery-card" />
      </div>
      <form onSubmit={(e) => handleSubmitDownloadCard(e, {selectedImage: card.src})}>
        <input type="submit" value={"Download " + shortCardFileName} className="button" />
      </form>
    </div>
  );
};

export default CardView;
