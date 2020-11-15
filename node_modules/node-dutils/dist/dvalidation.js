"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// This will validate a value based on a list of rules.
const underscore_1 = __importDefault(require("underscore"));
function throwIfNotFullValidation(obj, rules) {
    let res = fullValidation(obj, rules);
    if (res != true) {
        throw (new Error(res));
    }
}
exports.throwIfNotFullValidation = throwIfNotFullValidation;
function throwIfNotPartialValidation(obj, rules) {
    let res = partialValidation(obj, rules);
    if (res != true) {
        throw (new Error(res));
    }
}
exports.throwIfNotPartialValidation = throwIfNotPartialValidation;
// The Full Validation, The object must ensure all item exist as per the rule.
// while considering the object might not enforce all the rules but
// existing object items must holds rule. 
function fullValidation(obj, rules) {
    if (obj && rules) {
        for (const [key, rule] of Object.entries(rules)) {
            let res = validate(key, obj[key], rule);
            if (res != true) {
                return res;
            }
        }
    }
    return true;
}
exports.fullValidation = fullValidation;
// In partial validation, we check object to be validated by rules 
// while considering the object might not enforce all the rules but
// existing object items must holds rule. 
function partialValidation(obj, rules) {
    if (obj && rules) {
        for (const [key, value] of Object.entries(obj)) {
            if (rules[key]) {
                let res = validate(key, value, rules[key]);
                if (res != true) {
                    return res;
                }
            }
        }
    }
    return true;
}
exports.partialValidation = partialValidation;
/*
Apply rules on the val
rules can be like:
required|string|number|bool|array|object|email|array_of_object|array_of_email|in:A,B|
*/
function validate(key, val, rule) {
    if (!rule) {
        return true;
    }
    let rules = rule.split("|").map(x => x.trim());
    for (var rule of rules) {
        switch (rule) {
            case 'required':
                if (val == null || val == undefined) {
                    return `Validation failed: The ${key} field is required`;
                }
                if (underscore_1.default.isString(val) && val.length == 0) {
                    return `Validation failed: The ${key} field must not empty`;
                }
                if (underscore_1.default.isArray(val) && val.length == 0) {
                    return `Validation failed: The ${key} field must not empty`;
                }
                break;
            case 'string':
                if (!val) {
                    continue;
                }
                if (val && !underscore_1.default.isString(val)) {
                    return `Validation failed: ${key} must be a string`;
                }
                break;
            case 'number':
            case 'int':
            case 'integer':
                if (!val) {
                    continue;
                }
                let isnum = /^\d+$/.test(val);
                if (!isnum) {
                    return `Validation failed: ${key} must be a number`;
                }
                break;
            case 'bool':
                if (!val) {
                    continue;
                }
                if (val && !underscore_1.default.isBoolean(val)) {
                    return `Validation failed: ${key} must be a boolean`;
                }
                break;
            case 'array':
                if (!val) {
                    continue;
                }
                if (val && !underscore_1.default.isArray(val)) {
                    return `Validation failed: ${key} must be a array`;
                }
                break;
            case 'object':
                if (!val) {
                    continue;
                }
                if (val && !underscore_1.default.isObject(val)) {
                    return `Validation failed: ${key} must be a object`;
                }
                break;
            case 'array_of_object':
                if (!val) {
                    continue;
                }
                if (!underscore_1.default.isArray(val)) {
                    return `Validation failed: ${key} must be a array of objects`;
                }
                for (var x of val) {
                    if (!underscore_1.default.isObject(x)) {
                        return `Validation failed: ${key} must be a arry of objects`;
                    }
                }
                break;
            case 'email':
                if (!val) {
                    continue;
                }
                const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!re.test(String(val).toLowerCase())) {
                    return `Validation failed: ${key} must be email`;
                }
                break;
            case 'list_of_email':
                if (!val) {
                    continue;
                }
                const re1 = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                for (var y of String(val).split(',').map(x => x.trim())) {
                    if (!re1.test(String(y).toLowerCase())) {
                        return `Validation failed: ${key} must be list of email`;
                    }
                }
                break;
            default:
                // Custom check
                if (rule.startsWith('in:')) {
                    if (!val) {
                        continue;
                    }
                    let in_rule = rule.replace('in:', '').split(",").map(x => x.trim()).filter(x => x.length > 0);
                    if (!underscore_1.default.contains(in_rule, val)) {
                        return `Validation failed: ${key} should be either of [${in_rule}]`;
                    }
                }
                else {
                    return `Validation failed: Found Invalid Rule [${rule}]`;
                }
                break;
            // Wanna to add more validation rule.. Please keep adding here. 
            // Please write UT before checkin.
        }
    }
    return true;
}
exports.validate = validate;
//# sourceMappingURL=dvalidation.js.map