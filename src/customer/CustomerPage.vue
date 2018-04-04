<template>
  <div class="pagecontent">
    <div>
    <el-button-group>
      <el-button type="primary" @click="btnquery()">查询</el-button>
      <el-button type="primary" @click="btnadd()" v-show="btnshow('btnadd')">新增</el-button>
      <el-button type="primary" @click="btnedit()" v-show="btnshow('btnedit')">查看</el-button>
      <el-button type="primary" @click="btndelete()" v-show="btnshow('btndelete')">删除</el-button>
      <el-button type="primary" @click="btndataload()">刷新</el-button>
      <el-button type="primary" @cilck="btnprint()" v-show="btnshow('btnprint')">打印</el-button>
      <el-button type="primary" @cilck="btntoexcel()" v-show="btnshow('btntoexcel')">导出</el-button>
    </el-button-group>
    <el-tooltip content="输入中文查询客户，输入数字查询卡号，输入后回车即可" placement="top-start">
      <cinput v-model="queryvalue" @keyup.enter.native="btnquery(queryvalue)" placeholder="快捷查询" class="inline"></cinput>
      <div class="tablesearch" @click="btnquery()"><i class="el-icon-search"></i></div>
    </el-tooltip>
    </div>
    <ctable :data="tabledata" @selection-change="btnselect" @row-dblclick="btnedit" @pagechange="btndataload" :pagenum="pagenum" :loading="loading"></ctable>
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
      querylist: []
    }
  },
  created: function() {
  },
  mounted() {
    this.params = u.getpageparmas(this)
    this.btnquery()
  },
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
    btnquery: function(value) {
      this.querylist = []
      if (value !== undefined) {
        if (u.isnullorwhitespace(value)) {
          u.messagenotify(this, '请输入查询内容')
          return
        } else {
          if (u.isnum(value)) {
            u.addwhere(this, 'querylist', '', '', 'Customer.CardNO', '=', this.queryvalue, '')
          } else {
            u.addwhere(this, 'querylist', '', '', 'Customer.Name', 'like', this.queryvalue, '')
          }
        }
      } else {
        this.queryvalue = ''
      }
      this.btndataload(1)
    },
    btnadd: function() {
      u.addnewtab(this, 'C')
    },
    btnedit: function(row) {
      if (!this.btnshow('btnedit')) {
        return
      }
      row = u.dtselectvalue(this, row)
      if (!u.isnullorwhitespace(row)) {
        u.addnewtab(this, 'C', row.pk)
      }
    },
    btndelete: function() {
      u.messagedelete(this).then(() => {
        u.pagebatchoperate(this, 'Customer', 'Delete')
      }).catch((e) => {
        console.log(e)
      })
    },
    btntoexcel: function() {
      e.exportxlsx(this.tabledata.rows)
    },
    btnprint: function() {
    }
  }
}
</script>
