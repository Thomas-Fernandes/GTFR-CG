import { useEffect, useState } from "react";

import { sendToast } from "@/common/Toast";
import { downloadFile } from "@/common/utils/fileUtils";
import DownloadButton from "@/components/DownloadButton/DownloadButton";
import ImgWithOverlay from "@/components/ImgWithOverlay/ImgWithOverlay";
import { Toast, ToastType } from "@/constants/toasts";
import { useAppContext } from "@/contexts";

import { useCardsGalleryContext } from "./contexts";
import { CardViewProps } from "./types";

import "./CardView.scss";

const CardView: React.FC<CardViewProps> = ({ card, cardIdx }) => {
  const { intl } = useAppContext();
  const labels = {
    edit: intl.formatMessage({ id: "pages.cardgen.modal.edit" }),
    download: intl.formatMessage({ id: "components.downloadButton.download" }),
  };

  const { setIsModalOpen, setCurrentCard, setNewLyrics } = useCardsGalleryContext();

  const [isMounted, setIsMounted] = useState(false);

  const cardFileName = (card.imgSrc.split('/').pop() ?? "").split('?')[0] ?? "card";
  const shortCardFileName = cardFileName.replace(".png", "");
  const cardIsEditable = !(shortCardFileName === "00" || shortCardFileName === "outro");
  const alt = `card-${cardIdx.toString()}_${cardFileName}`;

  const openModal = () => {
    if (!cardIsEditable) {
      sendToast(Toast.CardNotEditable, ToastType.Warn);
      return;
    }

    setIsModalOpen(true);
    setCurrentCard(card);
    setNewLyrics(card.lyrics);
  };

  useEffect(() => {
    if (isMounted) return;
    setIsMounted(true);
  }, [isMounted]);

  return (
    <div className={`card-container ${isMounted ? "mounted" : ""}`}>
      <div onClick={openModal} className="card-container--card">
        { !cardIsEditable
        ? <img
            src={card.imgSrc} alt={alt}
          />
        : <ImgWithOverlay
            src={card.imgSrc} alt={alt}
            overlayText={labels.edit}
          />
        }
      </div>

      <DownloadButton className="mac"
        label={labels.download + " " + shortCardFileName}
        onClick={() => downloadFile(card.imgSrc)}
      />
    </div>
  );
};

export default CardView;
