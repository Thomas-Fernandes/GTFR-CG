import { useMemo } from "react";
import { useIntl } from "react-intl";
import { BrowserRouter as Router } from "react-router-dom";

import AppBackground from "@/components/AppBackground/AppBackground";

import { getLocalizedToasts } from "./common/utils/toastUtils";
import { AppContext, setToasts } from "./contexts";
import AppRoutes from "./Router";

import "./App.scss";

const App = () => {
  const intl = useIntl();
  const toasts = getLocalizedToasts(intl);
  setToasts(toasts);

  const contextValue = useMemo(() => ({ intl }), [intl]);

  return (
    <Router>
      <AppContext.Provider value={contextValue}>
        <AppBackground />
        <AppRoutes />
      </AppContext.Provider>
    </Router>
  );
};

export default App;
