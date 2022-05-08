import { promises as fs } from 'fs';
import { IFileSystemProvider } from "../../inferfaces";

export class FileSystemProvider implements IFileSystemProvider {
    public async writeFile(filePath: string, content: any): Promise<void>{
        await fs.writeFile(filePath, content);
    }

    public async deleteFile(filePath: string): Promise<void>{
        await fs.unlink(filePath);
    }
}