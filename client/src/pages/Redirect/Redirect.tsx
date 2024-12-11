import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useTitle } from "@/common/hooks/useTitle";

import TopBotSpacer from "@/components/TopBotSpacer/TopBotSpacer";

import { Title } from "@/constants/browser";
import { DEFAULT_EVENT_DURATION } from "@/constants/toasts";

import { DEFAULT_REDIRECTION, RedirectParams } from "./constants";

import "./Redirect.scss";

const Redirect = (): JSX.Element => {
  useTitle(Title.Lyrics);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const redirectTo = useRef(searchParams.get(RedirectParams.RedirectTo) ?? DEFAULT_REDIRECTION.redirect_to);
  const errorText = useRef(searchParams.get(RedirectParams.ErrorText) ?? DEFAULT_REDIRECTION.error_text);
  const [countdown, setCountdown] = useState(DEFAULT_EVENT_DURATION.SECONDS_TOAST);
  const [plural, setPlural] = useState(DEFAULT_REDIRECTION.plural);

  useEffect(() => {
    let secondsBeforeRedirect = countdown;

    const countdownInterval = setInterval(() => {
      secondsBeforeRedirect -= 1;
      setCountdown(secondsBeforeRedirect);
      setPlural(secondsBeforeRedirect < 2 ? "" : "s");

      if (secondsBeforeRedirect <= 0) {
        clearInterval(countdownInterval);
        navigate(redirectTo.current ?? "/");
      }
    }, 1000);
  }, [countdown, navigate, redirectTo]);

  return (
    <div id="redirect">
      <TopBotSpacer />

      <h1>{Title.Redirect}</h1>

      <div className="board">
        <h3 className="board--title">
          {"You are being redirected after an error was met..."}
        </h3>

        <p className="board--err">
          { errorText.current }
        </p>

        <p className="board--counter">
          {`You will be redirected to ${redirectTo.current} in ${countdown} second${plural}.`}
        </p>
      </div>

      <TopBotSpacer />
    </div>
  );
}

export default Redirect;