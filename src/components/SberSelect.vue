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
        @click="onOptionClick({ option, index, event: $event })"
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
import {Option, OptionArray, OptionClickEvent, OptionRecord, UpdateEvent} from '@/types/types'

@Component({
  name: 'SberSelect',
})
export default class SberSelect extends Vue {
  @Model('input', { type: [String, Number], default: null }) private value!: string | number | undefined

  @Prop({ default: () => [], type: [Array, Object] }) private options!: OptionArray | OptionRecord
  @Prop({ default: 'label', type: String }) private optionLabel!: string
  @Prop({ default: 'value', type: [String, Number] }) private optionValue!: string | number
  @Prop({ default: false, type: Boolean }) private disabled?: boolean

  // data

  private opened = false

  // computed

  private get label(): string | number | null {
    const SELECTED_OPTION = this.getSelectedOption()

    return SELECTED_OPTION ? this.getOptionLabel(SELECTED_OPTION) : null
  }

  private get isOptionsObject(): boolean {
    return isObject(this.options)
  }

  private get classes(): Record<string, boolean | undefined> {
    return {
      opened: this.opened,
      disabled: this.disabled,
    }
  }

  public get optionsElements(): Array<Element> {
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

  private toggleDropdown(): void {
    if (this.options) {
      this.opened ? this.hide() : this.show()
    }
  }

  private onOptionClick({ event, option, index }: OptionClickEvent): void {
    const SELECTED_VALUE = this.isOptionsObject ? index : this.getOptionValue(option)

    this.updateAndHide({
      value: SELECTED_VALUE,
      event,
    })
  }

  private onKeyDown(event: KeyboardEvent): void {
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

  private onKeyEnter(event: KeyboardEvent): void {
    const OPTION_IDX = SberSelect.getDataIndex(event)

    this.show()

    if (OPTION_IDX) {
      this.updateAndHide({
        value: this.getOptionValueByIndex(OPTION_IDX),
        event,
      })
    }
  }

  private onDownKey(): void {
    const ACTIVE_EL = document.activeElement

    this.isOptionElement(ACTIVE_EL)
      ? this.focusNextOption(ACTIVE_EL)
      : SberSelect.focusOption(this.optionsElements[0])
  }

  private onUpKey(): void {
    const ACTIVE_EL = document.activeElement

    if (this.isOptionElement(ACTIVE_EL)) {
      this.focusPrevOption(ACTIVE_EL)
    }
  }

  public focusNextOption(el: Element | null): void {
    if (el && el.nextElementSibling) {
      SberSelect.focusOption(el.nextElementSibling)
    }
  }

  public focusPrevOption(el: Element | null): void {
    if (el && el.previousElementSibling) {
      SberSelect.focusOption(el.previousElementSibling)
    }
  }

  private getSelectedOption(): Option | string | number | undefined {
    return this.isOptionsObject
      ? this.getSelectedOptionFromObject()
      : this.getSelectedOptionFromArray()
  }

  private getOptionValueByIndex(idx: string): unknown {
    return this.isOptionsObject
      ? this.getOptionValueFromObjectByIndex(idx)
      : this.getOptionValueFromArrayByIndex(idx)
  }

  private getSelectedOptionFromObject(): Option | string | number | undefined {
    return this.value && !Array.isArray(this.options)
      ? this.options[this.value]
      : undefined
  }

  private getSelectedOptionFromArray(): Option | undefined {
    if (this.value && Array.isArray(this.options)) {
      return this.options.find((option: Option) => this.getOptionValue(option) === this.value)
    }
  }

  private getOptionValueFromObjectByIndex(idx: string): unknown {
    const OBJECT_VALUES = Object.keys(this.options)
    const TARGET_VALUE = OBJECT_VALUES[Number(idx) - 1]

    return TARGET_VALUE || null
  }

  private getOptionValueFromArrayByIndex(idx: string): unknown {
    const OPTION = this.options[Number(idx)] as Option

    if (OPTION) {
      return this.getOptionValue(OPTION)
    }
  }

  public getOptionLabel(option: Option): string | number {
    return option instanceof Object && !(option instanceof Array)
      ? option[this.optionLabel]
      : option
  }

  public getOptionValue(option: Option): unknown {
    return option instanceof Object && !(option instanceof Array)
      ? option[this.optionValue]
      : option
  }

  static focusOption(el: Element): void {
    const EL = el as HTMLElement

    if (EL) {
      EL.focus()
    }
  }

  private updateAndHide({ event, value }: UpdateEvent): void {
    if (value) {
      this.hide()
      this.$emit('input', value)
      this.$emit('change', { originalEvent: event, value })
    }
  }

  /*
   * TODO: разобарться с типами событий
   */
  private onOutClick(event: any): void {
    const isSelectEl = (path: Array<HTMLElement>) =>
      path.find((el) => el === this.$refs?.sberSelect)

    if (!isSelectEl(event.path)) {
      this.hide()
    }
  }

  public isOptionElement(el: Element | null): boolean {
    return !!el && this.optionsElements.some((optionEl) => optionEl === el)
  }

  static getDataIndex(event: KeyboardEvent): string {
    const TARGET = event?.target as HTMLElement

    return TARGET?.getAttribute('data-index') || ''
  }

  public show(): void {
    this.opened = true
  }

  public hide(): void {
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
