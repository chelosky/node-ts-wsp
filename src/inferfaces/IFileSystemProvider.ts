export interface IFileSystemProvider {
    writeFile: (filePath: string, content: any) => Promise<void>,
    deleteFile: (filePath: string) => Promise<void>,
}
