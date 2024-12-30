import ActionButton from "@/components/ActionButton/ActionButton";
import { SpinnerId } from "@/constants/spinners";

import { useLyricsContext } from "./contexts";
import { handleLyricsSearchSubmit } from "./handlers";

import "./LyricsSearchForm.scss";

const LyricsSearchForm = () => {
  const { artist, songName, isFetching, setIsFetching, setLyricsParts, setPageMetadata, setDismissedParts, setArtist, setSongName } = useLyricsContext();

  return (
    <form className="search-form"
      onSubmit={(e) => handleLyricsSearchSubmit(e, {artist, songName}, {isFetching, setIsFetching, setLyricsParts, setPageMetadata, setDismissedParts})}
    >
      <label htmlFor="artist" className="hidden">{"Artist"}</label>
      <input required type="text" name="artist" id="artist"
        placeholder={"Enter artist name"}
        onChange={(e) => setArtist(e.target.value)}
      />

      <label htmlFor="songName" className="hidden">{"Song name"}</label>
      <input required type="text" name="songName" id="songName"
        placeholder={"Enter song name"}
        onChange={(e) => setSongName(e.target.value)}
      />

      <label htmlFor={SpinnerId.LyricsSearch} className="hidden">{"Search button"}</label>
      <div id={SpinnerId.LyricsSearch} className="spinner">
        <ActionButton type="submit" label="SEARCH" className="spaced" />
      </div>
    </form>
  )
};

export default LyricsSearchForm;