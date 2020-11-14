"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dlog;
(function (dlog) {
    function d(msg) {
        console.log(`[DEBUG] ${JSON.stringify(msg)}`);
    }
    dlog.d = d;
    function e(msg) {
        console.log(`[ERROR] ${JSON.stringify(msg)}`);
    }
    dlog.e = e;
    function i(msg) {
        console.log(`[INFO ] ${JSON.stringify(msg)}`);
    }
    dlog.i = i;
    function trace() {
    }
    dlog.trace = trace;
})(dlog = exports.dlog || (exports.dlog = {}));
//# sourceMappingURL=dlog.js.map