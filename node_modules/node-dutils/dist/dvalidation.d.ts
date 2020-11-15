export declare function throwIfNotFullValidation(obj: Object, rules: Object): void;
export declare function throwIfNotPartialValidation(obj: Object, rules: Object): void;
export declare function fullValidation(obj: Object, rules: Object): string | true;
export declare function partialValidation(obj: Object, rules: Object): string | true;
export declare function validate(key: string, val: any, rule: string): true | string;
