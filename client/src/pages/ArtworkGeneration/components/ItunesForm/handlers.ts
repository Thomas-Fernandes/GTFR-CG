import { FormEvent } from "react";

import { AutomaticSearchTriggers } from "./constants";
import { postItunesSearch } from "./requests";
import { HandleChangeTermProps, HandleSubmitItunesSearchProps, ItunesRequest } from "./types";

export const handleSubmitItunesSearch = (
  e: FormEvent<HTMLFormElement> | undefined,
  body: ItunesRequest,
  props: HandleSubmitItunesSearchProps
) => {
  const { setIsSearching, setItunesResults } = props;

  e?.preventDefault();

  postItunesSearch(body, { setIsSearching, setItunesResults });
};

export const handleChangeTerm = (value: string, country: string, props: HandleChangeTermProps) => {
  const { term, setTerm, startItunesSearch, setIsSearching, setItunesResults } = props;

  const willMakeSearch =
    value &&
    (value.length > AutomaticSearchTriggers.Length ||
      (value.length > AutomaticSearchTriggers.LengthWithoutTerm &&
        (value.includes(AutomaticSearchTriggers.Space) ||
          (!term.length && value.length > AutomaticSearchTriggers.LengthWithoutTerm))));

  setTerm(value);

  if (willMakeSearch)
    startItunesSearch(() => {
      handleSubmitItunesSearch(undefined, { term: value, country }, { setIsSearching, setItunesResults });
    });
};
