import { HPCCCodemirrorElement } from ".";
import { HPCCResizeElement, ChangeMap, customElement, css, html, ref } from "../common/hpcc-element";

const template = html<HPCCPreviewElement>`
    <div>
        <div>
            <iframe ${ref("_iframe")} width="${(s) => s.width}" height="${(s) => s.height}" frameborder="0"> </iframe>
        </div>
        <hpcc-codemirror ${ref("_cm")}></hpcc-codemirror>
    </div>
`;

const styles = css`
    :host > div {
        flex-direction: column;
    }

    :host > div > div {
        padding-bottom: 4px;
    }

    :host iframe {
        border: 1px solid #ccc;
    }

    :host > div > hpcc-codemirror {
        padding-top: 4px;
    }
`;

@customElement({ name: "hpcc-preview", template, styles })
export class HPCCPreviewElement extends HPCCResizeElement {
    _iframe: HTMLIFrameElement;
    _cm: HPCCCodemirrorElement;

    gatherScripts(node: HTMLElement, scripts: string[]): HTMLElement {
        const retVal = node.cloneNode() as typeof node;
        Array.prototype.slice
            .call(node.children, 0)
            .filter((child) => child !== this)
            .filter((child) => {
                return child.tagName !== "hpcc-preview".toUpperCase();
            })
            .forEach((child) => {
                if (child.tagName === "SCRIPT") {
                    scripts.push(child.outerHTML);
                }
                const clone = this.gatherScripts(child, scripts);
                retVal.append(clone);
            });
        return retVal;
    }

    enter() {
        super.enter();
        const head = document.head.innerHTML;
        const scripts = [];
        const clone = this.gatherScripts(document.body, scripts);
        const body = clone.innerHTML;
        const codeElements = this.getElementsByTagName("code")[0];
        this._cm.text = codeElements?.innerText ?? "" + this.innerHTML;
        this._cm.addEventListener("change", (evt) => {
            this._iframe.contentWindow?.document.write(`
<head>
${head}
</head>

<body style="overflow:hidden">
${this._cm.text.trim()}
${scripts}
</body>
`);
            this._iframe.contentWindow?.document.close();
        });
    }

    update(changes: ChangeMap) {
        super.update(changes);
    }
}
