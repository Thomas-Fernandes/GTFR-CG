import { useState } from "react";

import ActionButton from "@/components/ActionButton/ActionButton";
import { SpinnerId } from "@/constants/spinners";
import { useAppContext } from "@/contexts";
import { useDescriptionGenerationContext } from "@/pages/DescriptionGeneration/contexts";
import { handleSongPageSearchSubmit } from "./handlers";
import { DescriptionGenerationFormProps } from "./types";

import "./DescriptionGenerationForm.scss";

const DescriptionGenerationForm = ({ artist, song }: DescriptionGenerationFormProps) => {
  const { intl } = useAppContext();
  const labels = {
    artistPlaceholder: intl.formatMessage({ id: "pages.lyrics.search.artistPlaceholder" }),
    songPlaceholder: intl.formatMessage({ id: "pages.lyrics.search.songPlaceholder" }),
    submit: intl.formatMessage({ id: "pages.lyrics.search.submit" }),
  };

  const { setArtistLinks, setFoundPage } = useDescriptionGenerationContext();

  const [artistName, setArtistName] = useState(artist);
  const [songName, setSongName] = useState(song);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <form
      onSubmit={(e) =>
        handleSongPageSearchSubmit(
          e,
          { artist, songName },
          { isGenerating, setIsGenerating, setFoundPage, setArtistLinks }
        )
      }
      className="search-form"
    >
      <input
        type="text"
        name="artist"
        placeholder={labels.artistPlaceholder}
        value={artistName}
        onChange={(e) => setArtistName(e.target.value)}
        className={!artistName ? "empty" : ""}
      />
      <input
        type="text"
        name="song"
        placeholder={labels.songPlaceholder}
        value={songName}
        onChange={(e) => setSongName(e.target.value)}
        className={!songName ? "empty" : ""}
      />

      <div id={SpinnerId.DescriptionGenerate} className="submit">
        <ActionButton type="submit" label={labels.submit} className="spaced" />
      </div>
    </form>
  );
};

export default DescriptionGenerationForm;
