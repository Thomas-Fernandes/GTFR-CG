import { JSX, useState, useTransition } from "react";

import { SPINNER_ID } from "@constants/spinners";

import { handleChangeTerm, handleSubmitItunesSearch } from "./handlers";
import { ItunesFormProps } from "./types";

import "./ItunesForm.css";

const ItunesForm: React.FC<ItunesFormProps> = ({ setItunesResults }): JSX.Element => {
  const [term, setTerm] = useState("");
  const [country, setCountry] = useState("fr");
  const [, startItunesSearch] = useTransition();

  return (
    <form id="itunes" onSubmit={(e) => handleSubmitItunesSearch(e, { term, country }, { setItunesResults })}>
      <div className="flexbox">
        <input id="itunes-text" type="text" placeholder="Search on iTunes"
          onChange={(e) => handleChangeTerm(e.target.value, country, { term, setTerm, startItunesSearch, setItunesResults })}
        />
        <div id={SPINNER_ID.ITUNES} className="itunes-search">
          <select aria-label="Country"
            defaultValue="fr" onChange={(e) => setCountry(e.target.value)}
          >
            <option value="fr">{"France"}</option>
            <option value="us">{"United States"}</option>
            <option value="nz">{"New Zealand"}</option>
          </select>
          <input type="submit" value="SEARCH" className="action-button" />
        </div>
      </div>
    </form>
  );
};

export default ItunesForm;