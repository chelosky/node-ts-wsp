import * as venom from 'venom-bot';
import { EWspCodeHandlerMessage, EWspMessageType } from '../enums';

export interface IWspHandlerMessageParam {
    type: EWspMessageType,
    code: EWspCodeHandlerMessage,
    validatorCb: (client: venom.Whatsapp, message: venom.Message) => Promise<boolean>,
    processCb: (client: venom.Whatsapp, message: venom.Message) => Promise<void>,
}
