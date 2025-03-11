import { isResponse, type WorkerRequestMessage, type WorkerResponseMessage } from '@shared/sharedworker/worker-message'
import type { SharedWork } from '@shared/sharedworker/shared-work';
import type { RequestClient } from './request-client';

interface PendingRequest {
    fulfill(data: unknown): void
    id: string
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
            const id = window.crypto.randomUUID();
            const {promise, resolve} = Promise.withResolvers<unknown>();
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
}