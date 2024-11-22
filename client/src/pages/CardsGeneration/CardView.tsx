import React from "react";

import { sendToast } from "@/common/toast";

import ImgWithOverlay from "@/components/ImgWithOverlay/ImgWithOverlay";

import { Toast, ToastType } from "@/constants/toasts";

import { useCardsGalleryContext } from "./contexts";
import { handleSubmitDownloadCard } from "./handlers";
import { CardViewProps } from "./types";

import "./CardView.css";

const CardView: React.FC<CardViewProps> = ({ card, cardIdx }): JSX.Element => {
  const { setIsModalOpen, setCurrentCard, setNewLyrics } = useCardsGalleryContext();

  const cardFileName = (card.src.split('/').pop() ?? "").split('?')[0] ?? "card";
  const shortCardFileName = cardFileName.replace(".png", "");
  const cardIsEditable = !(shortCardFileName === "00" || shortCardFileName === "outro");
  const alt = `card-${cardIdx.toString()}_${cardFileName}`;

  const openModal = () => {
    if (!cardIsEditable) {
      sendToast(Toast.CardNotEditable, ToastType.Warn);
      return;
    }

    setIsModalOpen(true);
    setCurrentCard(card);
    setNewLyrics(card.lyrics);
  };

  return (
    <div key={alt} className="card card-container">
      <div onClick={openModal} className="gallery-card">
        { !cardIsEditable
        ? <img
            src={card.src} alt={alt}
          />
        : <ImgWithOverlay
            src={card.src} alt={alt}
            overlayText={"Edit this card"}
          />
        }

      </div>
      <form onSubmit={(e) => handleSubmitDownloadCard(e, {selectedImage: card.src})}>
        <input type="submit" value={"Download " + shortCardFileName} className="button" />
      </form>
    </div>
  );
};

export default CardView;
