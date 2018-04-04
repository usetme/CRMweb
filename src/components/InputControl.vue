<template>
  <div class="order_line" style="overflow: inherit">
  <span v-if="title" class="controlspan">{{title}}</span>
  <el-input  v-model="currentvalue"
              class="mydefinewidth"
              :size="size"
              :readonly="readonly"
              :disabled="disabled"
              :placeholder="placeholder"
              @change="valuechange">
  </el-input>
  </div>
</template>

<script>
  import u from '../js/utility'
  export default {
    props: {
      value: [String, Number],
      title: [String],
      length: {
        default: 1
      },
      password: {
        type: Boolean,
        default: false
      },
      size: {
        type: String,
        default: 'small'
      },
      readonly: {
        type: Boolean,
        default: false
      },
      placeholder: String,
      userdata: String,
      disabled: Boolean
    },
    data () {
      return {
        currentvalue: this.value,
        itemlists: []
      }
    },
    watch: {
      currentvalue () {
//        原生的type='password' element没有这个属性，只能通过原生input去添加
        if (this.password === true) {
          let parent = this.$el.getElementsByClassName('el-input')[0]
          let child = parent.getElementsByTagName('input')[0]
          child.setAttribute('type', 'password')
        }
      },
      value: function (val, oldValue) {
        if (val === this.currentvalue) {
          return
        }
        this.currentvalue = val
      }
    },
    created: function () {
    },
    mounted () {
      let that = this
      u.setcontrolwidth(that, 'mydefinewidth')
    },
    methods: {
      valuechange: function (val) {
        // console.log(val)
        this.$emit('input', val)
        this.$emit('change', [val, this.userdata])
      }
    }
  }
</script>
