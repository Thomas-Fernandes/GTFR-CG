import { useMemo, useState } from "react";

import { downloadFilesAsZip } from "@/common/utils/fileUtils";
import CardStack from "@/components/CardStack/CardStack";
import { useAppContext } from "@/contexts";
import { CardsGalleryContext } from "@/pages/CardsGeneration/contexts";
import { CardData } from "@/pages/CardsGeneration/types";

import CardEditModal from "./components/CardEditModal/CardEditModal";
import CardView from "./components/CardView/CardView";
import { CARDS_ZIP_FILENAME } from "./constants";
import { CardsGalleryProps } from "./types";

import "./CardsGallery.scss";

const CardsGallery = ({ initialCards, ...divProps }: CardsGalleryProps) => {
  const { intl } = useAppContext();
  const labels = {
    downloadAll: intl.formatMessage({ id: "pages.cardgen.downloadAll" }),
  };

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
          {cards.length > 0 && (
            <>
              <li key={0}>
                <CardStack
                  label={labels.downloadAll}
                  imgSrc={cards[1].imgSrc}
                  stackSize={2}
                  onClick={() =>
                    downloadFilesAsZip(
                      cards.map((card) => card.imgSrc),
                      CARDS_ZIP_FILENAME
                    )
                  }
                />
              </li>
              {cards.map((card, idx) => (
                <li key={idx + 1}>
                  <CardView card={card} cardIdx={idx} />
                </li>
              ))}
            </>
          )}
        </ul>
        {isModalOpen && currentCard && <CardEditModal />}
      </CardsGalleryContext.Provider>
    </div>
  );
};

export default CardsGallery;
