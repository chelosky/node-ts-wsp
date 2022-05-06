import { AppConfig } from "../config";
import { ENodeErrorType, ENodeSignal } from "../enums";
import { WhatsappProvider } from "../providers/whatsappProvider";
import { AppServer } from "../server";
import { CreateOptions } from 'venom-bot';

const wspOptions: CreateOptions = {
    session: 'session-name', //name of session
    multidevice: false // for version not multidevice use false.(default: true)
}

export class App {
    public async start(): Promise<void>{
        const appConfig = new AppConfig();
        const server = new AppServer(appConfig.getConfig());
        const wsp = new WhatsappProvider(wspOptions );

        await wsp.start();
        server.start();

        this._handleNodeSignals(server);
        this._handleNodeErrorTypes(server);
    }

    private _handleNodeSignals(server: AppServer): void{
        const signals: ENodeSignal[] = Object.values(ENodeSignal);
        signals.forEach((signal: ENodeSignal) => {
            process.on(signal, async () => {
                server.close();
            });
        });
    }

    private _handleNodeErrorTypes(server: AppServer): void{
        const errorTypes: ENodeErrorType[] = Object.values(ENodeErrorType);
        errorTypes.map((type) => {
            process.on(type, async (e) => {
                try {
                    console.log(`Error in process.on ${type}`)
                    console.error(e)
                    server.close()
                    process.exit(0)
                } catch (_) {
                    process.exit(1)
                }
            })
        })
    }
}