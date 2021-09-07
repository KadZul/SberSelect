<template>
  <div
    :class="classes"
    ref="sberSelect"
    class="sber-select"
    @keydown="onKeyDown"
  >
    <button class="value" type="button" @click="toggleDropdown">
      <span v-if="label" class="label">
        {{ label }}
      </span>
      <span v-else class="placeholder">
        <slot name="placeholder"> Выберите значение </slot>
      </span>
    </button>
    <div v-show="opened" ref="sberSelectOptions" class="options">
      <button
        v-for="(option, index) of options"
        :key="index"
        :data-index="index"
        class="option"
        @click="(event) => onOptionClick(event, option, index)"
      >
        <slot :option="option" :index="index" name="option">
          {{ getOptionLabel(option) }}
        </slot>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'vue-property-decorator'
import { isObject } from '@/utils/utils'
import { Option, OptionArray, OptionRecord, UpdateEvent } from '@/types/types'

@Component({
  name: 'SberSelect',
})
export default class SberSelect extends Vue {
  @Model('input', { type: [String, Number], default: null }) value!: string | number | undefined

  @Prop({ default: () => [] }) public options!: OptionArray | OptionRecord
  @Prop({ default: 'label' }) public optionLabel!: string
  @Prop({ default: 'value' }) public optionValue!: string | number
  @Prop({ default: false }) public disabled?: boolean

  // data

  opened = false

  // computed

  get label(): string | number | null {
    const SELECTED_OPTION = this.getSelectedOption()

    return SELECTED_OPTION ? this.getOptionLabel(SELECTED_OPTION) : null
  }

  get isOptionsObject(): boolean {
    return isObject(this.options)
  }

  get classes(): any {
    return {
      opened: this.opened,
      disabled: this.disabled,
    }
  }

  get optionsElements(): Array<Element> {
    const OPTIONS_EL = this.$refs?.sberSelectOptions as Element
    const OPTIONS_CHILDREN = OPTIONS_EL?.children ? [...OPTIONS_EL.children] : []

    return OPTIONS_CHILDREN || []
  }

  // lifecycle hooks

  mounted(): void {
    document.addEventListener('click', this.onOutClick)
  }

  beforeDestroy(): void {
    document.removeEventListener('click', this.onOutClick)
  }

  // methods

  toggleDropdown(): void {
    if (this.options) {
      this.opened ? this.hide() : this.show()
    }
  }

  onOptionClick(event: Event, option: Option, index: string | number): void {
    const SELECTED_VALUE = this.isOptionsObject ? index : this.getOptionValue(option)

    this.updateAndHide({
      value: SELECTED_VALUE,
      event,
    })
  }

