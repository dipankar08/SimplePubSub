import { DLog } from "./dlog";

var rp = require('request-promise');
const _ = require('underscore');

type Item = {
    url: String,
    data: Object,
}

export namespace DTelemetry {
     var session: string = null;
     var app_id: string = null;

     var pendingItems: Array<Item> = []

    export async function markAction(tag: string, extra: Object = {}) {
        var res = {}
        res['type'] = 'action';
        res['tag'] = tag
        let obj = _.extend(res, extra)
        DLog.d("Doing markAction", obj)
        pump('http://simplestore.dipankar.co.in/api/_analytics/action', obj)
    }

    export async function markHits(extra: Object = {}) {
        extra['type'] = 'hit_tracker';
        pump('http://simplestore.dipankar.co.in/api/_analytics/hit_tracker', extra)
    }

    export async function markException(e: Error, extra: Object = {}) {
        let errObj = { type: "exception", "error": e.name, location: e.stack.split("\n")[1].trim(), stack: e.stack };
        let obj = _.extend(errObj, extra)
        pump('http://simplestore.dipankar.co.in/api/_analytics/exception', obj)
    }

    export async function init(napp_id: string) {
        app_id = napp_id
        let body = { "type": "launch", "app_id": app_id, "app_version": "1.0", "device_os": "linux", "device_id": "linux", "device_api": "0" }
        try {
            let result = await rp({
                method: 'POST',
                uri: 'http://simplestore.dipankar.co.in/api/analytics/launch',
                body: body,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true
            })
            DLog.d(result);
            session = result.out[0].session;
            pumpPending();
            DLog.s("Telemetry Init successs")
        } catch (e) {
            DLog.ex(e);
        }

    }

    export async function onDestory() {
        await pumpPending();
    }

    async function pumpPending() {
        if (session != null) {
            for (var item of pendingItems) {
                await pump(item.url, item.data);
            }
            pendingItems = [];
        }
    }

    async function pump(url: String, data: Object) {
        DLog.d(`pump called:${JSON.stringify(data)}`);
        if (session == null) {
            pendingItems.push({ url: url, data: data })
        } else {
            if (!data['session']) {
                data['session'] = 'no_session';
            }
            data['app_id'] = app_id;
            DLog.d(`Sending Logs: url: ${url}`, data)
            try {
                let result = await rp({
                    method: 'POST',
                    uri: url,
                    body: data,
                    headers: {
                        'User-Agent': 'Request-Promise'
                    },
                    json: true
                })
                DLog.d(result);
                DLog.s(`Telemetry push success:${JSON.stringify(result)}`)
            } catch (e) {
                DLog.e(`Telemetry Failed${JSON.stringify(e)}`);
                DLog.ex(e);
            }
        }
    }
}