import { StateSetter } from "@/common/types";
import { CardData } from "@/pages/CardsGeneration/types";

export const updateCard = (
  setCards: StateSetter<CardData[]>,
  currentCard: CardData,
  newLyrics: string,
  cardFilename: string
) => {
  setCards((prevCards) =>
    prevCards.map((img) => img.id === currentCard.id // update only the card that was edited
      ? {
        id: img.id,
        imgSrc: `${cardFilename}?t=${Date.now()}`, // busting cached image with the same name thanks to timestamp
        lyrics: newLyrics,
      } : img
    )
  );
};