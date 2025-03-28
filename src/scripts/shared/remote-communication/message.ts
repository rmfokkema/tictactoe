import type { MethodArgs, MethodKey } from "./method-key"

export interface RequestMessage<TWork, TMethod extends MethodKey<TWork>> {
    type: 'request'
    id: string
    method: TMethod
    data: MethodArgs<TWork, TMethod>
}

export interface ResponseMessage<TResult> {
    type: 'response',
    requestId: string
    data: TResult
}

export interface ResponseErrorMessage {
    type: 'responseerror',
    requestId: string
    error: unknown
}

export function isRequest<TWork, TMethod extends MethodKey<TWork>>(message: unknown): message is RequestMessage<TWork, TMethod> {
    const cast = message as RequestMessage<TWork, TMethod>;
    return cast && cast.type === 'request';
}

export function isResponse<TResult>(message: unknown): message is ResponseMessage<TResult> | ResponseErrorMessage {
    const cast = message as ResponseMessage<TResult> | ResponseErrorMessage;
    return cast && (cast.type === 'response' || cast.type === 'responseerror');
}

