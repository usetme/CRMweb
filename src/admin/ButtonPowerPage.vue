<template>
  <div class="pagecontent">
    <div class="pageleft">
      <el-tree :data="menudata.rows" node-key="pk" highlight-current @node-click="btnquery"></el-tree>
    </div>
    <div class="pagecenter">
      <div>
      <el-button-group>
        <el-button type="primary" @click="btnadd()" v-show="btnshow('btnadd')">新增</el-button>
        <el-button type="primary" @click="btnedit()" v-show="btnshow('btnedit')">编辑</el-button>
        <el-button type="primary" @click="btndelete()" v-show="btnshow('btndelete')">删除</el-button>
        <el-button type="primary" @click="btndataload()">刷新</el-button>
      </el-button-group>
      <cinput v-model="queryvalue" @keyup.enter.native="btnquery()" placeholder="名称" class="inline"></cinput>
      <div class="tablesearch" @click="btnquery()"><i class="el-icon-search"></i></div>
      </div>
      <ctable :data="tabledata" @selection-change="btnselect" @row-dblclick="btnedit" @pagechange="btndataload" :pagenum="pagenum"></ctable>
    </div>
    <cwindow v-model="winvisible" :title="wintitle">
      <div class="order_input">
        <cinput title="编码" v-model="mm.Code"></cinput>
        <cinput title="名称" v-model="mm.Name"></cinput>
        <cselect title="菜单" v-model="mm.IsMenu" pk="YN"></cselect>
        <cselect title="节点" v-model="mm.pk_Node" querypk="1ad36ef1-5154-4e55-b3c4-a7da00ba02ba"></cselect>
        <cinput title="类名" v-model="mm.PageClass" :length="2"></cinput>
        <cinput title="参数" v-model="mm.Parameter" :length="2"></cinput>
        <cselect title="预警" v-model="mm.IsAlarm" pk="YN"></cselect>
        <ccorp title="公司" v-model="mm.pk_Corp"></ccorp>
        <cselect title="封存" v-model="mm.Seal" pk="YN"></cselect>
        <cinput title="备注" v-model="mm.Memo"></cinput>
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
  export default {
    data () {
      return {
        params: [],
        tabledata: {},
        menudata: [],
        loading: false,
        selectrows: [],
        pagenum: 1,
        queryvalue: '',
        querylist: [],
        mm: [],
        winvisible: false,
        wintitle: ''
      }
    },
    created: function () {
    },
    mounted: function () {
      this.params = u.getpageparmas(this)
//      this.btnquery()
//      u.querywhere(this, '7a1562a3-336d-4a54-a34c-a7da00a17c54', null, 'menudata')
      u.querydata(this, 'DefList', 'TreeList', null, 'menudata')
//      u.querywhere(this, '911992f4-adee-4ee7-9a1b-a7da01161063', null, 'menudata')
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
        console.log(this.menudata)
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
          u.addwhere(this, 'querylist', '', '', 'ButtonPower.Name', 'like', this.queryvalue, '')
        }
        u.addwhere(this, 'querylist', '', '', 'ButtonPower.pk_Node', '=', this.defpk, '')
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
          u.getmodel(this, 'Power', row.pk, 'mm', '编辑')
        }
      },
      btnsave: function (row) {
        let that = this
        u.getdata(that, 'Power', u.isnullorwhitespace(that.mm.ts) ? 'Add' : 'Update', that.mm).then(function (r) {
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
          u.pagebatchoperate(this, 'Power', 'Delete')
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
