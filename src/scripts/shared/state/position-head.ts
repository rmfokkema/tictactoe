import { link, type Linked } from "./link";
import { PositionArray } from "./position-array";

class Section {
    public constructor(
        private readonly length: number,
        private readonly offset: number
    ){}

    public write(positionIndex: number): number {
        return positionIndex + 1 << this.offset;
    }

    public read(values: number): number | undefined {
        const masked = (values >> (this.offset)) & ((1 << this.length) - 1); 
        if(masked === 0){
            return undefined;
        }
        return masked - 1;
    }
}

const sections: Section[] = [
    new Section(4, 0),
    new Section(4, 4),
    new Section(3, 8),
    new Section(3, 11),
    new Section(3, 14),
    new Section(3, 17),
    new Section(2, 20),
    new Section(2, 22),
    new Section(1, 24),
];

const firstSection = link(sections) as Linked<Section>

export class PositionHead {
    private constructor(
        private readonly vacantPositions: PositionArray,
        private readonly section: Linked<Section>
    ){}

    public write(position: number): {newHead: PositionHead, maskValue: number}{
        const positionIndex = this.vacantPositions.indexOf(position);
        if(positionIndex === -1){
            return {newHead: this, maskValue: 0}
        }
        const maskValue = this.section.value.write(positionIndex);
        const newVacantPositions = this.vacantPositions.removeAtIndex(positionIndex);
        const newSection = this.section.next || this.section;
        return {
            newHead: new PositionHead(
                newVacantPositions,
                newSection
            ),
            maskValue
        }
    }

    public read(positions: number): {position: number, newHead: PositionHead | undefined } | undefined {
        const indexValue = this.section.value.read(positions);
        if(indexValue === undefined){
            return undefined;
        }
        const positionIndex = Math.min(indexValue, this.vacantPositions.length - 1);
        const position = this.vacantPositions.positionAt(positionIndex);
        if(position === undefined){
            return undefined;
        }
        const nextSection = this.section.next;
        if(nextSection === undefined){
            return {position, newHead: undefined}
        }
        return {
            position,
            newHead: new PositionHead(
                this.vacantPositions.removeAtIndex(positionIndex),
                nextSection
            )
        }
    }

    public static initial = new PositionHead(PositionArray.initial, firstSection);
}