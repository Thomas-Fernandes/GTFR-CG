import { useState, useTransition } from "react";

import ActionButton from "@/components/ActionButton/ActionButton";
import Selector from "@/components/Selector/Selector";
import { SpinnerId } from "@/constants/spinners";

import { ITUNES_REGION_OPTIONS } from "./constants";
import { handleChangeTerm, handleSubmitItunesSearch } from "./handlers";
import { ItunesFormProps } from "./types";

import "./ItunesForm.scss";

const ItunesForm: React.FC<ItunesFormProps> = ({ setItunesResults }) => {
  const [term, setTerm] = useState("");
  const [country, setCountry] = useState(ITUNES_REGION_OPTIONS[0].value);
  const [, startItunesSearch] = useTransition();

  return (
    <form id="itunes"
      onSubmit={(e) => handleSubmitItunesSearch(e, { term, country }, { setItunesResults })}
    >
      <input type="text" placeholder={"Search on iTunes"} className="itunes--text"
        onChange={(e) => handleChangeTerm(e.target.value, country, { term, setTerm, startItunesSearch, setItunesResults })}
      />
      <div id={SpinnerId.ItunesSearch} className="itunes--search">
        <Selector aria-label={"country"} defaultValue={ITUNES_REGION_OPTIONS[0].value}
          setter={setCountry} options={ITUNES_REGION_OPTIONS}
        />
        <ActionButton type="submit" label="SEARCH" className="spaced" />
      </div>
    </form>
  );
};

export default ItunesForm;