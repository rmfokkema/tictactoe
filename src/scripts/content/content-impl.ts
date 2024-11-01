import { ClickEvent, ClickEventAtTarget, isAccepted } from "../events/types";
import { Content, ContentParent } from "./content";

export class ContentImpl implements Content, ContentParent{
    private children: Content[] = [];
    protected parent: ContentParent | undefined
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
    protected handleClickOnSelf(click: ClickEventAtTarget): void{
        if(!isAccepted(click)){
            click.reject();
        }
    }
    public triggerChange(): void {
        this.parent?.triggerChange();
    }
    public draw(_: CanvasRenderingContext2D): void{}
    public handleClick(click: ClickEvent): void {
        const accepted = click.maybeAccepted();
        if(accepted){
            this.handleClickOnSelf(accepted);
            return;
        }
        const acceptable = click.atTarget(this);
        this.handleClickOnSelf(acceptable);
        if(acceptable.accepted || acceptable.rejected){
            return;
        }
        for(const child of this.children){
            const forChild = click.forChild();
            child.handleClick(forChild);
            if(forChild.accepted){
                return;
            }
        }
    }

    public destroy(): void{
        this.parent = undefined;
        this.children.forEach(c => c.destroy())
        this.children.splice(0)
    }
}