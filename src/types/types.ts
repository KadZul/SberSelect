
type OptionArray = string[] | number[] | Option[]

type OptionRecord = Record<string | number, undefined | Option>

type Option = Record<string, any> | string | number

type UpdateEvent = {
  event: Event,
  value: any
}

export {
  Option,
  OptionArray,
  OptionRecord,
  UpdateEvent,
}