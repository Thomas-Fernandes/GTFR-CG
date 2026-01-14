import { useState } from "react";

import ButtonWithSpinner from "@/components/ButtonWithSpinner/ButtonWithSpinner";
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
    <form
      onSubmit={(e) =>
        handleLyricsSaveSubmit(e, convertToCardContents(lyricsParts, dismissedParts), {
          isSavingCardsContent,
          setIsSavingCardsContent,
          pageMetadata,
          isManual,
          lyricsParts,
          dismissedParts,
          navigate,
        })
      }
      className="lyrics-form"
    >
      <label htmlFor="lyrics-form--parts" className="hidden">
        {"Lyrics parts"}
      </label>
      <ul id="lyrics-form--parts" className="lyrics-form--parts">
        {lyricsParts.map((part, idx) => (
          <li key={`part_${idx}`}>
            {idx !== 0 && <hr className="w-full my-4" />}
            <LyricsPart part={part} idx={idx} />
          </li>
        ))}
      </ul>
      <hr className="my-8" />

      <label htmlFor={SpinnerId.LyricsConvert} className="hidden">
        {"Convert to cards button"}
      </label>
      <ButtonWithSpinner id={SpinnerId.LyricsConvert} label={labels.submit} isBusy={isSavingCardsContent} />
    </form>
  );
};

export default LyricsPartsForm;
