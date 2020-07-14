"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function or(...predicates) {
    return ((input) => predicates.some(guard => guard(input)));
}
exports.or = or;
function and(...predicates) {
    return ((input) => predicates.every(guard => guard(input)));
}
exports.and = and;
