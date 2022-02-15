import { terser } from "rollup-plugin-terser";
import { treeshake, plugins } from "../rollup.config";

import * as pkg from "../package.json";

export default [
    {
        input: "dist/esm/index.js",
        output: [
            {
                file: pkg.jsdelivr.split(".min").join(""),
                format: "umd",
                sourcemap: true,
                plugins: [],
                name: pkg.name
            },
            {
                file: pkg.jsdelivr,
                format: "umd",
                sourcemap: true,
                plugins: [terser()],
                name: pkg.name
            },
            {
                file: pkg.jsdelivr.split(".umd").join(".esm").split(".min").join(""),
                format: "es",
                sourcemap: true,
                plugins: [],
                name: pkg.name
            },
            {
                file: pkg.jsdelivr.split(".umd").join(".esm"),
                format: "es",
                sourcemap: true,
                plugins: [terser()],
                name: pkg.name
            }
        ],
        treeshake,
        plugins,
    },
];
