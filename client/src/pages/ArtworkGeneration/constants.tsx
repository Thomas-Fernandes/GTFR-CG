import { Option } from "@/components/SelectPopover/types";

import FileUploadForm from "./FileUploadForm";
import ItunesForm from "./ItunesForm";
import ItunesResults from "./ItunesResults";
import { ArtworkGenerationOption, GenerationOptionState } from "./types";
import YoutubeForm from "./YoutubeForm";

export const REGEX_YOUTUBE_URL = [
  /https?:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}/,
  /https?:\/\/youtu\.be\/[a-zA-Z0-9_-]{11}/,
];

export enum AutomaticSearchTriggers {
  Length = 7,
  LengthWithoutTerm = 5,
  Space = " ",
}

export enum ArtworkResultProps {
  MaxTitleLength = 42,
  MaxCropLength = 12,
}

export const ITUNES_REGION_OPTIONS: Option[] = [
  { label: "France", value: "fr" },
  { label: "United States", value: "us" },
  { label: "New Zealand", value: "nz" },
];

const ARTWORK_GENERATION_OPTION_PARENT_CLASS = "artwork-generation--options";
export const ARTWORK_GENERATION_OPTIONS: ArtworkGenerationOption[] = [
  { h1: "Search for cover artwork on iTunes", className: `${ARTWORK_GENERATION_OPTION_PARENT_CLASS}--itunes`,
    content: (itunesResults, setItunesResults) => {
      return (
        <>
          <h1>
            {"Search for cover artwork on iTunes"}
          </h1>

          <ItunesForm setItunesResults={setItunesResults ?? (() => {})} />

          <ItunesResults items={itunesResults ?? []} setItunesResults={setItunesResults ?? (() => {})} />
        </>
      );
    }
  },
  { h1: "Upload your image", className: `${ARTWORK_GENERATION_OPTION_PARENT_CLASS}--local`,
    content: () => {
      return (
        <>
          <h1>
            {"Upload your image"}
          </h1>

          <FileUploadForm />
        </>
      );
    }
  },
  { h1: "Use a YouTube video thumbnail", className: `${ARTWORK_GENERATION_OPTION_PARENT_CLASS}--youtube`,
    content: () => {
      return (
        <>
          <h1>
            {"Use a YouTube video thumbnail"}
          </h1>

          <YoutubeForm />
        </>
      );
    }
  }
];

export const DEFAULT_GENERATION_OPTION_STATE: GenerationOptionState = {
  current: 0,
  prevLabel: "",
  nextLabel: "",
}