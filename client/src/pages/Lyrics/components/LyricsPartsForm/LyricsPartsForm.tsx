import { useState } from "react";

import ActionButton from "@/components/ActionButton/ActionButton";
import { SpinnerId } from "@/constants/spinners";
import { useAppContext } from "@/contexts";
import { useLyricsContext } from "@/pages/Lyrics/contexts";

import LyricsPart from "./components/LyricsPart/LyricsPart";
import { handleLyricsSaveSubmit } from "./handlers";
import { LyricsPartsFormProps } from "./types";
import { convertToCardContents } from "./utils";

import "./LyricsPartsForm.scss";

const LyricsPartsForm = ({ lyricsParts }: LyricsPartsFormProps) => {
  const { intl } = useAppContext();
  const labels = {
    submit: intl.formatMessage({ id: "pages.lyrics.submit" }),
  };

  const { dismissedParts, pageMetadata, isManual, navigate } = useLyricsContext();

  const [isSavingCardsContent, setIsSavingCardsContent] = useState(false);

  return (
    <form className="lyrics-form"
      onSubmit={(e) => handleLyricsSaveSubmit(e, convertToCardContents(lyricsParts, dismissedParts),
        {isSavingCardsContent, setIsSavingCardsContent, pageMetadata, isManual, lyricsParts, dismissedParts, navigate}
      )}
    >
      <label htmlFor="lyrics-form--parts" className="hidden">{"Lyrics parts"}</label>
      <ul className="lyrics-form--parts" id="lyrics-form--parts">
        { lyricsParts.map((part, idx) =>
          <li key={`part_${idx}`}>
            <LyricsPart part={part} idx={idx} />
            { idx !== lyricsParts.length - 1 &&
              <hr className="w-full my-4" />
            }
          </li>
        )}
      </ul>
      <hr className="my-8" />

      <label htmlFor={SpinnerId.LyricsConvert} className="hidden">{"Convert to cards button"}</label>
      <div className="submit" id={SpinnerId.LyricsConvert}>
        <ActionButton type="submit" label={labels.submit} className="spaced" />
      </div>
    </form>
  );
};

export default LyricsPartsForm;