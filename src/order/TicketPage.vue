<template>
    <div class="order_input">
      <el-checkbox  v-model="CardNo" border>是否要票</el-checkbox>
      <cinput title="发票抬头" v-model="mm.CardNo"></cinput>
      <cnumber title="发票金额" v-model="mm.ID" :controls="true" :min="0"></cnumber>
      <citem title="发票类型" v-model="mm.AgeLevel" pk="5e481471-5f1f-4116-9f26-9d4800e92c21"></citem>
      <citem title="发票产品" v-model="mm" pk="59d383f2-f8d3-4059-9214-9a9c00ee182c"></citem>
      <cinput title="发票抬头" v-model="mm.CardNo"></cinput>
      <cnumber title="电话" v-model="mm.AllotTimes" :disabled="onlyread"></cnumber>
      <ccity title="城市" v-model="mm.PCA"></ccity>
      <cinput title="地址" v-model="mm.CardNo"></cinput>
      <cnumber title="邮编" v-model="mm.AllotTimes" :disabled="onlyread"></cnumber>
      <cnumber title="纳税识别号" v-model="mm.AllotTimes" :disabled="onlyread" :length="2"></cnumber>
      <cinput title="公司地址" v-model="mm.CardNo" :length="2"></cinput>
      <cnumber title="公司电话" v-model="mm.AllotTimes" :disabled="onlyread"></cnumber>
      <cinput title="开户银行" v-model="mm.CardNo"></cinput>
      <cnumber title="公司账号" v-model="mm.AllotTimes" :disabled="onlyread" :length="2"></cnumber>
      <cinput title="说明" v-model="mm.CardNo" :length="2"></cinput>
      <br><br><br>
      <cinput title="已经开票" v-model="mm.CardNo" :disabled="true"></cinput>
      <cnumber title="发票编号" v-model="mm.CardNo" :disabled="true"></cnumber>
      <cinput title="发票日期" v-model="mm.CardNo" :disabled="true"></cinput>
      <cnumber title="发运单号" v-model="mm.CardNo" :disabled="true"></cnumber>
      <cinput title="承运公司" v-model="mm.CardNo" :disabled="true"></cinput>
      <cinput title="开票备注" v-model="mm.CardNo" :disabled="true"></cinput>
      <cinput title="开票人" v-model="mm.CardNo" :disabled="true"></cinput>
      <cinput title="开票时间" v-model="mm.CardNo" :disabled="true"></cinput>
      <br><br><br>
    </div>
</template>

<script>
import u from '../js/utility'
export default {
    data() {
      return {
        mm: [],
        CardNo: ''
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

