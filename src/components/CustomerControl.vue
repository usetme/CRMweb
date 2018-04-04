<template>
  <div class="order_line">
    <span v-if="title" class="controlspan">{{title}}</span>
    <el-input :size="size"
              class="mydefinewidth"
              :disabled="disabled"
              :readonly="!editable"
              @blur="btntextshow(true)"
              :placeholder="placeholder"
              @focus="btnshow"
              v-model="textshow"
              @keyup.enter.native="btnreturn(textshow)">
      <i class="el-icon-search el-input__icon" slot="suffix" @click="btnshow"></i>
    </el-input>
    <el-dialog title="客户选择" :visible.sync="winvisible" :close-on-click-modal="false" :modal-append-to-body="false" top="10vh" center class="compoent_dialog">
      <el-button-group>
        <el-button type="primary" @click="btnquery()">查询</el-button>
        <el-button type="primary" @click="btnmodelf('')">清除</el-button>
      </el-button-group>
      <cinput v-model="queryvalue" @keyup.enter.native="btnquery()" placeholder="名称" class="inline"></cinput>
      <ctable :data="tabledata" :selection="false" @row-dblclick="btnselect" @pagechange="btndataload" :pagenum="pagenum" :pagesize="pagesize" :height="460"></ctable>
    </el-dialog>
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
      value: [String],
      title: [String],
      size: {
        type: String,
        default: 'small'
      },
      placeholder: String,
      disabled: Boolean,
      userdata: String,
      editable: false,
      showfield: {
        type: String,
        default: ''
      },
      issaleorder: false,
      deptpk: {
        type: String,
        default: ''
      },
      billdate: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        currentvalue: this.value,
        tabledata: [],
        menudata: [],
        winvisible: false,
        wintitle: '',
        pagenum: 1,
        pagesize: 10,
        queryvalue: '',
        querylist: [],
        mm: [],
        textshow: '',
        queryed: false
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
      that.btnload(u.isnullorwhitespace(this.currentvalue) ? '' : that.currentvalue)
    },
    mounted: function () {
      let that = this
      that.querylist = []
      u.setcontrolwidth(that, 'mydefinewidth')
    },
    methods: {
      btnload: function (pk) {
        if (u.isnullorwhitespace(pk)) {
          this.btnmodelf('')
        } else {
          let that = this
          that.queryed = true
          if (that.issaleorder) {
            u.querydataf(that, 'Customer', 'GetModel', {
              pk: pk,
              deptpk: this.deptpk,
              billdate: this.billdate
            }, that.btnmodelf, false)
          } else {
            u.getmodelf(that, 'Customer', pk, that.btnmodelf, false)
          }
        }
      },
      btnreturn (pk) {
        let that = this
        that.queryed = true
        if (that.issaleorder) {
          u.querydataf(that, 'Customer', 'GetModel', {
            pk: pk,
            deptpk: this.deptpk,
            billdate: this.billdate
          }, that.btnmodelreturn, false)
        } else {
          u.getmodelf(that, 'Customer', pk, that.btnmodelreturn, false)
        }
      },
      btnmodelf: function (data) {
        this.winvisible = false
        if (u.isnullorwhitespace(data)) {
          if (data === null) {
            if (this.editable) {
              this.winvisible = true
              this.queryvalue = this.textshow
              this.btnquery()
            }
          } else {
            this.currentvalue = ''
          }
          this.mm = []
          this.textshow = ''
        } else {
          this.mm = data
          this.currentvalue = data.pk_Customer
          this.btntextshow()
        }
        this.$emit('input', this.currentvalue)
      },
      btnmodelreturn: function (data) {
        this.btnmodelf(data)
        this.$emit('change', [this.mm, this.userdata])
      },
      btnselect: function (row) {
        this.btnreturn(row.pk)
      },
      btntextshow (blur) {
        // this.textshow = u.isnullorwhitespace(this.showfield) ? this.mm.Name : this.mm[this.showfield]
        let that = this
        if (blur === true) {
          if (that.queryed === false) {
            that.textshow = that.text
            return
          }
        }
        if (u.isnullorwhitespace(that.showfield)) {
          that.textshow = that.mm.Name
        } else {
          let s = that.showfield.split(',')
          let t = ''
          s.forEach(function (value, index) {
            t = t + (u.isnullorwhitespace(that.mm[value]) ? '' : that.mm[value])
          })
          that.textshow = t
        }
      },
      btnshow () {
        if (this.disabled) {
          return
        }
        if (this.issaleorder && (u.isnullorwhitespace(this.deptpk) || u.isnullorwhitespace(this.billdate))) {
          u.messagenotify(this, '请先选择单据日期和部门')
          return
        }
        this.winvisible = true
      },
      btndataload: function (num) {
        let that = this
        if (num !== undefined) {
          that.pagenum = num
        }
        u.querypage(that, 'aafab34f-94f9-4b02-9357-a78b01091af1', this.pagesize, that.pagenum, that.querylist, 'tabledata')
      },
      btnquery: function (data) {
        this.querylist = []
        if (u.isnullorwhitespace(this.queryvalue)) {
          if (u.ischs(this.queryvalue)) {
            u.addwhere(this, 'querylist', '', '', 'Customer.Name', 'like', this.queryvalue, '')
          } else {
            u.addwhere(this, 'querylist', 'and', '(', 'Customer.Tel', 'like', this.queryvalue, '')
            u.addwhere(this, 'querylist', 'or', '', 'Customer.Mobile', 'like', this.queryvalue, '')
            u.addwhere(this, 'querylist', 'or', '', 'Customer.OtherTel', 'like', this.queryvalue, '')
            u.addwhere(this, 'querylist', 'or', '', 'Customer.CardNo', '=', this.queryvalue, ')')
          }
        }
        this.btndataload()
      }
    }
  }
</script>
