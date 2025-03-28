import { createRequestServer, duplicableWork } from "@shared/remote-communication";
import { type SharedWork, SharedWorkImpl, type SharedWorkState } from "@shared/shared-work";

const channel = new BroadcastChannel('duplicatedwork');

const duplicatedSharedWork = duplicableWork<SharedWork, SharedWorkState>(new SharedWorkImpl()).create(
    channel,
    300,
    {
        commands: ['storeMap', 'verifyAndStoreMap'],
        queries: ['getStoredMap']
    }
)

const duplicableSharedWorkRequestServer = createRequestServer(duplicatedSharedWork);

duplicableSharedWorkRequestServer.listen(globalThis);