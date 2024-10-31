import { createNewContext } from "../../common/ContextProvider";
import { StateSetter } from "../../common/Types";

export interface LyricsContextType {
  dismissedParts: Set<number>;
  setDismissedParts: StateSetter<Set<number>>;
}

const { context: LyricsContext, useContext: useLyricsContext } = createNewContext<LyricsContextType>();

export { LyricsContext, useLyricsContext };

