<template>
  <div class="pagecontent">
    <div>
    <el-button-group>
      <el-button type="primary" @click="btnquery()">查询</el-button>
      <el-button type="primary" @click="btnedit()" v-show="btnshow('btnedit')">编辑</el-button>
      <el-button type="primary" @click="btndataload()">刷新</el-button>
      <el-button type="primary" @click="btntoexcel()" v-show="btnshow('btntoexcel')">导出</el-button>
    </el-button-group>
    <cinput v-model="queryvalue" @keyup.enter.native="btnquery()" placeholder="名称" class="inline"></cinput>
    <div class="tablesearch" @click="btnquery()"><i class="el-icon-search"></i></div>
    </div>
    <ctable :data="tabledata" @selection-change="btnselect" @row-dblclick="btnedit" @pagechange="btndataload" :pagenum="pagenum"></ctable>
    <cwindow v-model="winvisible" :title="wintitle">
      <div class="order_input">
        <cinput title="编码" v-model="mm.Code" :disabled="true"></cinput>
        <cinput title="名称" v-model="mm.Name" :disabled="true"></cinput>
        <cselect title="锁定" v-model="mm.Lock" pk="YN"></cselect>
        <cselect title="管理员" v-model="mm.IsAdmin" pk="YN"></cselect>
        <cselect title="登录下级" v-model="mm.LoginSubordinate" pk="YN"></cselect>
        <cselect title="共享客户" v-model="mm.DataShareCustomer" pk="SZDJ"></cselect>
        <cselect title="客户数据" v-model="mm.DataCustomer" pk="SZDJ"></cselect>
        <cselect title="订单数据" v-model="mm.DataOrder" pk="SZDJ"></cselect>
        <cselect title="仓库数据" v-model="mm.DataStore" pk="SZDJ"></cselect>
        <cselect title="部门数据" v-model="mm.DataDept" pk="SZDJ"></cselect>
        <cinput title="密码" v-model="mm.Password"></cinput>
        <cselect title="全网访问" v-model="mm.AllNet" pk="YN"></cselect>
        <cnumber title="可用短信" v-model="mm.SMSNum" :controls="true"></cnumber>
        <cnumber title="已发短信" v-model="mm.SMSUsedNum" :disabled="true"></cnumber>
        <cnumber title="座席号" v-model="mm.phoneNo"></cnumber>
        <cinput title="AcdID" v-model="mm.AcdID"></cinput>
        <cinput title="技能等级" v-model="mm.Skill"></cinput>
        <cselect title="坐席类型" v-model="mm.AgentType" pk="ZXLX"></cselect>
        <cselect title="客户端登录" v-model="mm.IsClientLogin" pk="YN"></cselect>
        <cinput title="公司范围" v-model="mm.DataCorp" :length="2"></cinput>
        <p class="align">(AcdID和技能可以设置多个,以;分隔,如AcdID:2001;2002 技能:1;2)</p>
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
    created: function () {
    },
    mounted: function () {
      this.params = u.getpageparmas(this)
      this.btnquery()
    },
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
      btnquery: function () {
        this.querylist = []
        u.addwhere(this, 'querylist', '', '', 'Employee.Name', 'like', this.queryvalue, '')
        this.btndataload(1)
      },
      btnedit: function (row) {
        if (!this.btnshow('btnedit')) {
          return
        }
        row = u.dtselectvalue(this, row)
        if (!u.isnullorwhitespace(row)) {
          u.getmodel(this, 'User', row.pk, 'mm', '编辑')
        }
      },
      btnsave: function (row) {
        let that = this
        u.getdata(that, 'User', u.isnullorwhitespace(that.mm.ts) ? 'Add' : 'Update', that.mm).then(function (r) {
          if (r.ok) {
            u.messagesuccess(that)
            that.winvisible = false
            that.btndataload(1)
          } else {
            u.messagenotify(that, r.message)
          }
        })
      },
      btntoexcel: function () {
        e.exportxlsx(this.tabledata.rows)
      }
    }
  }
</script>

