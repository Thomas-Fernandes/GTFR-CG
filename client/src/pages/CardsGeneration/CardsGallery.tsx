import React, { useMemo, useRef, useState } from "react";

import CardEditModal from "./CardEditModal";
import CardView from "./CardView";
import { CardsGalleryContext } from "./contexts";
import { handleMouseDown, handleMouseUp } from "./mouse";
import { CardData, CardsGalleryProps } from "./types";

import "./CardsGallery.css";

const CardsGallery: React.FC<CardsGalleryProps> = ({ id, initialCards }): JSX.Element => {
  const [cards, setCards] = useState<CardData[]>(initialCards);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState<CardData | null>(null);
  const [newLyrics, setNewLyrics] = useState("");

  const contextValue = useMemo(
    () => ({ setCards, setIsModalOpen, currentCard, setCurrentCard, newLyrics, setNewLyrics }),
    [setCards, currentCard, newLyrics]
  );

  // used to prevent the modal from closing when click&dragging from inside to outside the modal
  const isMouseDownRef = useRef(false);
  const clickedInsideModalRef = useRef(false);

  return (
    <div id={id} className="card-gallery flex-row"
      onMouseDown={(e) => handleMouseDown(e, { isMouseDownRef, clickedInsideModalRef })}
      onMouseUp={() => handleMouseUp({ isMouseDownRef })}
    >
      <CardsGalleryContext.Provider value={contextValue}>
        { cards?.map((card, idx) =>
          <CardView key={idx} card={card} cardIdx={idx} />
        )}
        { isModalOpen && currentCard && (
          <CardEditModal />
        )}
      </CardsGalleryContext.Provider>
    </div>
  );
};

export default CardsGallery;
