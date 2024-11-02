import React, { useMemo, useRef, useState } from "react";

import { sendToast } from "@common/toast";

import { TOAST, TOAST_TYPE } from "@constants/toasts";

import CardEditModal from "./CardEditModal";
import { CardsGalleryContext } from "./context";
import { handleSubmitDownloadCard } from "./handlers";
import { CardData } from "./interfaces";
import { handleMouseDown, handleMouseUp } from "./mouse";

import "./CardsGallery.css";

export type GenerationProps = {
  cardMetaname: string;
  bgImg: File | undefined;
  colorPick: string;
  includeCenterArtwork: boolean | undefined;
  generateOutro: boolean;
  includeBackgroundImg: boolean;

  cardBottomColor: string;
};

type CardsGalleryProps = {
  id: string;
  initialCards: CardData[];
  generationProps: GenerationProps;
};

const CardsGallery: React.FC<CardsGalleryProps> = ({ id, initialCards, generationProps }) => {
  const [cards, setCards] = useState<CardData[]>(initialCards);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState<CardData | null>(null);
  const [newLyrics, setNewLyrics] = useState("");

  const contextValue = useMemo(
    () => ({ setIsModalOpen, currentCard, newLyrics, setNewLyrics, setCards }),
    [setIsModalOpen, currentCard, newLyrics, setNewLyrics, setCards]
  );

  const openModal = (card: CardData, cardFileName: string) => {
    if (cardFileName === "00" || cardFileName === "outro") {
      sendToast(TOAST.CARD_NOT_EDITABLE, TOAST_TYPE.WARN);
      return;
    }

    setIsModalOpen(true);
    setCurrentCard(card);
    setNewLyrics(card.lyrics);
  };

  // used to prevent the modal from closing when click&dragging from inside to outside the modal
  const isMouseDownRef = useRef(false);
  const clickedInsideModalRef = useRef(false);

  const renderCard = (card: CardData, nb: number): JSX.Element => {
    const cardFileName = (card.src.split('/').pop() ?? "").split('?')[0] ?? "card";
    const shortCardFileName = cardFileName.replace(".png", "");
    const alt = "card" + "-" + nb.toString() + "_" + cardFileName;

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

  return (
    <CardsGalleryContext.Provider value={contextValue}>
      <div id={id} className="card-gallery flex-row"
        onMouseDown={(e) => handleMouseDown(e, { isMouseDownRef, clickedInsideModalRef })}
        onMouseUp={() => handleMouseUp({ isMouseDownRef })}
      >
        { cards?.map((card, idx) =>
          renderCard(card, idx))
        }

        { isModalOpen && currentCard && (
          <CardEditModal generationProps={generationProps} />
        )}
      </div>
    </CardsGalleryContext.Provider>
  );
};

export default CardsGallery;