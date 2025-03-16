import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useTitle } from "@/common/hooks/useTitle";
import TopBotSpacer from "@/components/TopBotSpacer/TopBotSpacer";
import { DEFAULT_EVENT_DURATION } from "@/constants/toasts";
import { useAppContext } from "@/contexts";

import { DEFAULT_REDIRECTION, RedirectParams } from "./constants";

import "./Redirect.scss";

const Redirect = () => {
  const { intl } = useAppContext();
  useTitle(intl.formatMessage({ id: "pages.redirect.title" }));

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

      <h1>{intl.formatMessage({ id: "pages.redirect.title" })}</h1>

      <div className="board">
        <h2 className="board--title">
          {intl.formatMessage({ id: "pages.redirect.header" })}
        </h2>

        <p className="board--err">
          { errorText.current }
        </p>

        <p className="board--counter">
          {`${intl.formatMessage({ id: "pages.redirect.counter.1" })} ${redirectTo.current} `
          + `${intl.formatMessage({ id: "pages.redirect.counter.2" })} ${countdown} `
          + `${intl.formatMessage({ id: "pages.redirect.counter.3" })}${plural}.`}
        </p>
      </div>

      <TopBotSpacer />
    </div>
  );
}

export default Redirect;