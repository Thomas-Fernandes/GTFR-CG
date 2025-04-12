import { ReactNode } from "react";

export interface LocaleChangeRequest {
  locale: string;
}

export interface LocaleContextProviderProps {
  children: ReactNode;
}
