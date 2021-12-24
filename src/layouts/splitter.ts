import { display } from "@microsoft/fast-foundation";
import { HPCCResizeElement, customElement, css, html, ref, ChangeMap, attribute } from "../common/element";
import { SplitPanel, Widget } from "@lumino/widgets";
import { MessageLoop } from "@lumino/messaging";
import { WidgetAdapterCSS, WidgetAdapter } from "./lumino/widgetAdapter";
import { splitpanel } from "./lumino/styles";

const template = html<HPCCSplitterElement>`
    <div ${ref("_div")} style="width:${s => s.width};height:${s => s.height}">
    </div>
`;

const styles = css`
${display("inline")} :host {
}

:host > div {
}

${WidgetAdapterCSS}

${splitpanel}

.hpcc-LuminoAdapter {
    padding: 8px;
    border: 1px solid #c0c0c0;
}
`;

@customElement({ name: "hpcc-splitter", template, styles })
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

    _div: HTMLDivElement;

    protected _splitPanel = new SplitPanel({ orientation: "horizontal" });

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
