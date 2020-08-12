import * as fp from './fp';
export const isOneOf = fp.or;
export { fp };
export function is(t) {
    return (input) => input === t;
}
export function isNot(not) {
    return (input) => input !== not;
}
export function isOfBasicType(basicString) {
    return ((input) => typeof input == basicString);
}
/**
 * Create a validator that asserts the passed argument is instance of the given constructor.
 */
export function isInstanceOf(ctor) {
    return (input => input instanceof ctor);
}
/**
 * Create a validator that asserts the passed argument is exactly `null`,
 * just like `input === null`.
 */
export const isNull = is(null);
/**
 * Create a validator that asserts the passed argument is exactly `undefined`,
 * just like `input === undefined`.
 */
export const isUndefined = is(undefined);
/**
 * Create a validator that asserts the passed argument is either `null` or `undefined`,
 * just like `input == null`.
 */
export const isNullOrUndefined = isOneOf(isNull, isUndefined);
/**
 * Alias for isNullOrUndefined.
 * Just like `input == null`.
 */
export const isNullish = isNullOrUndefined;
/**
 * Create a validator that asserts the passed argument is not `null`,
 * just like `input !== null`.
 */
export function isNotNull(arg) {
    return arg !== null;
}
/**
 * Create a validator that asserts the passed argument is not `undefined`,
 * just like `input !== undefined`.
 */
export function isNotUndefined(arg) {
    return arg !== undefined;
}
/**
 * Create a validator that asserts the passed argument is neither `null` or `undefined`,
 * just like `input != null`.
 * @param arg
 */
export function isNotNullOrUndefined(arg) {
    return arg !== null && arg !== undefined;
}
/**
 * Alias for isNotNullOrUndefined.
 * Just like `input != null`.
 */
export const isNotNullish = isNotNullOrUndefined;
/**
 * Create a validator that asserts the passed argument is of type `'number'`,
 * just like `typeof input == 'number'`.
 */
export const isNumber = isOfBasicType('number');
/**
 * Create a validator that asserts the passed argument is of type `'string'`,
 * just like `typeof input == 'string'`.
 */
export const isString = isOfBasicType('string');
/**
 * Create a validator that asserts the passed argument is of type `'boolean'`,
 * just like `typeof input == 'boolean'`.
 */
export const isBoolean = isOfBasicType('boolean');
/**
 * Create a validator that asserts the passed argument is of type `'function'`,
 * just like `typeof input == 'function'`.
 */
export const isFunction = isOfBasicType('function');
/**
 * Create a validator that asserts the passed argument is of type `'object'`,
 * just like `typeof input == 'object'`.
 *
 * You are probably looking for `isOfShape` which lets you specify what kind of
 * keys and values should the object consist of.
 */
export const isObject = isOfBasicType('object');
export function isEnum(...enums) {
    return (input) => {
        return enums.some(is(input));
    };
}
export function isArrayOf(itemGuard) {
    return ((input) => Array.isArray(input) && input.every(itemGuard));
}
const optionalSymbol = Symbol('optional');
/**
 * Create a validator that asserts that passed guard passes for the given value,
 * or that that value is not set.
 */
export function optional(guard) {
    const optionalGuard = (arg) => {
        return isUndefined(arg) || guard(arg);
    };
    optionalGuard[optionalSymbol] = true;
    return optionalGuard;
}
function isOptional(guard) {
    return guard[optionalSymbol] === true;
}
export function isOfExactShape(shape) {
    return isOfShape(shape, true);
}
/**
 * Create a validator that asserts that passed argument is an object of a certain shape.
 * Accepts an object of guards.
 */
export function isOfShape(shape, exact = false) {
    const fn = (input) => {
        if (input === null || typeof input != 'object')
            return false;
        let missingKeyCount = 0;
        const isNothingMissing = Object.keys(shape).every((key) => {
            const keyGuard = shape[key];
            if (typeof keyGuard == 'function') {
                if (key in input)
                    return keyGuard(input[key]);
                if (isOptional(keyGuard)) {
                    missingKeyCount++;
                    return keyGuard(input[key]);
                }
                return false;
            }
            else if (typeof keyGuard == 'object') {
                return isOfShape(keyGuard, exact)(input[key]);
            }
        });
        if (!isNothingMissing)
            return false;
        return !exact || Object.keys(input).length + missingKeyCount == Object.keys(shape).length;
    };
    fn.shape = shape;
    fn.exact = exact;
    return fn;
}
export function isTuple(...guards) {
    return ((input) => {
        if (!Array.isArray(input)) {
            return false;
        }
        if (input.length != guards.length) {
            return false;
        }
        return input.every((val, i) => guards[i](val));
    });
}
export function pick(guard, ...keys) {
    const resultingShape = {};
    for (const key of keys) {
        resultingShape[key] = guard.shape[key];
    }
    return isOfShape(resultingShape, guard.exact);
}
export function omit(guard, ...keys) {
    const resultingShape = {};
    for (const key of Object.keys(guard.shape)) {
        if (keys.indexOf(key) == -1) {
            resultingShape[key] = guard.shape[key];
        }
    }
    return isOfShape(resultingShape, guard.exact);
}
/**
 * Allows every value in a shape to be undefined.
 */
export function partial(guard) {
    const resultShape = {};
    for (const key of Object.keys(guard.shape)) {
        resultShape[key] = isOneOf(isUndefined, guard.shape[key]);
    }
    return isOfShape(resultShape, guard.exact);
}
/**
 * Create a utility function which will throw if the given condition is not satisfied,
 * and which will return the correct type.
 *
 * @param guard
 * @param defaultErrorMessage
 */
export function throwIf(guard, defaultErrorMessage = `Assertion failed.`) {
    return (input, additionalErrorMessage) => {
        if (guard(input)) {
            const errorMessage = [defaultErrorMessage, additionalErrorMessage].filter(isNotNullish).join(' ');
            throw new Error(errorMessage);
        }
        return input;
    };
}
