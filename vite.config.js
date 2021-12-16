import { defineConfig } from "vite";
import { apiExtractor } from "rollup-plugin-api-extractor";

export default defineConfig({
    resolve: {
        alias: {
        },
    },
    plugins: [
        apiExtractor({
            configFile: "./api-extractor.json",
            configurationXXX: {
                projectFolder: ".",
                mainEntryPointFilePath: "<projectFolder>/types/index.d.ts",
                "dtsRollup": {
                    "enabled": true,
                    "untrimmedFilePath": "<projectFolder>/dist/index.d.ts"
                },
            }
        })
    ]
});
