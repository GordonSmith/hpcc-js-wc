import { css } from "../../common/element";
import { Widget } from "@lumino/widgets";

export const WidgetAdapterCSS = css`

.lm-Widget {
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    cursor: default;
}
  
.lm-Widget.lm-mod-hidden {
    display: none !important;
}
`;

export class WidgetAdapter extends Widget {

    constructor(node: Element) {
        super({ node: node as HTMLElement });
        this.addClass("hpcc-LuminoAdapter");
    }

    protected onResize(msg: Widget.ResizeMessage): void {
        super.onResize(msg);
    }
}
