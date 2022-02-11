export type TextSize = { width: number; height: number; };
let g_fontCanvas;
let g_fontSizeContext: CanvasRenderingContext2D;
const g_fontSizeContextCache: { [key: string]: TextSize } = {};

function globalCanvasElement() {
    if (!g_fontCanvas) {
        g_fontCanvas = document.getElementById("hpcc_js_font_size");
        if (!g_fontCanvas) {
            g_fontCanvas = document.createElement("canvas");
            g_fontCanvas.id = "hpcc_js_font_size";
            document.body.appendChild(g_fontCanvas);
        }
    }
    return g_fontCanvas;
}

function globalCanvasContext() {
    if (!g_fontSizeContext) {
        g_fontCanvas = globalCanvasElement();
        g_fontSizeContext = (g_fontCanvas as HTMLCanvasElement).getContext("2d")!;
    }
    return g_fontSizeContext;
}

export function textSize(_text: string | string[], fontName: string = "Verdana", fontSize: number = 12, bold: boolean = false): Readonly<TextSize> {
    g_fontSizeContext = globalCanvasContext();
    const text = _text instanceof Array ? _text : [_text];
    const hash = `${bold}::${fontSize}::${fontName}::${text.join("::")}`;
    let retVal = g_fontSizeContextCache[hash];
    if (!retVal) {
        g_fontSizeContext.font = `${bold ? "bold " : ""}${fontSize}px ${fontName}`;
        g_fontSizeContextCache[hash] = retVal = {
            width: Math.max(...text.map(t => g_fontSizeContext.measureText("" + t).width)),
            height: fontSize * text.length
        };
    }
    return retVal;
}

