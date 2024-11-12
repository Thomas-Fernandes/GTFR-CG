import { useEffect, useRef } from "react";

import { Title } from "@/constants/browser";

type TitleType = `${Title}`;

export const useTitle = (title: TitleType) => {
  const documentIsDefined = document !== undefined;
  const originalTitle = useRef(documentIsDefined ? document.title : null);

  useEffect(() => {
    if (!documentIsDefined)
      return;

    const currentTitle = originalTitle?.current ?? "";

    if (document.title !== title)
      document.title = Title.Prefix + title;

    return () => {
      document.title = currentTitle;
    };
  }, [documentIsDefined, title]);
};