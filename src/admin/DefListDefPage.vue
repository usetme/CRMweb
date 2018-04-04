<template>
  <div class="pagecontent">
    <div>
    <el-button-group>
      <el-button type="primary" @click="btnquery()">查询</el-button>
      <el-button type="primary" @click="btnadd()" v-show="btnshow('btnadd')">新增</el-button>
      <el-button type="primary" @click="btnedit()" v-show="btnshow('btnedit')">编辑</el-button>
      <el-button type="primary" @click="btndelete()" v-show="btnshow('btndelete')">删除</el-button>
      <el-button type="primary" @click="btndataload()">刷新</el-button>
      <el-button type="primary" @click="btntoexcel()" v-show="btnshow('btntoexcel')">导出</el-button>
    </el-button-group>
    <cinput v-model="queryvalue" @keyup.enter.native="btnquery()" placeholder="名称" class="inline"></cinput>
    <div class="tablesearch" @click="btnquery()"><i class="el-icon-search"></i></div>
    </div>
    <ctable :data="tabledata" @selection-change="btnselect" @row-dblclick="btnedit" @pagechange="btndataload" :pagenum="pagenum"></ctable>
    <cui :pk="params[2]" v-model="mm"></cui>
  </div>
</template>

<script>
import u from '../js/utility'
import e from '../js/excel'
export default {
  data() {
    return {
      params: [],
      tabledata: {},
      loading: false,
      selectrows: [],
      pagenum: 1,
      queryvalue: '',
      querylist: [],
      mm: [],
      winvisible: false,
      wintitle: '',
      menudata: []
    }
  },
  created: function() {
  },
  mounted: function() {
    this.params = u.getpageparmas(this)
    this.btnquery()
  },
  computed: {},
  methods: {
    btnshow: function(btnid) {
      return u.buttonshow(this, btnid)
    },
    btnselect: function(rows) {
      this.selectrows = rows
    },
    btndataload: function(num) {
      if (num !== undefined) {
        this.pagenum = num
      }
      u.querypage(this, this.params[1], u.querypagesize(), this.pagenum, this.querylist, 'tabledata')
    },
    btnquery: function() {
      u.addwhere(this, 'querylist', '', '', 'Name', 'like', this.queryvalue, '')
      this.btndataload(1)
    },
    btnadd: function() {
      u.getmodel(this, 'DefList', '', 'mm', '新增')
    },
    btnedit: function(row) {
      if (!this.btnshow('btnedit')) {
        return
      }
      row = u.dtselectvalue(this, row)
      if (!u.isnullorwhitespace(row)) {
        u.getmodel(this, 'DefList', row.pk, 'mm', '编辑')
      }
    },
    btnsave: function(row) {
      let that = this
      u.getdata(that, 'DefList', u.isnullorwhitespace(that.mm.ts) ? 'Add' : 'Update', that.mm).then(function(r) {
        if (r.ok) {
          u.messagesuccess(that)
          that.winvisible = false
          that.btndataload(1)
        } else {
          u.messagenotify(that, r.message)
        }
      })
    },
    btndelete: function() {
      u.messagedelete(this).then(() => {
        u.pagebatchoperate(this, 'DefList', 'Delete')
      }).catch((e) => {
        console.log(e)
      })
    },
    btntoexcel: function() {
      e.exportxlsx(this.tabledata.rows)
    }
  }
}
</script>

