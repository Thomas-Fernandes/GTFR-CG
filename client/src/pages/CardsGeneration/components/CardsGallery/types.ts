import { ComponentPropsWithoutRef } from "react";

import { CardData } from "@/pages/CardsGeneration/types";

export type CardsGalleryProps = ComponentPropsWithoutRef<"div"> & {
  initialCards: CardData[];
};
