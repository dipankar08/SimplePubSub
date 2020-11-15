"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let colorogs = require('color-logs');
let _log = colorogs(true, true, __filename);
var DLog;
(function (DLog) {
    function d(msg) {
        _log.debug(msg);
    }
    DLog.d = d;
    function e(msg) {
        _log.error(msg);
    }
    DLog.e = e;
    function i(msg) {
        _log.info(msg);
    }
    DLog.i = i;
    function s(msg) {
        _log.info(msg);
    }
    DLog.s = s;
})(DLog = exports.DLog || (exports.DLog = {}));
//# sourceMappingURL=dlog.js.map