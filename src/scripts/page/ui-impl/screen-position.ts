import type { TransformationRepresentation } from "ef-infinite-canvas"

export interface ScreenPosition{
    inPrimary: boolean
    inSecondary: boolean
}

export interface ScreenPositionCalculator {
    getScreenPosition(transformation: TransformationRepresentation): ScreenPosition
}