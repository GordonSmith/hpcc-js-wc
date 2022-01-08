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
${display("inline-block")} 

:host {
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

    /**
     * The spacing between the panels in the splitter
     * 
     * @defaultValue 4
     */
    @attribute spacing: number = 4;

    protected _splitPanel = new SplitPanel({ orientation: this.orientation, spacing: this.spacing });
    protected _div: HTMLDivElement;
    protected _slot: HTMLSlotElement;

    constructor() {
        super();
    }

    private _constructed = false;
    construct() {
        if (this._constructed) return;
        const codeElements = this._slot.assignedElements();
        this._constructed = codeElements.length > 0;
        for (let i = 0; i < codeElements.length; ++i) {
            const e = codeElements[i] as HTMLElement;
            const w = new WidgetAdapter(this, e);
            this._splitPanel.addWidget(w);
        }
    }

    enter() {
        super.enter();
        Widget.attach(this._splitPanel, this._div);
        this.construct();
    }

    update(changes: ChangeMap) {
        super.update(changes);
        this.construct();
        this._splitPanel.orientation = this.orientation;
        this._splitPanel.spacing = this.spacing;
        this._splitPanel.node.style.width = `${this.clientWidth}px`;
        this._splitPanel.node.style.height = `${this.clientHeight}px`;
        this._splitPanel.update();
    }

    exit() {
        Widget.detach(this._splitPanel);
        super.exit();
    }
}
