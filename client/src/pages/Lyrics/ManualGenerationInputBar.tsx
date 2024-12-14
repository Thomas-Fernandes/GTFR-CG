import { useLyricsContext } from "./contexts";

import "./ManualGenerationInputBar.scss";

const ManualGenerationInputBar = () => {
  const { setArtist, setSongName, pageMetadata, setPageMetadata } = useLyricsContext();

  return (
    <div className="manual-generation">
      <input required type="text" name="artist" placeholder={"Enter artist name"}
        onChange={(e) => { setArtist(e.target.value); setPageMetadata({...pageMetadata, artist: e.target.value}); }}
      />
      <input required type="text" name="songName" placeholder={"Enter song name"}
        onChange={(e) => { setSongName(e.target.value); setPageMetadata({...pageMetadata, title: e.target.value}); }}
      />
    </div>
  )
};

export default ManualGenerationInputBar;