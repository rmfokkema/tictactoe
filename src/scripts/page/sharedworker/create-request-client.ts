import { isResponse, type WorkerRequestMessage, type WorkerResponseMessage } from '@shared/sharedworker/worker-message'
import type { SharedWork } from '@shared/sharedworker/shared-work';
import type { RequestClient } from './request-client';

interface PendingRequest {
    fulfill(data: unknown): void
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

export function createRequestClient(): RequestClient {
    const worker = new SharedWorker(new URL('../../sharedworker/main.ts', import.meta.url), {type: 'module'});
    const pending: PendingRequest[] = [];
    worker.port.onmessage = (e) => {
        const data = e.data;
        if(isResponse(data)){
            fulfillRequest(data);
        }
    }
    return {
        sendRequest(method: keyof SharedWork, data: unknown) {
            const id = createRequestId();
            const {promise, resolve} = promiseWithResolvers<unknown>();
            pending.push({
                fulfill: resolve,
                id
            })
            const requestMessage: WorkerRequestMessage = {
                type: 'request',
                method,
                data,
                id
            };
            worker.port.postMessage(requestMessage)
            return promise;
        }
    }

    function fulfillRequest(response: WorkerResponseMessage): void {
        const index = pending.findIndex(r => r.id === response.requestId);
        if(index === -1){
            return;
        }
        const [request] = pending.splice(index, 1);
        request.fulfill(response.data);
    }

    function createRequestId(): string {
        const arr = window.crypto.getRandomValues(new Uint32Array(1));
        return arr[0].toString();
    }
}