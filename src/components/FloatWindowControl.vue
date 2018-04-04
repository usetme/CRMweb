<template>
  <transition name="fade">
  <div class="floatwindow" v-show="currentvalue" v-drag:dragable>
    <div id="dragable">
      <span class="floatwindowspan">{{title}}</span>
      <span class="el-icon-close btnright" @click="valuechange"></span>
    </div>
    <slot></slot>
  </div>
  </transition>
</template>

<script>
  import $ from 'jquery'
  export default {
    data () {
      return {
        currentvalue: this.value
      }
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      value (val) {
        if (val === this.currentvalue) {
          return
        }
        this.currentvalue = val
      }
    },
    methods: {
      valuechange: function (val) {
        this.currentvalue = false
        this.$emit('input', this.currentvalue)
      }
    }
  }
</script>
<style>
  #dragable {
    position: relative;
    width: 100%;
    height: 50px;
    cursor: move;
  }
</style>
