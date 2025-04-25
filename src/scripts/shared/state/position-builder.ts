import { combine, Identity, type Transformation } from "../transformations";
import { PositionHead } from "./position-head";


export class PositionBuilder {
    private constructor(
        public positions: number,
        public lastPlayedPosition: number | undefined,
        private readonly head: PositionHead
    ){}

    public write(position: number): PositionBuilder {
        const { maskValue, newHead } = this.head.write(position);
        if(newHead === this.head){
            return this;
        }
        const newPositions = this.positions | maskValue;
        return new PositionBuilder(
            newPositions,
            position,
            newHead
        )
    }

    public static initial: PositionBuilder = new PositionBuilder(
        0,
        undefined,
        PositionHead.initial
    )
}