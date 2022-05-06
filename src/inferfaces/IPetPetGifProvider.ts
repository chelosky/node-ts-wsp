export interface IPetPetGifProvider {
   createGif: (filename: string, path: string) => Promise<boolean>;
}
