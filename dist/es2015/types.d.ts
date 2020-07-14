export declare type BasicString = 'string' | 'boolean' | 'number' | 'object' | 'function';
export declare type Primitive = string | boolean | number;
export declare type Basic = Primitive | object | Function;
export declare type BasicToString<T extends Basic> = T extends string ? 'string' : T extends number ? 'number' : T extends boolean ? 'boolean' : T extends Function ? 'function' : T extends object ? 'object' : never;
export declare type StringToBasic<T extends BasicString> = T extends 'string' ? string : T extends 'number' ? number : T extends 'boolean' ? boolean : T extends 'function' ? Function : T extends 'object' ? object : never;
export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export declare type Dict = Record<string, any>;
export declare type Predicate<Input = any> = (input: Input) => boolean;
/**
 * A helper which allows you to utilize the type of validator without using the validator itself.
 *
 * @example
 * type NumberType = FromGuard<typeof isNumber>
 *
 * @example
 * const isUser = isOfShape({
 *   name: isString,
 *   age: isNumber,
 * })
 * type UserType = FromGuard<typeof isUser>
 * // same as:
 * type UserType2 = { name: string, age: number }
 */
export declare type FromGuard<T> = T extends GuardWithShape<infer V> ? V : T extends Guard<infer W> ? W : null;
export declare type Guard<T> = (input: any) => input is T;
export declare type GuardWithKnownInputType<I, T extends I> = (input: I) => input is T;
export declare type GuardWithShape<T> = Guard<T> & {
    shape: Shape<T>;
    exact: boolean;
};
export declare type GuardOrShape<T> = T extends Primitive ? Guard<T> : Shape<T>;
export declare type Shape<T extends Dict> = {
    [key in keyof T]: GuardOrShape<T[key]>;
};
export declare type Unguard<T> = T extends Guard<infer V> ? V : never;
export declare type Unshape<T extends Dict> = {
    [key in keyof T]: UnshapeOrUnguard<T[key]>;
};
export declare type UnshapeOrUnguard<T> = T extends Primitive ? never : T extends Guard<any> ? Unguard<T> : Unshape<T>;
