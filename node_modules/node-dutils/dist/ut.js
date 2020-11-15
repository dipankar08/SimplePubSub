"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* Dipankar's Fev UT libs */
const dlog_1 = require("./dlog");
class UT {
    constructor() {
        this.p_count = 0;
        this.f_count = 0;
    }
    check(observed, expected) {
        if (observed == expected) {
            dlog_1.DLog.s("Test pass");
            this.p_count++;
        }
        else {
            try {
                throw (new Error("Failed"));
            }
            catch (e) {
                let loc = e.stack.split("\n")[2];
                dlog_1.DLog.e(`Test Fail: Observed:<${observed}>, expected:<${expected}> at ${loc.trim()}`);
            }
            this.f_count++;
        }
    }
    report() {
        dlog_1.DLog.i(`
               
    -----------------------------------------------
        U T report
    -----------------------------------------------
    Total TC: ${this.p_count + this.f_count}
    Passed: ${this.p_count}
    Failed: ${this.f_count}
    -----------------------------------------------
    `);
    }
}
exports.UT = UT;
//# sourceMappingURL=ut.js.map