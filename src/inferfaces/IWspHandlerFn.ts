import * as venom from 'venom-bot';

export interface IWspHandlerFn {
    [key: string]: (message: venom.Message) => Promise<void>
}
