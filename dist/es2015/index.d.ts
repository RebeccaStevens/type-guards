import * as fp from './fp';
import { Basic, BasicString, Dict, Guard, GuardWithShape, Optional, OptionalGuard, Omit, Shape, StringToBasic, Unshape, FromGuard } from './types';
export { Guard, GuardWithShape, Optional, OptionalGuard, Dict, Shape, Omit, FromGuard };
export declare const isOneOf: typeof fp.or;
export { fp };
export declare function is<T>(t: T): (input: any) => input is T;
export declare function isNot<T, N extends T>(not: N): (input: T) => input is Exclude<T, N>;
export declare function isOfBasicType<T extends BasicString>(basicString: T): Guard<StringToBasic<T>>;
/**
 * Create a validator that asserts the passed argument is instance of the given constructor.
 */
export declare function isInstanceOf<T>(ctor: (new (...args: any[]) => T) | (Function & {
    prototype: T;
})): (x: any) => x is T;
/**
 * Create a validator that asserts the passed argument is exactly `null`,
 * just like `input === null`.
 */
export declare const isNull: (arg: any) => arg is null;
/**
 * Create a validator that asserts the passed argument is exactly `undefined`,
 * just like `input === undefined`.
 */
export declare const isUndefined: (arg: any) => arg is undefined;
/**
 * Create a validator that asserts the passed argument is either `null` or `undefined`,
 * just like `input == null`.
 */
export declare const isNullOrUndefined: Guard<null | undefined>;
/**
 * Alias for isNullOrUndefined.
 * Just like `input == null`.
 */
export declare const isNullish: Guard<null | undefined>;
/**
 * Create a validator that asserts the passed argument is not `null`,
 * just like `input !== null`.
 */
export declare function isNotNull<T>(arg: T): arg is Exclude<T, null>;
/**
 * Create a validator that asserts the passed argument is not `undefined`,
 * just like `input !== undefined`.
 */
export declare function isNotUndefined<T>(arg: T): arg is Exclude<T, undefined>;
/**
 * Create a validator that asserts the passed argument is neither `null` or `undefined`,
 * just like `input != null`.
 * @param arg
 */
export declare function isNotNullOrUndefined<T>(arg: T): arg is Exclude<T, null | undefined>;
/**
 * Alias for isNotNullOrUndefined.
 * Just like `input != null`.
 */
export declare const isNotNullish: typeof isNotNullOrUndefined;
/**
 * Create a validator that asserts the passed argument is of type `'number'`,
 * just like `typeof input == 'number'`.
 */
export declare const isNumber: (arg: any) => arg is number;
/**
 * Create a validator that asserts the passed argument is of type `'string'`,
 * just like `typeof input == 'string'`.
 */
export declare const isString: Guard<string>;
/**
 * Create a validator that asserts the passed argument is of type `'boolean'`,
 * just like `typeof input == 'boolean'`.
 */
export declare const isBoolean: Guard<boolean>;
/**
 * Create a validator that asserts the passed argument is of type `'function'`,
 * just like `typeof input == 'function'`.
 */
export declare const isFunction: Guard<Function>;
/**
 * Create a validator that asserts the passed argument is of type `'object'`,
 * just like `typeof input == 'object'`.
 *
 * You are probably looking for `isOfShape` which lets you specify what kind of
 * keys and values should the object consist of.
 */
export declare const isObject: Guard<object>;
/**
 * Create a validator that asserts the passed argument is one of the given values.
 * Usually used for enumerations, but does not require the elements of enumeration
 * to be of the same type.
 *
 * It's a shorter way to say `oneIf(is('a'), is('b'), is('c'))` by saying
 * `isEnum('a', 'b', 'c')`.
 */
export declare function isEnum<T>(...enums: T[]): Guard<T>;
export declare function isEnum(...enums: Basic[]): (input: any) => boolean;
/**
 * Create a validator that asserts that passed argument is an array. Accepts another
 * type guard which is used for every item of the array.
 */
