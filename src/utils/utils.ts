
function isObject(val: any): boolean {
    return val instanceof Object && !(val instanceof Array)
}

function isPrimitive(val: any): boolean {
    return typeof val === 'object' ? val === null : typeof val !== 'function'
}

export {
    isObject,
    isPrimitive
}