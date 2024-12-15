import { useRef, useState } from "react";

import { AutoResizeTextarea } from "@/components/AutoResizeTextarea/AutoResizeTextarea";
import { SpinnerId } from "@/constants/spinners";

import { useCardsGalleryContext, useCardsGenerationContext } from "./contexts";
import { handleSaveModal } from "./handlers";
import { handleMouseDown, handleMouseUp, handleOverlayClick } from "./mouse";

import "./CardEditModal.scss";

const CardEditModal = () => {
  const generationProps = useCardsGenerationContext();

  const { setIsModalOpen, currentCard, newLyrics, setNewLyrics, setCards } = useCardsGalleryContext();
  const cardIdPadding = (currentCard && currentCard.id < 10) ? "0" : "";

  const [isModalSaving, setIsModalSaving] = useState(false);

  const closeModal = () => { setIsModalOpen(false); setIsModalSaving(false); };

  // used to prevent the modal from closing when click&dragging from inside to outside the modal
  const isMouseDownRef = useRef(false);
  const clickedInsideModalRef = useRef(false);

  return (
    <div className="modal-overlay"
      onMouseDown={(e) => handleMouseDown(e, { isMouseDownRef, clickedInsideModalRef })}
      onMouseUp={() => handleMouseUp({ isMouseDownRef })}
      onClick={() => handleOverlayClick({ clickedInsideModalRef, closeModal })}
    >
      <div className="modal-overlay--content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-overlay--content--header">
          {`Edit Lyrics of Card ${cardIdPadding}${currentCard?.id}`}
        </h2>

        <AutoResizeTextarea disabled={isModalSaving}
          value={newLyrics} onChange={(e) => setNewLyrics(e.target.value)}
          className="!w-full"
        />
        {/* FIXME missing line width limit */}

        <div className="modal-overlay--content--actions flex-row gap-4">
          <button type="button" disabled={isModalSaving}
            onClick={() => currentCard && handleSaveModal(currentCard, isModalSaving,
              { generationProps, newLyrics, generateSingleCardProps: { currentCard, setCards, setIsModalSaving, closeModal } }
            )}
          >
            { isModalSaving ? "Saving..." : "Save" }
          </button>

          <div id={SpinnerId.CardsGenerateSingle} /> {/* Spinner for saving, in-between */}

          <button type="button" onClick={closeModal} disabled={isModalSaving}>
            {"Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardEditModal;
