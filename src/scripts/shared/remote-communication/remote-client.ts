import type { AsyncWork, AsyncMethodAwaitedReturnType } from "./async-work";
import type { ChannelLike } from "./channel-like";
import { isResponse, type RequestMessage, type ResponseErrorMessage, type ResponseMessage } from "./message";
import type { MethodArgs, MethodKey } from "./method-key";
import { RemoteTimeoutError } from "./remote-timeout-error";


interface PendingRequest {
    method: string
    fulfill(data: unknown): void
    reject(error: unknown): void
    id: string
}

function promiseWithResolvers<T>(): {promise: Promise<T>, resolve: (v: T) => void, reject: (err: unknown) => void}{
    let resolve: (v: T) => void = () => {};
    let reject: (err: unknown) => void = () => {};
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    })
    return {promise, resolve, reject};
}

interface RemoteClientFactory<TWork> {
    create<TMethods extends readonly MethodKey<TWork>[]>(
        channel: ChannelLike,
        methodKeys: TMethods,
        requestTimeout: number
    ): AsyncWork<Pick<TWork, TMethods[number]>>
}

export function remoteClient<TWork>(): RemoteClientFactory<TWork> {
    return {
        create(
            channel,
            methodKeys,
            requestTimeout: number
        ){
            const pending: PendingRequest[] = [];
            const methods: Partial<AsyncWork<TWork>> = {};
            for(const methodKey of methodKeys){
                // @ts-ignore
                methods[methodKey] = createRequestSender(methodKey);
            }
            channel.addEventListener('message', (e) => {
                const data = e.data;
                listener(data);
            });
            return methods as AsyncWork<TWork>;
            function listener(data: unknown): void {
                if(isResponse(data)){
                    fulfillRequest(data);
                }
            }

            function createRequestId(): string {
                const arr = crypto.getRandomValues(new Uint32Array(1));
                return arr[0].toString();
            }

            function fulfillRequest<TResult>(response: ResponseMessage<TResult> | ResponseErrorMessage): void {
                const index = pending.findIndex(r => r.id === response.requestId);
                if(index === -1){
                    return;
                }
                const [request] = pending.splice(index, 1);
                if(response.type === 'response'){
                    request.fulfill(response.data);
                }else{
                    request.reject(new Error(`Error calling remote '${request.method}'`, {cause: response.error}))
                }
            }

            function timeoutRequest(requestId: string): void {
                const index = pending.findIndex(r => r.id === requestId);
                if(index === -1){
                    return;
                }
                const [request] = pending.splice(index, 1);
                request.reject(new RemoteTimeoutError(`After ${requestTimeout}ms, no response from remote for method '${request.method}'`))
            }

            function createRequestSender<TMethod extends MethodKey<TWork>>(method: TMethod){
                return (...args: MethodArgs<TWork, TMethod>) => {
                    const id = createRequestId();
                    const {promise, resolve, reject} = promiseWithResolvers<AsyncMethodAwaitedReturnType<TWork, TMethod>>();
                    const request: PendingRequest = {
                        method,
                        fulfill: resolve,
                        reject,
                        id
                    };
                    pending.push(request);
                    const rejectionTimeout = setTimeout(() => timeoutRequest(id), requestTimeout);
                    promise.then(() => clearTimeout(rejectionTimeout), () => clearTimeout(rejectionTimeout));
                    const requestMessage: RequestMessage<TWork, TMethod> = {
                        type: 'request',
                        method,
                        data: args,
                        id
                    };
                    channel.postMessage(requestMessage);
                    return promise;
                }
            }
        }
    }
}