export declare namespace DAssert {
    function verifyOrThrow(cond: boolean, msg: string): void;
    function verifyNotNullAndEmpty(data: any, msg: string): void;
    function verifyObject(data: any, msg: string): void;
    function verifyArray(data: any, msg: string): void;
    function verifyString(data: any, msg: string): void;
}
