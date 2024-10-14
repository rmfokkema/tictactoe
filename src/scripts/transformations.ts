export type PositionIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export interface Transformation{
    positions: [
        PositionIndex, PositionIndex, PositionIndex,
        PositionIndex, PositionIndex, PositionIndex,
        PositionIndex, PositionIndex, PositionIndex,
    ]
}

const identity: Transformation = {
    positions: [0, 1, 2, 3, 4, 5, 6, 7, 8]
}

const rotate: Transformation = {
    positions: [6, 3, 0, 7, 4, 1, 8, 5, 2]
}

const flip: Transformation = {
    positions: [2, 1, 0, 5, 4, 3, 8, 7, 6]
}

function combine({positions: one}: Transformation, {positions: other}: Transformation): Transformation{
    return {
        positions: [
            other[one[0]], other[one[1]], other[one[2]],
            other[one[3]], other[one[4]], other[one[5]],
            other[one[6]], other[one[7]], other[one[8]]
        ]
    }
}

export function *getAllTransformations(): Iterable<Transformation>{
    let current = identity;
    for(let numberOfRotations = 0; numberOfRotations < 3; numberOfRotations++){
        current = combine(current, rotate);
        yield current;
    }
    current = flip;
    yield current;
    for(let numberOfRotations = 0; numberOfRotations < 3; numberOfRotations++){
        current = combine(current, rotate);
        yield current;
    }
}

