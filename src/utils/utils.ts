function isObject(val: any): boolean {
    return typeof val === 'object' && val !== null && !Array.isArray(val) && typeof val !== 'function'
}

function isPrimitive(val: any): boolean {
    return typeof val === 'object' ? val === null : typeof val !== 'function'
}

export {
    isObject,
    isPrimitive
}