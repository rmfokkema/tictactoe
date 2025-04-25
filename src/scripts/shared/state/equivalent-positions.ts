export interface EquivalentPositions {
    position: number
    successors(): Iterable<EquivalentPositions>
}