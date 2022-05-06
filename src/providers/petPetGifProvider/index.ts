import * as fs from 'fs';
import petPetGif from 'pet-pet-gif';
import { IFileSystemProvider, IPetPetGifProvider } from "../../inferfaces";

export class PetPetGifProvider implements IPetPetGifProvider {
    
    constructor(private fileSystem: IFileSystemProvider){ }

    public async createGif(filename: string, path: string): Promise<boolean> {
        const animatedGif = await this._generateGif(path);

        fs.writeFile(filename, animatedGif, function (err) {
            if(err){
                throw err;
            }
        });
        return true;
    }

    private async _generateGif(path: string): Promise<Buffer>{
        return petPetGif(path);
    }
}