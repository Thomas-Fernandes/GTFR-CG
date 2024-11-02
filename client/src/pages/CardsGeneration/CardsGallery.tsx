import React, { useMemo, useRef, useState } from "react";

import CardEditModal from "./CardEditModal";
import CardView from "./CardView";
import { CardsGalleryContext } from "./context";
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

const CardsGallery: React.FC<CardsGalleryProps> = ({ id, initialCards, generationProps }): JSX.Element => {
  const [cards, setCards] = useState<CardData[]>(initialCards);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState<CardData | null>(null);
  const [newLyrics, setNewLyrics] = useState("");

  const contextValue = useMemo(
    () => ({ setIsModalOpen, currentCard, setCurrentCard, newLyrics, setNewLyrics, setCards }),
    [setIsModalOpen, currentCard, setCurrentCard, newLyrics, setNewLyrics, setCards]
  );

  // used to prevent the modal from closing when click&dragging from inside to outside the modal
  const isMouseDownRef = useRef(false);
  const clickedInsideModalRef = useRef(false);

  return (
    <CardsGalleryContext.Provider value={contextValue}>
      <div id={id} className="card-gallery flex-row"
        onMouseDown={(e) => handleMouseDown(e, { isMouseDownRef, clickedInsideModalRef })}
        onMouseUp={() => handleMouseUp({ isMouseDownRef })}
      >
        { cards?.map((card, idx) =>
          <CardView key={idx} card={card} cardIdx={idx} />
        )}
        { isModalOpen && currentCard && (
          <CardEditModal generationProps={generationProps} />
        )}
      </div>
    </CardsGalleryContext.Provider>
  );
};

export default CardsGallery;
