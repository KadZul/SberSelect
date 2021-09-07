
function isObject(val: unknown): boolean {
    return val instanceof Object && !(val instanceof Array)
}

function isPrimitive(val: unknown): boolean {
    return typeof val === 'object' ? val === null : typeof val !== 'function'
}

export {
    isObject,
    isPrimitive
}