import { Content, ContentParent } from "./content";

export class ContentImpl implements Content, ContentParent{
    public constructor(
        protected readonly parent: ContentParent
    ){

    }
    public triggerChange(): void {
        this.parent.triggerChange();
    }
    public draw(_: CanvasRenderingContext2D): void{}
    public willHandleClick(_: number, __: number): boolean {
        return false;
    }

    public handleClick(_: number, __: number): void{}
}