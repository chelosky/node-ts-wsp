import * as venom from 'venom-bot';
import { AppConfig } from "../config";
import { AppServer } from "../server";
import { HANDLERS } from "../handlers";
import { ENodeErrorType, ENodeSignal } from "../enums";
import { WhatsappProvider } from "../providers/whatsappProvider";

const wspOptions: venom.CreateOptions = {
    session: 'session-name', //name of session
    multidevice: false // for version not multidevice use false.(default: true)
}

export class App {
    public async start(): Promise<void>{
        const appConfig = new AppConfig();
        const server = new AppServer(appConfig.getConfig());
        const wsp = new WhatsappProvider(wspOptions, HANDLERS);

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
