<template>
  <div class="order_line">
    <span v-if="title" class="controlspan">{{title}}</span>
    <el-input  v-model="username"
               class="mydefinewidth"
               :size="size"
                :readonly="readonly"
                :disabled="true"
                :placeholder="placeholder">
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
      disabled: Boolean
    },
    data () {
      return {
        currentvalue: this.value,
        username: '',
        itemlists: []
      }
    },
    watch: {
      value: function (val, oldValue) {
        if (val === this.currentvalue) {
          return
        }
        this.currentvalue = val
        this.btnload(this.currentvalue)
      }
    },
    created: function () {
      let that = this
      that.btnload(u.isnullorwhitespace(that.currentvalue) ? '' : that.currentvalue)
    },
    mounted () {
      let that = this
      u.setcontrolwidth(that, 'mydefinewidth')
    },
    methods: {
      btnload: function (pk) {
        if (u.isnullorwhitespace(pk)) {
          this.btnmodelf('')
        } else {
          let that = this
          u.getmodelcachef(that, 'Employee', pk, that.btnmodelf, false)
        }
      },
      btnmodelf: function (data) {
        if (u.isnullorwhitespace(data)) {
          this.username = this.currentvalue
        } else {
          this.username = data.Name
        }
      }
    }
  }
</script>
