import type { TransformationRepresentation } from "ef-infinite-canvas";

export function transformPosition(
    transformation: TransformationRepresentation,
    x: number,
    y: number
): {x: number, y: number}{
    const {a, b, c, d, e, f} = transformation;
    return {
        x: a * x + c * y + e,
        y: b * x + d * y + f
    }
}