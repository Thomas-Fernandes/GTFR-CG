import { useState, useTransition } from "react";

import ActionButton from "@/components/ActionButton/ActionButton";
import SelectPopover from "@/components/SelectPopover/SelectPopover";
import { SpinnerId } from "@/constants/spinners";

import { ITUNES_REGION_OPTIONS } from "./constants";
import { handleChangeTerm, handleSubmitItunesSearch } from "./handlers";
import { ItunesFormProps } from "./types";

import "./ItunesForm.scss";

const ItunesForm: React.FC<ItunesFormProps> = ({ setItunesResults }) => {
  const [term, setTerm] = useState("");
  const [country, setCountry] = useState(ITUNES_REGION_OPTIONS[0].value);
  const [_, startItunesSearch] = useTransition();

  return (
    <form id="itunes"
      onSubmit={(e) => handleSubmitItunesSearch(e, { term, country }, { setItunesResults })}
    >
      <label htmlFor="itunes--text" className="hidden">{"Search on iTunes"}</label>
      <input type="text" placeholder={"Search on iTunes"} className="itunes--text" id="itunes--text"
        onChange={(e) => handleChangeTerm(e.target.value, country, { term, setTerm, startItunesSearch, setItunesResults })}
      />

      <label htmlFor={SpinnerId.ItunesSearch} className="hidden">{"Search button"}</label>
      <div id={SpinnerId.ItunesSearch} className="itunes--search">
        <SelectPopover aria-label={"country"}
          label={country ? `country: ${country.toUpperCase()}` : "Select an option"}
          options={ITUNES_REGION_OPTIONS}
          onSelect={setCountry}
        />
        <ActionButton type="submit" label="SEARCH" className="spaced" />
      </div>
    </form>
  );
};

export default ItunesForm;