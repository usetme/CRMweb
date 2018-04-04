<template>
    <div class="pagecontent">
        <el-button-group>
            <el-button type="primary" @click="btnquery()">查询</el-button>
            <el-button type="primary" @click="btnadd()" v-show="btnshow('btnadd')">新增</el-button>
            <el-button type="primary" @click="btnedit()" v-show="btnshow('btnedit')">编辑</el-button>
            <el-button type="primary" @click="btndelete()" v-show="btnshow('btndelete')">删除</el-button>
            <el-button type="primary" @click="btndataload()">刷新</el-button>
        </el-button-group>
      <ctable :data="tabledata" @selection-change="btnselect" @row-dblclick="btnedit" @pagechange="btndataload" :pagenum="pagenum"></ctable>
        <cwindow v-model="winvisible" :title="wintitle">
            <div class="order_input">
              <cinput title="姓名" v-model="mm.Name"></cinput>
              <citem title="关系" v-model="mm.Relation" pk="84f57e59-2514-4e64-9d65-9a9c00fb924d"></citem>
              <cselect title="性别" v-model="mm.Sex" pk="Sex"></cselect>
              <cdatepicker title="生日" v-model="mm.Birthday"></cdatepicker>
              <cnumber title="电话" v-model="mm.Tel" :disabled="onlyread"></cnumber>
              <cnumber title="手机" v-model="mm.Mobile" :disabled="onlyread"></cnumber>
              <cnumber title="邮编" v-model="mm.PostCode" :disabled="onlyread"></cnumber>
              <ccity title="城市" v-model="mm.PCA"></ccity>
              <cinput title="地址" v-model="mm.Address" length="2"></cinput>
              <cinput title="备注" v-model="mm.Memo" length="2"></cinput>
              <cinput title="是否同往" v-model="mm.Def1"></cinput>
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
  created: function () {
  },
  mounted: function () {
    let that = this
    that.params = u.getpageparmas(that)
    that.btnquery()
  },
  computed: {},
  methods: {
    employeechange(data) {
            if (u.isnullorwhitespace(this.mm.pk_Dept)) {
                this.mm.pk_Dept = data[0].pk_Dept
            }
        },
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
            this.querylist = []
            u.addwhere(this, 'querylist', '', '', 'Name', 'like', this.queryvalue, '')
            this.btndataload(1)
        },
        btnadd: function() {
            u.getmodel(this, 'Connect', '', 'mm', '新增')
        },
        btnedit: function(row) {
            if (!this.btnshow('btnedit')) {
                return
            }
            row = u.dtselectvalue(this, row)
            if (!u.isnullorwhitespace(row)) {
                u.getmodel(this, 'Connect', row.pk, 'mm', '编辑')
            }
        },
        btnsave: function(row) {
            let that = this
            u.getdata(that, 'Connect', u.isnullorwhitespace(that.mm.ts) ? 'Add' : 'Update', that.mm).then(function(r) {
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
                u.pagebatchoperate(this, 'Connect', 'Delete')
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

