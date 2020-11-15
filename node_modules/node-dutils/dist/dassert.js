"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const underscore_1 = __importDefault(require("underscore"));
var DAssert;
(function (DAssert) {
    function verifyOrThrow(cond, msg) {
        if (!cond) {
            throw Error(msg);
        }
    }
    DAssert.verifyOrThrow = verifyOrThrow;
    function verifyNotNullAndEmpty(data, msg) {
        if (underscore_1.default.isNull(data) || underscore_1.default.isUndefined(data) || underscore_1.default.isEmpty(data)) {
            throw Error(msg);
        }
    }
    DAssert.verifyNotNullAndEmpty = verifyNotNullAndEmpty;
    function verifyObject(data, msg) {
        if (underscore_1.default.isArray(data)) {
            throw Error(msg);
        }
        if (!underscore_1.default.isObject(data)) {
            throw Error(msg);
        }
    }
    DAssert.verifyObject = verifyObject;
    function verifyArray(data, msg) {
        if (!underscore_1.default.isArray(data)) {
            throw Error(msg);
        }
    }
    DAssert.verifyArray = verifyArray;
    function verifyString(data, msg) {
        if (!underscore_1.default.isString(data)) {
            throw Error(msg);
        }
    }
    DAssert.verifyString = verifyString;
})(DAssert = exports.DAssert || (exports.DAssert = {}));
//# sourceMappingURL=dassert.js.map