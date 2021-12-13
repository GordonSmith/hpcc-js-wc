import { HPCCResizeElement, HPCCElement, attribute, property, volatile, ChangeMap, customElement, css, html, ref } from "../base/hpcc-element";
import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { html as cmHtml } from "@codemirror/lang-html";

class XML {

    parse(string, type: DOMParserSupportedType = "text/xml") {
        return new DOMParser().parseFromString(string, type);  // like JSON.parse
    }

    stringify(DOM) {
        return new XMLSerializer().serializeToString(DOM);                         // like JSON.stringify
    }

    transform(xml, xsl) {
        const proc = new XSLTProcessor();
        proc.importStylesheet(typeof xsl == "string" ? this.parse(xsl) : xsl);
        const output = proc.transformToFragment(typeof xml == "string" ? this.parse(xml) : xml, document);
        return typeof xml == "string" ? this.stringify(output) : output; // if source was string then stringify response, else return object
    }

    minify(node) {
        return this.toString(node, false);
    }

    prettify(node) {
        return this.toString(node, true);
    }

    toString(node, pretty, level = 0, singleton = false) {
        if (typeof node == "string") node = this.parse(node);
        const tabs = pretty ? Array(level + 1).fill("").join("\t") : "";
        const newLine = pretty ? "\n" : "";
        if (node.nodeType == 3) return (singleton ? "" : tabs) + node.textContent.trim() + (singleton ? "" : newLine);
        if (!node.tagName) return this.toString(node.firstChild, pretty);
        let output = tabs + `<${node.tagName}`; // >\n
        for (let i = 0; i < node.attributes.length; i++)
            output += ` ${node.attributes[i].name}="${node.attributes[i].value}"`;
        if (node.childNodes.length == 0) return output + " />" + newLine;
        else output += ">";
        const onlyOneTextChild = ((node.childNodes.length == 1) && (node.childNodes[0].nodeType == 3));
        if (!onlyOneTextChild) output += newLine;
        for (let i = 0; i < node.childNodes.length; i++)
            output += this.toString(node.childNodes[i], pretty, level + 1, onlyOneTextChild);
        return output + (onlyOneTextChild ? "" : tabs) + `</${node.tagName}>` + newLine;
    }
}

const template = html<HPCCCodemirrorElement>`
<div ${ref("div")} style="width:${s => s.width};height:${s => s.height}">
</div>
`;

const styles = css`
:host {
}

.cm-editor { 
    width: 100%; 
    height: 100%; 
    border: 1px solid #ddd;
}
`;

@customElement({ name: "hpcc-codemirror", template, styles })
export class HPCCCodemirrorElement extends HPCCResizeElement {

    @attribute width?: number | string;
    @attribute height?: number | string;
    @property text: string = "";
    private _text: string;

    div: HTMLDivElement;
    view: EditorView;

    enter() {
        super.enter();
        this.view = new EditorView({
            state: EditorState.create({
                doc: "",
                extensions: [basicSetup, cmHtml()]
            }),
            parent: this.div,
            dispatch: tr => {
                this.view.update([tr]);
                if (!tr.changes.empty) {
                    this._text = this.view.state.doc.toString();
                    this.$emit("change", this._text);
                }
            }
        });
    }

    update(changes: ChangeMap) {
        super.update(changes);
        if (changes.text) {
            const xml = new XML();
            const formatted = this.text;//xml.prettify(xml.parse(this.text));
            this.view.dispatch({ changes: { from: 0, to: this.view.state.doc.length, insert: formatted } });
        }
    }
}
