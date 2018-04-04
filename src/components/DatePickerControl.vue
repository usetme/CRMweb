<template>
  <div class="order_line">
      <span v-if="title" class="controlspan">{{title}}</span>
    <el-date-picker ref="datepickercontrol"
                      class="mydefinewidth"
                      v-model="currentvalue"
                      :type="type"
                      :size="size"
                      :readonly="readonly"
                      :disabled="disabled"
                      :placeholder="placeholder"
                      :popperClass="popperClass"
                      :editable="editable"
                      @change="valuechange">
    </el-date-picker>
  </div>
</template>

<script>
  import u from '../js/utility'
  export default {
    props: {
      value: [String],
      title: [String],
      type: {
        type: String,
        default: 'date'
      },
      length: {
        type: Number,
        default: 1
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
      disabled: Boolean,
      popperClass: String,
      editable: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        currentvalue: this.value
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
        this.$emit('input', val)
        this.$emit('change', [val, this.userdata])
      }
    }
  }
</script>
