export function or(...predicates) {
    return ((input) => predicates.some(guard => guard(input)));
}
export function and(...predicates) {
    return ((input) => predicates.every(guard => guard(input)));
}
