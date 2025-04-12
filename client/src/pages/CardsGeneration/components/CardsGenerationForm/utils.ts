import { SongPartsCards } from "@/common/types";
import { CardData } from "@/pages/CardsGeneration/types";

export const deduceNewCards = (paths: string[], cardsLyrics: SongPartsCards, hasOutro: boolean): CardData[] => {
  return paths.map((path, idx) => ({
    id: idx,
    imgSrc: path,
    lyrics: idx === 0 || (hasOutro && idx === paths.length - 1) // card 00 and outro card have no lyrics
      ? ""
      : cardsLyrics[idx - 1].join("\n")
  }));
};