import { HPCCCodemirrorElement } from "../codemirror";
import { HPCCResizeElement, attribute, ChangeMap, customElement, css, display, html, ref } from "../common";

const template = html<HPCCPreviewElement>`\
<div>
    <div ${ref("_iframeDiv")}>
    </div>
    <hpcc-codemirror ${ref("_cm")}></hpcc-codemirror>
</div>`;

const styles = css`
${display("inline")} 

:host > div {
    flex-direction: column;
}

:host > div > div {
    padding-bottom: 4px;
}

:host > div > hpcc-codemirror {
    padding-top: 4px;
}
`;

@customElement("hpcc-preview", { template, styles })
export class HPCCPreviewElement extends HPCCResizeElement {

    /**
     * Border style for the preview iframe
     *
     * @defaultValue "1px solid #ccc"
    */
    @attribute previewBorder = "1px solid #ccc";

    /**
     * Force full reload of iframe, on each change.
     * 
     * @defaultValue false
     */
    @attribute({ mode: "boolean" }) fullReload = false;

    /**
     * Force full reload of iframe, on each change.
     * 
     * @defaultValue ""
     */
    @attribute headExt = "";

    @attribute content = "";

    protected _iframeDiv: HTMLDivElement;
    protected _iframe: HTMLIFrameElement;
    protected _cm: HPCCCodemirrorElement;

    gatherScripts(node: HTMLElement, scripts: string[]) {
        Array.prototype.slice
            .call(node.children, 0)
            .filter((child) => child !== this)
            .filter((child) => {
                return child.tagName !== "hpcc-preview".toUpperCase();
            })
            .forEach((child) => {
                if (child.tagName === "SCRIPT") {
                    scripts.push(child.outerHTML.toString());
                }
                // this.gatherScripts(child, scripts);
            });
    }

    protected _head = "";
    protected _scripts: string[] = [];

    enter() {
        super.enter();
        this._head = document.head.innerHTML.toString();
        const codeElements = this.getElementsByTagName("code")[0];
        this._cm.content = codeElements?.innerText ?? "" + this.innerHTML;
        this.gatherScripts(document.body, this._scripts);
        this._cm.addEventListener("change", (evt) => {
            this.content = this._cm.content.trim();
        });
    }

    update(changes: ChangeMap) {
        super.update(changes);
        if (changes.content) {
            if (!this._iframe || this.fullReload) {
                this._iframeDiv.innerHTML = "";
                this._iframe = document.createElement("iframe");
                this._iframe.style.border = this.previewBorder;
                this._iframe.width = `${this.width}`;
                this._iframe.height = `${this.height}`;
                this._iframeDiv.append(this._iframe);
            }
            this._iframe.contentWindow?.document.open();
            this._iframe.contentWindow?.document.write(`\
<head>
${this._head}
</head>

<body style="overflow:hidden">
<div>
${this._cm.content.trim()}
</div>
${this._scripts.join("\n")}
</body>`);
            this._iframe.contentWindow?.document.close();
        }
    }
}
