import { HPCCCodemirrorElement } from "../codemirror";
import { HPCCResizeElement, attribute, ChangeMap, customElement, css, display, html, ref } from "../common";

const template = html<HPCCPreviewElement>`\
<div ${ref("_iframeDiv")}>
</div>
<hpcc-codemirror ${ref("_cm")}></hpcc-codemirror>`;

const styles = css`
${display("inline-block")} 

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
     * @defaultValue ""
     */
    @attribute headExt = "";

    /**
     * Content to be displayed in the preview iframe
     * 
     * @defaultValue ""
     */
    @attribute content = "";

    protected _iframeDiv: HTMLDivElement;
    protected _iframe: HTMLIFrameElement;
    protected _cm: HPCCCodemirrorElement;
    protected _vitepress: boolean = false;

    gatherScripts(node: HTMLElement, scripts: string[]) {
        Array.prototype.slice
            .call(node.children, 0)
            .filter((child) => child !== this)
            .filter((child) => {
                return child.tagName !== "hpcc-preview".toUpperCase();
            })
            .forEach((child) => {
                if (child.tagName === "SCRIPT") {
                    if (child.src.indexOf("/@fs/") >= 0) {
                        this._vitepress = true;
                    }
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
        this._cm.text = codeElements?.innerText ?? "" + this.innerHTML;
        this.gatherScripts(document.body, this._scripts);
        this._cm.addEventListener("change", () => {
            this.content = this._cm.text.trim();
        });
    }

    update(changes: ChangeMap) {
        super.update(changes);
        if (changes.content) {
            this._iframeDiv.innerHTML = "";
            this._iframe = document.createElement("iframe");
            this._iframe.style.border = this.previewBorder;
            this._iframe.width = "100%";
            this._iframe.height = `${this.clientHeight * 2 / 3}`;
            this._iframeDiv.append(this._iframe);
            this._iframe.contentWindow?.document.open();
            this._iframe.contentWindow?.document.write(`\
<head>
${this._vitepress ? '<script src="/.vitepress/dist/assets/index.js"></script>' :
                    '<script src="/hpcc-js-wc/assets/index.umd.min.js"></script>'}
<style>
        body {
            margin: 0;
        }
    </style>
</head>

<body style="overflow:hidden">
<div>
${this._cm.text.trim()}
</div>
</body>`);
            this._iframe.contentWindow?.document.close();
        }
        this._cm.style.width = "100%";
        this._cm.style.height = `${this.clientHeight / 3}px`;
    }
}
