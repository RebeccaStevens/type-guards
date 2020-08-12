"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwIf = exports.partial = exports.omit = exports.pick = exports.isTuple = exports.isOfShape = exports.isOfExactShape = exports.optional = exports.isArrayOf = exports.isEnum = exports.isObject = exports.isFunction = exports.isBoolean = exports.isString = exports.isNumber = exports.isNotNullish = exports.isNotNullOrUndefined = exports.isNotUndefined = exports.isNotNull = exports.isNullish = exports.isNullOrUndefined = exports.isUndefined = exports.isNull = exports.isInstanceOf = exports.isOfBasicType = exports.isNot = exports.is = exports.fp = exports.isOneOf = void 0;
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
const optionalSymbol = Symbol('optional');
/**
 * Create a validator that asserts that passed guard passes for the given value,
 * or that that value is not set.
 */
function optional(guard) {
    const optionalGuard = (arg) => {
        return exports.isUndefined(arg) || guard(arg);
    };
    optionalGuard[optionalSymbol] = true;
    return optionalGuard;
}
exports.optional = optional;
function isOptional(guard) {
    return guard[optionalSymbol] === true;
}
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
