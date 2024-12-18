import { MouseEvent, RefObject } from "react";

export const handleMouseDown = (
  e: MouseEvent<HTMLDivElement>,
  props: { isMouseDownRef: RefObject<boolean>, clickedInsideModalRef: RefObject<boolean> }
) => {
  const { isMouseDownRef, clickedInsideModalRef } = props;
  isMouseDownRef.current = true;

  const modalContent = document.querySelector(".modal-overlay--content");
  clickedInsideModalRef.current = modalContent?.contains(e.target as Node) ?? false; // click inside modal?
};

export const handleMouseUp = (props: { isMouseDownRef: RefObject<boolean> }) => {
  const { isMouseDownRef } = props;
  isMouseDownRef.current = false;
};

export const handleOverlayClick = (props: { clickedInsideModalRef: RefObject<boolean>, closeModal: () => void }) => {
  const { clickedInsideModalRef, closeModal } = props;
  if (!clickedInsideModalRef.current)
    closeModal();
};