import type { SharedWork } from '@shared/sharedworker/shared-work';

export interface RequestClient {
    sendRequest(method: keyof SharedWork, data: unknown): Promise<unknown>
}