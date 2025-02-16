import { useState, useTransition } from "react";

import ActionButton from "@/components/ActionButton/ActionButton";
import SelectPopover from "@/components/SelectPopover/SelectPopover";
import { SpinnerId } from "@/constants/spinners";
import { useAppContext } from "@/contexts";

import { ITUNES_REGION_OPTIONS } from "./constants";
import { handleChangeTerm, handleSubmitItunesSearch } from "./handlers";
import { ItunesFormProps } from "./types";

import "./ItunesForm.scss";

const ItunesForm: React.FC<ItunesFormProps> = ({ setItunesResults }) => {
  const { intl } = useAppContext();
  const labels = {
    inputPlaceholder: intl.formatMessage({ id: "pages.artgen.itunes.inputPlaceholder" }),
    localeTitle: intl.formatMessage({ id: "pages.artgen.itunes.localeTitle" }),
    locale: intl.formatMessage({ id: "pages.artgen.itunes.locale" }),
    submit: intl.formatMessage({ id: "pages.artgen.itunes.submit" }),
  }

  const [term, setTerm] = useState("");
  const [country, setCountry] = useState(ITUNES_REGION_OPTIONS[0].value);
  const [_, startItunesSearch] = useTransition();

  return (
    <form id="itunes"
      onSubmit={(e) => handleSubmitItunesSearch(e, { term, country }, { setItunesResults })}
    >
      <label htmlFor="itunes--text" className="hidden">{labels.inputPlaceholder}</label>
      <input type="text" placeholder={labels.inputPlaceholder} className="itunes--text" id="itunes--text"
        onChange={
          (e) => handleChangeTerm(e.target.value, country, { term, setTerm, startItunesSearch, setItunesResults })
        }
      />

      <label htmlFor={SpinnerId.ItunesSearch} className="hidden">{labels.submit}</label>
      <div id={SpinnerId.ItunesSearch} className="itunes--search">
        <SelectPopover aria-label={"country"} title={labels.localeTitle}
          label={`${labels.locale}: ${country?.toUpperCase()}`}
          options={ITUNES_REGION_OPTIONS}
          onSelect={setCountry}
        />
        <ActionButton type="submit" label={labels.submit} className="spaced" />
      </div>
    </form>
  );
};

export default ItunesForm;