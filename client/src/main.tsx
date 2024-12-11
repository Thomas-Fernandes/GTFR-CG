import { StrictMode } from "react"
import ReactDOM from "react-dom/client"

import { DarkModeProvider } from "@/components/DarkModeProvider/DarkModeProvider"

import App from "./App"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DarkModeProvider>
      <div className="rotate-zoom" />
      <div className="custom-background" />
      <App />
    </DarkModeProvider>
  </StrictMode>
)
