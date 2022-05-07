import { promises as fs } from 'fs';
import petPetGif from 'pet-pet-gif';
import { IPetPetGifProvider } from "../../inferfaces";

export class PetPetGifProvider implements IPetPetGifProvider {
    
    constructor(){ }

    public async createGif(filename: string, path: string): Promise<boolean> {
        const animatedGif = await this._generateGif(path);
        await fs.writeFile(filename, animatedGif);
        return true;
    }

    private async _generateGif(path: string): Promise<Buffer>{
        return petPetGif(path);
    }
}