export declare function isArrayOf<T extends Dict>(itemGuard: GuardWithShape<T>): GuardWithShape<T[]>;
export declare function isArrayOf<T>(itemGuard: Guard<T>): Guard<T[]>;
/**
 * Create a validator that asserts that passed guard passes for the given value,
 * or that that value is not set.
 */
export declare function optional<T>(guard: Guard<T>): OptionalGuard<T>;
export declare function isOfExactShape<V extends Dict, T extends Shape<V> = Shape<V>>(shape: T): GuardWithShape<Unshape<T>>;
/**
 * Create a validator that asserts that passed argument is an object of a certain shape.
 * Accepts an object of guards.
 */
export declare function isOfShape<V extends Dict, T extends Shape<V> = Shape<V>>(shape: T, exact?: boolean): GuardWithShape<Unshape<T>>;
/**
 * Create a validator that asserts that passed argument is a tuple of certain elements.
 */
export declare function isTuple<A>(a: Guard<A>): Guard<[A]>;
export declare function isTuple<A, B>(a: Guard<A>, b: Guard<B>): Guard<[A, B]>;
export declare function isTuple<A, B, C>(a: Guard<A>, b: Guard<B>, c: Guard<C>): Guard<[A, B, C]>;
/**
 * Create a validator which modifies an existing shape guard. Allows you to pick
 * one or more keys which you want to keep from the object, and discard others.
 *
 * If you want to keep a lot of keys, check out `omit`.
 *
 * @example
 * The following two asserts result in the same guard.
 *
 * ```ts
 * const assert1 = isOfShape({a: isNumber})
 * const assert2 = pick(isOfShape({a: isNumber, b: isString}, 'a')
 * ```
 */
export declare function pick<T extends Dict, K1 extends keyof T>(guard: GuardWithShape<T>, key1: K1): GuardWithShape<Pick<T, K1>>;
export declare function pick<T extends Dict, K1 extends keyof T, K2 extends keyof T>(guard: GuardWithShape<T>, key1: K1, key2: K2): GuardWithShape<Pick<T, K1 | K2>>;
export declare function pick<T extends Dict, K1 extends keyof T, K2 extends keyof T, K3 extends keyof T>(guard: GuardWithShape<T>, key1: K1, key2: K2, key3: K3): GuardWithShape<Pick<T, K1 | K2 | K3>>;
/**
 * Create a validator which modifies an existing shape guard. Allows you to omit
 * one or more keys which you want to remove form the object, and keep others.
 *
 * If you want to discard a lot of keys, check out `pick`.
 *
 * @example
 * The following two asserts result in the same guard.
 *
 * ```ts
 * const assert1 = isOfShape({a: isNumber})
 * const assert2 = omit(isOfShape({a: isNumber, b: isString}, 'b')
 * ```
 */
export declare function omit<T extends Dict, K1 extends keyof T>(guard: GuardWithShape<T>, key1: K1): GuardWithShape<Omit<T, K1>>;
export declare function omit<T extends Dict, K1 extends keyof T, K2 extends keyof T>(guard: GuardWithShape<T>, key1: K1, key2: K2): GuardWithShape<Omit<T, K1 | K2>>;
export declare function omit<T extends Dict, K1 extends keyof T, K2 extends keyof T, K3 extends keyof T>(guard: GuardWithShape<T>, key1: K1, key2: K2, key3: K3): GuardWithShape<Omit<T, K1 | K2 | K3>>;
/**
 * Allows every value in a shape to be undefined.
 */
export declare function partial<T extends Dict>(guard: GuardWithShape<T>): GuardWithShape<Partial<T>>;
/**
 * Create a utility function which will throw if the given condition is not satisfied,
 * and which will return the correct type.
 *
 * @param guard
 * @param defaultErrorMessage
 */
export declare function throwIf<T>(guard: Guard<T>, defaultErrorMessage?: string): <V>(input: V, additionalErrorMessage?: string | undefined) => Exclude<V, T>;
