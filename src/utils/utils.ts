import { Option } from '@/types/types';

function isObject(val: Option | string | number | boolean | undefined): boolean {
    return typeof val === 'object' && val !== null && !Array.isArray(val) && typeof val !== 'function'
}

function isPrimitive(val: Option | string | number | boolean | undefined): boolean {
    return typeof val === 'object' ? val === null : typeof val !== 'function'
}

export {
    isObject,
    isPrimitive
}