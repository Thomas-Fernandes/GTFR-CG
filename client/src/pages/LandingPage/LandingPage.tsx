import { JSX } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "@/common/hooks/useTitle";
import DarkModeToggle from "@/components/DarkModeToggle/DarkModeToggle";
import ToastContainer from "@/components/ToastContainer/ToastContainer";
import TopBotSpacer from "@/components/TopBotSpacer/TopBotSpacer";
import { Title } from "@/constants/browser";
import { ViewPaths } from "@/constants/paths";

import ActionButton from "@/components/ActionButton/ActionButton";
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
          <div className="landing-page--content--left--content">
            <div className="landing-page--content--left--content--motto">
              <div className="landing-page--content--left--content--motto--phrase">
                <span className="blue">{"Co"}</span><span className="white">{"mprend"}</span><span className="red">{"re"}</span>
              </div>
              <div className="landing-page--content--left--content--motto--phrase">
                <span className="blue">{"les chan"}</span><span className="white">{"sons du"}</span><span className="red">&nbsp;{"monde"}</span>
              </div>
              <div className="landing-page--content--left--content--motto--brand">
                <span>{"Genius traductions françaises Content Generator"}</span>
              </div>
            </div>

            <div className="landing-page--content--left--content--buttons">
              <ActionButton
                onClick={() => window.location.href = "https://github.com/Thomas-Fernandes/GTFR-CG"}
                label={"Learn More"}
              />
              <ActionButton
                onClick={() => navigate(ViewPaths.Home)}
                label={"Generate Content"}
              />
            </div>
          </div>
        </div>
        <div className="landing-page--content--right">
          <img src="/img/logo-rd.png" alt="gtfr" />
          <img src="/gif/landing.gif" alt="video" />
        </div>
      </div>

      <TopBotSpacer />
    </div>
  );
};

export default LandingPage;