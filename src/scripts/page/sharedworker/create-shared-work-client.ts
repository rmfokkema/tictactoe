import { allMethodNames, type SharedWork } from "@shared/sharedworker/shared-work";
import type { RequestClient } from "./request-client";
import type { SharedWorkClient } from "./shared-work-client";

export function createSharedWorkClient(requestClient: RequestClient): SharedWorkClient {
    const result: Partial<SharedWorkClient> = {};
    for(const methodName of Object.getOwnPropertyNames(allMethodNames)){
        const method = methodName as keyof SharedWork;
        // @ts-ignore
        result[method] = (...params) => requestClient.sendRequest(method, params);
    }
    return result as SharedWorkClient;
}