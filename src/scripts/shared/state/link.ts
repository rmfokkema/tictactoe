export interface Linked<T> {
    value: T
    next: Linked<T> | undefined
}

export function link<T>(items: T[]): Linked<T> | undefined {
    if(items.length === 0){
        return undefined;
    }
    const [first, ...rest] = items;
    return {
        value: first,
        next: link(rest)
    }
}