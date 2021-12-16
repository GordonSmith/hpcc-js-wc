/* eslint-disable @typescript-eslint/no-var-requires */
function for_inline_plugin(md, ruleName, tokenType, iterator) {

    function scan(state) {
        var i, blkIdx, inlineTokens;

        for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
            if (state.tokens[blkIdx].type !== tokenType) {
                continue;
            }

            iterator(state.tokens, blkIdx);
        }
    }

    md.core.ruler.push(ruleName, scan);
}

var md = require("markdown-it")();

md.core.ruler.before("normalize", "my_rule", function replace(state) {
    state.src = state.src.split("#### h4 Heading").join("**h4 Heading**");
});

const { ApiModel, ApiPackage } = require("@microsoft/api-extractor-model");

const apiModel = new ApiModel();
const apiPackage = apiModel.loadPackage("./temp/web-components.api.json");

const structs = {};
const markdown = {};

for (const entyrPoint of apiPackage.members) {
    for (const struct of entyrPoint.members) {
        if (struct.displayName.indexOf("HPCC") === 0 && struct.displayName.indexOf("Element") > 0) {
            structs[struct.displayName] = {
                ...struct,
                members: {}
            };
            for (const prop of struct.members) {
                if (prop.tsdocComment) {
                    structs[struct.displayName].members[prop.displayName] = prop;
                    const params = prop.tsdocComment.params?.blocks?.map(p => {
                        return `${p.parameterName}: ${p.kind}`;
                    }) || [];

                    const content = `
### \`${prop.displayName}\`

**Signature:**
  
\`\`\`tyepscript
${prop.excerpt?.text}
\`\`\`

${params.join("\n")}
`;
                    markdown[struct.displayName + "." + prop.displayName] = content;
                }
            }
        }
    }
}

console.log(structs);

console.log(md.render(`
---
# h1 Heading

abcdefg

## h2 Heading

123123123

### h3 Heading
### \`h3 coderef\`
#### h4 Heading
##### h5 Heading
###### h6 Heading
___

---

***

`));