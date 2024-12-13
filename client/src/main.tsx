import { StrictMode } from "react"
import ReactDOM from "react-dom/client"

import { DarkModeProvider } from "@/components/DarkModeProvider/DarkModeProvider"

import App from "./App"
import AppBackground from "./components/AppBackground/AppBackground"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DarkModeProvider>
      <AppBackground />
      <App />
    </DarkModeProvider>
  </StrictMode>
)
