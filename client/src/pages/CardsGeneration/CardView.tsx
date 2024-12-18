import { sendToast } from "@/common/toast";
import { downloadFile } from "@/common/utils/fileUtils";
import DownloadButton from "@/components/DownloadButton/DownloadButton";
import ImgWithOverlay from "@/components/ImgWithOverlay/ImgWithOverlay";
import { Toast, ToastType } from "@/constants/toasts";

import { useCardsGalleryContext } from "./contexts";
import { CardViewProps } from "./types";

import "./CardView.scss";

const CardView: React.FC<CardViewProps> = ({ card, cardIdx }) => {
  const { setIsModalOpen, setCurrentCard, setNewLyrics } = useCardsGalleryContext();

  const cardFileName = (card.src.split('/').pop() ?? "").split('?')[0] ?? "card";
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

  return (
    <div className="card-container">
      <div onClick={openModal} className="card-container--card">
        { !cardIsEditable
        ? <img
            src={card.src} alt={alt}
          />
        : <ImgWithOverlay
            src={card.src} alt={alt}
            overlayText={"Edit this card"}
          />
        }
      </div>

      <DownloadButton className="mac"
        label={"Download " + shortCardFileName}
        onClick={() => downloadFile(card.src)}
      />
    </div>
  );
};

export default CardView;
