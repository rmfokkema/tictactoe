import { combine, Identity, type Transformation } from "../transformations";
import { PositionHead } from "./position-head";

export class PositionReader {
    private constructor(
        private readonly positions: number,
        private readonly head: PositionHead
    ){}

    public read(): {position: number, nextReader: PositionReader | undefined } | undefined {
        const result = this.head.read(this.positions);
        if(!result){
            return undefined;
        }
        const nextHead = result.newHead;
        if(nextHead === undefined){
            return {position: result.position, nextReader: undefined};
        }
        return {
            position: result.position,
            nextReader: new PositionReader(this.positions, nextHead)
        }
    }

    public static *readAllPositions(positions: number): Generator<number> {
        let head = PositionHead.initial;
        while(true){
            const result = head.read(positions);
            if(result === undefined){
                break;
            }
            yield result.position;
            const nextHead = result.newHead;
            if(nextHead === undefined){
                break;
            }
            head = nextHead;
        }
    }

    public static create(positions: number): PositionReader {
        return new PositionReader(positions, PositionHead.initial);
    }
}

export class TransformedPositionReader {
    private constructor(
        private readonly reader: PositionReader,
        private readonly transformation: Transformation
    ){}

    public read(): {position: number, nextReader: TransformedPositionReader | undefined } | undefined {
        const result = this.reader.read();
        if(result === undefined){
            return undefined;
        }
        const position = this.transformation.positions[result.position];
        const nextReader = result.nextReader;
        if(nextReader === undefined){
            return {position, nextReader: undefined}
        }
        return {
            position,
            nextReader: new TransformedPositionReader(nextReader, this.transformation)
        }
    }

    public transform(transformation: Transformation): TransformedPositionReader {
        const newTransformation = combine(this.transformation, transformation);
        return new TransformedPositionReader(this.reader, newTransformation);
    }

    public static create(positions: number): TransformedPositionReader{
        const reader = PositionReader.create(positions);
        return new TransformedPositionReader(reader, Identity);
    }
}