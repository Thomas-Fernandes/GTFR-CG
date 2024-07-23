import { useEffect, useRef } from "react";

import { TITLE } from "./Constants";

const useTitle = (title: string) => {
  const documentIsDefined = document !== undefined;
  const originalTitle = useRef(documentIsDefined ? document.title : null);

  useEffect(() => {
    if (!documentIsDefined) return;

    const currentTitle = originalTitle.current ?? "";

    if (document.title !== title) document.title = TITLE.PREFIX + title;

    return () => {
      document.title = currentTitle;
    };
  }, [documentIsDefined, title]);
};

export default useTitle;