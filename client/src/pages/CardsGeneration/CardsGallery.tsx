import React, { useMemo, useState } from "react";

import CardEditModal from "./CardEditModal";
import CardView from "./CardView";
import { CardsGalleryContext } from "./contexts";
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

  return (
    <div id={id} className="card-gallery flex-row">
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
