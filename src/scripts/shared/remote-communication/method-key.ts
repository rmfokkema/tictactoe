type KeysWithType<TObj, TType> = {[key in keyof TObj]: TObj[key] extends TType ? key : never}[keyof TObj]

export type MethodKey<TWork> = string & KeysWithType<TWork, (...args: never) => unknown>;

export type MethodArgs<TWork, TMethod extends MethodKey<TWork>> = TWork[TMethod] extends (...params: infer P) => unknown ? P : never

export type MethodReturnType<TWork, TMethod extends MethodKey<TWork>> = TWork[TMethod] extends (...params: infer _) => infer R ? R : never;