export const ROW_ONE = { rowIndex: 0 } as const
export const ROW_TWO = { rowIndex: 1 } as const
export const ROW_THREE = { rowIndex: 2 } as const
export const COLUMN_ONE = { columnIndex: 0 } as const
export const COLUMN_TWO = { columnIndex: 1 } as const
export const COLUMN_THREE = { columnIndex: 2 } as const
export const MAIN_DIAGONAL = { mainDiagonal: true } as const
export const OTHER_DIAGONAL = { otherDiagonal: true } as const
export type ThreeInColumn = 
    | typeof COLUMN_ONE
    | typeof COLUMN_TWO
    | typeof COLUMN_THREE

export type ThreeInRow = 
    | typeof ROW_ONE
    | typeof ROW_TWO
    | typeof ROW_THREE

export type Three = 
    | ThreeInRow
    | ThreeInColumn
    | typeof MAIN_DIAGONAL
    | typeof OTHER_DIAGONAL

export function isInRow(three: Three): three is ThreeInRow{
    return (three as ThreeInRow).rowIndex !== undefined;
}

export function isInColumn(three: Three): three is ThreeInColumn{
    return (three as ThreeInColumn).columnIndex !== undefined;
}