let  colorogs = require('color-logs')
let _log = colorogs(true, true, __filename);
export namespace DLog {
    export function d(msg: String, msg2: any = null) {
        _log.debug("[DEBUG] " + msg, msg2 ? msg2 : "");
    }
    export function e(msg: String, msg2: any = null) {
        _log.error("[ERROR] " + msg, msg2);
    }
    export function i(msg: String, msg2: any = null) {
        _log.info("[INFO] " + msg, msg2);
    }
    export function s(msg: String, msg2: any = null) {
        _log.info("[INFO] " + msg, msg2);
    }
    // exception as fetal
    export function ex(e: any) {
        _log.error("[EXCEPTON] Unwanted Exception: "+e.message, e.stack);
        console.log(e);
    }
     // exception as expected!
     export function exe(e: Error) {
        _log.debug("[EXCEPTON] Exception as Expected", e.message, e.stack);
    }
}