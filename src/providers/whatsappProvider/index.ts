import * as venom from 'venom-bot';
import { EWspMessageType } from '../../enums';
import { IWspHandlerFn, IWspHandlerMessageParam } from '../../inferfaces';

export class WhatsappProvider{
    private client: venom.Whatsapp;

    constructor(private options: venom.CreateOptions, private handlers: IWspHandlerMessageParam[]){ }

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
        const onAnyMessageHandlers = this.handlers.filter((handler) => handler.type === EWspMessageType.ANY_MESSAGE);
        const receiverMessageHandlers = this.handlers.filter((handler) => handler.type === EWspMessageType.RECEIVER_MESSAGE);

        this.client.onAnyMessage(async (message: venom.Message) => await this._handleMessage(message, onAnyMessageHandlers));
        this.client.onMessage(async (message: venom.Message) => await this._handleMessage(message, receiverMessageHandlers));
    }

    private async _handleMessage(message: venom.Message, handlers: IWspHandlerMessageParam[]){
        const { isMedia, caption, body } = message;
        const bar = isMedia ? caption : body;

        const handlerFn = this._generateHandlerFn(handlers);

        await (handlerFn[bar] || handlerFn['default'])(message);
    }

    private _generateHandlerFn(handlers: IWspHandlerMessageParam[]): IWspHandlerFn{
        const handlerFn: IWspHandlerFn = {
            ['default']: async () => {/**/},
        };
        
        handlers.forEach(handler => {
            const { code } = handler;
            handlerFn[code] = async (message: venom.Message) => await this._foo(handler, message);
        });

        return handlerFn;
    }

    private async _foo(handler: IWspHandlerMessageParam, message: venom.Message){
        const { validatorCb, processCb } = handler;
        try {
            await validatorCb(this.client, message);
            await processCb(this.client, message);
        } catch (error: any) {
           this._sendErrorNotification(error, message);
        }
    }

    private async _sendErrorNotification(error: any, message: venom.Message){
        const { fromMe, to, from } = message;
        const receiver = fromMe ? to : from;
        await this.client.sendText(receiver, error.message)
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