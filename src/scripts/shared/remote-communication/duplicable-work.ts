export interface DuplicableWork<TState> {
    getState(): TState
    setState(value: TState): void
}