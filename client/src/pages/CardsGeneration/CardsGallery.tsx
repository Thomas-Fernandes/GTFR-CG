import { useMemo, useState } from "react";

import CardEditModal from "./CardEditModal";
import CardView from "./CardView";
import { CardsGalleryContext } from "./contexts";
import { CardData, CardsGalleryProps } from "./types";

import "./CardsGallery.scss";

const CardsGallery: React.FC<CardsGalleryProps> = ({ initialCards, ...divProps }) => {
  const [cards, setCards] = useState<CardData[]>(initialCards);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState<CardData | null>(null);
  const [newLyrics, setNewLyrics] = useState("");

  const contextValue = useMemo(
    () => ({ setCards, setIsModalOpen, currentCard, setCurrentCard, newLyrics, setNewLyrics }),
    [cards, currentCard, newLyrics]
  );

  return (
    <div className="card-gallery" {...divProps}>
      <CardsGalleryContext.Provider value={contextValue}>
        <ul className="card-gallery--cards">
          { cards?.map((card, idx) =>
            <li key={idx}>
              <CardView card={card} cardIdx={idx} />
            </li>
          )}
        </ul>
        { isModalOpen && currentCard && (
          <CardEditModal />
        )}
      </CardsGalleryContext.Provider>
    </div>
  );
};

export default CardsGallery;
