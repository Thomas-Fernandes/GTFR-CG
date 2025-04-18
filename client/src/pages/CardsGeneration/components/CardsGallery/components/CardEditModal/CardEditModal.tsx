import { useRef, useState } from "react";

import { AutoResizeTextarea } from "@/components/AutoResizeTextarea/AutoResizeTextarea";
import { SpinnerId } from "@/constants/spinners";
import { useAppContext } from "@/contexts";
import { useCardsGalleryContext, useCardsGenerationContext } from "@/pages/CardsGeneration/contexts";

import { handleSaveModal } from "./handlers";
import { handleMouseDown, handleMouseUp, handleOverlayClick } from "./mouse";

import "./CardEditModal.scss";

const CardEditModal = () => {
  const { intl } = useAppContext();
  const labels = {
    header: intl.formatMessage({ id: "pages.cardgen.modal.header" }),
    save: intl.formatMessage({ id: "pages.cardgen.modal.save" }),
    saving: intl.formatMessage({ id: "pages.cardgen.modal.saving" }),
    cancel: intl.formatMessage({ id: "pages.cardgen.modal.cancel" }),
  };

  const generationProps = useCardsGenerationContext();

  const { setIsModalOpen, currentCard, newLyrics, setNewLyrics, setCards } = useCardsGalleryContext();
  const cardIdPadding = currentCard && currentCard.id < 10 ? "0" : "";

  const [isModalSaving, setIsModalSaving] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setIsModalSaving(false);
  };

  // used to prevent the modal from closing when click&dragging from inside to outside the modal
  const isMouseDownRef = useRef(false);
  const clickedInsideModalRef = useRef(false);

  return (
    <div
      onMouseDown={(e) => handleMouseDown(e, { isMouseDownRef, clickedInsideModalRef })}
      onMouseUp={() => handleMouseUp({ isMouseDownRef })}
      onClick={() => handleOverlayClick({ clickedInsideModalRef, closeModal })}
      className="modal-overlay"
    >
      <div onClick={(e) => e.stopPropagation()} className="modal-overlay--content">
        <h2 className="modal-overlay--content--header">{`${labels.header} ${cardIdPadding}${currentCard?.id}`}</h2>

        <AutoResizeTextarea
          disabled={isModalSaving}
          value={newLyrics}
          onChange={(e) => setNewLyrics(e.target.value)}
          className="!w-full"
        />

        <div className="modal-overlay--content--actions flex-row gap-4">
          <button
            type="button"
            disabled={isModalSaving}
            onClick={() =>
              currentCard &&
              handleSaveModal(currentCard, isModalSaving, {
                generationProps,
                newLyrics,
                generateSingleCardProps: { currentCard, setCards, setIsModalSaving, closeModal },
              })
            }
          >
            {isModalSaving ? labels.saving : labels.save}
          </button>
          <div id={SpinnerId.CardsGenerateSingle} /> {/* Spinner for saving, in-between */}
          <button type="button" onClick={closeModal} disabled={isModalSaving}>
            {labels.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardEditModal;
