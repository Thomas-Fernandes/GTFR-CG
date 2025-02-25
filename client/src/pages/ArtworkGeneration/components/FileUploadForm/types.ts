export type FileUploadRequest = Readonly<{
  localFile: File | undefined;
  includeCenterArtwork: boolean;
}>;