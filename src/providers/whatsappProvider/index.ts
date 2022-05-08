import mime from 'mime-types';
import * as venom from 'venom-bot';
import { EImageType } from '../../enums';
import { IFileSystemProvider, IPetPetGifProvider } from '../../inferfaces';

export class WhatsappProvider{
    private client: venom.Whatsapp;

    constructor(private options: venom.CreateOptions, private petPetGifProvider: IPetPetGifProvider, private fileSystemProvider: IFileSystemProvider){ }

    public async start(){
        try {
            this.client = await venom.create(this.options);
            await this._setUp();
        } catch (error) {
            throw error;
        }
    }

    public async close(): Promise<void>{
        if(!this.client){
            throw '';
        }
        await this.client.close();
    }

    private async _setUp(){
        this.client.onAnyMessage(async (message: any) => {
            const { isMedia, caption, mimetype, isGroupMsg, from, to} = message;
            if(isMedia && caption == 'PETPETGIF'){
                const buffer = await this.client.decryptFile(message);
                const extension = mime.extension(mimetype);
                
                const validImageTypes: string[] = [EImageType.BMP, EImageType.PNG, EImageType.JPG, EImageType.JFIF, EImageType.JPEG];

                if(!extension || !(validImageTypes.includes(extension))) {
                    throw `${extension} is not a valid image type`;
                }
                
                const { originalFilePath, generatedGifPath } = await this.petPetGifProvider.createGifFromBuffer(buffer, extension as string);
                
                const receiver = isGroupMsg ? to : from;
                await this.client.sendImageAsStickerGif(receiver, generatedGifPath);

                await Promise.all([
                    this.fileSystemProvider.deleteFile(originalFilePath),
                    this.fileSystemProvider.deleteFile(generatedGifPath),
                ]);
            }
        });
    }
// venom
//     .create({
//         session: 'session-name', //name of session
//         multidevice: false // for version not multidevice use false.(default: true)
//     })
//     .then((client: any) => start(client))
//     .catch((error: any) => {
//         console.log(error);
//     });

// function start(client: any) {
//     client.onMessage((message: any) => {
//         const { body, from } = message;

//         client
//         .sendText(message.from, `Esto es una prueba de wsp 🕷 - Message: ${body}`)
//         .then((result: any) => {
//             console.log('Result: ', result); //return object success
//         })
//         .catch((erro: any) => {
//             console.error('Error when sending: ', erro); //return object error
//         });

//         if (message.isMedia === true || message.isMMS === true) {
//             message.
//             const buffer = await client.decryptFile(message);
//             // At this point you can do whatever you want with the buffer
//             // Most likely you want to write it into a file
//             const fileName = `some-file-name.${mime.extension(message.mimetype)}`;
//             await fs.writeFile(fileName, buffer, (err) => {
//                 if(err) console.log('xd');
//             });
//         }

//         const msgFn: {
//             [key: string]: () => any
//         } = {
//             ['panchy1']: () => client.sendImageAsStickerGif(from, './assets/panchy1.gif'),
//             ['panchy2']: () => client.sendImageAsStickerGif(from, './assets/panchy2.gif'),
//             ['panchy3']: () => client.sendImageAsStickerGif(from, './assets/panchy3.gif'),
//             ['panchy4']: () => client.sendImageAsStickerGif(from, './assets/panchy4.gif'),
//             ['panchy05']: () => client.sendImageAsStickerGif(from, './assets/panchy05.gif'),
//             ['yiyo']: () => client.sendImageAsSticker(from, './assets/yiyotest.png'),
//             ['default']: () => console.log('NADA'),
//         };

//         (msgFn[body] || msgFn['default'])();
//     });
// }
}