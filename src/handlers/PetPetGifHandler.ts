import mime from 'mime-types';
import * as venom from 'venom-bot';
import { IBaseHandler, IWspHandlerMessageParam } from '../inferfaces';
import { EImageType, EWspCodeHandlerMessage, EWspMessageType } from "../enums";
import { PetPetGifProvider } from '../providers/petPetGifProvider';
import { FileSystemProvider } from '../providers/fileSystemProvider';

class PetPetGifHandler implements IBaseHandler{

    constructor(private petPetGifProvider: PetPetGifProvider, private fileSystemProvider: FileSystemProvider ){}

    public getHandlers(): IWspHandlerMessageParam[]{
        const handlers: IWspHandlerMessageParam[] = [
            {
                type: EWspMessageType.ANY_MESSAGE,
                code: EWspCodeHandlerMessage.PET_PET_GIF,
                validatorCb: async (_client: venom.Whatsapp, message: venom.Message) => {
                    const { isMedia, mimetype } = message;
                    
                    if(!isMedia) return false;
        
                    const validImageTypes: string[] = [EImageType.BMP, EImageType.PNG, EImageType.JPG, EImageType.JFIF, EImageType.JPEG];
                    const extension = mime.extension(mimetype);
        
                    return !extension || !(validImageTypes.includes(extension));
                },
                processCb: async (client: venom.Whatsapp, message: venom.Message) => {
                    const { mimetype, fromMe, from, to} = message;
                    const buffer = await client.decryptFile(message);
                    const extension = mime.extension(mimetype);
                    
                    const { originalFilePath, generatedGifPath } = await this.petPetGifProvider.createGifFromBuffer(buffer, extension as string);
                    
                    const receiver = fromMe ? to : from;
                    await client.sendImageAsStickerGif(receiver, generatedGifPath);
        
                    await Promise.all([
                        this.fileSystemProvider.deleteFile(originalFilePath),
                        this.fileSystemProvider.deleteFile(generatedGifPath),
                    ]);
                },
            }
        ];
        return handlers;
    }
}

const fileSystemProvider = new FileSystemProvider();
const petPetGifProvider = new PetPetGifProvider(fileSystemProvider);
export const petPetGifHandler = new PetPetGifHandler( petPetGifProvider, fileSystemProvider );
