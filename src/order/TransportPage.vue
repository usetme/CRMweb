<template>
  <div>
    <div class="order_input btnleft" style="width: 55%">
      <el-checkbox  v-model="CardNo" border>是否发运</el-checkbox>
      <citem title="承运公司" v-model="mm.AgeLevel" pk="b4456d0e-8e89-4dbe-b185-9a9c00ee1ee4"></citem>
      <cnumber title="运费" v-model="mm.ID" :controls="true" :min="0"></cnumber>
      <citem title="承运公司" v-model="mm.AgeLevel" pk="d3e653f5-4d86-437b-9c79-9a9c00fb9829"></citem>
      <cinput title="收件人" v-model="mm.CardNo"></cinput>
      <cnumber title="手机" v-model="mm.AllotTimes" :disabled="onlyread"></cnumber>
      <cnumber title="电话" v-model="mm.AllotTimes" :disabled="onlyread"></cnumber>
      <ccity title="城市" v-model="mm.PCA"></ccity>
      <cinput title="地址" v-model="mm.CardNo" :length="2"></cinput>
      <cnumber title="邮编" v-model="mm.AllotTimes" :disabled="onlyread"></cnumber>
      <cinput title="发货要求" v-model="mm.CardNo" :length="2"></cinput>
      <br><br><br>
    </div>
    <div class="order_input btnright" style="width: 40%;">
      <cinput title="已经发运" v-model="mm.CardNo" :disabled="true"></cinput>
      <cnumber title="发运单号" v-model="mm.ID" :controls="true" :min="0" :disabled="true"></cnumber>
      <cinput title="承运公司" v-model="mm.CardNo" :disabled="true"></cinput>
      <cinput title="发运人" v-model="mm.CardNo" :disabled="true"></cinput>
      <cinput title="发运日期" v-model="mm.CardNo" :disabled="true"></cinput>
      <cinput title="物流状态" v-model="mm.CardNo" :disabled="true"></cinput>
      <ctextarea title=" " v-model="mm.Memo" :length="2" :disabled="true"></ctextarea>
      <br><br><br>
    </div>
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
