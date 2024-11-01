
import { hideSpinner, showSpinner } from "@common/Spinner";

import { SPINNER_ID } from "@constants/Spinner";

import "./Home.css";

export const hideAllStatsSpinners = () => {
  hideSpinner(SPINNER_ID.STATISTICS_FIRST_OPERATION);
  hideSpinner(SPINNER_ID.STATISTICS_LAST_OPERATION);
  hideSpinner(SPINNER_ID.STATISTICS_ARTWORK_GENERATION);
  hideSpinner(SPINNER_ID.STATISTICS_LYRICS_FETCHES);
};

export const showAllStatsSpinners = () => {
  showSpinner(SPINNER_ID.STATISTICS_FIRST_OPERATION);
  showSpinner(SPINNER_ID.STATISTICS_LAST_OPERATION);
  showSpinner(SPINNER_ID.STATISTICS_ARTWORK_GENERATION);
  showSpinner(SPINNER_ID.STATISTICS_LYRICS_FETCHES);
};