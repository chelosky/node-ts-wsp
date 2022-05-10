import { IWspHandlerMessageParam } from "./IWspHandlerMessageParam";

export interface IBaseHandler{
    getHandlers: () => IWspHandlerMessageParam[],
}
