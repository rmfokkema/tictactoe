import { Player } from "../player";
import { allTransformations, type Transformation } from "../transformations";

export class PositionSet{
    public constructor(private readonly positions: number){

    }

    private transformPositions(transformation: Transformation): number{
        let positions = 0;
        let positionIndex = 0;
        for(const player of this.getPlayersAtPositions()){
            positions |= (player << (2 * transformation.positions[positionIndex++]));
        }
        return positions;
    }

    private *getOwnTransformations(): Iterable<Transformation> {
        for(const transformation of allTransformations){
            if(this.transformPositions(transformation) === this.positions){
                yield transformation;
            }
        }
    }

    private *getEmptyPositions(): Iterable<number> {
        for(let position = 0; position < 9; position++){
            if((this.positions & 3 << 2 * position) === 0){
                yield position;
            }
        }
    }

    public *findTransformations(player: Player, position: number): Iterable<{transformation: Transformation, positionSet: PositionSet}> {
        const seen = new Set<number>();
        for(const ownTransformation of this.getOwnTransformations()){
            const newPositionSet = this.withPlayerAtPosition(player, ownTransformation.positions[position]);
            if(seen.has(newPositionSet.positions)){
                continue;
            }
            yield {transformation: ownTransformation, positionSet: newPositionSet};
            seen.add(newPositionSet.positions);
        }
    }

    public findTransformationToEquivalent(fromPosition: number): Transformation | undefined {
        for(const emptyPosition of this.getEmptyPositions()){
            for(const transformation of this.getOwnTransformations()){
                if(transformation.positions[fromPosition] === emptyPosition){
                    return transformation;
                }
            }
        }
        return undefined;
    }

    public findTransformation(from: number, to: number): Transformation | undefined {
        for(const transformation of this.getOwnTransformations()){
            if(transformation.positions[from] === to){
                return transformation;
            }
        }
        return undefined;
    }

    public withPlayerAtPosition(player: Player, position: number): PositionSet {
        return new PositionSet(this.positions | (player << (2 * position)))
    }

    public findEquivalentEmptyPosition(position: number): {position: number, transformation: Transformation} | undefined {
        const ownTransformations = [...this.getOwnTransformations()];
        for(const emptyPosition of this.getEmptyPositions()){
            const transformation = ownTransformations.find(t => t.positions[position] === emptyPosition);
            if(transformation){
                return {position: emptyPosition, transformation}
            }
        }
        return undefined;
    }

    public getNonequivalentEmptyPositions(): Iterable<number> {
        const result: Set<number> = new Set();
        const ownTransformations = [...this.getOwnTransformations()];
        a:for(const emptyPosition of this.getEmptyPositions()){
            for(const ownTransformation of ownTransformations){
                const transformed = ownTransformation.positions[emptyPosition];
                if(result.has(transformed)){
                    continue a;
                }
            }
            result.add(emptyPosition);
        }
        return result;
    }

    public *getPlayersAtPositions(): Iterable<Player | 0>{
        for(let position = 0; position < 9; position++){
            yield (this.positions >> (2 * position)) & 3;
        }
    }
}