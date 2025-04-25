import type { CustomPointerEventMap } from "../pointer-events/types"
import type { MarkSlot } from "../ui"
import type { Destroyable } from "./destroyable";
import type { MarkParent } from "./mark-parent";

export class O implements Destroyable {
    private readonly doubleClickListener: (ev: CustomPointerEventMap['dblclick']) => void

    public constructor(
        private readonly cell: MarkSlot,
        parent: MarkParent
    ){
        cell.displayO();
        this.doubleClickListener = () => parent.notifyMarkDoubleClicked();
        cell.addEventListener('dblclick', this.doubleClickListener);
        cell.addEventListener('click', () => parent.notifyMarkClicked());
    }

    public destroy(): void {
        this.cell.removeEventListener('dblclick', this.doubleClickListener);
    }
}