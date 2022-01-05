import { HPCCResizeElement, customElement, css, display, html, ref, ChangeMap, attribute } from "../../common";
import { SplitPanel, Widget } from "@lumino/widgets";
import { MessageLoop } from "@lumino/messaging";
import { WidgetAdapter } from "./widgetAdapter";
import { splitpanel, widget } from "./styles";

const template = html<HPCCSplitterElement>`\
<div ${ref("_div")}>
</div>
<slot ${ref("_slot")}></slot>`;

const styles = css`
${display("inline")} :host {
}

:host > div {
}

${widget}
${splitpanel}

.hpcc-LuminoAdapter {
    padding: 8px;
    border: 1px solid #c0c0c0;
}`;

@customElement("hpcc-splitter", { template, styles })
export class HPCCSplitterElement extends HPCCResizeElement {

    /**
     * The orientation of the splitter
     * 
     * @typeParam horizontal - Horizontal orientation
     * @typeParam vertical - Vertical orientation
     * 
     * @defaultValue "horizontal"
     */

    @attribute orientation: "horizontal" | "vertical" = "horizontal";

    protected _splitPanel = new SplitPanel({ orientation: "horizontal" });
    _div: HTMLDivElement;
    _slot: HTMLSlotElement;

    constructor() {
        super();
    }

    private _constructed = false;
    construct() {
        if (this._constructed) return;
        const codeElements = this._slot.assignedElements();
        this._constructed = codeElements.length > 0;
        for (let i = codeElements.length - 1; i >= 0; --i) {
            const e = codeElements[i] as HTMLElement;
            const w = new WidgetAdapter(e);
            this._splitPanel.insertWidget(0, w);
        }
    }

    enter() {
        super.enter();
        MessageLoop.sendMessage(this._splitPanel, Widget.Msg.BeforeAttach);
        this._div.append(this._splitPanel.node);
        MessageLoop.sendMessage(this._splitPanel, Widget.Msg.AfterAttach);
        this.construct();
    }

    update(changes: ChangeMap) {
        super.update(changes);
        this.construct();
        this._splitPanel.orientation = this.orientation;
        this._splitPanel.node.style.width = this.widthString;
        this._splitPanel.node.style.height = this.heightString;
        this._splitPanel.update();
    }

    exit() {
        MessageLoop.sendMessage(this._splitPanel, Widget.Msg.BeforeDetach);
        this._splitPanel.node.parentNode?.removeChild(this._splitPanel.node);
        MessageLoop.sendMessage(this._splitPanel, Widget.Msg.AfterDetach);
        super.exit();
    }
}
