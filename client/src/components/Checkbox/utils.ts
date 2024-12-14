const variables = {
  "$secondary-1": "#ffffff",
  "$secondary-2": "#f4f4f4",
  "$secondary-3": "#c0c0c0",
  "$accent": "#8fbc8f",
  "$accent--75": "#6f9f6f",
  "$accent--50": "#4f7f4f",
}

export const getBackgroundColor = (disabled: boolean, checked: boolean, isDarkMode: boolean) => {
  if (disabled) return variables["$accent--75"];
  return checked ? variables["$accent"] : variables["$secondary-1"];
};

export const getBorder = (checked: boolean, isDarkMode: boolean) => {
  return `.1rem solid ${checked ? variables["$accent"] : variables["$secondary-2"]}`;
};