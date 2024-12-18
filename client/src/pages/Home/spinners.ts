
import { hideSpinner, showSpinner } from "@/common/spinner";

import { SpinnerId } from "@/constants/spinners";

const allStatsSpinnerIds = Object.values(SpinnerId)
  .filter((id) => id.startsWith("home_stat"));

export const hideAllStatsSpinners = () => {
  allStatsSpinnerIds.forEach((id) => {
    hideSpinner(id);
  });
};

export const showAllStatsSpinners = () => {
  allStatsSpinnerIds.forEach((id) => {
    showSpinner(id);
  });
};