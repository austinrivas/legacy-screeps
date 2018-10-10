import {assert} from "chai";
import {loop} from "../src/main";

describe("main", () => {
    before(() => {
        // runs before all tests in this block
    });

    beforeEach(() => {
        // runs before each test in this block
    });

    it("should export a loop function", () => {
        assert.isTrue(typeof loop === "function");
    });

    it("should return void when called with no context", () => {
        assert.isUndefined(loop());
    });
});
