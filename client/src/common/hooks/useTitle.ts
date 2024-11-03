import { useEffect, useRef } from "react";

import { TITLE } from "@constants/browser";

type TitleType = `${TITLE}`;

export const useTitle = (title: TitleType) => {
  const documentIsDefined = document !== undefined;
  const originalTitle = useRef(documentIsDefined ? document.title : null);

  useEffect(() => {
    if (!documentIsDefined)
      return;

    const currentTitle = originalTitle?.current ?? "";

    if (document.title !== title)
      document.title = TITLE.PREFIX + title;

    return () => {
      document.title = currentTitle;
    };
  }, [documentIsDefined, title]);
};