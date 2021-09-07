
type OptionArray = string[] | number[] | Option[]

type OptionRecord = Record<string | number, undefined | Option>

type Option = Record<string, any> | string | number

type UpdateEvent = {
  event: Event,
  value: any
  index?: string | number
}

type OptionClickEvent = {
  event: Event
  option: Option
  index: string | number
}

export {
  Option,
  OptionArray,
  OptionRecord,
  UpdateEvent,
  OptionClickEvent,
}