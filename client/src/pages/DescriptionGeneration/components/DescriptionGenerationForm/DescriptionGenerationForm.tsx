import { useAppContext } from "@/contexts";

import { DescriptionGenerationFormProps } from "./types";

const DescriptionGenerationForm = ({ meta }: DescriptionGenerationFormProps) => {
  const { intl } = useAppContext();
  const labels = {};

  return <form></form>;
};

export default DescriptionGenerationForm;
