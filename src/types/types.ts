
type OptionArray = string[] | number[] | Option[]

type OptionRecord = Record<string | number, undefined | Option>

type Option = Record<string, any> | string | number

export {
  Option,
  OptionArray,
  OptionRecord,
}