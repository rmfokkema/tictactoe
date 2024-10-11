import { Content, ContentParent } from "./content";

export class ContentImpl implements Content, ContentParent{
    private children: Content[] = [];
    private parent: ContentParent | undefined
    public constructor(
        parent: ContentParent
    ){
        this.parent = parent;
        parent.addChild(this)
    }
    public addChild(child: Content) {
        this.children.push(child)
    }
    protected removeChild(child: Content): void {
        const index = this.children.indexOf(child);
        if(index === -1){
            return;
        }
        child.destroy();
        this.children.splice(index, 1)
    }
    public triggerChange(): void {
        this.parent?.triggerChange();
    }
    public draw(_: CanvasRenderingContext2D): void{}
    public willHandleClick(_: number, __: number): boolean {
        return false;
    }

    public handleClick(_: number, __: number): void{}
    public destroy(): void{
        this.parent = undefined;
        this.children.forEach(c => c.destroy())
        this.children.splice(0)
    }
}