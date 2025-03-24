import { useAppContext } from "@/contexts";

import { useLyricsContext } from "./contexts";

import "./ManualGenerationInputBar.scss";

const ManualGenerationInputBar = () => {
  const { intl } = useAppContext();
  const labels = {
    artistPlaceholder: intl.formatMessage({ id: "pages.lyrics.search.artistPlaceholder" }),
    songPlaceholder: intl.formatMessage({ id: "pages.lyrics.search.songPlaceholder" }),
  };

  const { setArtist, setSongName, pageMetadata, setPageMetadata } = useLyricsContext();

  return (
    <div className="manual-generation">
      <input required type="text" name="artist" placeholder={labels.artistPlaceholder}
        onChange={(e) => { setArtist(e.target.value); setPageMetadata({...pageMetadata, artist: e.target.value}); }}
      />
      <input required type="text" name="songName" placeholder={labels.songPlaceholder}
        onChange={(e) => { setSongName(e.target.value); setPageMetadata({...pageMetadata, title: e.target.value}); }}
      />
    </div>
  )
};

export default ManualGenerationInputBar;