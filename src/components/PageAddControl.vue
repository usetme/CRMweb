<template>
  <div :style="floatcss" v-drag:dragable>
    <div id="dragable">
      <span class="floatwindowspan">{{currenttitle}}</span>
      <span class="el-icon-close btnright" @click="$emit('onclose', pk, 'close')"></span>
    </div>
    <slot>
      <div ref="maindiv"></div>
    </slot>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('onclose', pk, 'close')">取消</el-button>
      <el-button type="primary" @click="btnsave">提交</el-button>
    </div>
  </div>
</template>

<script>
  import u from '../js/utility'
  export default {
    props: {
      pk: {
        type: String,
        default: ''
      },
      ui: {
        type: String,
        default: ''
      },
      pkui: {
        type: String,
        default: ''
      },
      operate: {
        type: String,
        default: ''
      },
      title: {
        type: Boolean,
        default: false
      },
      width: {
        type: Number,
        default: 550
      },
      height: {
        type: Number,
        default: 400
      },
      offset: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        currenttitle: this.title,
        mm: [],
        floatcss: {
          'position': 'fixed',
          'top': (this.offset + 20) + '%',
          'left': (this.offset + 32) + '%',
          'width': this.width + 'px',
          'min-height': this.height + 'px',
          'background': 'rgba(238, 241, 246, 1)',
          'border-radius': '2px',
          'border': '1px solid #d1dbe5',
          'padding': '20px',
          'z-index': 2000,
          'font-size': '12px',
          'padding-left': '30px'
        }
      }
    },
    watch: {},
    mounted () {
      if (u.isnullorwhitespace(this.operate)) {
        u.messagenotify(this, "必须提供操作的表名")
        return
      }
      if (!u.isnullorwhitespace(this.ui)) {
        u.compile(this, this.ui)
      }
      if (!u.isnullorwhitespace(this.pkui) && u.isnullorwhitespace(this.ui)) {
        this.$nextTick(() => {
          u.querydatacachef(this, 'PageContent', 'GetContent', {pk: this.pkui}, this.load, true)
        })
      }
      u.isnullorwhitespace(this.pk) ? this.currenttitle = '新增' : this.currenttitle = '编辑'
      u.getmodel(this, this.operate, this.pk, 'mm')
    },
    methods: {
      btnshow: function (btnid) {
        return u.buttonshow(this, btnid)
      },
      load: function (ui) {
        u.compile(this, ui)
      },
      btnsave: function (row) {
        let that = this
        u.getdata(that, that.operate, u.isnullorwhitespace(that.mm.ts) ? 'Add' : 'Update', that.mm).then(function (r) {
          if (r.ok) {
            u.messagesuccess(that)
          } else {
            u.messagenotify(that, r.message)
          }
          that.$emit('onclose', that.pk, 'save', r.ok) // 返回调用页面是否成功保存
        })
      }
    }
  }
</script>

