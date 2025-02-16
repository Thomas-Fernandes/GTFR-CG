import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "@/common/hooks/useTitle";
import { NavButtonSide } from "@/components/NavButton/constants";
import NavButton from "@/components/NavButton/NavButton";
import ToastContainer from "@/components/ToastContainer/ToastContainer";
import TopBotSpacer from "@/components/TopBotSpacer/TopBotSpacer";
import { ViewPaths } from "@/constants/paths";
import { useAppContext } from "@/contexts";

import { defaultStatistics } from "./constants";
import { getGeniusToken, getStatistics } from "./requests";
import StatisticsBoard from "./StatisticsBoard";
import { Statistics } from "./types";

import "./Home.scss";

const Home = () => {
  const { intl } = useAppContext();
  const labels = {
    title: intl.formatMessage({ id: "pages.artgen.title" }),
    artgenTitle: intl.formatMessage({ id: "pages.artgen.title" }),
    lyricsTitle: intl.formatMessage({ id: "pages.lyrics.title" }),
    cardgenTitle: intl.formatMessage({ id: "pages.cardgen.title" }),
  };

  useTitle(labels.title);

  const navigate = useNavigate();

  const [geniusToken, setGeniusToken] = useState("");
  const [stats, setStats] = useState<Statistics>(defaultStatistics);

  useEffect(() => {
    const routeKey = location.pathname;
    const hasVisited = sessionStorage.getItem(routeKey);

    const fetchAndSetData = () => {
      getStatistics(setStats);

      if (!hasVisited) {
        getGeniusToken(setGeniusToken);
        sessionStorage.setItem(routeKey, "visited");
      }
    };

    fetchAndSetData();
  }, [navigate]);

  return (
    <div id="home">
      <ToastContainer />
      <TopBotSpacer />

      <h1>{labels.title}</h1>

      <div className="home navbar">
        <div className="navbar-row">
          <NavButton to={ViewPaths.ArtworkGeneration} label={labels.artgenTitle} side={NavButtonSide.Right} />
          <NavButton to={ViewPaths.Lyrics} label={labels.lyricsTitle} side={NavButtonSide.Right} />
        </div>
        <div className="navbar-row">
          <NavButton to={ViewPaths.CardsGeneration} label={labels.cardgenTitle} side={NavButtonSide.Right} />
        </div>
      </div>

      <StatisticsBoard stats={stats} />

      <div className="hidden"> {/* avoid unused variable */}
        <p>{`Genius Token: '${geniusToken}'`}</p>
      </div>

      <TopBotSpacer />
    </div>
  );
};

export default Home;