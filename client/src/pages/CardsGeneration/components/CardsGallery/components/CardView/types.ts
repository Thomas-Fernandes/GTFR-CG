import { ComponentPropsWithoutRef } from "react";

import { CardData } from "@/pages/CardsGeneration/types";

export type CardViewProps = ComponentPropsWithoutRef<"div"> & Readonly<{
  card: CardData;
  cardIdx: number;
}>;