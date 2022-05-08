import { IPetPetGifResponse } from "./IPetPetGifResponse";

export interface IPetPetGifProvider {
   createGifFromBuffer: (content: Buffer, extension: string) => Promise<IPetPetGifResponse>;
   createGifFromPath: (path: string) => Promise<string>;
}
