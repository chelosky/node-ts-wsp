import { v4 as uuidv4 } from 'uuid';
import petPetGif from 'pet-pet-gif';
import { EPath } from '../../enums/EPath';
import { IFileSystemProvider, IPetPetGifProvider, IPetPetGifResponse } from "../../inferfaces/";

export class PetPetGifProvider implements IPetPetGifProvider {
    
    constructor(private fileSystemProvider: IFileSystemProvider){}

    public async createGifFromBuffer(content: Buffer, extension: string): Promise<IPetPetGifResponse> {
        const originalFilePath = `${EPath.TempFolder}${uuidv4()}.${extension}`;
        await this.fileSystemProvider.writeFile(originalFilePath, content);
        const generatedGifPath = await this.createGifFromPath(originalFilePath);
        return {
            originalFilePath,
            generatedGifPath,
        };
    }

    public async createGifFromPath(path: string): Promise<string> {
        const filePath = `${EPath.TempFolder}${uuidv4()}.gif`;
        const bufferGif = await this._generateGif(path);
        await this.fileSystemProvider.writeFile(filePath, bufferGif);
        return filePath;
    }

    private async _generateGif(path: string): Promise<Buffer>{
        return petPetGif(path);
    }
}