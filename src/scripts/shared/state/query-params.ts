import type { GameState } from "./game-state";
import { GameStateImpl } from "./game-state-impl";

export function isQueryParamForState(key: string, value: string): boolean {
    if(!/^[xo]+$/i.test(key)){
        return false;
    }
    if(/^[xo]+$/i.test(value)){
        return true;
    }
    return value === '';
}
export function getQueryParamsForState(state: GameState): {key: string, value: string} {
    const xo = state.id.toString(2).replace(/[10]/g, (v) => v === '1' ? 'x' : 'o');
    if(xo.length === 1){
        return {
            key: xo,
            value: ''
        }
    }
    const keyLength = Math.floor(xo.length / 2);

    return {
        key: xo.slice(0, keyLength),
        value: xo.slice(keyLength)
    }
}

interface QueryParamsLike {
    entries(): Iterable<[string, string]>
}

export function getStateFromQueryParams(params: QueryParamsLike): GameState | undefined {
    for(const [key, value] of params.entries()){
        if(!isQueryParamForState(key, value)){
            continue;
        }
        const zerosAndOnes = `${key}${value}`.replace(/[xo]/g, (v) => v === 'x' ? '1' : '0');
        const positions = parseInt(zerosAndOnes, 2);
        return GameStateImpl.fromSummary({positions})
    }
    return undefined;
}