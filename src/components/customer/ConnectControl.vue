<template>
    <div class="pagecontent">
        <el-button-group>
            <el-button type="primary" @click="btnadd()" v-show="btnshow('btnadd')">新增</el-button>
            <el-button type="primary" @click="btnedit()" v-show="btnshow('btnedit')">编辑</el-button>
            <el-button type="primary" @click="btndelete()" v-show="btnshow('btndelete')">删除</el-button>
            <el-button type="primary" @click="btndataload()">刷新</el-button>
        </el-button-group>
        <ctable :data="tabledata" @selection-change="btnselect" @row-dblclick="btnedit" @pagechange="btndataload" :pagenum="pagenum"></ctable>
        <cwindow v-model="winvisible" :title="wintitle">
            <div class="order_input">
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
import u from '../../js/utility'
export default {
    props: {
        pk: [String]
    },
    watch: {
        pk: function(val, oldValue) {
            if (val === this.oldValue) {
                return
            }
            this.btnquery()
        }
    },
    data() {
        return {
            params: [],
            tabledata: {},
            loading: false,
            selectrows: [],
            pagenum: 1,
            mm: [],
            winvisible: false,
            wintitle: '',
            menudata: []
        }
    },
    created: function() {
    },
    mounted: function() {
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
            if (u.isnullorwhitespace(this.pk)) {
                return
            }
            if (num !== undefined) {
                this.pagenum = num
            }
            u.querypage(this, 'd7183691-3028-4b69-8fcb-a7db0112e9ad', 10, this.pagenum, [
                {
                    Field: 'pk',
                    Value: this.pk,
                    Parm: 'Y'
                }], 'tabledata')
        },
        btnquery: function() {
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
            if (u.isnullorwhitespace(that.mm.ts) && u.isnullorwhitespace(that.mm.pk_Customer)) {
                this.mm.pk_Customer = this.pk
            }
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
        }
    }
}
</script>

