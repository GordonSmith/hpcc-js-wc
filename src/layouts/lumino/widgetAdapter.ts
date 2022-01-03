import { Widget } from "@lumino/widgets";
import { Message } from "@lumino/messaging";

export class WidgetAdapter extends Widget {

    constructor(node: Element) {
        super({ node: node as HTMLElement });
        this.addClass("hpcc-LuminoAdapter");
    }

    protected onResize(msg: Widget.ResizeMessage): void {
        super.onResize(msg);
    }

    protected onCloseRequest(msg: Message): void {
        super.onCloseRequest(msg);
    }
}
