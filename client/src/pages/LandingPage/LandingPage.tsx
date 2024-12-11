import { useNavigate } from "react-router-dom";

import { useTitle } from "@/common/hooks/useTitle";
import ActionButton from "@/components/ActionButton/ActionButton";
import DarkModeToggle from "@/components/DarkModeToggle/DarkModeToggle";
import ImgButton from "@/components/ImgButton/ImgButton";
import ToastContainer from "@/components/ToastContainer/ToastContainer";
import TopBotSpacer from "@/components/TopBotSpacer/TopBotSpacer";
import { Title } from "@/constants/browser";
import { ViewPaths } from "@/constants/paths";

import "./LandingPage.scss";

const LandingPage = (): JSX.Element => {
  useTitle(Title.Landing);

  const navigate = useNavigate();

  return (
    <div id="landing-page">
      <ToastContainer />
      <TopBotSpacer />

      <DarkModeToggle />

      <div className="landing-page--content">
          <div className="landing-page--content--left">
            <div className="landing-page--content--left--motto">
              <div className="landing-page--content--left--motto--phrase">
                <span className="blue">{"Co"}</span><span className="white">{"mprend"}</span><span className="red">{"re"}</span>
              </div>
              <div className="landing-page--content--left--motto--phrase">
                <span className="blue">{"les chan"}</span><span className="white">{"sons du"}</span><span className="red">&nbsp;{"monde"}</span>
              </div>
              <div className="landing-page--content--left--motto--brand">
                <span>{"Genius traductions françaises "}{"Content Generator"}</span>
              </div>
            </div>

            <div className="landing-page--content--left--buttons">
              <ActionButton
                onClick={() => window.open("https://github.com/Thomas-Fernandes/GTFR-CG")}
                label={"Learn More"}
              />
              <ActionButton
                onClick={() => navigate(ViewPaths.Home)}
                label={"Generate Content"}
              />
            </div>
          </div>
        <div className="landing-page--content--right">
          <img src="/img/logo-rd.png" alt="gtfr" />
          <ImgButton
            src="/gif/landing.gif" alt="video"
            onClick={() => window.open("https://www.youtube.com/@geniustraductionsfrancaises")}
            overlayText="Go to our YouTube channel" newTabLink
          />
        </div>
      </div>

      <TopBotSpacer />
    </div>
  );
};

export default LandingPage;