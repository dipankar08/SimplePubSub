import _ from "underscore";

export namespace DAssert {
    export function verifyOrThrow(cond:boolean, msg: string) {
        if(!cond){
            throw Error(msg);
        }
    }
    export function verifyNotNullAndEmpty(data:any, msg: string) {
        if(_.isNull(data) || _.isUndefined(data) || _.isEmpty(data)){
            throw Error(msg);
        }
    }

    export function verifyObject(data:any, msg: string) {
        if(_.isArray(data)){
            throw Error(msg);
        }
        if(!_.isObject(data)){
            throw Error(msg);
        }
    }
    export function verifyArray(data:any, msg: string) {
        if(!_.isArray(data)){
            throw Error(msg);
        }
    }
    
    export function verifyString(data:any, msg: string) {
        if(!_.isString(data)){
            throw Error(msg);
        }
    }
}