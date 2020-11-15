"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DTypes;
(function (DTypes) {
    function isTrue(s) {
        return (s == 'true' || s == true || s == 'True' || s == 'TRUE');
    }
    DTypes.isTrue = isTrue;
    function isFalse(s) {
        return (s == 'false' || s == false || s == 'False' || s == 'FALSE');
    }
    DTypes.isFalse = isFalse;
})(DTypes = exports.DTypes || (exports.DTypes = {}));
//# sourceMappingURL=dtypes.js.map