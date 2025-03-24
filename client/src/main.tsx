import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { DarkModeProvider } from "@/components/DarkModeProvider/DarkModeProvider";
import { LocaleProvider } from "@/components/LocaleProvider/LocaleProvider";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocaleProvider>
      <DarkModeProvider>
        <App />
      </DarkModeProvider>
    </LocaleProvider>
  </StrictMode>
);