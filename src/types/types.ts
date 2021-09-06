interface ArrayObjectOptions {
  [index: string]: {
    [key: string]: string | number | boolean | Option
  }
}

interface ArrayPrimitiveOptions {
  [index: string]: string | number
}

interface ObjectOptions {
  [key: string]: string | number | boolean | Option
}

interface Option {
  [key: string]: Option | string | number | boolean | undefined
}


export {
  ArrayObjectOptions,
  ArrayPrimitiveOptions,
  ObjectOptions,
  Option
}