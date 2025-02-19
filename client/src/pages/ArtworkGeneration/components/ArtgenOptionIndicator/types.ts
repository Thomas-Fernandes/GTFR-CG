export type ArtgenOptionIndicatorProps = Readonly<{
  direction: "prev" | "next";
  optionIdx: number;
  optionsLength: number;
  label: string;
}>;