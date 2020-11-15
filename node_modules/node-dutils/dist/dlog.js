"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let colorogs = require('color-logs');
let _log = colorogs(true, true, __filename);
var DLog;
(function (DLog) {
    function d(msg, msg2 = null) {
        _log.debug("[DEBUG] " + msg, msg2 ? msg2 : "");
    }
    DLog.d = d;
    function e(msg, msg2 = null) {
        _log.error("[ERROR] " + msg, msg2);
    }
    DLog.e = e;
    function i(msg, msg2 = null) {
        _log.info("[INFO] " + msg, msg2);
    }
    DLog.i = i;
    function s(msg, msg2 = null) {
        _log.info("[INFO] " + msg, msg2);
    }
    DLog.s = s;
    // exception as fetal
    function ex(e) {
        _log.error("[EXCEPTON] Unwanted Exception: " + e.message, e.stack);
        console.log(e);
    }
    DLog.ex = ex;
    // exception as expected!
    function exe(e) {
        _log.debug("[EXCEPTON] Exception as Expected", e.message, e.stack);
    }
    DLog.exe = exe;
})(DLog = exports.DLog || (exports.DLog = {}));
//# sourceMappingURL=dlog.js.map