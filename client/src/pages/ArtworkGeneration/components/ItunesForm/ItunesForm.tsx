import { useState, useTransition } from "react";

import ButtonWithSpinner from "@/components/ButtonWithSpinner/ButtonWithSpinner";
import SelectPopover from "@/components/SelectPopover/SelectPopover";
import { SpinnerId } from "@/constants/spinners";
import { useAppContext } from "@/contexts";
import { useArtworkGenerationContext } from "@/pages/ArtworkGeneration/contexts";

import { ITUNES_REGION_OPTIONS } from "./constants";
import { handleChangeTerm, handleSubmitItunesSearch } from "./handlers";
import { ItunesFormProps } from "./types";

import "./ItunesForm.scss";

const ItunesForm = ({ setItunesResults }: ItunesFormProps) => {
  const { intl } = useAppContext();
  const labels = {
    inputPlaceholder: intl.formatMessage({ id: "pages.artgen.itunes.inputPlaceholder" }),
    localeTitle: intl.formatMessage({ id: "pages.artgen.itunes.localeTitle" }),
    locale: intl.formatMessage({ id: "pages.artgen.itunes.locale" }),
    submit: intl.formatMessage({ id: "pages.artgen.itunes.submit" }),
  };
  const { isSearching, setIsSearching } = useArtworkGenerationContext();

  const [term, setTerm] = useState("");
  const [country, setCountry] = useState(ITUNES_REGION_OPTIONS[0].value);
  const [_, startItunesSearch] = useTransition();

  return (
    <form
      id="itunes"
      onSubmit={(e) => handleSubmitItunesSearch(e, { term, country }, { setIsSearching, setItunesResults })}
    >
      <label htmlFor="itunes--text" className="hidden">
        {labels.inputPlaceholder}
      </label>
      <input
        type="text"
        id="itunes--text"
        placeholder={labels.inputPlaceholder}
        onChange={(e) =>
          handleChangeTerm(e.target.value, country, {
            term,
            setTerm,
            startItunesSearch,
            setIsSearching,
            setItunesResults,
          })
        }
        className="itunes--text"
      />

      <label htmlFor={SpinnerId.ItunesSearch} className="hidden">
        {labels.submit}
      </label>
      <div className="itunes--search">
        <SelectPopover
          aria-label={"country"}
          title={labels.localeTitle}
          label={`${labels.locale}: ${country?.toUpperCase()}`}
          options={ITUNES_REGION_OPTIONS}
          onSelect={setCountry}
        />
        <ButtonWithSpinner id={SpinnerId.ItunesSearch} label={labels.submit} isBusy={isSearching} />
      </div>
    </form>
  );
};

export default ItunesForm;
