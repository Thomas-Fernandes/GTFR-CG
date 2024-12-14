import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "@/common/hooks/useTitle";
import { NavButtonSide } from "@/components/NavButton/constants";
import NavButton from "@/components/NavButton/NavButton";
import ToastContainer from "@/components/ToastContainer/ToastContainer";
import TopBotSpacer from "@/components/TopBotSpacer/TopBotSpacer";
import { SessionStorage, Title } from "@/constants/browser";
import { ViewPaths } from "@/constants/paths";
import { Toast } from "@/constants/toasts";

import { LyricsContext } from "./contexts";
import GenerationModeFlipper from "./GenerationModeFlipper";
import { handleLoadLastContents } from "./handlers";
import LyricsPartsForm from "./LyricsPartsForm";
import LyricsSearchForm from "./LyricsSearchForm";
import ManualGenerationInputBar from "./ManualGenerationInputBar";
import { isTokenSet } from "./requests";
import { LyricsContents, LyricsPartType, PageMetadata } from "./types";

const Lyrics = () => {
  useTitle(Title.Lyrics);

  const navigate = useNavigate();

  const [isGeniusTokenSet, setIsGeniusTokenSet] = useState(false);

  const [isFetching, setIsFetching] = useState(false);

  const [artist, setArtist] = useState("");
  const [songName, setSongName] = useState("");

  const [pageMetadata, setPageMetadata] = useState({} as PageMetadata);
  const [lyricsParts, setLyricsParts] = useState([] as LyricsPartType[]);
  const [lastContents, setLastContents] = useState({} as LyricsContents);

  const [isManual, setIsManual] = useState(false);

  const [dismissedParts, setDismissedParts] = useState(new Set<number>());

  const contextValue = useMemo(
    () => ({
      isFetching, setIsFetching, artist, setArtist, songName, setSongName, pageMetadata, setPageMetadata,
      lyricsParts, setLyricsParts, dismissedParts, setDismissedParts, isManual, setIsManual, navigate
    }),
    [isFetching, artist, songName, pageMetadata, lyricsParts, dismissedParts, isManual, navigate]
  );

  useEffect(() => {
    if (isGeniusTokenSet)
      return;

    isTokenSet().then((isSet) => {
      if (!isSet) {
        navigate(`${ViewPaths.Redirect}?redirect_to=${ViewPaths.Home}&error_text=${Toast.NoGeniusToken}`);
        return;
      }

      setIsGeniusTokenSet(true);

      const latestCardGeneration = sessionStorage.getItem(SessionStorage.LatestCardGeneration);
      setLastContents(JSON.parse(latestCardGeneration ?? "{{}, [], []}"));
    });
  });

  return (
    <div id="lyrics">
      <ToastContainer />
      <TopBotSpacer />

      <div className="navbar">
        <NavButton to={ViewPaths.Home} label={Title.Home} side={NavButtonSide.Left} />
        <NavButton to={ViewPaths.ArtworkGeneration} label={Title.ArtworkGeneration} side={NavButtonSide.Left} />
        <NavButton to={ViewPaths.CardsGeneration} label={Title.CardsGeneration} side={NavButtonSide.Right} />
      </div>

      <h1>{Title.Lyrics}</h1>

      <button type="button" className="medium mac"
        onClick={() => handleLoadLastContents({lastContents, setPageMetadata, setLyricsParts, setDismissedParts})}
      >
        {"Load last contents"}
      </button>

      <LyricsContext.Provider value={contextValue}>
        { isManual
          ? <ManualGenerationInputBar />
          : <LyricsSearchForm />
        }

        { !isFetching &&
          <GenerationModeFlipper />
        }

        { !isFetching && lyricsParts.length > 0 &&
          <>
            <hr className="my-8" />

            <LyricsPartsForm lyricsParts={lyricsParts} />
          </>
        }
      </LyricsContext.Provider>

      <TopBotSpacer />
    </div>
  )
};

export default Lyrics;