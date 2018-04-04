<template>
  <div class="pagecontent">
    <div class="pageleft">
      <el-menu @select="btnquery" class="menulist" width="20%" background-color="#fff" text-color="#555">
        <el-menu-item v-for="(m,index) in menudata.rows" :index="m.Value" :key="m.Value">{{m.Text}}</el-menu-item>
      </el-menu>
    </div>
    <div class="pagecenter">
      <el-button-group>
        <el-button type="primary" @click="btnquery()">查询</el-button>
        <el-button type="primary" @click="btnadd()" v-show="btnshow('btnadd')">新增</el-button>
        <el-button type="primary" @click="btnedit()" v-show="btnshow('btnedit')">编辑</el-button>
        <el-button type="primary" @click="btndelete()" v-show="btnshow('btndelete')">删除</el-button>
        <el-button type="primary" @click="btndataload()">刷新</el-button>
        <el-button type="primary" @click="btntoexcel()" v-show="btnshow('btntoexcel')">导出</el-button>
      </el-button-group>
      <cinput v-model="queryvalue" @keyup.enter.native="btnquery()" placeholder="名称" class="inline"></cinput>
      <ctable :data="tabledata" @selection-change="btnselect" @row-dblclick="btnedit" @pagechange="btndataload" :pagenum="pagenum"></ctable>
    </div>
    <cwindow v-model="winvisible" :title="wintitle">
      <div class="order_input">
        <cinput title="编码" v-model="mm.Code"></cinput>
        <cinput title="名称" v-model="mm.Name"></cinput>
        <cselect title="封存" v-model="mm.Seal" pk="YN"></cselect>
        <cselect title="固定" v-model="mm.Fix" pk="YN"></cselect>
        <ctextarea title="值" v-model="mm.Value" :length="2"></ctextarea>
        <cinput title="备注" v-model="mm.Memo" :length="2"></cinput>
        <ccorp title="组织" v-model="mm.pk_Corp"></ccorp>
      </div>
      <div class="dialog-footer">
        <el-button @click="winvisible=false">取消</el-button>
        <el-button type="primary" @click="btnsave">提交</el-button>
      </div>
    </cwindow>
  </div>
</template>

<script>
  import u from '../js/utility'
  import e from '../js/excel'
  import $ from 'jquery'
  export default {
    data () {
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
        menudata: [],
        defpk: ''
      }
    },
    created: function () {
    },
    mounted: function () {
      this.params = u.getpageparmas(this)
      $('.menulist').css('height', document.body.offsetHeight - 120 + 'px')
      // this.btnquery()
      u.querywhere(this, '9a5b66d1-3d70-4f50-9aac-a77100e76573', null, 'menudata')
    },
    computed: {},
    methods: {
      btnshow: function (btnid) {
        return u.buttonshow(this, btnid)
      },
      btnselect: function (rows) {
        this.selectrows = rows
      },
      btndataload: function (num) {
        if (num !== undefined) {
          this.pagenum = num
        }
        u.querypage(this, this.params[1], u.querypagesize(), this.pagenum, this.querylist, 'tabledata')
      },
      btnquery: function (data) {
        this.querylist = []
        if (!u.isnullorwhitespace(data)) {
          this.defpk = data
        } else {
          u.addwhere(this, 'querylist', '', '', 'DefList.Name', 'like', this.queryvalue, '')
        }
        u.addwhere(this, 'querylist', '', '', 'DefList.pk_Def', '=', this.defpk, '')
        this.btndataload(1)
      },
      btnadd: function () {
        u.getmodel(this, 'DefList', '', 'mm', '新增')
      },
      btnedit: function (row) {
        if (!this.btnshow('btnedit')) {
          return
        }
        row = u.dtselectvalue(this, row)
        if (!u.isnullorwhitespace(row)) {
          u.getmodel(this, 'DefList', row.pk, 'mm', '编辑')
        }
      },
      btnsave: function (row) {
        let that = this
        u.getdata(that, 'DefList', u.isnullorwhitespace(that.mm.ts) ? 'Add' : 'Update', that.mm).then(function (r) {
          if (r.ok) {
            u.messagesuccess(that)
            that.winvisible = false
            that.btndataload(1)
          } else {
            u.messagenotify(that, r.message)
          }
        })
      },
      btndelete: function () {
        u.messagedelete(this).then(() => {
          u.pagebatchoperate(this, 'DefList', 'Delete')
        }).catch((e) => {
          console.log(e)
        })
      },
      btntoexcel: function () {
        e.exportxlsx(this.tabledata.rows)
      }
    }
  }
</script>
