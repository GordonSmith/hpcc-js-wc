import { display } from "@microsoft/fast-foundation";
import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { html as cmHtml } from "@codemirror/lang-html";
import { HPCCResizeElement, attribute, property, ChangeMap, customElement, css, html, ref } from "../base/hpcc-element";

const template = html<HPCCCodemirrorElement>`
<div ${ref("div")}>
</div>
`;

const styles = css`
${display("inline")} :host {
}

.cm-editor { 
    border: 1px solid #ddd;
}
`;

@customElement({ name: "hpcc-codemirror", template, styles })
export class HPCCCodemirrorElement extends HPCCResizeElement {

    @attribute width?: number | string = "100%";
    @attribute height?: number | string = "100%";
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
            this.view.dispatch({ changes: { from: 0, to: this.view.state.doc.length, insert: this.text } });
        }
    }
}
