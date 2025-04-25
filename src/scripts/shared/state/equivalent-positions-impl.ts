import { otherPlayer, Player } from "../player";
import type { EquivalentPositions } from "./equivalent-positions";
import { TransformedPositionReader } from "./position-reader";
import { PositionSet } from "./position-set";

function *continueEquivalentPositions(
    positionSet: PositionSet,
    player: Player,
    reader: TransformedPositionReader
): Iterable<EquivalentPositions> {
    const result = reader.read();
    if(result === undefined){
        return;
    }
    const nextReader = result.nextReader;
    if(nextReader === undefined){
        for(const {transformation} of positionSet.findTransformations(player, result.position)){
            const transformedPosition = transformation.positions[result.position];
            yield {
                position: transformedPosition,
                successors() {
                    return []
                },
            }
        }
        return;
    }
    const nextPlayer = otherPlayer(player);
    for(const {transformation, positionSet: transformedPositionSet} of positionSet.findTransformations(player, result.position)){
        const transformedPosition = transformation.positions[result.position];
        const transformedReader = nextReader.transform(transformation);
        yield {
            position: transformedPosition,
            successors() {
                return continueEquivalentPositions(
                    transformedPositionSet,
                    nextPlayer,
                    transformedReader
                )
            },
        }
    }
}

export function getEquivalentPositions(positions: number): Iterable<EquivalentPositions> {
    const positionSet = new PositionSet(0);
    const reader = TransformedPositionReader.create(positions);
    return continueEquivalentPositions(positionSet, Player.X, reader);
}