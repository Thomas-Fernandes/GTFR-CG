import React, { useRef, useState } from "react";

import { SPINNER_ID } from "@constants/spinners";

import { AutoResizeTextarea } from "@components/AutoResizeTextarea/AutoResizeTextarea";

import { useCardsGalleryContext } from "./contexts";
import { handleSaveModal } from "./handlers";
import { handleOverlayClick } from "./mouse";
import { CardEditModalProps } from "./types";

import "./CardEditModal.css";

const CardEditModal: React.FC<CardEditModalProps> = ({ generationProps }): JSX.Element => {
  const { setIsModalOpen, currentCard, newLyrics, setNewLyrics, setCards } = useCardsGalleryContext();
  const cardIdPadding = currentCard && currentCard.id < 10 ? "0" : "";

  const [isModalSaving, setIsModalSaving] = useState(false);

  const closeModal = () => { setIsModalOpen(false); setIsModalSaving(false); };

  const clickedInsideModalRef = useRef(false);

  return (
    <div className="modal-overlay flexbox" onClick={() => handleOverlayClick({ clickedInsideModalRef, closeModal })}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="mv-0">
          {`Edit Lyrics of Card ${cardIdPadding}${currentCard?.id}`}
        </h3>

        <AutoResizeTextarea title={"card-edit"} disabled={isModalSaving}
          value={newLyrics} onChange={(e) => setNewLyrics(e.target.value)}
          style={{ width: "100%" }}
        />

        <div className="modal-actions flex-row g-1">
          <button type="button" disabled={isModalSaving}
            onClick={() => currentCard && handleSaveModal(currentCard, isModalSaving,
              { generationProps, newLyrics, generateSingleCardProps: { currentCard, setCards, setIsModalSaving, closeModal } }
            )}
          >
            {isModalSaving ? "Saving..." : "Save"}
          </button>

          <div id={SPINNER_ID.CARDS_GENERATE_SINGLE} /> {/* Spinner for saving, in-between */}

          <button type="button" onClick={closeModal} disabled={isModalSaving}>
            {"Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardEditModal;
