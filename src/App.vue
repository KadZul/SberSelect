<template>
  <div id="app">
    <SberSelect
      v-model="selectValue"
      :options="arrayObjects"
      option-label="title"
      option-value="val"
      @change="test"
    >
      <template #placeholder>
        placeholder
      </template>
      <!--<template #option="{ option, index }">
        <span>{{ getOptionValue(option, index) }}</span>
      </template>-->
    </SberSelect>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SberSelect from '@/components/SberSelect.vue';

@Component({
  components: {
    SberSelect,
  },
})
export default class App extends Vue {
  selectValue = null
  arrayPrimitives = [1, 2, 3]
  arrayObjects = [
    {
      val: 1,
      title: 'one'
    },
    {
      val: 2,
      title: 'two'
    },
    {
      val: 3,
      title: 'three'
    }
  ]
  object = {
    245: {label: 'one', id: 1, message: 'Такие дела 1'},
    11: {label: 'two', id: 1, message: 'Такие дела 2'},
    125: {label: 'three', id: 1, message: 'Такие дела 3'}
  }
  objectPrimitives = {
    1: 'one',
    2: 'two',
    3: 'three'
  }

  test(val: any): any {
    console.log(val)
  }

  getOptionValue(val: any, index: any) {
    console.log(val)
    return `${val?.message} ${val?.label} ${index}`
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
