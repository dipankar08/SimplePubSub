export declare namespace DTelemetry {
    function markAction(tag: string, extra?: Object): Promise<void>;
    function markHits(extra?: Object): Promise<void>;
    function markException(e: Error, extra?: Object): Promise<void>;
    function init(napp_id: string): Promise<void>;
    function onDestory(): Promise<void>;
}
