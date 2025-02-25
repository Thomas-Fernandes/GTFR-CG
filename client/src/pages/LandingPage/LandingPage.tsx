import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "@/common/hooks/useTitle";
import ActionButton from "@/components/ActionButton/ActionButton";
import ImgButton from "@/components/ImgButton/ImgButton";
import ToastContainer from "@/components/ToastContainer/ToastContainer";
import TopBotSpacer from "@/components/TopBotSpacer/TopBotSpacer";
import { gifPaths, imgPaths } from "@/constants/media";
import { ViewPaths } from "@/constants/paths";
import { useAppContext } from "@/contexts";

import "./LandingPage.scss";

const LandingPage = () => {
  const { intl } = useAppContext();
  const labels = {
    title: intl.formatMessage({ id: "pages.artgen.title" }),
    learnMore: intl.formatMessage({ id: "pages.landing.learnMore" }),
    generateContent: intl.formatMessage({ id: "pages.landing.generateContent" }),
    overlayText: intl.formatMessage({ id: "pages.landing.overlayText" }),
  };

  useTitle(labels.title);

  const navigate = useNavigate();

  useEffect(() => {
    if (!window.location.href.endsWith(ViewPaths.LandingPage)) {
      navigate(ViewPaths.LandingPage);
    }
  });

  return (
    <div id="landing-page">
      <ToastContainer />
      <TopBotSpacer />

      <div className="landing-page--content">
        <div className="landing-page--content--left">
          <div className="landing-page--content--left--motto">
            <div className="landing-page--content--left--motto--phrase">
              <span className="blue">{"Co"}</span>
              <span className="white">{"mprend"}</span>
              <span className="red">{"re"}</span>
            </div>
            <div className="landing-page--content--left--motto--phrase">
              <span className="blue">{"les chan"}</span>
              <span className="white">{"sons du"}</span>
              <span className="red">&nbsp;{"monde"}</span>
            </div>
            <div className="landing-page--content--left--motto--brand">
              <span>
                {"Genius traductions françaises "}
                {"Content Generator"}
              </span>
            </div>
          </div>

          <div className="landing-page--content--left--buttons">
            <ActionButton
              newTabLink
              onClick={() => window.open("https://github.com/Thomas-Fernandes/GTFR-CG")}
              label={labels.learnMore}
            />

            <ActionButton onClick={() => navigate(ViewPaths.Home)} label={labels.generateContent} />
          </div>
        </div>
        <div className="landing-page--content--right">
          <img src={imgPaths.Logo} alt="gtfr" />
          <ImgButton
            src={gifPaths.Landing}
            alt="video"
            onClick={() => window.open("https://www.youtube.com/@geniustraductionsfrancaises")}
            overlayText={labels.overlayText}
          />
        </div>
      </div>

      <TopBotSpacer />
    </div>
  );
};

export default LandingPage;
