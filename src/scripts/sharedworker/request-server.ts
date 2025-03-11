import type { SharedWork } from '@shared/sharedworker/shared-work'
import type { WorkerRequestMessage, WorkerResponseMessage } from '@shared/sharedworker/worker-message'

export interface RequestServer {
    getReponse(request: WorkerRequestMessage): WorkerResponseMessage
}

export function createRequestServer(work: SharedWork): RequestServer {
    return {
        getReponse(request: WorkerRequestMessage){
            // @ts-ignore
            const result = work[request.method](...request.data); 
            return {
                requestId: request.id,
                type: 'response',
                data: result
            }
        }
    }
}