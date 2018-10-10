import {assert} from "chai";
import {DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL, DONE_RENEW_LIFE, LOG_VSC_URL_TEMPLATE} from "../../src/config/config";

describe("config", () => {

    before(() => {
        // runs before all tests in this block
    });

    beforeEach(() => {
        // runs before each test in this block
    });

    it("should export LOG_VSC_URL_TEMPLATE function", () => {
        assert.isDefined(LOG_VSC_URL_TEMPLATE);
        assert.isTrue(typeof LOG_VSC_URL_TEMPLATE === "function");
    });

    it("calling LOG_VSC_URL_TEMPLATE should return a string", () => {
        assert.isTrue(typeof LOG_VSC_URL_TEMPLATE("path", "line") === "string");
    });

    it("should have renew values defined", () => {
      assert.isNumber(DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL);
      assert.isNumber(DONE_RENEW_LIFE);
    });
});
