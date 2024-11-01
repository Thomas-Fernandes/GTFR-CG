import { JSX, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import useTitle from "@/common/useTitle";

import { TITLE } from "@constants/Common";
import { DEFAULT_REDIRECTION } from "@constants/Redirection";
import { DEFAULT_EVENT_DURATION } from "@constants/Toast";

import "./Redirect.css";

const Redirect = (): JSX.Element => {
  useTitle(TITLE.LYRICS);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const redirectTo = useRef(searchParams.get("redirect_to") ?? DEFAULT_REDIRECTION.redirect_to);
  const errorText = useRef(searchParams.get("error_text") ?? DEFAULT_REDIRECTION.error_text);
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
      <span className="top-bot-spacer" />

      <h1>Redirection page</h1>

      <div className="board">
        <h3 className="title">You are being redirected after an error was met...</h3>
        <p className="err">{ errorText.current }</p>
        <p className="counter">
          You will be redirected to&nbsp;{redirectTo.current}&nbsp;in&nbsp;{countdown}&nbsp;second{plural}.
        </p>
      </div>

      <span className="top-bot-spacer" />
    </div>
  );
}

export default Redirect;