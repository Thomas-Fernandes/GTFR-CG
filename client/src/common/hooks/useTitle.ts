import { useEffect, useRef } from "react";

import { Title } from "@/constants/browser";

export const useTitle = (title: string) => {
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