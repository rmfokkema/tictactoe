import { Measurements } from "../measurements";
import { ContentParent } from "./content";
import { ContentImpl } from "./content-impl";

export class EquivalentPossibility extends ContentImpl{
    public constructor(
        parent: ContentParent,
        private readonly measurements: Measurements
    ){
        super(parent)
    }
}