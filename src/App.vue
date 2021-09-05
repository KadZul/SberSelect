<template>
  <div id="app">
    <SberSelect v-model="selectValue" :options="object" @change="test"/>
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
      value: 1,
      label: 'one'
    },
    {
      value: 2,
      label: 'two'
    },
    {
      value: 1,
      label: 'three'
    }
  ]
  object = {
    1: {label: 'one', id: 1},
    2: {label: 'two', id: 1},
    3: {label: 'three', id: 1}
  }

  test(val: any): any {
    console.log(val)
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
