import React, { useState, useEffect } from "react";
import { defaultContext } from "../../utils/Constants";
import { Context } from "../../utils/Types";

import "./Redirect.css";
import { isEmpty } from "../../utils/ObjUtils";

const Redirect = (passedContext?: Context): React.JSX.Element => {
  const context = !isEmpty(passedContext) ? passedContext : defaultContext;
  const [countdown, setCountdown] = useState(5);
  const [plural, setPlural] = useState("s");

  useEffect(() => {
    let secondsBeforeRedirect = countdown;

    const countdownInterval = setInterval(() => {
      secondsBeforeRedirect -= 1;
      setCountdown(secondsBeforeRedirect);
      setPlural(secondsBeforeRedirect < 2 ? "" : "s");

      if (secondsBeforeRedirect <= 0) {
        clearInterval(countdownInterval);
        window.location.href = context?.redirect_to ?? "/";
      }
    }, 1000);
  }, [context, countdown]);

  return (
    <>
      <span className="top-bot-spacer"></span>
      <h1>Redirection page</h1>
      <div className="board">
        <h3 className="title">You are being redirected after an error was met...</h3>
        <p className="err">{ context?.error_text }</p>
        <p className="counter">
          You will be redirected to&nbsp;<span id="direction">{ context?.redirect_to }</span>&nbsp;in&nbsp;<span id="countdown">{ countdown }</span>&nbsp;second<span id="plural">{ plural }</span>.
        </p>
      </div>
      <span className="top-bot-spacer"></span>
    </>
  );
}

export default Redirect;