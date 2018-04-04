<template>
  <div class="order_line">
  <span v-if="title" class="controlspan">{{title}}</span>
  <el-input   v-model="currentvalue"
              :size="size"
              class="mydefinewidth"
              :readonly="readonly"
              :disabled="true"
              :placeholder="placeholder"
              @change="valuechange">
  </el-input>
  </div>
</template>

<script>
  import u from '../js/utility'
  export default {
    props: {
      length: {
        type: Number,
        default: 1
      },
      value: [String, Number],
      title: [String],
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
        // this.$emit('input', val)
        //  this.$emit('change', [val, this.userdata])
      }
    }
  }
</script>
