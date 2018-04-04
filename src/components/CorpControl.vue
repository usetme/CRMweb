<template>
  <div class="order_line">
    <span v-if="title" class="controlspan">{{title}}</span>
    <el-input :size="size" :disabled="disabled" class="mydefinewidth" :readonly="true" :placeholder="placeholder" @focus="btnshow" v-model="textshow" @keyup.enter.native="btnreturn(textshow)">
      <i class="el-icon-search el-input__icon" slot="suffix" @click="btnshow"></i>
    </el-input>
    <el-dialog title="公司选择" :visible.sync="winvisible" :close-on-click-modal="false" :modal-append-to-body="false"  top="10vh" center class="compoent_dialog">
      <el-button-group>
        <el-button type="primary" @click="btnquery()">查询</el-button>
        <el-button type="primary" @click="btnmodelf('')">清除</el-button>
      </el-button-group>
      <cinput v-model="queryvalue" @keyup.enter.native="btnquery()" placeholder="名称" class="inline"></cinput>
      <div class="controlleft">
        <el-tree :data="menudata" node-key="pk" highlight-current @node-click="btnquery"></el-tree>
      </div>
      <div class="controlright">
        <ctable :data="tabledata" :selection="false" @row-dblclick="btnselect" @pagechange="btndataload" :pagenum="pagenum" :pagesize="pagesize" :height="460"></ctable>
      </div>
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
    }
  },
  data() {
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
      textshow: ''
    }
  },
  watch: {
    value: function(val, oldValue) {
      if (val === this.currentvalue) {
        return
      }
      this.currentvalue = val
      this.btnload(this.currentvalue)
    }
  },
  created: function() {
    u.querydatacache(this, 'Dept', 'TreeCorp', null, 'menudata')
    this.btnload(u.isnullorwhitespace(this.currentvalue) ? '' : this.currentvalue)
  },
  mounted: function() {
    this.querylist = []
    u.setcontrolwidth(this, 'mydefinewidth')
  },
  methods: {
    btnload: function(pk) {
      if (u.isnullorwhitespace(pk)) {
        this.btnmodelf('')
      } else {
        u.getmodelcachef(this, 'Dept', pk, this.btnmodelf, false)
      }
    },
    btnreturn(pk) {
      u.getmodelcachef(this, 'Dept', pk, this.btnmodelreturn, false)
    },
    btnmodelf: function(data) {
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
        this.currentvalue = data.pk_Dept
        this.btntextshow()
      }
      this.$emit('input', this.currentvalue)
    },
    btnmodelreturn: function(data) {
      this.btnmodelf(data)
      this.$emit('change', [this.mm, this.userdata])
    },
    btnselect: function(row) {
      this.btnreturn(row.pk)
    },
    btntextshow() {
      if (u.isnullorwhitespace(this.showfield)) {
        this.textshow = this.mm.Name
      } else {
        let s = this.showfield.split(',')
        let t = ''
        s.forEach(function(value, index) {
          t = t + (u.isnullorwhitespace(this.mm[value]) ? '' : this.mm[value])
        })
        this.textshow = t
      }
    },
    btnshow() {
      if (this.disabled) {
        return
      }
      this.winvisible = true
    },
    btndataload: function(num) {
      if (num !== undefined) {
        this.pagenum = num
      }
      u.querypage(this, 'a48b5a2a-af69-4760-83b2-a7d800be58bb', this.pagesize, this.pagenum, this.querylist, 'tabledata')
    },
    btnquery: function(data) {
      this.querylist = []
      if (u.isnullorwhitespace(data)) {
        u.addwhere(this, 'querylist', '', '', 'Dept.Name', 'like', this.queryvalue, '')
      } else {
        u.addwhere(this, 'querylist', 'and', '(', 'Dept.fpk', '=', data.pk, '')
        u.addwhere(this, 'querylist', 'or', '', 'Dept.pk_Dept', '=', data.pk, ')')
      }
      this.btndataload()
    }
  }
}
</script>
