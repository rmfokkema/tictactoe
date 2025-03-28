import { remoteClient, type AsyncWork, type ChannelLike } from '@shared/remote-communication'
import type { SharedWork } from '@shared/shared-work/shared-work';

function sharedWorkerIsAvailable(): boolean {
    return typeof SharedWorker !== 'undefined';
}

function createClientWithChannel(channel: ChannelLike, requestTimeout: number): AsyncWork<SharedWork>{
    return remoteClient<SharedWork>().create(
        channel,
        [
            'storeMap',
            'verifyAndStoreMap',
            'getStoredMap'
        ],
        requestTimeout
    );
}

export function createSharedWorkClient(): AsyncWork<SharedWork> {
    if(!sharedWorkerIsAvailable()){
        const worker = new Worker(new URL('../../dedicatedworker/main.ts', import.meta.url), {type: 'module'});
        return createClientWithChannel(worker, 1000);
    }
    const worker = new SharedWorker(new URL('../../sharedworker/main.ts', import.meta.url), {type: 'module'});
    const client = createClientWithChannel(worker.port, 300);
    worker.port.start();
    return client;
}