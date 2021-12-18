import { display } from "@microsoft/fast-foundation";
import { HPCCResizeElement, attribute, customElement, css, html, ref, ChangeMap } from "../common/hpcc-element";
import { SplitPanel, Widget, Panel, Layout, SplitLayout } from "@lumino/widgets";
import { MessageLoop } from "@lumino/messaging";

const template = html<HPCCSplitterElement>`
    <div ${ref("_div")}>
    </div>
`;

const styles = css`
${display("inline")} :host {
}

:host > div {
}

.widget-placeholder {
    padding: 8px;
    border: 1px solid #c0c0c0;
}

.lm-Widget {
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  cursor: default;
}

.lm-Widget.lm-mod-hidden {
  display: none !important;
}

.lm-SplitPanel-child {
  z-index: 0;
}

.lm-SplitPanel-handle {
  z-index: 1;
}

.lm-SplitPanel-handle.lm-mod-hidden {
  display: none !important;
}

.lm-SplitPanel-handle:after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: '';
}

.lm-SplitPanel[data-orientation='horizontal'] > .lm-SplitPanel-handle {
  cursor: ew-resize;
}

.lm-SplitPanel[data-orientation='vertical'] > .lm-SplitPanel-handle {
  cursor: ns-resize;
}

.lm-SplitPanel[data-orientation='horizontal'] > .lm-SplitPanel-handle:after {
  left: 50%;
  min-width: 8px;
  transform: translateX(-50%);
}

.lm-SplitPanel[data-orientation='vertical'] > .lm-SplitPanel-handle:after {
  top: 50%;
  min-height: 8px;
  transform: translateY(-50%);
}
`;

export class WidgetPlaceholder extends Widget {

    constructor(node: Element) {
        super({ node: node as HTMLElement });
        this.addClass("widget-placeholder");
    }

    protected onResize(msg: Widget.ResizeMessage): void {
        super.onResize(msg);
    }
}

@customElement({ name: "hpcc-splitter", template, styles })
export class HPCCSplitterElement extends HPCCResizeElement {

    _div: HTMLDivElement;

    protected _splitPanel = new SplitPanel({ orientation: "horizontal" });
    protected _widgets: WidgetPlaceholder[] = [];

    enter() {
        super.enter();
        MessageLoop.sendMessage(this._splitPanel, Widget.Msg.BeforeAttach);
        this._div.append(this._splitPanel.node);
        MessageLoop.sendMessage(this._splitPanel, Widget.Msg.AfterAttach);
        const codeElements = this.children;
        for (let i = codeElements.length - 1; i >= 0; --i) {
            this._widgets.unshift(new WidgetPlaceholder(codeElements[i]));
        }
        this._widgets.forEach((w) => {
            this._splitPanel.addWidget(w);
        });
    }

    update(changes: ChangeMap) {
        super.update(changes);
        const height = this._widgets.reduce((prev, curr) => {
            return prev >= curr.node.clientHeight ? prev : curr.node.clientHeight;
        }, 0);
        this._splitPanel.node.style.height = `${height + 2}px`;
        this._splitPanel.update();
    }

    exit() {
        MessageLoop.sendMessage(this._splitPanel, Widget.Msg.BeforeDetach);
        this._splitPanel.node.parentNode?.removeChild(this._splitPanel.node);
        MessageLoop.sendMessage(this._splitPanel, Widget.Msg.AfterDetach);
        super.exit();
    }
}
