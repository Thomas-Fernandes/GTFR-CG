import { forwardRef, useEffect, useRef } from "react";

import { AutoResizeTextareaProps } from "./types";

import "./AutoResizeTextarea.scss";

export const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>(({ value, className, ...props }, ref) => {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const combinedRef = ref || internalRef;

  useEffect(() => {
    const textarea = internalRef.current;

    if (textarea) {
      const resizeTextarea = () => {
        textarea.style.height = "auto";
        textarea.style.height = `${(textarea.scrollHeight + 4) / 16 + 1}rem`;
      };
      resizeTextarea();
      textarea.addEventListener("input", resizeTextarea);
      return () => {
        textarea.removeEventListener("input", resizeTextarea);
      };
    }
  }, [value]);

  return (
    <textarea
      ref={combinedRef}
      value={value}
      className={`lyrics-textarea ${className ?? ""}`}
      {...props}
    />
  );
});