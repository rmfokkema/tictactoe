import { Content, ContentParent } from "./content";

export class ContentRoot<TContent extends Content> implements Content, ContentParent{
    private onChangeCallback: (() => void) | undefined;
    public readonly content: TContent;
    private constructor(
        factory: (parent: ContentParent) => TContent
    ){
        this.content = factory(this);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.content.draw(ctx)
    }

    public willHandleClick(x: number, y: number): boolean {
        return this.content.willHandleClick(x, y)
    }

    public triggerChange(): void {
        this.onChangeCallback?.();
    }

    public handleClick(x: number, y: number): void {
        this.content.handleClick(x, y)
    }

    public addChild(): void {
        
    }

    public destroy(): void {
        this.content.destroy();
    }

    public onChange(callback: () => void): void{
        this.onChangeCallback = callback;
    }

    public static create<TContent extends Content>(factory: (parent: ContentParent) => TContent): ContentRoot<TContent>{
        return new ContentRoot(factory)
    }
}