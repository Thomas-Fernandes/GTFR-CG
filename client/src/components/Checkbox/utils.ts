const variables = {
  "$secondary-1": "#ffffff",
  "$secondary-2": "#f4f4f4",
  "$secondary-3": "#c0c0c0",
  "$accent": "#8fbc8f",
  "$accent--75": "#6f9f6f",
  "$accent--50": "#4f7f4f",
}

export const getBackgroundColor = (disabled: boolean, checked: boolean, isDarkMode: boolean) => {
  if (disabled)
    return isDarkMode ? variables["$accent--50"] : variables["$accent--75"];

  const pickAccent = isDarkMode ? variables["$accent--75"] : variables["$accent"];
  return checked ? pickAccent : variables["$secondary-3"];
};

export const getBorder = (checked: boolean, isDarkMode: boolean) => {
  const pickAccent = isDarkMode ? variables["$accent--75"] : variables["$accent"];
  return `.1rem solid ${checked ? pickAccent : variables["$secondary-2"]}`;
};