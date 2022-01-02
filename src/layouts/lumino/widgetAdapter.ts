import { Widget } from "@lumino/widgets";
import { Message } from "@lumino/messaging";
import { css } from "../../common";

export const WidgetAdapterCSS = css`
.lm-Widget {
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    cursor: default;
}
  
.lm-Widget.lm-mod-hidden {
    display: none !important;
}`;

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
