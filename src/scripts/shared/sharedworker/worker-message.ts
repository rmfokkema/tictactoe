import type { SharedWork } from "./shared-work"

export interface WorkerRequestMessage {
    type: 'request',
    id: string
    data: unknown,
    method: keyof SharedWork
}

export interface WorkerResponseMessage {
    type: 'response'
    requestId: string
    data: unknown
}

export type WorkerMessage = WorkerRequestMessage | WorkerResponseMessage

export function isRequest(message: WorkerMessage): message is WorkerRequestMessage {
    return message.type === 'request'
}

export function isResponse(message: WorkerMessage): message is WorkerResponseMessage {
    return message.type === 'response'
}