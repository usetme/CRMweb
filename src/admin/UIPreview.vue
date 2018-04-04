<template>
  <div>
    <el-button type="primary" @click="btnpreview">预览</el-button>
    <el-input
      type="textarea"
      :rows="6"
      placeholder="请输入内容"
      v-model="textarea">
    </el-input>
    <div ref="htmlui">
    </div>
  </div>
</template>

<script>
  import u from '../js/utility'
  export default {
    data () {
      return {
        textarea: '',
        mm: []
      }
    },
    created: function () {
    },
    mounted () {
    },
    methods: {
      btnpreview () {
        this.$refs.htmlui.innerHTML = ''
        u.compile(this, this.textarea)
      }
    }
  }
</script>
