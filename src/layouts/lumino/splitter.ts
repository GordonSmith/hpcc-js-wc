import { HPCCResizeElement, customElement, css, display, html, ref, ChangeMap, attribute } from "../../common";
import { SplitPanel, Widget } from "@lumino/widgets";
import { MessageLoop } from "@lumino/messaging";
import { WidgetAdapter } from "./widgetAdapter";
import { splitpanel, widget } from "./styles";

const template = html<HPCCSplitterElement>`\
<div ${ref("_div")}">
</div>`;

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
    protected _div: HTMLDivElement;

    constructor() {
        super();
    }

    enter() {
        super.enter();
        MessageLoop.sendMessage(this._splitPanel, Widget.Msg.BeforeAttach);
        this._div.append(this._splitPanel.node);
        MessageLoop.sendMessage(this._splitPanel, Widget.Msg.AfterAttach);
        const codeElements = this.children;
        for (let i = codeElements.length - 1; i >= 0; --i) {
            const node = codeElements[i] as HTMLElement;
            const w = new WidgetAdapter(node);
            this._splitPanel.insertWidget(0, w);
        }
    }

    update(changes: ChangeMap) {
        super.update(changes);
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
