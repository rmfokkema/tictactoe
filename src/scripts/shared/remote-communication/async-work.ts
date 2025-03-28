import type { MethodKey } from "./method-key";

export type AsyncMethodAwaitedReturnType<TWork, TMethod extends MethodKey<TWork>> = TWork[TMethod] extends (...args: infer _) => infer R ? Awaited<R> : never
export type AsyncMethod<TWork, TMethod extends MethodKey<TWork>> = TWork[TMethod] extends (...args: infer P) => infer R ? (...args: P) => Promise<Awaited<R>> : never

export type AsyncWork<TWork> = {
    [Method in MethodKey<TWork>]: AsyncMethod<TWork, Method>
}