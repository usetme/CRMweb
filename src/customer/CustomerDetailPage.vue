<template>
  <div class="pagecontent">
    <el-button-group>
      <el-button type="primary" :disabled="pagestate==='E'" v-show="true" @click="btnadd">新增</el-button>
      <el-button type="primary" :disabled="pagestate!=='Q'" v-show="true" @click="btnedit">编辑</el-button>
      <el-button type="primary" :disabled="pagestate!=='Q'" v-show="true" @click="btndelete">删除</el-button>
      <el-button type="primary" :disabled="pagestate!=='E'" v-show="true" @click="btnsave">保存</el-button>
      <el-button type="primary" :disabled="pagestate!=='E'" v-show="true" @click="btncancel">取消</el-button>
      <el-button type="primary" :disabled="pagestate==='E'" v-show="true" @click="btnrefresh">刷新</el-button>
      <el-button type="primary" :disabled="pagestate==='E'" v-show="true" @click="btnprint">打印</el-button>
    </el-button-group>
    <cui pk="e48f7d20-6059-4e15-aca3-a81c00f5601c" v-model="mm"></cui>
    <ctabs pk="dd0b254c-a03b-46bd-b365-9adf00b9cf45" v-model="mm" cdirectory="customer">
      <el-tab-pane label="更多信息">
        <div class="order_input">
          <cinput title="卡号" v-model="mm.CardNo"></cinput>
          <cgrade title="级别" v-model="mm.Grade"></cgrade>
          <citem title="服务等级" v-model="mm.ServiceLevel" pk="b8afc430-ab3b-4efc-8b2b-9d47015fb870"></citem>
          <ccustomer title="推荐人" v-model="mm.fpk"></ccustomer>
          <cemployee title="员工" v-model="mm.pk_Employee" @change="employeechange"></cemployee>
          <cdept title="部门" v-model="mm.pk_Dept" :disabled="onlyread"></cdept>
          <ccorp title="公司" v-model="mm.pk_Corp" :disabled="onlyread"></ccorp>
          <citem title="类型" v-model="mm.Type" pk="ee1fc93a-a96b-457e-9a1c-9a9c00fb6cfc"></citem>
          <citem title="年龄阶段" v-model="mm.AgeLevel" pk="470de1bd-de06-4e4f-9a0c-9f0a00c0f015"></citem>
          <cdatepicker title="生日" v-model="mm.Birthday"></cdatepicker>
          <cdatepicker title="农历生日" v-model="mm.BirthLunar"></cdatepicker>
          <cdatepicker title="加入日期" v-model="mm.JoinDate"></cdatepicker>
          <citem title="来源" v-model="mm.Source" pk="b8afc430-ab3b-4efc-8b2b-9d47015fb870"></citem>
          <citem title="经济状况" v-model="mm.Economy" pk="f5a5f876-517e-4b5e-9cfb-9a9c00fb887c"></citem>
          <citem title="保健意识" v-model="mm.HealthWare" pk="e2a784ae-a862-4402-a45d-9a9c00fb8307"></citem>
          <cinput title="健康状况" v-model="mm.Health"></cinput>
          <citem title="亲密度" v-model="mm.Intimate" pk="48ffde4c-531e-431f-9c48-9a9c00fb5e80"></citem>
          <cnumber title="身份证" v-model="mm.ID"></cnumber>
          <citem title="民族" v-model="mm.Folk" pk="60e961e6-8000-4c6d-96ee-9a9c00fb8cb7"></citem>
          <cinput title="备注" v-model="mm.Memo" length="2"></cinput>
          <cnumber title="分配次数" v-model="mm.AllotTimes" :disabled="onlyread"></cnumber>
          <cnumber title="可用积分" v-model="mm.Score" :disabled="onlyread"></cnumber>
          <cnumber title="电子账户" v-model="mm.BankMoney" :disabled="onlyread"></cnumber>
          <cnumber title="电子券" v-model="mm.Ticket" :disabled="onlyread"></cnumber>
          <cnumber title="累计消费" v-model="mm.MoneyTotal" :disabled="onlyread"></cnumber>
        </div>
      </el-tab-pane>
    </ctabs>
  </div>
</template>

<script>
import u from '../js/utility'
import CityJson from '../assets/city.json'
export default {
    components: {},
    data() {
        return {
            params: [],
            pagestate: 'E',
            onlyread: false,
            mm: []
        }
    },
    watch: {
        mm: function(newmm, oldmm) {
        }
    },
    created: function() {
    },
    mounted() {
        this.params = u.getpageparmas(this)
        this.loaddata()
    },
    methods: {
        getcolumnstyle(obj) {
            return u.getcolumnstyle(obj)
        },
        employeechange(data) {
            if (u.isnullorwhitespace(this.mm.pk_Dept)) {
                this.mm.pk_Dept = data[0].pk_Dept
            }
        },
        loaddata() {
            let that = this
            u.querydataf(that, 'Customer', 'GetModel', {
                pk: that.params[2] === 'New' ? '' : that.params[1],
                type: that.params[2]
            }, that.binddata, true)
        },
        binddata(model) {
            let that = this
            that.modelload()
            that.mm = model
            if (u.isnullorwhitespace(that.mm.ts)) {
                this.modeladd(that.mm.pk_Employee)
            } else {
                this.modelquery()
            }
        },
        btnadd() {
            u.addnewtab(this, 'C')
        },
        btnedit() {
            this.modeledit()
            this.btnaddline()
        },
        btndelete() {
            u.messagedelete(this).then(() => {
                let that = this
                u.getdata(that, 'Customer', 'Delete', { pk: that.mm.pk_Customer }).then(function(r) {
                    if (r.ok) {
                        u.closetab(that)
                        u.addnewtab(that, 'S')
                    } else {
                        u.messagenotify(that, r.message)
                    }
                })
            }).catch((e) => {
                console.log(e)
            })
        },
        btnsave() {
            let that = this
            u.getdata(that, 'Customer', u.isnullorwhitespace(that.mm.ts) ? 'Add' : 'Update', that.mm).then(function(r) {
                if (r.ok) {
                    that.params[1] = that.mm.pk_Customer
                    that.params[2] = 'Query'
                    that.loaddata()
                    u.messagesuccess(that)
                } else {
                    u.messagenotify(that, r.message)
                }
            })
        },
        btncancel() {
            this.loaddata()
        },
        btnprint() {
        },
        btnrefresh() {
            this.loaddata()
        },
        modeledit() {
            this.pagestate = 'E'
            this.onlyread = false
        },
        modeladd(isnew) {
            this.pagestate = 'E'
            this.onlyread = false
            this.mm.BillDate = u.getdate()
            if (isnew === true || u.isnullorwhitespace(isnew)) {
                this.mm.pk_Dept = u.getuser().pk_Dept
                this.mm.pk_Employee = u.getuser().pk_User
            }
        },
        modelquery() {
            this.pagestate = 'Q'
            this.onlyread = true
        },
        modelload() {
            this.pagestate = 'L'
            this.onlyread = true
        }
    }
}
</script>

