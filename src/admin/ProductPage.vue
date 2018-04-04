<template>
  <div class="pagecontent">
    <div class="pageleft">
      <el-tree :data="menudata" node-key="pk" highlight-current @node-click="btnquery"></el-tree>
    </div>
    <div class="pagecenter">
      <div>
      <el-button-group>
        <el-button type="primary" @click="btnquery()">查询</el-button>
        <el-button type="primary" @click="btnadd()" v-show="btnshow('btnadd')">新增</el-button>
        <el-button type="primary" @click="btnedit()" v-show="btnshow('btnedit')">编辑</el-button>
        <el-button type="primary" @click="btndelete()" v-show="btnshow('btndelete')">删除</el-button>
        <el-button type="primary" @click="btndataload()">刷新</el-button>
        <el-button type="primary" @click="btntoexcel()" v-show="btnshow('btntoexcel')">导出</el-button>
      </el-button-group>
      <cinput v-model="queryvalue" @keyup.enter.native="btnquery()" placeholder="名称" class="inline"></cinput>
      <div class="tablesearch" @click="btnquery()"><i class="el-icon-search"></i></div>
      </div>
      <ctable :data="tabledata" @selection-change="btnselect" @row-dblclick="btnedit" @pagechange="btndataload" :pagenum="pagenum"></ctable>
    </div>
    <cwindow v-model="winvisible" :title="wintitle">
      <el-tabs active-name="first">
        <el-tab-pane label="基本信息" name="first">
          <div class="order_input">
            <cinput title="编码" v-model="mm.Code"></cinput>
            <cinput title="名称" v-model="mm.Name"></cinput>
            <ccategory title="分类" v-model="mm.pk_Category"></ccategory>
            <cselect title="单位" v-model="mm.Meas" pk="743c4e68-0654-40c9-9350-99ec01105468"></cselect>
            <cinput title="条码" v-model="mm.BarCode"></cinput>
            <cinput title="规格" v-model="mm.Type"></cinput>
            <cinput title="型号" v-model="mm.Spec"></cinput>
            <cinput title="颜色" v-model="mm.Color"></cinput>
            <cnumber title="重量kg" v-model="mm.Weight"></cnumber>
            <cnumber title="体积" v-model="mm.Volume"></cnumber>
            <cnumber title="长" v-model="mm.Length"></cnumber>
            <cnumber title="宽" v-model="mm.Width"></cnumber>
            <cnumber title="高" v-model="mm.Height"></cnumber>
            <cinput title="备注" v-model="mm.Memo" :length="2"></cinput>
          </div>
        </el-tab-pane>
        <el-tab-pane label="价格积分" name="second">
          <div class="order_input">
            <cnumber title="产品PV" v-model="mm.PV"></cnumber>
            <cselect title="特价产品" v-model="mm.SpecialOffer" pk="YN"></cselect>
            <cnumber title="采购价格" v-model="mm.PriceP"></cnumber>
            <cnumber title="调拨价格" v-model="mm.PriceT"></cnumber>
            <cnumber title="成本价格" v-model="mm.PriceCost"></cnumber>
            <cnumber title="销售价格" v-model="mm.Price"></cnumber>
            <cnumber title="会员价格" v-model="mm.PriceM"></cnumber>
            <cnumber title="市场价格" v-model="mm.PriceRetail"></cnumber>
            <cnumber title="获得积分" v-model="mm.Score"></cnumber>
            <cnumber title="推荐积分" v-model="mm.Scorefpk"></cnumber>
            <cnumber title="最低售价" v-model="mm.PriceMin"></cnumber>
            <cnumber title="最高售价" v-model="mm.PriceMax"></cnumber>
          </div>
        </el-tab-pane>
        <el-tab-pane label="管理信息" name="third">
          <div class="order_input">
            <cselect title="封存" v-model="mm.Seal" pk="YN"></cselect>
            <cselect title="负库存" v-model="mm.Negative" pk="YN"></cselect>
            <cselect title="组合品" v-model="mm.Bom" pk="YN"></cselect>
            <cnumber title="使用天数" v-model="mm.Days"></cnumber>
            <cnumber title="保养周期" v-model="mm.MaintenancePeriod"></cnumber>
            <cnumber title="采购周期" v-model="mm.PurchasingCycle"></cnumber>
            <cselect title="批次管理" v-model="mm.Batch" pk="YN"></cselect>
            <cselect title="保质期" v-model="mm.Quality" pk="YN"></cselect>
            <cnumber title="质保天数" v-model="mm.QualityDays"></cnumber>
            <cselect title="允许订货" v-model="mm.CanOrder" pk="YN"></cselect>
            <cselect title="仅订单用" v-model="mm.OnlyOrder" pk="YN"></cselect>
            <cselect title="管理库存" v-model="mm.ManageStock" pk="YN"></cselect>
            <cdatepicker title="开始日期" v-model="mm.BeginDate"></cdatepicker>
            <cdatepicker title="结束日期" v-model="mm.EndDate"></cdatepicker>
            <cselect title="是否赠品" v-model="mm.Gift" pk="YN"></cselect>
            <cselect title="是否充值" v-model="mm.IsBank" pk="YN"></cselect>
          </div>
        </el-tab-pane>
        <el-tab-pane label="自定义项" name="third">
          <cui pk="90c9cf14-3cc7-41aa-82c6-a7d900d8c2b4" v-model="mm"></cui>
        </el-tab-pane>
        <el-tab-pane label="关联项目" name="fourth">
          <chealth :pk="mm.pk_Product"></chealth>
        </el-tab-pane>
      </el-tabs>
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
    this.params = u.getpageparmas(this)
    this.btnquery()
    u.querydata(this, 'Category', 'TreeList', null, 'menudata')
  },
  computed: {},
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
    btnquery: function(data) {
      this.querylist = []
      if (u.isnullorwhitespace(data)) {
        u.addwhere(this, 'querylist', '', '', 'Name', 'like', this.queryvalue, '')
      } else {
        u.addwhere(this, 'querylist', '', '', 'Product.pk_Category', '=', data.pk, '')
      }
      this.btndataload(1)
    },
    btnadd: function() {
      u.getmodel(this, 'Product', '', 'mm', '新增')
    },
    btnedit: function(row) {
      if (!this.btnshow('btnedit')) {
        return
      }
      row = u.dtselectvalue(this, row)
      if (!u.isnullorwhitespace(row)) {
        u.getmodel(this, 'Product', row.pk, 'mm', '编辑')
      }
    },
    btnsave: function(row) {
      let that = this
      u.getdata(that, 'Product', u.isnullorwhitespace(that.mm.ts) ? 'Add' : 'Update', that.mm).then(function(r) {
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
        u.pagebatchoperate(this, 'Product', 'Delete')
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
