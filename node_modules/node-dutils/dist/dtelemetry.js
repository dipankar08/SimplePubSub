"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dlog_1 = require("./dlog");
var rp = require('request-promise');
const _ = require('underscore');
var DTelemetry;
(function (DTelemetry) {
    var session = null;
    var app_id = null;
    var pendingItems = [];
    async function markAction(tag, extra = {}) {
        var res = {};
        res['type'] = 'action';
        res['tag'] = tag;
        let obj = _.extend(res, extra);
        dlog_1.DLog.d("Doing markAction", obj);
        pump('http://simplestore.dipankar.co.in/api/_analytics/action', obj);
    }
    DTelemetry.markAction = markAction;
    async function markHits(extra = {}) {
        extra['type'] = 'hit_tracker';
        pump('http://simplestore.dipankar.co.in/api/_analytics/hit_tracker', extra);
    }
    DTelemetry.markHits = markHits;
    async function markException(e, extra = {}) {
        let errObj = { type: "exception", "error": e.name, location: e.stack.split("\n")[1].trim(), stack: e.stack };
        let obj = _.extend(errObj, extra);
        pump('http://simplestore.dipankar.co.in/api/_analytics/exception', obj);
    }
    DTelemetry.markException = markException;
    async function init(napp_id) {
        app_id = napp_id;
        let body = { "type": "launch", "app_id": app_id, "app_version": "1.0", "device_os": "linux", "device_id": "linux", "device_api": "0" };
        try {
            let result = await rp({
                method: 'POST',
                uri: 'http://simplestore.dipankar.co.in/api/analytics/launch',
                body: body,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true
            });
            dlog_1.DLog.d(result);
            session = result.out[0].session;
            pumpPending();
            dlog_1.DLog.s("Telemetry Init successs");
        }
        catch (e) {
            dlog_1.DLog.ex(e);
        }
    }
    DTelemetry.init = init;
    async function onDestory() {
        await pumpPending();
    }
    DTelemetry.onDestory = onDestory;
    async function pumpPending() {
        if (session != null) {
            for (var item of pendingItems) {
                await pump(item.url, item.data);
            }
            pendingItems = [];
        }
    }
    async function pump(url, data) {
        dlog_1.DLog.d(`pump called:${JSON.stringify(data)}`);
        if (session == null) {
            pendingItems.push({ url: url, data: data });
        }
        else {
            if (!data['session']) {
                data['session'] = 'no_session';
            }
            data['app_id'] = app_id;
            dlog_1.DLog.d(`Sending Logs: url: ${url}`, data);
            try {
                let result = await rp({
                    method: 'POST',
                    uri: url,
                    body: data,
                    headers: {
                        'User-Agent': 'Request-Promise'
                    },
                    json: true
                });
                dlog_1.DLog.d(result);
                dlog_1.DLog.s(`Telemetry push success:${JSON.stringify(result)}`);
            }
            catch (e) {
                dlog_1.DLog.e(`Telemetry Failed${JSON.stringify(e)}`);
                dlog_1.DLog.ex(e);
            }
        }
    }
})(DTelemetry = exports.DTelemetry || (exports.DTelemetry = {}));
//# sourceMappingURL=dtelemetry.js.map