import { ViewPaths } from "@/constants/paths";

export const DEFAULT_REDIRECTION = {
  error_text: "",
  redirect_to: ViewPaths.Home,
  plural: "s",
};

export enum RedirectParams {
  ErrorText = "error_text",
  RedirectTo = "redirect_to",
}