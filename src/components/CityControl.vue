<template>
  <div class="order_line" style="overflow: inherit">
    <span v-if="title" class="controlspan">{{title}}</span>
    <el-cascader
      v-model="currentvalue"
      :options="menudata"
      :props="addressprops"
      class="mydefinewidth"
      :size="size"
      filterable
      clearable>
    </el-cascader>
  </div>
</template>

<script>
  import u from '../js/utility'
  import addressList from '../assets/city.json'
  export default {
    props: {
      title: [String],
      size: {
        type: String,
        default: 'small'
      },
      length: {
        type: Number,
        default: 2
      }
    },
    data () {
      return {
        currentvalue: this.value,
        menudata: addressList,
        cityarray: [],
        addressprops: {
          value: 'pk'
        },
        flag: true
      }
    },
    mounted () {
      let that = this
      u.setcontrolwidth(that, 'mydefinewidth')
    },
    watch: {
//      value: function (val, oldValue) {
//        if (val === this.currentvalue) {
//          return
//        }
//        this.currentvalue = val
//      }
    },
    methods: {
      fit (val) {
        console.log(val)
      },
      handleItemChange (val) {
//        console.log(val)
      },
      handleChange(value) {
//        console.log(value)
      }
    }
  }
</script>
