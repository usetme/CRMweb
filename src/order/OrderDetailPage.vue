<template>
  <div class="pagecontent">
      <el-button-group>
        <el-button type="primary" :disabled="pagestate==='E'" v-show="true" @click="btnadd">新增</el-button>
        <el-button type="primary" :disabled="pagestate!=='Q'" v-show="true" @click="btnedit">编辑</el-button>
        <el-button type="primary" :disabled="pagestate!=='Q'" v-show="true" @click="btndelete">删除</el-button>
        <el-button type="primary" :disabled="pagestate!=='E'" v-show="true" @click="btnsave">保存</el-button>
        <el-button type="primary" :disabled="pagestate!=='E'" v-show="true" @click="btncancel">取消</el-button>
        <el-button type="primary" :disabled="pagestate!=='E'" v-show="true" @click="btnaddline">增行</el-button>
        <el-button type="primary" :disabled="pagestate==='E'" v-show="true" @click="btncopy">复制</el-button>
        <el-button type="primary" :disabled="pagestate!=='Q'" v-show="true" @click="btnsign">审批</el-button>
        <el-button type="primary" :disabled="pagestate!=='S'" v-show="true" @click="btnsigncancel">弃审</el-button>
        <el-button type="primary" :disabled="pagestate!=='S'" v-show="true" @click="btnback">退货</el-button>
        <el-button type="primary" :disabled="pagestate==='E'" v-show="true" @click="btnrefresh">刷新</el-button>
        <el-button type="primary" :disabled="pagestate==='E'" v-show="true" @click="btnprint">打印</el-button>
      </el-button-group>
    <div class="order_input">
      <cinput title="单据编号" v-model="mm.BillCode" :disabled="onlyread"></cinput>
      <cdatepicker title="单据日期" v-model="mm.BillDate" :disabled="onlyread"></cdatepicker>
      <cselect title="仓库" v-model="mm.pk_Store" :disabled="onlyread" querypk="77e5eda4-176f-4bd6-9117-a7ac013049cc"></cselect>
      <cselect title="付款类型" v-model="mm.PayType" :disabled="onlyread" pk="197c00b6-7168-41af-b674-9a9c00edf2d6"></cselect>
      <cdept title="部门选择" v-model="mm.pk_Dept" :disabled="onlyread"></cdept>
      <cemployee title="员工选择" v-model="mm.pk_Employee" :disabled="onlyread" @change="employeechange"></cemployee>
      <ccustomer title="客户选择" v-model="mm.pk_Customer" :billdate="mm.BillDate" issaleorder="true" :deptpk="mm.pk_Dept" @change="customerchange" :disabled="onlyread"></ccustomer>
      <cnumber title="订单金额" v-model="mm.Total" :disabled="true"></cnumber>
      <cnumber title="抹零" v-model="mm.ToZero" :disabled="true"></cnumber>
      <cnumber title="折扣" v-model="mm.Discount" @change="discountchange('discount')" :disabled="onlyread"></cnumber>
      <cnumber title="货款" v-model="mm.TotalMoney" @change="discountchange('totalmoney')" :disabled="onlyread"></cnumber>
      <cnumber title="优惠金额" v-model="mm.DiscountMoney" @change="discountchange('discountmoney')" :disabled="onlyread"></cnumber>
      <cnumber title="相关费用" v-model="mm.Fee" @change="buildtotal" :disabled="onlyread"></cnumber>
      <cnumber title="积分兑换" v-model="mm.ScoreMoney" @change="buildtotal" :disabled="onlyread"></cnumber>
      <cnumber title="用电子券" v-model="mm.TicketMoney" @change="buildtotal" :disabled="onlyread"></cnumber>
      <cnumber title="用优惠券" v-model="mm.CouponMoney" @change="buildtotal" :disabled="onlyread"></cnumber>
      <cnumber title="电子账户" v-model="mm.BankMoney" :disabled="onlyread"></cnumber>
      <cnumber title="未收金额" :value="mm.Total-mm.Payment" :disabled="true"></cnumber>
      <cnumber title="收款金额" v-model="mm.Payment" :disabled="onlyread"></cnumber>
      <cnumber title="表体金额" :value="mm.TotalMoneyDetail" :disabled="true"></cnumber>
      <cnumber title="送电子券" :value="mm.Ticket" :disabled="true"></cnumber>
      <clabel title="收件人" v-model="mm.SendCustName"></clabel>
    </div>
    <ctabs pk="c5bad9d0-9d0f-4c80-831a-a429010ffdec" v-model="mm" cdirectory="order">
      <el-tab-pane label="产品信息">
        <el-table  :data="getdetail(true)" :height="tableheight"  show-summary border >
          <el-table-column label="行号" width="90">
            <template scope="scope">
              <span>{{scope.row.HH}}</span>
            </template>
          </el-table-column>
          <el-table-column label="编码" min-width="120">
            <template scope="scope">
              <div v-if="producteditable(scope.row)">
                <cproduct v-model="scope.row.pk_Product"
                          :text="scope.row.Code"
                          :billdate="mm.BillDate"
                          issaleorder="true"
                          :deptpk="mm.pk_Dept"
                          :customerpk="mm.pk_Customer"
                          showfield="Code"
                          :disabled="onlyread"
                          :editable=true
                          :userdata="scope.row.pk_OrderDetail"
                          @change="detailproductchange">
                </cproduct>
              </div>
              <span v-else>{{scope.row.Code}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Product" label="名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Num" label="数量" width="100">
            <template scope="scope">
              <div v-if="numeditable(scope.row)">
                <cnumber size="small"
                         v-model="scope.row.Num"
                         :disabled="onlyread"
                         :userdata="scope.row.pk_OrderDetail"
                         @change="detailnumchange"
                         :length="0.5">
                </cnumber>
              </div>
              <span v-else>{{scope.row.Num}}</span>
            </template>
          </el-table-column>
          <el-table-column label="价格" width="100">
            <template scope="scope">
              <div v-if="priceeditable(scope.row)">
                <cnumber size="small"
                         :length="0.5"
                         v-model="scope.row.Price"
                         :disabled="onlyread"
                         :userdata="scope.row.pk_OrderDetail"
                         @change="detailpricechange">
                </cnumber>
              </div>
              <span v-else>{{scope.row.Price}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Money" label="金额" width="100">
            <template scope="scope">
              <div v-if="moneyeditable(scope.row)">
                <cnumber size="small"
                         :length="0.5"
                         v-model="scope.row.Money"
                         :disabled="onlyread"
                         :userdata="scope.row.pk_OrderDetail"
                         @change="detailmoneychange">
                </cnumber>
              </div>
              <span v-else>{{scope.row.Money}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Gift" label="赠品"></el-table-column>
          <el-table-column prop="NotNum" label="未执行数"></el-table-column>
          <el-table-column prop="FactNum" label="实库数量"></el-table-column>
          <el-table-column prop="BackNum" label="退货数量"></el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button :disabled="onlyread"
                         size="small"
                         type="danger"
                         @click.native.prevent="btndeleteline(scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </ctabs>
  </div>
</template>

<script>
  import u from '../js/utility'
  export default {
    components: {},
    data () {
      return {
        params: [],
        pagestate: 'E',
        onlyread: false,
        mm: [],
        mmdetail: [],
        mmrow: [],
        mmc: [],
        billtype: 'S',
        products: [],
        tableheight: 300
      }
    },
    watch: {
      mmdetail: {
        handler: function (newmm, oldmm) {
//          console.log('newmm')
//          console.log(newmm)
          // this.buildsum()
        },
        deep: true
      },
      mm: function (newmm, oldmm) {
      }
    },
    created: function () {
      let that = this
      u.getmodelcache(that, 'OrderDetail', '', 'mmrow')
    },
    mounted () {
      this.params = u.getpageparmas(this)
      this.tableheight = u.gettableheight(this, 300)
      this.loaddata()
    },
    methods: {
      getcolumnstyle (obj) {
        return u.getcolumnstyle(obj)
      },
      producteditable (row) {
        return !this.onlyread && u.isnullorwhitespace(this.mm.SourceCode) && u.isnullorwhitespace(row.Bom) && u.isnullorwhitespace(row.GiftProduct)
      },
      numeditable (row) {
        return !this.onlyread && u.isnullorwhitespace(row.Bom) && u.isnullorwhitespace(row.GiftProduct)
      },
      priceeditable (row) {
        return !this.onlyread && u.isnullorwhitespace(row.Bom) && u.isnullorwhitespace(row.GiftProduct)
      },
      moneyeditable (row) {
        return !this.onlyread && u.isnullorwhitespace(row.Bom) && u.isnullorwhitespace(row.GiftProduct)
      },
      employeechange (data) {
        if (u.isnullorwhitespace(this.mm.pk_Dept)) {
          this.mm.pk_Dept = data[0].pk_Dept
        }
      },
      customerchange (data) {
        this.mmc = u.copyjson(data[0])
        if (u.isnullorwhitespace(this.mm.ts)) {
          this.mm.Recommend = this.mmc.fpk
          this.mm.SendCity = this.mmc.Province + ' ' + this.mmc.City + ' ' + this.mmc.Area
          this.mm.SendAddress = this.mmc.Address
          this.mm.SendTel = this.mmc.Tel
          this.mm.SendMobile = this.mmc.Mobile
          this.mm.SendPostCode = this.mmc.PostCode
          this.mm.SendCustName = this.mmc.Name
          if (u.getuser().Parm.OrderDefaultUserCustomerDeptEmployee) {
            this.mm.pk_Dept = this.mmc.pk_Dept
            this.mm.pk_Employee = this.mmc.pk_Employee
          }
        }
      },
      loaddata () {
        let that = this
        // u.getmodelf(that, 'Order', that.params[2] === 'New' ? '' : that.params[1], that.binddata)
        u.querydataf(that, 'Order', 'GetModel', {
          pk: that.params[2] === 'New' ? '' : that.params[1],
          type: that.params[2]
        }, that.binddata, true)
      },
      binddata (model) {
        let that = this
        that.modelload()
        that.mm = model
        that.mmdetail = model.Detail
        if (u.isnullorwhitespace(that.mm.ts)) {
          this.modeladd(that.mm.pk_Employee)
        } else {
          if (that.mm.State === 0) {
            this.modelquery()
            u.querydata(that, 'Customer', 'GetModel', { pk: model.pk_Customer, deptpk: model.pk_Dept, billdate: model.BillDate }, 'mmc', false)
//            that.mm.Detail.forEach(function (row) {
//              u.querydataf(that, 'Product', 'GetModel', {
//                pk: row.pk_Product,
//                customerpk: model.pk_Customer,
//                deptpk: model.pk_Dept,
//                billdate: model.BillDate
//              }, function (data) {
//                console.log(data)
//              }, false)
//            })
          } else if (that.mm.State === 1) {
            this.modelsign()
          } else {
            u.messagenotify(that, 'Sate状态不对' + that.mm.State)
          }
        }
      },
      getdetail (konghang) {
        if (u.isnullorwhitespace(this.mm.Detail)) {
          return null
        } else {
          if (konghang) {
            return this.mm.Detail.filter(c => c.dr !== 1).sort(function (a, b) {
              return a.HH - b.HH
            })
          } else {
            return this.mm.Detail.filter(c => c.dr !== 1 && !u.isnullorwhitespace(c.pk_Product)).sort(function (a, b) {
              return a.HH - b.HH
            })
          }
        }
      },
      getdetailrow (val) {
        // 解析传入控件的主键所在行
        let rows = this.mm.Detail.filter(c => c.pk_OrderDetail === val[1])
        if (rows.length !== 1) {
          u.messagenotify(this, '表体行不存在或者主键重复')
          return null
        } else {
          return rows[0]
        }
      },
      btnadd () {
        u.addnewtab(this, 'S')
      },
      btnedit () {
        this.modeledit()
        this.btnaddline()
      },
      btndelete () {
        u.messagedelete(this).then(() => {
          let that = this
          u.getdata(that, 'Order', 'Delete', {pk: that.mm.pk_Order}).then(function (r) {
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
      btnsave () {
        let that = this
        u.getdata(that, 'Order', u.isnullorwhitespace(that.mm.ts) ? 'Add' : 'Update', that.mm).then(function (r) {
          if (r.ok) {
            that.params[1] = that.mm.pk_Order
            that.params[2] = 'Query'
            that.loaddata()
            u.messagesuccess(that)
          } else {
            u.messagenotify(that, r.message)
          }
        })
      },
      btncancel () {
        this.loaddata()
      },
      btncopy () {
        u.addnewtab(this, 'S', this.mm.pk_Order, 'Copy')
      },
      btnback () {
        u.addnewtab(this, 'S', this.mm.pk_Order, 'Back')
      },
      btnsign () {
        let that = this
        u.getdata(that, 'Order', 'Sign', {pk: that.mm.pk_Order}).then(function (r) {
          if (r.ok) {
            that.loaddata()
            u.messagesuccess(that)
          } else {
            u.messagenotify(that, r.message)
          }
        })
      },
      btnsigncancel () {
        let that = this
        u.getdata(that, 'Order', 'SignCancel', {pk: that.mm.pk_Order}).then(function (r) {
          if (r.ok) {
            that.loaddata()
            u.messagesuccess(that)
          } else {
            u.messagenotify(that, r.message)
          }
        })
      },
      btnprint () {
        this.loaddata()
      },
      btnrefresh () {
        this.loaddata()
      },
      modeledit () {
        this.pagestate = 'E'
        this.onlyread = false
      },
      modeladd (isnew) {
        this.mm.BillType = this.billtype
        this.pagestate = 'E'
        this.onlyread = false
        this.mm.BillDate = u.getdate()
        if (isnew === true || u.isnullorwhitespace(isnew)) {
          this.mm.pk_Dept = u.getuser().pk_Dept
          this.mm.pk_Employee = u.getuser().pk_User
        }
        // this.mm.pk_Store = Passport.pk_Store;
        this.mm.SendNeed = this.billtype === 'S' ? u.toyn(u.getuser().Parm.DefalutSend) : 'N'
      },
      modelquery () {
        this.pagestate = 'Q'
        this.onlyread = true
      },
      modelsign () {
        this.pagestate = 'S'
        this.onlyread = true
      },
      modelload () {
        this.pagestate = 'L'
        this.onlyread = true
      },
      btnaddline () {
        let detail = this.mm.Detail.filter(c => c.dr !== 1)
        let d = u.copyjson(this.mmrow)
        d.pk_OrderDetail = u.newid()
        d.pk_Order = this.mm.pk_Order
        d.HH = (detail.length === 0 ? 1 : detail[detail.length - 1].HH + 1)
        d.dr = 2
        this.mm.Detail.push(d)
        return d
      },
      btndeleteline (row) {
        let that = this
        let detail = u.copyjson(that.mm.Detail)
        if (!u.isnullorwhitespace(row.pk_Bom)) {
          detail.filter(c => c.Bom === row.Bom && !u.isnullorwhitespace(c.pk_Bom)).forEach(function (r) {
            if (r.dr === 2) {
              u.listremove(that.mm.Detail, r.pk_OrderDetail, 'pk_OrderDetail')
            } else {
              u.listvalue(that.mm.Detail, r.pk_OrderDetail, 'pk_OrderDetail').dr = 1
            }
          })
        } else {
          detail.filter(c => c.GiftProduct === row.pk_OrderDetail).forEach(function (r) {
            if (r.dr === 2) {
              u.listremove(that.mm.Detail, r.pk_OrderDetail, 'pk_OrderDetail')
            } else {
              u.listvalue(that.mm.Detail, r.pk_OrderDetail, 'pk_OrderDetail').dr = 1
            }
          })
          if (row.dr === 2) {
            u.listremove(that.mm.Detail, row.pk_OrderDetail, 'pk_OrderDetail')
          } else {
            u.listvalue(that.mm.Detail, row.pk_OrderDetail, 'pk_OrderDetail').dr = 1
          }
        }
        that.buildsum()
      },
      detailproductchange (val) {
        let row = this.getdetailrow(val)
        if (row === null) {
          return
        }
        let that = this
        let modelProduct = val[0]
        if (modelProduct === null || modelProduct.Seal === 'Y') {
          if (modelProduct == null) {
            u.messagenotify(that, '不存在,请核对编码和部门');
          } else if (modelProduct.Seal === 'Y') {
            u.messagenotify(that, '产品封存');
          }
          this.builddetail(row, null)
        } else {
          // 读取表头策略
          if (this.billtype === 'S') {
            this.mmc.Prices = u.copyjson(modelProduct.Prices)
            this.mmc.TicketSchemes = u.copyjson(modelProduct.TicketSchemes)
            this.mmc.PriceOrderGifts = u.copyjson(modelProduct.PriceOrderGifts)
            u.listadd(this.products, modelProduct, 'pk_Product')
          }
          let isback = that.mm.IsBack === 2 ? -1 : 1
          if (modelProduct.Bom === 'Y') {
            if (this.billtype !== 'S') {
              u.messagenotify(that, '只有销售订单允许使用组合品')
              return
            }
            u.listremove(that.mm.Detail, row.pk_OrderDetail, 'pk_OrderDetail')
            let bomid = u.newid()
            modelProduct.Boms.forEach(function (p, index) {
              row = that.btnaddline()
              that.builddetail(row, p, isback, bomid, false, modelProduct.pk_Product)
              row.Memo = '组合:' + modelProduct.Name
            })
          } else {
            if (this.billtype === 'S' && modelProduct.PriceLists != null) {
              row.Price = modelProduct.Price
              row.PriceScore = modelProduct.PriceScore
              row.ProductScore = modelProduct.Score
              row.ProductScorefpk = modelProduct.Scorefpk
              var vprice = modelProduct.PriceLists.filter(c => c.FromNum <= row.Num && (c.EndNum === 0 || c.EndNum >= row.Num))
              if (vprice.length > 0) {
                if (vprice[0].Price < modelProduct.Price) {
                  // 如果不新创建个modelProduct，后面数量修改时候价格就无法还原了,但是好像现在没有影响又隐藏了
                  // modelProduct = u.copyjson(modelProduct)
                  modelProduct.Price = vprice[0].Price
                  modelProduct.PriceScore = vprice[0].PriceScore
                  modelProduct.ProductScore = vprice[0].Score
                  modelProduct.ProductScorefpk = vprice[0].Scorefpk
                }
              }
            }
            this.builddetail(row, modelProduct, isback)
            // 开始赠品
            if (this.billtype === 'S' && modelProduct.PriceGifts != null) {
              let beishu = 1
              let gifts = modelProduct.PriceGifts.filter(c => c.Num <= row.Num).sort(function (x, y) {
                y.Num - x.Num
              })
              if (gifts.length > 0) {
                if (gifts[0].Condition === '1') {
                  beishu = Math.floor(Math.abs(row.Num) / gifts[0].Num)
                }
                gifts[0].GiftProducts.forEach(function (g) {
                  let giftrow = that.btnaddline()
                  that.builddetail(giftrow, g, u.todecimal(beishu * isback), '', true, row.pk_OrderDetail)
                })
              }
            }
          }
          this.btnaddline()
          this.buildsum()
        }
      },
      detailnumchange (val) {
        let that = this
        let row = that.getdetailrow(val)
        if (row !== null) {
          if (that.billtype === 'S') {
            let modelProduct = u.listvalue(that.products, row.pk_Product, 'pk_Product')
            if (modelProduct !== null) {
              if (modelProduct.PriceLists != null) {
                row.Price = modelProduct.Price
                row.PriceScore = modelProduct.PriceScore
                row.ProductScore = modelProduct.Score
                row.ProductScorefpk = modelProduct.Scorefpk
                var vprice = modelProduct.PriceLists.filter(c => c.FromNum <= row.Num && (c.EndNum === 0 || c.EndNum >= row.Num))
                if (vprice.length > 0) {
                  if (vprice[0].Price < modelProduct.Price) {
                    row.Price = vprice[0].Price
                    row.PriceScore = vprice[0].PriceScore
                    row.ProductScore = vprice[0].Score
                    row.ProductScorefpk = vprice[0].Scorefpk
                  }
                }
              }
              if (modelProduct.PriceGifts != null) {
                u.copyjson(that.getdetail().filter(c => c.GiftProduct === row.pk_OrderDetail)).forEach(
                  function (r) {
                    if (r.dr === 2) {
                      u.listremove(that.mm.Detail, r.pk_OrderDetail, 'pk_OrderDetail')
                    } else {
                      u.listvalue(that.mm.Detail, r.pk_OrderDetail, 'pk_OrderDetail').dr = 1
                    }
                  }
                )
                that.deleteblankrow()
                let isback = row.Num === 0 ? 0 : row.Num / Math.abs(row.Num)
                let beishu = 1
                let gifts = modelProduct.PriceGifts.filter(c => c.Num <= row.Num).sort(function (x, y) {
                  y.Num - x.Num
                })
                if (gifts.length > 0) {
                  if (gifts[0].Condition === '1') {
                    beishu = Math.floor(Math.abs(row.Num) / gifts[0].Num)
                  }
                  gifts[0].GiftProducts.forEach(function (g) {
                    let giftrow = that.btnaddline()
                    that.builddetail(giftrow, g, u.todecimal(beishu * isback), '', true, row.pk_OrderDetail)
                  })
                }
                that.btnaddline()
              }
            }
          }
          row.Money = u.todecimal(row.Num * row.Price)
          row.MoneyPV = u.todecimal(row.PV * row.Money)
          row.MoneyScore = u.todecimal(row.Num * row.PriceScore)
          row.Score = u.todecimal(row.Num * row.ProductScore)
          row.Scorefpk = u.todecimal(row.Num * row.ProductScorefpk)
          if (row.dr === 0) {
            row.dr = 3
          }
          this.buildsum()
        }
      },
      deleteblankrow () {
        let that = this
        u.copyjson(that.mm.Detail.filter(c => u.isnullorwhitespace(c.pk_Product))).forEach(
          function (r) {
            if (r.dr === 2) {
              u.listremove(that.mm.Detail, r.pk_OrderDetail, 'pk_OrderDetail')
            } else {
              u.listvalue(that.mm.Detail, r.pk_OrderDetail, 'pk_OrderDetail').dr = 1
            }
          }
        )
      },
      detailpricechange (val) {
        let row = this.getdetailrow(val)
        if (row !== null) {
          row.Money = u.todecimal(row.Num * row.Price)
          row.MoneyPV = u.todecimal(row.PV * row.Money)
//          row.TaxPrice = u.todecimal(row.Price / (1 + TaxRate))
//          row.TaxMoney = u.todecimal(row.TaxPrice * row.Num)
          if (row.dr === 0) {
            row.dr = 3
          }
          this.buildsum()
        }
      },
      detailmoneychange (val) {
        let row = this.getdetailrow(val)
        if (row !== null) {
          if (row.Num === 0) {
            row.Num = 1
            row.Price = row.Money
          } else {
            row.Price = u.todecimal(row.Money / row.Num)
          }
          row.MoneyPV = u.todecimal(row.PV * row.Money)
//          row.TaxPrice = u.todecimal(row.Price / (1 + TaxRate))
//          row.TaxMoney = u.todecimal(row.TaxPrice * row.Num)
          if (row.dr === 0) {
            row.dr = 3
          }
          this.buildsum()
        }
      },
      discountchange (type) {
        if (type === 'discount') {
          this.mm.Discount = u.todecimal(this.mm.Discount)
          this.mm.DiscountMoney = u.todecimal(u.arraysum(this.getdetail(), 'Money') * (100 - this.mm.Discount) / 100)
          this.mm.TotalMoney = u.todecimal(this.mm.TotalMoneyDetail - this.mm.DiscountMoney)
        } else if (type === 'discountmoney') {
          this.mm.DiscountMoney = u.todecimal(this.mm.DiscountMoney)
          this.mm.TotalMoney = u.todecimal(this.mm.TotalMoneyDetail - this.mm.DiscountMoney)
          this.mm.Discount = u.todecimal(this.mm.TotalMoney / this.mm.TotalMoneyDetail * 100)
        } else {
          this.mm.TotalMoney = u.todecimal(this.mm.TotalMoney)
          this.mm.DiscountMoney = u.todecimal(this.mm.TotalMoneyDetail - this.mm.TotalMoney)
          this.mm.Discount = u.todecimal(this.mm.TotalMoney / this.mm.TotalMoneyDetail * 100)
        }
        this.buildtotal()
      },
      buildtotal () {
        // console.log(u.arraysum(this.getdetail(), 'Money'))
        let CalSendMoney = this.mm.SendNeed === 'Y' ? (this.mm === null ? 0 : this.mm.IsBack >= 1 ? -this.mm.SendMoney : this.mm.SendMoney) : 0
        this.mm.Total = u.todecimal(this.mm.TotalMoney + CalSendMoney + this.mm.Fee - this.mm.ScoreMoney - this.mm.TicketMoney - this.mm.CouponMoney)
        // 抹零处理
        this.mm.ToZero = 0
        if (u.getuser().Parm.OrderToZero === 1) {
          this.mm.ToZero = u.todecimal(this.mm.Total - Math.floor(this.mm.Total * 10) / 10)
          this.mm.ToZero = u.todecimal(-this.mm.ToZero + (this.mm.Total >= 0 ? 0 : 0.1))
        }
        this.mm.Total = u.todecimal(this.mm.Total + this.mm.ToZero)
        let detail = this.getdetail()
        this.mm.TotalPV = this.mm.TotalMoney === 0 ? 0 : u.todecimal(u.arraysum(detail, 'MoneyPV') * this.mm.Total / this.mm.TotalMoney)
        this.mm.Score = u.arraysum(detail, 'Score') + (u.getuser().Parm.HowMoneyGetOneScore <= 0 ? 0 : u.todecimal(this.mm.TotalPV / u.getuser().Parm.HowMoneyGetOneScore))
        this.mm.Balance = u.isnullorwhitespace(this.mm.ts) ? u.todecimal(this.mm.Total - this.mm.Payment - this.mm.BankMoney)
          : u.todecimal(this.mm.Total - this.mm.PaymentFirst - this.mm.BankMoney)
      },
      buildsum (isback) {
        if (this.onlyread) {
          return
        }
        let that = this
        let detail = this.getdetail()
        // console.log(detail)
        if (detail.filter(c => c.Num >= 0).length === detail.length) {
          this.mm.IsBack = 0
        } else if (detail.filter(c => c.Num < 0).length === detail.length) {
          this.mm.IsBack = 2
        } else {
          this.mm.IsBack = 1
        }
        let money = u.arraysum(detail, 'Money')
        this.mm.TotalScore = u.arraysum(detail, 'MoneyScore')
        this.mm.TotalMoneyDetail = money
        this.mm.TotalBankMoney = u.arraysum(detail.filter(c => c.IsBank === 'Y'), 'Money')
        this.mm.SpecialOfferMoney = u.arraysum(detail.filter(c => c.SpecialOffer === "Y" || c.Gift === "Y"), 'Money')
        this.mm.OriginalPriceMoney = u.todecimal(this.mm.TotalMoneyDetail - this.mm.SpecialOfferMoney)
        if (this.billtype === 'S' && !u.isnullorwhitespace(this.mmc) && (u.isnullorwhitespace(isback) || isback === false)) {
          // 价格策略
          if (!u.isnullorwhitespace(this.mmc.Prices)) {
            let discountmoney = 0
            let discountmax = 0
            this.mmc.Prices.sort(function (a, b) {
              return b.Money - a.Money
            }).forEach(function (v, index) {
              let mymoney = 0
              if (v.IncludeSpecialOffer === 'N') {
                mymoney = u.arraysum(detail.filter(c => c.SpecialOffer === 'N' && c.Gift === 'N'), 'Money')
              } else {
                mymoney = u.arraysum(detail, 'Money')
              }
              if (Math.abs(mymoney) >= v.Money) {
                if (v.Condition === '0') {
                  if (v.Type === '*') {
                    discountmoney = (mymoney * v.Discount / 100)
                  } else {
                    if (mymoney >= 0) {
                      discountmoney = v.Discount
                    } else {
                      discountmoney = -v.Discount
                    }
                  }
                } else {
                  if (v.Type === '-') {
                    discountmoney = Math.floor(mymoney / v.Money) * v.Discount
                  }
                }
              }
              // 比较所有策略选择最大的一个优惠
              if (Math.abs(discountmoney) > Math.abs(discountmax)) {
                discountmax = discountmoney
              }
            })
            this.mm.DiscountMoney = u.todecimal(discountmax)
          }
          // 下面两句老代码没有
          this.mm.TotalMoney = u.todecimal(this.mm.TotalMoneyDetail - this.mm.DiscountMoney)
          this.mm.Discount = u.todecimal(this.mm.TotalMoney / this.mm.TotalMoneyDetail * 100)
          // 绑定时候删除赠品 赠品策略 本来分开的其实也没有金额对上面没有影响
          u.copyjson(that.getdetail().filter(c => c.GiftProduct === that.mm.pk_Order)).forEach(
            function (r) {
              if (r.dr === 2) {
                u.listremove(that.mm.Detail, r.pk_OrderDetail, 'pk_OrderDetail')
              } else {
                u.listvalue(that.mm.Detail, r.pk_OrderDetail, 'pk_OrderDetail').dr = 1
              }
            }
          )
          that.deleteblankrow()
          if (!u.isnullorwhitespace(this.mmc.PriceOrderGifts)) {
            let find = false
            this.mmc.PriceOrderGifts.sort(function (x, y) {
              y.Money - x.Money
            }).forEach(function (v) {
              if (!find) {
                let mymoney = 0
                if (v.IncludeSpecialOffer === 'N') {
                  mymoney = u.arraysum(detail.filter(c => c.SpecialOffer === 'N' && c.Gift === 'N'), 'Money')
                } else {
                  mymoney = u.arraysum(detail, 'Money')
                }
                mymoney = u.todecimal(mymoney * that.mm.Discount / 100)
                if (Math.abs(mymoney) >= v.Money) {
                  if (v.GiftProducts != null) {
                    let beishu = 1
                    if (v.Condition === '1') {
                      beishu = Math.floor(Math.abs(mymoney) / v.Money)
                    }
                    v.GiftProducts.forEach(function (g) {
                      let giftrow = that.btnaddline()
                      that.builddetail(giftrow, g, beishu, '', true, that.mm.pk_Order)
                    })
                    find = true
                  }
                }
              }
            })
            that.btnaddline()
          }
          //  送券策略
          if (!u.isnullorwhitespace(this.mmc.TicketSchemes)) {
            let ticket = 0
            let ticketmax = 0
            this.mm.Ticket = 0
            this.mmc.TicketSchemes.sort(function (a, b) {
              return b.Money - a.Money
            }).forEach(function (v, index) {
              let mymoney = 0
              if (v.IncludeSpecialOffer === 'N') {
                mymoney = u.arraysum(detail.filter(c => c.SpecialOffer === 'N' && c.Gift === 'N'), 'Money')
              } else {
                mymoney = u.arraysum(detail, 'Money')
              }
              if (Math.abs(mymoney) >= v.Money) {
                if (v.Condition === '0') {
                  if (mymoney >= 0) {
                    ticket = v.Ticket
                  } else {
                    ticket = -v.Ticket;
                  }
                } else {
                  ticket = Math.floor(mymoney / v.Money) * v.Ticket
                }
              }
              if (Math.abs(ticket) > Math.abs(ticketmax)) {
                ticketmax = ticket
              }
            })
            this.mm.Ticket = u.todecimal(ticketmax)
          }
        }
        // 特殊情况折扣率归100
        if (money === 0) {
          this.mm.DiscountMoney = 0
          this.mm.Discount = 100
          this.mm.TotalMoney = money
          this.mm.Fee = 0
          this.mm.ScoreMoney = 0
          this.mm.TicketMoney = 0
          this.mm.CouponMoney = 0
          this.mm.BankMoney = 0
          if (u.isnullorwhitespace(this.mm.ts)) {
            this.mm.Payment = 0
          }
        } else {
          if (this.mm.TotalMoney * money < 0) {
            u.messagewarning(this, '优惠或折扣已清除')
            this.mm.DiscountMoney = 0
            this.mm.Discount = 100
            this.mm.TotalMoney = money
          } else {
            // 前面都算过了 这次修改为不用计算
            // 以优惠金额优先
//            this.mm.TotalMoney = (money - this.mm.DiscountMoney)
//            this.mm.Discount = this.mm.TotalMoney / money * 100
//            if (this.mm.TotalMoney / money < 0) {
//              u.messagenotify(this, '优惠或折扣已清除')
//              this.mm.DiscountMoney = 0
//              this.mm.Discount = 100
//              this.mm.TotalMoney = money
//            }
          }
        }
        this.buildtotal()
      },
      builddetail (row, modelProduct, isbacknum, delbomid, isgift, sourepk) {
        isgift = u.isnullorwhitespace(isgift) ? false : isgift
        row.pk_Product = modelProduct === null ? '' : modelProduct.pk_Product
        row.Code = modelProduct === null ? '' : modelProduct.Code
        row.Product = modelProduct === null ? '' : modelProduct.Name
        row.SpecialOffer = modelProduct === null ? '' : modelProduct.SpecialOffer
        row.BatchCode = modelProduct === null ? '' : (modelProduct.IsBatch === 'Y' ? '请输入' : '')
        row.Num = isbacknum
        row.BackNum = 0
        row.Gift = (this.billtype === 'S' && modelProduct !== null) ? modelProduct.Gift : 'N'
        if (this.billtype === 'P') {
          row.Price = modelProduct === null ? 0 : modelProduct.PriceP
        } else if (this.billtype === 'T') {
          row.Price = modelProduct === null ? 0 : modelProduct.PriceT
        } else if (this.billtype === 'S') {
          row.Price = (modelProduct === null || isgift) ? 0 : modelProduct.Price
        } else {
          row.Price = 0
        }
        row.PriceDown = row.Price
        row.OriginalPrice = row.Price
//        row.OriginalPrice = modelProduct === null ? 0 : modelProduct.OriginalPrice
//        row.OriginalPriceScore = modelProduct === null ? 0 : modelProduct.OriginalPriceScore
//        row.OriginalProductScore = modelProduct === null ? 0 : modelProduct.OriginalScore
        row.Money = modelProduct === null ? 0 : u.todecimal(row.Price * row.Num)
        row.MoneyDown = modelProduct === null ? 0 : row.Money
        row.PV = modelProduct === null ? 1 : modelProduct.PV
        row.MoneyPV = modelProduct === null ? 0 : u.todecimal(row.PV * row.Money)
        row.PriceScore = modelProduct === null ? 0 : modelProduct.PriceScore
        row.MoneyScore = modelProduct === null ? 0 : u.todecimal(row.PriceScore * row.Num)
        row.ProductScore = modelProduct === null ? 0 : modelProduct.Score
        row.Score = modelProduct === null ? 0 : u.todecimal(row.ProductScore * row.Num)
        row.ProductScorefpk = modelProduct === null ? 0 : modelProduct.Scorefpk
        row.Scorefpk = modelProduct === null ? 0 : u.todecimal(row.ProductScorefpk * row.Num)
        row.OnlyOrder = modelProduct === null ? 'N' : modelProduct.OnlyOrder
        row.Meas = modelProduct === null ? '' : modelProduct.Meas
        row.Type = modelProduct === null ? '' : modelProduct.Type
        row.Spec = modelProduct === null ? '' : modelProduct.Spec
        row.IsBank = modelProduct === null ? 'N' : modelProduct.IsBank
        row.Memo = ''
        if (row.dr === 0) {
          row.dr = 3
        }
        if (!u.isnullorwhitespace(delbomid)) {
          row.BomNum = 1
          row.Bom = delbomid
          row.pk_Bom = sourepk
        }
        if (isgift) {
          row.Gift = 'Y'
          row.GiftProduct = sourepk
          row.Memo = '买赠'
        }
      }
    }
  }
</script>
