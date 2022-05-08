import { AppConfig } from "../config";
import { ENodeErrorType, ENodeSignal } from "../enums";
import { WhatsappProvider } from "../providers/whatsappProvider";
import { AppServer } from "../server";
import { CreateOptions } from 'venom-bot';
import { PetPetGifProvider } from "../providers/petPetGifProvider";
import { FileSystemProvider } from "../providers/fileSystemProvider";

const wspOptions: CreateOptions = {
    session: 'session-name', //name of session
    multidevice: false // for version not multidevice use false.(default: true)
}

export class App {
    public async start(): Promise<void>{
        const appConfig = new AppConfig();
        const server = new AppServer(appConfig.getConfig());
        const fileSystem = new FileSystemProvider();
        const petPetGif = new PetPetGifProvider(fileSystem);
        const wsp = new WhatsappProvider(wspOptions, petPetGif, fileSystem);

        await wsp.start();
        server.start();

        this._handleNodeSignals(server, wsp);
        this._handleNodeErrorTypes(server, wsp);
    }

    private _handleNodeSignals(server: AppServer, wsp: WhatsappProvider): void{
        const signals: ENodeSignal[] = Object.values(ENodeSignal);
        signals.forEach((signal: ENodeSignal) => {
            process.on(signal, async () => {
                server.close();
                wsp.close();
            });
        });
    }

    private _handleNodeErrorTypes(server: AppServer, wsp: WhatsappProvider): void{
        const errorTypes: ENodeErrorType[] = Object.values(ENodeErrorType);
        errorTypes.map((type) => {
            process.on(type, async (e) => {
                try {
                    console.log(`Error in process.on ${type}`);
                    console.error(e);
                    server.close();
                    wsp.close();
                    process.exit(0);
                } catch (_) {
                    process.exit(1);
                }
            })
        })
    }
}