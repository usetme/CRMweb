<template>
  <div class="order_line">
    <span v-if="title" class="controlspan">{{title}}</span>
    <el-input-number  v-model="currentvalue"
                      class="mydefinewidth inputnumber"
                      :size="size"
                      controls-position="right"
                       :readonly="readonly"
                       :controls="controls"
                       :max="max"
                       :min="min"
                       :disabled="disabled"
                       :placeholder="placeholder"
                       @change="valuechange">
    </el-input-number>
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
      value: [Number],
      title: [String],
      size: {
        type: String,
        default: 'small'
      },
      controls: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      placeholder: String,
      userdata: String,
      disabled: Boolean,
      max: {
        type: Number,
        default: Infinity
      },
      min: {
        type: Number,
        default: -Infinity
      }
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
        this.$emit('input', val)
        this.$emit('change', [val, this.userdata])
      }
    }
  }
</script>
<style>
  .inputnumber input{text-align: right}
</style>
