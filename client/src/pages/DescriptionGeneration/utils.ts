import { sendToast } from "@/common/Toast";
import { ToastType } from "@/constants/toasts";
import { getToasts } from "@/contexts";

export const extractSongInfo = (songMetaname: string) => {
  const toasts = getToasts();

  if (!songMetaname) {
    sendToast(toasts.descgen.noSongInfo, ToastType.Warn);
    return ["", ""];
  }

  const separatorIndex = songMetaname.indexOf(", ");
  const artist = songMetaname.substring(0, separatorIndex);
  const songName = songMetaname.substring(separatorIndex + 2);

  return [artist, songName.substring(1, songName.length - 2)];
};
