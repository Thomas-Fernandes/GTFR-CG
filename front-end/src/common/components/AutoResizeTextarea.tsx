import { forwardRef, useEffect, useRef } from "react";

type AutoResizeTextareaProps = React.ComponentPropsWithoutRef<"textarea">;

export const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>((props, ref) => {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const combinedRef = ref || internalRef;

  useEffect(() => {
    const textarea = internalRef.current;

    if (textarea) {
      const resizeTextarea = () => {
        textarea.style.height = "auto";
        textarea.style.height = `calc(${textarea.scrollHeight}px + 4px)`;
      };
      resizeTextarea();
      textarea.addEventListener("input", resizeTextarea);
      return () => {
        textarea.removeEventListener("input", resizeTextarea);
      };
    }
  }, []);
  return <textarea ref={combinedRef} {...props} />;
});