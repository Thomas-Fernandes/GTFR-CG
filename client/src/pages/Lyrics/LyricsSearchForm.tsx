import ActionButton from "@/components/ActionButton/ActionButton";
import { SpinnerId } from "@/constants/spinners";
import { useAppContext } from "@/contexts";

import { useLyricsContext } from "./contexts";
import { handleLyricsSearchSubmit } from "./handlers";

import "./LyricsSearchForm.scss";

const LyricsSearchForm = () => {
  const { intl } = useAppContext();
  const labels = {
    artistPlaceholder: intl.formatMessage({ id: "pages.lyrics.search.artistPlaceholder" }),
    songPlaceholder: intl.formatMessage({ id: "pages.lyrics.search.songPlaceholder" }),
    submit: intl.formatMessage({ id: "pages.lyrics.search.submit" }),
  };

  const {
    artist, songName, isFetching,
    setIsFetching, setLyricsParts, setPageMetadata, setDismissedParts, setArtist, setSongName
  } = useLyricsContext();

  return (
    <form className="search-form"
      onSubmit={(e) => handleLyricsSearchSubmit(
        e, {artist, songName}, {isFetching, setIsFetching, setLyricsParts, setPageMetadata, setDismissedParts})
      }
    >
      <label htmlFor="artist" className="hidden">{"Artist"}</label>
      <input required type="text" name="artist" id="artist"
        placeholder={labels.artistPlaceholder}
        onChange={(e) => setArtist(e.target.value)}
      />

      <label htmlFor="songName" className="hidden">{"Song name"}</label>
      <input required type="text" name="songName" id="songName"
        placeholder={labels.songPlaceholder}
        onChange={(e) => setSongName(e.target.value)}
      />

      <label htmlFor={SpinnerId.LyricsSearch} className="hidden">{"Search button"}</label>
      <div id={SpinnerId.LyricsSearch} className="spinner">
        <ActionButton type="submit" label={labels.submit} className="spaced" />
      </div>
    </form>
  )
};

export default LyricsSearchForm;