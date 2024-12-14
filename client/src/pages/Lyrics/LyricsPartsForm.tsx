import { useState } from "react";

import ActionButton from "@/components/ActionButton/ActionButton";
import { SpinnerId } from "@/constants/spinners";

import { useLyricsContext } from "./contexts";
import { handleLyricsSaveSubmit } from "./handlers";
import LyricsPart from "./LyricsPart";
import { LyricsPartsFormProps } from "./types";
import { convertToCardContents } from "./utils";

import "./LyricsPartsForm.scss";

const LyricsPartsForm: React.FC<LyricsPartsFormProps> = ({ lyricsParts }) => {
  const { dismissedParts, pageMetadata, isManual, navigate } = useLyricsContext();

  const [isSavingCardsContent, setIsSavingCardsContent] = useState(false);

  return (
    <form className="lyrics-form"
      onSubmit={(e) => handleLyricsSaveSubmit(e, convertToCardContents(lyricsParts, dismissedParts),
        {isSavingCardsContent, setIsSavingCardsContent, pageMetadata, isManual, lyricsParts, dismissedParts, navigate}
      )}
    >
      { lyricsParts.map((part, idx) =>
        <div key={"part_" + idx}>
          <LyricsPart part={part} idx={idx} />
          { idx !== lyricsParts.length - 1 &&
            <hr className="w-full my-4" />
          }
        </div>
      )}
      <hr className="my-8" />

      <div className="submit" id={SpinnerId.LyricsConvert}>
        <ActionButton type="submit" label="CONVERT TO CARDS" className="spaced" />
      </div>
    </form>
  );
};

export default LyricsPartsForm;