  onKeyDown(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case 40:
        event.preventDefault()
        this.onDownKey()
        break
      case 38:
        event.preventDefault()
        this.onUpKey()
        break
      case 32:
        event.preventDefault()
        this.onKeyEnter(event)
        break
      case 13:
        event.preventDefault()
        this.onKeyEnter(event)
        break
      case 27:
        event.preventDefault()
        this.hide()
    }
  }

  onKeyEnter(event: KeyboardEvent): void {
    const OPTION_IDX = this.getDataIndex(event)

    this.show()

    if (OPTION_IDX) {
      this.updateAndHide({
        value: this.getOptionValueByIndex(OPTION_IDX),
        event,
      })
    }
  }

  onDownKey(): void {
    const ACTIVE_EL = document.activeElement

    this.isOptionElement(ACTIVE_EL)
      ? this.focusNextOption(ACTIVE_EL)
      : this.focusOption(this.optionsElements[0])
  }

  onUpKey(): void {
    const ACTIVE_EL = document.activeElement

    if (this.isOptionElement(ACTIVE_EL)) {
      this.focusPrevOption(ACTIVE_EL)
    }
  }

  focusNextOption(el: Element | null): void {
    if (el && el.nextElementSibling) {
      this.focusOption(el.nextElementSibling)
    }
  }

  focusPrevOption(el: Element | null): void {
    if (el && el.previousElementSibling) {
      this.focusOption(el.previousElementSibling)
    }
  }

  getSelectedOption(): Option | string | number | undefined {
    return this.isOptionsObject
      ? this.getSelectedOptionFromObject()
      : this.getSelectedOptionFromArray()
  }

  getOptionValueByIndex(idx: string): any {
    return this.isOptionsObject
      ? this.getOptionValueFromObjectByIndex(idx)
      : this.getOptionValueFromArrayByIndex(idx)
  }

  getSelectedOptionFromObject(): Option | string | number | undefined {
    return this.value && !Array.isArray(this.options)
      ? this.options[this.value]
      : undefined
  }

  getSelectedOptionFromArray(): Option | undefined {
    if (this.value && Array.isArray(this.options)) {
      return this.options.find((option: Option) => this.getOptionValue(option) === this.value)
    }
  }

  getOptionValueFromObjectByIndex(idx: string): any {
    const OBJECT_VALUES = Object.keys(this.options)
    const TARGET_VALUE = OBJECT_VALUES[Number(idx) - 1]

    return TARGET_VALUE || null
  }

  getOptionValueFromArrayByIndex(idx: string): any {
    const OPTION = this.options[Number(idx)] as Option

    if (OPTION) {
      return this.getOptionValue(OPTION)
    }
  }

  getOptionLabel(option: Option): string | number {
    return option instanceof Object && !(option instanceof Array)
      ? option[this.optionLabel]
      : option
  }

  getOptionValue(option: Option): any {
    return option instanceof Object && !(option instanceof Array)
      ? (option[this.optionValue] as any)
      : option
  }

  focusOption(el: Element): void {
    const EL = el as HTMLElement

    if (EL) {
      EL.focus()
    }
  }

  updateAndHide({ event, value }: UpdateEvent): void {
    if (value) {
      this.hide()
      this.$emit('input', value)
      this.$emit('change', { originalEvent: event, value })
    }
  }

  onOutClick(event: any): void {
    const isSelectEl = (path: Array<HTMLElement>) =>
      path.find((el) => el === this.$refs?.sberSelect)

    if (!isSelectEl(event.path)) {
      this.hide()
    }
  }

  isOptionElement(el: Element | null): boolean {
    return !!el && this.optionsElements.some((optionEl) => optionEl === el)
  }

  getDataIndex(event: KeyboardEvent): string {
    const TARGET = event?.target as HTMLElement

    return TARGET?.getAttribute('data-index') || ''
  }

  show(): void {
    this.opened = true
  }

  hide(): void {
    this.opened = false
  }
}
</script>

<style lang="scss" scoped>
.sber-select {
  text-align: left;
  display: flex;
  flex-direction: column;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  max-width: 300px;

  .value {
    position: relative;
    cursor: pointer;
    display: flex;
    border: none;
    background-color: #ffffff;
    padding: 10px 15px;

    .label,
    .placeholder {
      line-height: 1;
    }

    &:hover,
    &:focus-visible {
      outline: none;
      background-color: #f4f4f4;
    }

    &:after {
      content: '';
      position: absolute;
      top: 13px;
      right: 9px;
      display: block;
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 7px solid black;
      transform: rotate(0);
      transform-origin: 50% 35%;
      transition: transform 200ms ease-in-out;
    }
  }

  .options {
    list-style: none;
    margin: 0;
    padding: 0;

    .option {
      width: 100%;
      display: flex;
      border: none;
      background-color: #ffffff;
      cursor: pointer;
      padding: 8px 15px;

      &:hover,
      &:focus-visible {
        outline: none;
        background-color: #f4f4f4;
      }
    }
  }

  &.opened {
    .value {
      &:hover,
      &:focus-visible {
        outline: none;
        background-color: #ffffff;
      }

      &:after {
        transform: rotate(180deg);
      }
    }
  }

  &.disabled {
    pointer-events: none;

    .value {
      cursor: auto;
      color: #434343;
      background-color: #8e8f9466;
    }
  }
}
</style>
