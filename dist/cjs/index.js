"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const is_plain_object_1 = __importDefault(require("is-plain-object"));
const fp = __importStar(require("./fp"));
exports.fp = fp;
exports.isOneOf = fp.or;
function is(t) {
    return (input) => input === t;
}
exports.is = is;
function isNot(not) {
    return (input) => input !== not;
}
exports.isNot = isNot;
function isOfBasicType(basicString) {
    return ((input) => typeof input == basicString);
}
exports.isOfBasicType = isOfBasicType;
/**
 * Create a validator that asserts the passed argument is instance of the given constructor.
 */
function isInstanceOf(ctor) {
    return (input => input instanceof ctor);
}
exports.isInstanceOf = isInstanceOf;
/**
 * Create a validator that asserts the passed argument is exactly `null`,
 * just like `input === null`.
 */
exports.isNull = is(null);
/**
 * Create a validator that asserts the passed argument is exactly `undefined`,
 * just like `input === undefined`.
 */
exports.isUndefined = is(undefined);
/**
 * Create a validator that asserts the passed argument is either `null` or `undefined`,
 * just like `input == null`.
 */
exports.isNullOrUndefined = exports.isOneOf(exports.isNull, exports.isUndefined);
/**
 * Alias for isNullOrUndefined.
 * Just like `input == null`.
 */
exports.isNullish = exports.isNullOrUndefined;
/**
 * Create a validator that asserts the passed argument is not `null`,
 * just like `input !== null`.
 */
function isNotNull(arg) {
    return arg !== null;
}
exports.isNotNull = isNotNull;
/**
 * Create a validator that asserts the passed argument is not `undefined`,
 * just like `input !== undefined`.
 */
function isNotUndefined(arg) {
    return arg !== undefined;
}
exports.isNotUndefined = isNotUndefined;
/**
 * Create a validator that asserts the passed argument is neither `null` or `undefined`,
 * just like `input != null`.
 * @param arg
 */
function isNotNullOrUndefined(arg) {
    return arg !== null && arg !== undefined;
}
exports.isNotNullOrUndefined = isNotNullOrUndefined;
/**
 * Alias for isNotNullOrUndefined.
 * Just like `input != null`.
 */
exports.isNotNullish = isNotNullOrUndefined;
/**
 * Create a validator that asserts the passed argument is of type `'number'`,
 * just like `typeof input == 'number'`.
 */
exports.isNumber = isOfBasicType('number');
/**
 * Create a validator that asserts the passed argument is of type `'string'`,
 * just like `typeof input == 'string'`.
 */
exports.isString = isOfBasicType('string');
/**
 * Create a validator that asserts the passed argument is of type `'boolean'`,
 * just like `typeof input == 'boolean'`.
 */
exports.isBoolean = isOfBasicType('boolean');
/**
 * Create a validator that asserts the passed argument is of type `'function'`,
 * just like `typeof input == 'function'`.
 */
exports.isFunction = isOfBasicType('function');
/**
 * Create a validator that asserts the passed argument is of type `'object'`,
 * just like `typeof input == 'object'`.
 *
 * You are probably looking for `isOfShape` which lets you specify what kind of
 * keys and values should the object consist of.
 */
exports.isObject = isOfBasicType('object');
function isEnum(...enums) {
    return (input) => {
        return enums.some(is(input));
    };
}
exports.isEnum = isEnum;
function isArrayOf(itemGuard) {
    return ((input) => Array.isArray(input) && input.every(itemGuard));
}
exports.isArrayOf = isArrayOf;
function isOfExactShape(shape) {
    return isOfShape(shape, true);
}
exports.isOfExactShape = isOfExactShape;
/**
 * Create a validator that asserts that passed argument is an object of a certain shape.
 * Accepts an object of guards.
 */
function isOfShape(shape, exact = false) {
    const fn = (input) => {
        if (!is_plain_object_1.default(input))
            return false;
        const isNothingMissing = Object.keys(shape).every((key) => {
            const keyGuard = shape[key];
            if (typeof keyGuard == 'function') {
                return keyGuard(input[key]);
            }
            else if (typeof keyGuard == 'object') {
                return isOfShape(keyGuard, exact)(input[key]);
            }
        });
        if (!isNothingMissing)
            return false;
        return !exact || Object.keys(input).length == Object.keys(shape).length;
    };
    fn.shape = shape;
    fn.exact = exact;
    return fn;
}
exports.isOfShape = isOfShape;
function isTuple(...guards) {
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
exports.isTuple = isTuple;
function pick(guard, ...keys) {
    const resultingShape = {};
    for (const key of keys) {
        resultingShape[key] = guard.shape[key];
    }
    return isOfShape(resultingShape, guard.exact);
}
exports.pick = pick;
function omit(guard, ...keys) {
    const resultingShape = {};
    for (const key of Object.keys(guard.shape)) {
        if (keys.indexOf(key) == -1) {
            resultingShape[key] = guard.shape[key];
        }
    }
    return isOfShape(resultingShape, guard.exact);
}
exports.omit = omit;
/**
 * Allows every value in a shape to be undefined.
 */
function partial(guard) {
    const resultShape = {};
    for (const key of Object.keys(guard.shape)) {
        resultShape[key] = exports.isOneOf(exports.isUndefined, guard.shape[key]);
    }
    return isOfShape(resultShape, guard.exact);
}
exports.partial = partial;
/**
 * Create a utility function which will throw if the given condition is not satisfied,
 * and which will return the correct type.
 *
 * @param guard
 * @param defaultErrorMessage
 */
function throwIf(guard, defaultErrorMessage = `Assertion failed.`) {
    return (input, additionalErrorMessage) => {
        if (guard(input)) {
            const errorMessage = [defaultErrorMessage, additionalErrorMessage].filter(exports.isNotNullish).join(' ');
            throw new Error(errorMessage);
        }
        return input;
    };
}
exports.throwIf = throwIf;
