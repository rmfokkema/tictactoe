interface CryptoLike {
    getRandomValues<T extends ArrayBufferView | null>(array: T): T;
}

type SetTimeoutLike = (handler: Function, timeout?: number, ...args: any[]) => number
type ClearTimeoutLike = (id: number | undefined) => void

declare var crypto: CryptoLike;
declare var setTimeout: SetTimeoutLike;
declare var clearTimeout: ClearTimeoutLike;