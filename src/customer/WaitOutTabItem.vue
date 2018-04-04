<template>
    <div class="pagecontent">
      <el-button-group>
        <el-button type="primary" @click="btndataload()">刷新</el-button>
        <el-button type="primary" @click="btntoexcel()">出库</el-button>
      </el-button-group>
      <ctable :data="tabledata" @selection-change="btnselect" @row-dblclick="btnedit" @pagechange="btndataload" :pagenum="pagenum"></ctable>
        <cwindow v-model="winvisible" :title="wintitle">
            <div class="order_input">
                <ccustomer title="客户" v-model="mm.pk_Customer"></ccustomer>
                <cselect title="联系类型" v-model="mm.ConnType" pk="bda0f04a-f424-405e-a3d7-9a9c00ee079e"></cselect>
                <cdatepicker title="联系日期" v-model="mm.ConnTime"></cdatepicker>
                <cdatepicker title="下次联系" v-model="mm.NextTime"></cdatepicker>
                <cdept title="部门" v-model="mm.pk_Dept"></cdept>
                <cemployee title="员工" v-model="mm.pk_Employee" @change="employeechange"></cemployee>
                <ctextarea title="内容" v-model="mm.Memo" :length="2"></ctextarea>
            </div>
            <!-- <cui pk="635b5daa-2539-4808-a74c-a7a8009ef8db" v-model="mm"></cui> -->
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
    created: function() {
    },
    mounted: function() {
//        this.params = u.getpageparmas(this)
        this.btnquery()
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

