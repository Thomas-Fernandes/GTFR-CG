import { useState } from "react";


import { SpinnerId } from "@constants/spinners";

import { useLyricsContext } from "./contexts";
import { handleLyricsSaveSubmit } from "./handlers";
import LyricsPart from "./LyricsPart";
import { LyricsPartsFormProps } from "./types";
import { convertToCardContents } from "./utils";

import "./LyricsPartsForm.css";

const LyricsPartsForm: React.FC<LyricsPartsFormProps> = ({ lyricsParts }): JSX.Element => {
  const { dismissedParts, pageMetadata, isManual, navigate } = useLyricsContext();

  const [isSavingCardsContent, setIsSavingCardsContent] = useState(false);

  return (
    <form className="lyrics-form flexbox"
      onSubmit={(e) => handleLyricsSaveSubmit(e, convertToCardContents(lyricsParts, dismissedParts),
        {isSavingCardsContent, setIsSavingCardsContent, pageMetadata, isManual, lyricsParts, dismissedParts, navigate}
      )}
    >
      { lyricsParts.map((part, idx) =>
        <LyricsPart key={idx} part={part} idx={idx} />
      )}
      <div className="action-button" id={SpinnerId.LyricsConvert}>
        <input type="submit" value="CONVERT TO CARDS" className="action-button convert-button" />
      </div>
    </form>
  );
};

export default LyricsPartsForm;