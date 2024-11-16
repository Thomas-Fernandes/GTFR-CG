import { MutableRefObject } from "react";

export const handleMouseDown = (
  e: React.MouseEvent<HTMLDivElement>,
  props: { isMouseDownRef: MutableRefObject<boolean>, clickedInsideModalRef: MutableRefObject<boolean> }
) => {
  const { isMouseDownRef, clickedInsideModalRef } = props;
  isMouseDownRef.current = true;

  const modalContent = document.querySelector('.modal-content');
  clickedInsideModalRef.current = modalContent?.contains(e.target as Node) ?? false; // click inside modal?
};

export const handleMouseUp = (props: { isMouseDownRef: MutableRefObject<boolean> }) => {
  const { isMouseDownRef } = props;
  isMouseDownRef.current = false;
};

export const handleOverlayClick = (props: { clickedInsideModalRef: MutableRefObject<boolean>, closeModal: () => void }) => {
  const { clickedInsideModalRef, closeModal } = props;
  if (!clickedInsideModalRef.current)
    closeModal();
};