import path from "path";

// vite.config.js
export default {
    resolve: {
        alias: {
            // crypto: "",
            "@hpcc-js/wc-core": path.resolve(__dirname, "./packages/core/src/index.ts"),
            "@hpcc-js/wc-editor": path.resolve(__dirname, "./packages/editor/src/index.ts"),
            "@hpcc-js/wc-gauge": path.resolve(__dirname, "./packages/gauge/src/index.ts"),
            "@hpcc-js/wc-layout": path.resolve(__dirname, "./packages/layout/src/index.ts"),
            "@hpcc-js/wc-legacy": path.resolve(__dirname, "./packages/legacy/src/index.ts"),
            "@hpcc-js/wc-observable": path.resolve(__dirname, "./packages/observable/src/index.ts"),
            "@hpcc-js/wc-pie": path.resolve(__dirname, "./packages/pie/src/index.ts"),
            "@hpcc-js/wc-preview": path.resolve(__dirname, "./packages/preview/src/index.ts"),
            "@hpcc-js/wc-sankey": path.resolve(__dirname, "./packages/sankey/src/index.ts"),
            "@hpcc-js/wc-treemap": path.resolve(__dirname, "./packages/treemap/src/index.ts")
        },
    },
}