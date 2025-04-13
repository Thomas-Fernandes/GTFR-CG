import { Dict } from "@/common/types";
import { PageMetadata } from "@/pages/Lyrics/types";

export const strArrToMetadata = (metadata: string[]): PageMetadata => {
  return metadata.reduce((acc: PageMetadata, curr) => {
    const [key, value] = curr.split(": ");
    (acc as Dict<any>)[key] = value;
    return acc;
  }, {} as PageMetadata);
};
