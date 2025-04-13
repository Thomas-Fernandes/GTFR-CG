const scss = {
  "$secondary-1": "#ffffff",
  "$secondary-2": "#f4f4f4",
  "$secondary-3": "#c0c0c0",
  $accent: "#8fbc8f",
  "$accent--75": "#6f9f6f",
  "$accent--50": "#4f7f4f",
};

export const getBackgroundColor = (disabled: boolean, checked: boolean, isDarkMode: boolean) => {
  if (disabled) {
    return isDarkMode ? scss["$accent--50"] : scss["$accent--75"];
  }

  const pickAccent = isDarkMode ? scss["$accent--75"] : scss["$accent"];
  return checked ? pickAccent : scss["$secondary-3"];
};

export const getBorder = (checked: boolean, isDarkMode: boolean) => {
  const pickAccent = isDarkMode ? scss["$accent--75"] : scss["$accent"];
  return `.1rem solid ${checked ? pickAccent : scss["$secondary-2"]}`;
};
