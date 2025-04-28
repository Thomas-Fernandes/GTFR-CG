import { useAppContext } from "@/contexts";

import { DescriptionGenerationFormProps } from "./types";

const Description = ({ content }: DescriptionGenerationFormProps) => {
  const { intl } = useAppContext();
  const labels = {};

  return <div id="description-generation"></div>;
};

export default Description;
