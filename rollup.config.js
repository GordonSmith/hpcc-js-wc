import alias from "@rollup/plugin-alias";
import resolve from "@rollup/plugin-node-resolve";
import commonJS from "@rollup/plugin-commonjs";
import transformTaggedTemplate from "rollup-plugin-transform-tagged-template";
import filesize from "rollup-plugin-filesize";
import { terser } from "rollup-plugin-terser";

import * as pkg from "./package.json";

function transformHTMLFragment(data) {
    data = data.replace(/\s*([<>])\s*/g, "$1"); // remove spaces before and after angle brackets
    return data.replace(/\s{2,}/g, " "); // Collapse all sequences to 1 space
}

function transformCSSFragment(data) {
    if (/\/\*(?![\s\S]*\*\/)[\s\S]*/g.test(data)) {
        throw new Error("Unterminated comment found in CSS tagged template literal");
    }

    return data.replace(
        /(?:\s*\/\*(?:[\s\S])+?\*\/\s*)|(?:;)\s+(?=\})|\s+(?=\{)|(?<=:)\s+|\s*([{};,])\s*/g,
        "$1"
    );
}

const parserOptions = {
    sourceType: "module",
};

export default [
    {
        input: "dist/index.js",
        treeshake: {
            // preset: "smallest",
            // moduleSideEffects: false,
        },
        output: [
            {
                file: pkg.jsdelivr,
                format: "es",
                plugins: [terser()],
            },
        ],
        plugins: [
            alias({
                entries: [
                    // { find: "crypto", replacement: "" },
                    // { find: '@hpcc-js/util', replacement: '@hpcc-js/util/lib-es6/index.js' },
                ]
            }),
            resolve(),
            commonJS(),
            transformTaggedTemplate({
                tagsToProcess: ["css"],
                transformer: transformCSSFragment,
                parserOptions,
            }),
            transformTaggedTemplate({
                tagsToProcess: ["html"],
                transformer: transformHTMLFragment,
                parserOptions,
            }),
            filesize({
                showMinifiedSize: false,
                showBrotliSize: true,
            }),
        ],
    },
];