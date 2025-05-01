import { FormEvent } from "react";

import { SongPageSearchSubmitProps } from "./types";

export const handleSongPageSearchSubmit = (
  e: FormEvent<HTMLFormElement>,
  body: { artist: string; songName: string },
  props: SongPageSearchSubmitProps
) => {
  e.preventDefault();
  const { isGenerating, setIsGenerating, setFoundPage } = props;
  const { artist, songName } = body;
  if (isGenerating) return;

  if (artist.trim() === "" || songName.trim() === "") {
    setFoundPage("Please fill in all fields.");
    return;
  }
  setIsGenerating(true);
  setFoundPage("Generating description...");
  // Simulate an API call
  setTimeout(() => {
    setIsGenerating(false);
    setFoundPage("Description generated successfully!");
  }, 2000);
};
