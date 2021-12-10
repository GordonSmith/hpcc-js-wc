import * as React from "react";
import { expect } from "chai";

interface TestProps {
}

export const Test: React.FunctionComponent<TestProps> = ({
}) => {

    return <>
        {// #region snippet
        }
        {// #endregion snippet
        }
    </>;
};

const test1 = `
`;

describe("sankey", function () {
    it("simple", async function () {
        const v = "123abc";
        expect(v).to.be.a.string;
        expect(v).to.not.be.empty;
    });
});
