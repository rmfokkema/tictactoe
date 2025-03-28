export interface MessageEventLike {
    data: unknown
}

export interface ChannelLike {
    postMessage(message: unknown): void
    addEventListener(type: 'message', listener: (e: MessageEventLike) => void): void
}