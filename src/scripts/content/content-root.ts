import { ClickEvent } from "../events/types";
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

    public triggerChange(): void {
        this.onChangeCallback?.();
    }

    public handleClick(click: ClickEvent): void {
        this.content.handleClick(click);
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