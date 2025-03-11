export function *combinedGenerator<T1, T2>(one: Generator<T1>, other: Generator<T2>): Generator<[T1 | undefined, T2 | undefined]>{
    let oneResult: IteratorResult<T1> | undefined;
    let otherResult: IteratorResult<T2> | undefined;
    try{
        while(
            !oneResult ||
            !otherResult ||
            !oneResult.done ||
            !otherResult.done
        ){
            oneResult = one.next();
            otherResult = other.next();
            if(oneResult.done){
                if(otherResult.done){
                    break;
                }
                yield [undefined, otherResult.value];
                continue;
            }
            if(otherResult.done){
                yield [oneResult.value, undefined];
                continue;
            }
            yield [oneResult.value, otherResult.value];
        }
    }finally{
        one.return(undefined);
        other.return(undefined);
    }
}