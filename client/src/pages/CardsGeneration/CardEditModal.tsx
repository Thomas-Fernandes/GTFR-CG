import { useRef, useState } from "react";

import { AutoResizeTextarea } from "@components/AutoResizeTextarea/AutoResizeTextarea";

import { SpinnerId } from "@constants/spinners";

import { useCardsGalleryContext, useCardsGenerationContext } from "./contexts";
import { handleSaveModal } from "./handlers";
import { handleMouseDown, handleMouseUp, handleOverlayClick } from "./mouse";

import "./CardEditModal.css";

const CardEditModal = (): JSX.Element => {
  const generationProps = useCardsGenerationContext();

  const { setIsModalOpen, currentCard, newLyrics, setNewLyrics, setCards } = useCardsGalleryContext();
  const cardIdPadding = (currentCard && currentCard.id < 10) ? "0" : "";

  const [isModalSaving, setIsModalSaving] = useState(false);

  const closeModal = () => { setIsModalOpen(false); setIsModalSaving(false); };

  // used to prevent the modal from closing when click&dragging from inside to outside the modal
  const isMouseDownRef = useRef(false);
  const clickedInsideModalRef = useRef(false);

  return (
    <div className="modal-overlay flexbox"
      onMouseDown={(e) => handleMouseDown(e, { isMouseDownRef, clickedInsideModalRef })}
      onMouseUp={() => handleMouseUp({ isMouseDownRef })}
      onClick={() => handleOverlayClick({ clickedInsideModalRef, closeModal })}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="mv-0">
          {`Edit Lyrics of Card ${cardIdPadding}${currentCard?.id}`}
        </h3>

        <AutoResizeTextarea title={"card-edit"} disabled={isModalSaving}
          value={newLyrics} onChange={(e) => setNewLyrics(e.target.value)}
          className="w-100"
        />

        <div className="modal-actions flex-row g-1">
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
