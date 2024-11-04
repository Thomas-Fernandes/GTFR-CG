
import { hideSpinner, showSpinner } from "@common/spinner";

import { SpinnerId } from "@constants/spinners";

import "./Home.css";

export const hideAllStatsSpinners = () => {
  hideSpinner(SpinnerId.StatsFirstOperation);
  hideSpinner(SpinnerId.StatsLastOperation);
  hideSpinner(SpinnerId.StatsArtworkGenerations);
  hideSpinner(SpinnerId.StatsLyricsFetches);
};

export const showAllStatsSpinners = () => {
  showSpinner(SpinnerId.StatsFirstOperation);
  showSpinner(SpinnerId.StatsLastOperation);
  showSpinner(SpinnerId.StatsArtworkGenerations);
  showSpinner(SpinnerId.StatsLyricsFetches);
};