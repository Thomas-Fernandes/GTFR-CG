import { useMemo, useState } from "react";

import { downloadFilesAsZip } from "@/common/utils/fileUtils";
import CardStack from "@/components/CardStack/CardStack";

import CardEditModal from "./CardEditModal";
import CardView from "./CardView";
import { CARDS_ZIP_FILENAME } from "./constants";
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
          { cards.length > 0 &&
            <>
              <li key={0}>
                <CardStack label={"Download All as Zip"} imgSrc={cards[1].src} stackSize={2}
                  onClick={() => downloadFilesAsZip(cards.map(card => card.src), CARDS_ZIP_FILENAME)}
                />
              </li>
              { cards.map((card, idx) =>
                <li key={idx + 1}>
                  <CardView card={card} cardIdx={idx} />
                </li>
              )}
            </>
          }
        </ul>
        { isModalOpen && currentCard && (
          <CardEditModal />
        )}
      </CardsGalleryContext.Provider>
    </div>
  );
};

export default CardsGallery;
