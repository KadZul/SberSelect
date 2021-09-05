<template>
  <div :class="{'opened': opened}" ref="sberSelect" class="sber-select" @keydown="onKeyDown">
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
        class="option"
        @click="onOptionClick(option, index)"
      >
        <slot :option="option" :index="index" name="option">
          {{ getOptionLabel(option) }}
        </slot>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Model, Prop, Vue } from "vue-property-decorator";
import { isObject, isPrimitive } from '@/utils/utils';

@Component({
  name: 'SberSelect'
})

export default class HelloWorld extends Vue {
  @Model('input', { type: [String, Number] }) value!: string|number

  @Emit('input')
  @Emit('change')
  onOptionClick(option: any, index: string | number): string | number {
    const SELECTED_VALUE = this.isOptionsObject
      ? index
      : this.getOptionValue(option)

    this.opened = false

    return SELECTED_VALUE
  }

  @Prop() public options!: Array<any>|any
  @Prop({ default: 'label' }) public optionLabel!: string
  @Prop({ default: 'value' }) public optionValue!: string

  opened = false

  get label(): string | number | null {
    const SELECTED_OPTION = this.getSelectedOption()

    return SELECTED_OPTION ? this.getOptionLabel(SELECTED_OPTION) : null
  }

  get isOptionsObject(): boolean {
    return isObject(this.options)
  }

  get optionsElements(): Array<Element> {
    const OPTIONS_EL = this.$refs?.sberSelectOptions as Element
    const OPTIONS_CHILDREN = OPTIONS_EL?.children ? [...OPTIONS_EL.children] : []

    return OPTIONS_CHILDREN || []
  }

  mounted(): void {
    document.addEventListener('click', this.onOutClick)
  }

  beforeDestroy(): void {
    document.removeEventListener('click', this.onOutClick)
  }

  getOptionLabel(option: any): string|number {
    return isObject(option) ? option[this.optionLabel] : option
  }

  getOptionValue(option: any): string|number {
    return isObject(option) ? option[this.optionValue] : option
  }

  onOutClick(event: any): void {
    const isSelectEl = (path: Array<HTMLElement>) => path.find(el => el === this.$refs?.sberSelect)

    if (!isSelectEl(event.path)) {
      this.opened = false
    }
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
      case 13:
      case 27:
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

  focusOption(el: Element): void {
    const EL = el as HTMLElement

    if (EL) {
      EL.focus()
    }
  }

  isOptionElement(el: Element | null): boolean {
    return !!el && this.optionsElements.some(optionEl => optionEl === el)
  }

  getSelectedOption(): any {
    return this.isOptionsObject
      ? this.getSelectedOptionFromObject()
      : this.getSelectedOptionFromArray()
  }

  getSelectedOptionFromObject(): any {
    if (this.value && this.options) {
      return isObject(this.options[this.value])
        ? this.options[this.value][this.optionLabel]
        : this.options[this.value]
    }
  }

  getSelectedOptionFromArray(): any {
    const isTargetOption = (option: any) => isPrimitive(option)
        ? option === this.value
        : option[this.optionValue] === this.value;

    if (this.value && this.options) {
      return this.options.find(isTargetOption)
    }
  }

  toggleDropdown(): void {
    if (this.options) {
      this.opened = !this.opened
    }
  }
}
</script>

<style lang="scss" scoped>
.sber-select {
  text-align: left;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, .15);
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
      content: "";
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
}
</style>