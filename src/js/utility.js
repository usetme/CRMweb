/**
 * 上半部分是项目特有，下半部分公用
 *  Created by LiveSW on 2016/10/19.
 */
import $ from 'jquery'
import Vue from 'vue'
import 'babel-polyfill'
export default {
  getweather () {
    let url = 'http://chaxun.1616.net/s.php?type=ip&output=json&callback=?&_=' + Math.random();
    var promise = new Promise((resolve, reject) => {
      $.getJSON(url, function (data) {
        $.ajax({
          type: 'get',
          async: false,
          url: 'http://api.k780.com/?app=weather.future&weaid=' + data.Ip + '&appkey=28952&sign=1cdae07d429ae1f79b32d1e2dfe43291&format=json&jsoncallback=data',
          dataType: 'jsonp',
          jsonp: 'callback',
          jsonpCallback: 'data',
          error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('fail')
          },
          success: function (data, textStatus) {
            resolve(data.result)
          }
        })
      })
    })
    return promise
  },
  gettableheight(that, cutheight) {
    if (cutheight === undefined) {
      return document.body.clientHeight - 20
    } else {
      return document.body.clientHeight - cutheight
    }
  },
  setcontrolwidth(that, widthclass) {
    that.$el.getElementsByClassName(widthclass)[0].style.width = (that.length * 250 - 110) + 'px'
  },
  openpageadd(that, pk, ui, pkui, morewindow) {
    if (that.windowarray === undefined) {
      this.message(that, '请检查是否定义了windowarray')
    }
    if (morewindow === undefined || morewindow === false) {
      that.windowarray = [] // 是否多弹出多窗口
    }
    that.windowarray.push({
      pk: pk,
      ui: ui,
      pkui: pkui
    })
  },
  closepageadd(that, pk) {
    that.windowarray = that.windowarray.filter(w => w.pk !== pk)
  },
  loadui(that, uipk, refdiv) {
    that.$nextTick(() => {
      // 从querydatacache复制改造
      // (that, operate, operatetype, userdata, datas)
      // u.querydatacachef(that, 'PageContent', 'GetContent', {pk: '572f2478-b435-4bdd-bc0b-a79600aeb993'}, this.compile(this, ui,refdiv), true)
      let self = this
      let operate = 'PageContent'
      let operatetype = 'GetContent'
      let userdata = { pk: uipk }
      let cachepk = 'querydatacache' + operate + operatetype + JSON.stringify(userdata).replace(/^\s+|\s+$/g, '')
      let data = window.localStorage.getItem(cachepk)
      if (data !== null) {
        // that[datas] = JSON.parse(data)
        self.compile(that, JSON.parse(data), refdiv)
      } else {
        let self = this
        return this.getdata(that, operate, operatetype, userdata, false).then(function (r) {
          if (r.ok) {
            let d = r.data
            if (d.Content !== null) {
              d.Content = d.Content.replace(/{/g, '<')
              d.Content = d.Content.replace(/}/g, '>')
            }
            if (!self.isnullorwhitespace(r.data)) {
              window.localStorage.setItem(cachepk, JSON.stringify(d))
            }
            self.compile(that, d, refdiv)
            // that[datas] = d
          } else {
            self.message(that, r.message)
            console.log(r.message)
          }
        })
      }
    })
  },
  compile(that, ui, refdiv) {
    const $parent = that.$parent
    let template = ''
    if (ui.Content === undefined) {
      template = ui
    } else {
      template = ui.Content
    }
    const newdiv = document.createElement('div')
    newdiv.innerHTML = template
    let methods = {}
    Object.keys($parent).forEach(key => {
      const func = $parent[key]
      if (typeof (func) === 'function' && (func.name === 'boundFn' || func.name === 'n')) {
        methods[key] = func
      }
    })
    const res = Vue.compile(newdiv.outerHTML)
    // 将功能页面的数据、方法重新带入渲染
    const component = new Vue({
      render: res.render,
      staticRenderFns: res.staticRenderFns,
      methods: methods,
      data() {
        return $parent._data
      }
    })
    const divui = component.$mount()
    that.$refs[this.isnullorwhitespace(refdiv) ? 'maindiv' : refdiv].appendChild(divui.$el)
  },
  addtab(that, child) {
    let tabsarray = that.$root.$children[0].$children[0].tabsArray
    let pageinfoarr = child.PageClass.split('/')
    if (pageinfoarr.length !== 2) {
      this.message(that, '请检查权限目录设置')
      return
    }
    let pagepath = pageinfoarr[0]
    let pageclass = pageinfoarr[1]
    let tabcurrent = (child.pk_Power + pageclass + child.Parameter).toString()
    let isexitscomponent = false
    for (let i in tabsarray) {
      if (tabcurrent === tabsarray[i].tabpath) {
        that.$root.$children[0].$children[0].tabCurrent = tabsarray[i].tabpath // 重新激活已存在页签
        that.$root.$children[0].$children[0].tabparams = child.pk_Power + ',' + child.Parameter
        return
      }
      // 判断控件是否已注册
      if (tabsarray[i].content === pageclass) {
        isexitscomponent = true
      }
    }
    // 动态加载页签控件
    if (!isexitscomponent) {
      Vue.component(pageclass, function (resolve) {
        if (pagepath.toLowerCase() === 'admin') {
          require(['../admin/' + pageclass], resolve)
        } else if (pagepath.toLowerCase() === 'customer') {
          require(['../customer/' + pageclass], resolve)
        } else if (pagepath.toLowerCase() === 'order') {
          require(['../order/' + pageclass], resolve)
        } else if (pagepath.toLowerCase() === 'outin') {
          require(['../outin/' + pageclass], resolve)
        } else {
          require(['../ErrPage'], resolve)
        }
      })
    }
    tabsarray.push({
      title: child.Name,
      tabpath: tabcurrent, // 对应tab控件的name，通过组合可以形成唯一值，用于类似于打个多个客户详细信息
      content: pageclass
    })
    that.$root.$children[0].$children[0].tabCurrent = tabcurrent
    that.$root.$children[0].$children[0].tabsArray = tabsarray
    that.$root.$children[0].$children[0].tabparams = child.pk_Power + ',' + child.Parameter // 传递页面参数
  },
  addnewtab: function (that, billtype, pk, type) {
    // New  Query Back Copy
    if (this.isnullorwhitespace(pk)) {
      type = 'New'
      pk = this.newid()
    } else if (this.isnullorwhitespace(type)) {
      type = 'Query'
    }
    if (billtype === 'S') {
      this.addtab(that, {
        Name: type === 'Query' ? '销售单据' : (type === 'Back' ? '订单退货' : ('新增订单')),
        pk_Power: '7188c096-22c4-49e2-83f1-a76e01337377',
        PageClass: 'order/OrderDetailPage',
        Parameter: pk + ',' + type
      })
    } else if (billtype === 'P') {

    } else if (billtype === 'C') {
      this.addtab(that, {
        Name: type === 'Query' ? '客户信息' : '新增客户',
        pk_Power: '6101f45c-3744-49f6-a6bd-a7db00b108e0',
        PageClass: 'customer/CustomerDetailPage',
        Parameter: pk + ',' + type
      })
    }
  },
  removetab(that, targetName) {
    let tabs = that.tabsArray
    let activeName = that.tabCurrent
    let activeParams = that.tabparams
    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.tabpath === targetName) {
          let nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            activeName = nextTab.tabpath
            activeParams = nextTab.tabparams
          }
        }
      })
    }
    that.tabCurrent = activeName
    that.tabparams = activeParams
    that.tabsArray = tabs.filter(tab => tab.tabpath !== targetName)
  },
  closetab(that) {
    // 用于除mainpage页面其他页面调研关闭tab
    this.removetab(that.$root.$children[0].$children[0], that.$root.$children[0].$children[0].tabCurrent)
  },
  message: function (that, message) {
    that.$message(message)
  },
  messagesuccess: function (that) {
    that.$message({
      message: '成功',
      type: 'success',
      duration: 3000
    })
  },
  messagewarning: function (that, message) {
    that.$message({
      message: message,
      type: 'warning',
      duration: 3000
    })
  },
  messagedelete: function (that) {
    return that.$confirm('确认删除数据?', '提示', {
      type: 'warning'
    })
  },
  messageconfirm: function (that, message) {
    return that.$confirm('确认' + message + '?', '提示', {
      type: 'warning'
    })
  },
  messagenotify: function (that, message, duration) {
    if (this.isnullorwhitespace(duration)) {
      duration = 6000
    }
    that.$notify({
      title: '提示',
      message: message,
      duration: duration
    })
  },
  getcolumnstyle(obj) {
    if (obj.style === 'align') {
      if (obj.title === '金额' || obj.title === '收款' || obj.title === '产品奖励' || obj.title === '大单奖励') {
        return 'right'
      }
    } else if (obj.style === 'width') {
      if (obj.title === '地址' || obj.title === '仓库名称') {
        return 200
      } else if (obj.title === '序号') {
        return 70
      } else if (obj.title === '备注') {
        return 360
      } else if (obj.title.indexOf('时间') > 0) {
        return 180
      } else {
        return 140
      }
    }
  },
  getpageparmas(that) {
    let params = that.$root.$children[0].$children[0].tabparams
    that.$root.$children[0].$children[0].tabparams = ''
    // console.log(params)
    return params.split(',')
  },
  buttonshow: function (that, btnid) {
    let buttons = this.getuser().WebButtons
    if (buttons === null) {
      return true
    } else {
      return buttons.filter(btn => btn.btnpower === that.params[0]).filter(btn => btn.btnid === btnid).length !== 1
    }
  },
  querypagesize: function () {
    return 100
  },
  pagebatchoperate(that, operate, operatetype) {
    let i = 0
    let sucrows = []
    let errmessage = ''
    let self = this
    that.loading = true
    that.selectrows.forEach(function (row) {
      self.getdata(that, operate, operatetype, { pk: row.pk }, false).then(function (r) {
        if (r.ok) {
          sucrows.push(row)
        } else {
          errmessage = errmessage + r.message + '<br/>\\n\r\n\r'
        }
        if (i + 1 === that.selectrows.length) {
          that.loading = false
          if (sucrows.length === that.selectrows.length) {
            self.messagesuccess(that)
            that.btndataload()
          } else {
            sucrows.forEach(function (sucrow) {
              self.listremove(that.selectrows, sucrow.pk)
            })
            self.messagenotify(that, errmessage)
          }
        }
        i++
      })
    })
  },
  dtselectvalue(that, row) {
    if (this.isnullorwhitespace(row)) {
      if (that.selectrows.length !== 1) {
        this.messagenotify(that, '请选择单行或者双击行')
        return null
      } else {
        row = that.selectrows[0]
        return that.selectrows[0]
      }
    } else {
      return row
    }
  },
  getdata: function (that, operate, operatetype, userdata, loading) {
    var loadingInstance = null
    if (loading !== false) {
      let divtarget = document.querySelectorAll('.el-tab-pane')
      let currenttarget
      // 找到当前激活tab显示刷新
      if (divtarget.length !== 0) {
        for (let d in divtarget) {
          if (divtarget[d].style === undefined) {
            continue
          }
          if (this.isnullorwhitespace(divtarget[d].style.display)) {
            currenttarget = divtarget[d]
          }
        }
      }
      loadingInstance = (loading === false) ? null : that.$loading({
        fullscreen: true,
        target: divtarget.length === 0 ? '.layout' : currenttarget,
        text: '正在加载...'
      })
    }
    var ticket = ''
    if (this.isnullorwhitespace(userdata)) {
      userdata = { pk: 'nodata' }
    }
    if (operate !== 'User' && operatetype !== 'Login') {
      var user = window.localStorage.getItem('user')
      if (user === null) {
        console.log('未登陆')
        this.message(that, '未登陆')
      } else {
        ticket = JSON.parse(user).Ticket
      }
    }
    let self = this
    let promise = new Promise((resolve, reject) => {
      $.ajax({
        url: '/LiveWebService',
        type: 'post',
        dataType: 'json',
        data: {
          param: JSON.stringify({
            operate: operate,
            operatetype: operatetype,
            userticket: ticket,
            localtime: this.gettime(),
            data: userdata
          })
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          self.message(that, '网络中断或服务不存在')
          console.log('交互operate:' + operate + ',operatetype:' + operatetype + ',userticket:' + ticket + ',data' + JSON.stringify(userdata))
        },
        success: function (data, textStatus) {
          resolve(data)
          if (data.message === '已离线请登录') {
            self.message(that, data.message)
            setTimeout(() => {
              if (that !== undefined) {
                let router = that.$router
                if (router !== undefined) {
                  // router.go({name: 'Login', params: {offline: 'n'}})
                }
              }
            }, 500)
          }
        },
        complete: function (XMLHttpRequest, textStatus) {
          if (loadingInstance !== null) {
            loadingInstance.close()
          }
        }
      })
    })
    return promise
  },
  /**
   * 上半部分是项目特有，下半部分公用
   */
  newid() {
    let date = new Date()
    var guid = date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString()
    let user = this.getuser()
    if (user !== null) {
      guid = guid + user.UserCode
    }
    let lg = guid.length
    if (lg >= 32) {
      guid = guid.substr(0, 32)
    } else {
      for (let i = 1; i <= 32 - lg; i++) {
        guid += Math.floor(Math.random() * 16.0).toString(16)
      }
    }
    return guid.substr(0, 8) + '-' + guid.substr(8, 4) + '-' + guid.substr(12, 4) + '-' + guid.substr(16, 4) + '-' + guid.substr(20)
  },
  getuser: function () {
    let user = window.localStorage.getItem('user')
    if (user != null) {
      return JSON.parse(user)
    } else {
      return null
    }
  },
  getmodel: function (that, operate, pk, mm, wintitle) {
    if (!this.isnullorwhitespace(wintitle)) {
      that['winvisible'] = true
      that['wintitle'] = wintitle
    }
    return this.querydata(that, operate, 'GetModel', { pk: (this.isnullorwhitespace(pk) ? '' : pk) }, mm, true)
  },
  getmodelf: function (that, operate, pk, ufun, loading) {
    return this.querydataf(that, operate, 'GetModel', { pk: (this.isnullorwhitespace(pk) ? '' : pk) }, ufun, loading)
  },
  getmodelcache(that, operate, pk, mm) {
    return this.querydatacache(that, operate, 'GetModel', { pk: (this.isnullorwhitespace(pk) ? '' : pk) }, mm)
  },
  getmodelcachef: function (that, operate, pk, ufun, loading) {
    return this.querydatacachef(that, operate, 'GetModel', { pk: (this.isnullorwhitespace(pk) ? '' : pk) }, ufun, loading)
  },
  querydata: function (that, operate, operatetype, userdata, datas, loading) {
    let retrunvalue = this.getdata(that, operate, operatetype, userdata, loading)
    if (datas === undefined) {
      return retrunvalue
    } else {
      let self = this
      return retrunvalue.then(function (r) {
        if (r.ok) {
          that[datas] = r.data
        } else {
          self.message(that, r.message)
          console.log(r.message)
        }
      })
    }
  },
  querydataf: function (that, operate, operatetype, userdata, ufun, loading) {
    let returnvalue = this.getdata(that, operate, operatetype, userdata, loading)
    if (ufun === undefined) {
      return returnvalue
    } else {
      let self = this
      return returnvalue.then(function (r) {
        if (r.ok) {
          ufun(r.data)
        } else {
          ufun(null)
          self.message(that, r.message)
          console.log(r.message)
        }
      })
    }
  },
  querydatacache: function (that, operate, operatetype, userdata, datas) {
    let cachepk = 'querydatacache' + operate + operatetype + JSON.stringify(userdata).replace(/^\s+|\s+$/g, '')
    let data = window.localStorage.getItem(cachepk)
    if (data != null) {
      that[datas] = JSON.parse(data)
    } else {
      let self = this
      return this.getdata(that, operate, operatetype, userdata, false).then(function (r) {
        if (r.ok) {
          let d = r.data
          if (!self.isnullorwhitespace(r.data)) {
            window.localStorage.setItem(cachepk, JSON.stringify(d))
          }
          that[datas] = d
        } else {
          self.message(that, r.message)
          console.log(r.message)
        }
      })
    }
  },
  querydatacachef: function (that, operate, operatetype, userdata, ufun, loading) {
    let cachepk = 'querydatacachef' + operate + operatetype + JSON.stringify(userdata).replace(/^\s+|\s+$/g, '')
    let data = window.localStorage.getItem(cachepk)
    if (data != null) {
      ufun(JSON.parse(data))
    } else {
      let self = this
      return this.getdata(that, operate, operatetype, userdata, false).then(function (r) {
        if (r.ok) {
          let d = r.data
          if (!self.isnullorwhitespace(r.data)) {
            window.localStorage.setItem(cachepk, JSON.stringify(d))
          }
          ufun(d)
        } else {
          ufun(null)
          self.message(that, r.message)
          console.log(r.message)
        }
      })
    }
  },
  querywhere: function (that, querypk, querylists, datas) {
    return this.querypage(that, querypk, 0, 0, querylists, datas)
  },
  querypage: function (that, querypk, pagesize, pagenum, querylists, datas) {
    let self = this
    let returnvalue = this.getdata(that, 'QueryQuery', 'Query', {
      pk: querypk,
      pagenum: pagenum,
      pagesize: pagesize,
      lists: querylists
    })
    if (datas === undefined) {
      return returnvalue
    } else {
      returnvalue.then(function (r) {
        if (r.ok) {
          that[datas] = r.data
          // if (pagenum === 1 && pagetotal !== undefined) {
          //   that[pagetotal] = r.data.total
          // }
          // if (tableexpand !== undefined) {
          //   that[tableexpand] = r.data.expands.length > 0
          // }
        } else {
          self.message(that, r.message)
        }
      })
      return null
    }
  },
  querychart: function (that, querypk, querylists, charttype, doc, chart, id, stack) {
    stack = (stack === undefined) ? '' : stack
    let param = {
      pk: querypk,
      pagenum: 0,
      lists: querylists,
      type: charttype,
      stack: stack
    }
    let returnvalue = this.getdata(that, 'QueryQuery', 'Chart', param)
    if (id === undefined || doc === undefined || chart === undefined) {
      return returnvalue
    } else {
      let self = this
      returnvalue.then(function (r) {
        if (r.ok) {
          let myChart = chart.init(doc.getElementById(id))
          myChart.setOption(r.data)
        } else {
          that.charcd = 1
          self.message(that, r.message)
        }
      })
      return null
    }
  },
  querymodel: function (that, querypk, pk, mm) {
    let returnvalue = this.getdata(that, 'QueryQuery', 'Model', { pk: querypk, value: pk })
    if (mm === undefined) {
      return returnvalue
    } else {
      let self = this
      return returnvalue.then(function (r) {
        if (r.ok) {
          that[mm] = r.data
        } else {
          self.message(that, r.message)
          console.log(r.message)
        }
      })
    }
  },
  dateadd: function (date, day) {
    date.setDate(date.getDate() + day)
    return this.getdate(date)
  },
  datetimeadd: function (date, hour) {
    date.setHours(date.getHours() + hour)
    return this.gettime(date)
  },
  gettime: function (date) {
    if (date === undefined) {
      date = new Date()
    }
    var year = date.getFullYear()
    var month = date.getMonth()
    var data = date.getDate()
    var hours = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    var time = year + '-' + this.fnW((month + 1)) + '-' + this.fnW(data) + ' ' + this.fnW(hours) + ':' + this.fnW(minute) + ':' + this.fnW(second)
    return time
  },
  getdate: function (date) {
    if (date === undefined) {
      date = new Date()
    }
    var year = date.getFullYear()
    var month = date.getMonth()
    var data = date.getDate()
    var time = year + '-' + this.fnW((month + 1)) + '-' + this.fnW(data)
    return time
  },
  fnW: function (str) {
    return str > 9 ? str : '0' + str
  },
  isnullorwhitespace: function (val) {
    if (val === undefined || val === null || val === '') {
      return true
    } else {
      return false
    }
  },
  addwhere: function (that, querylist, lg, lp, field, condition, value, rp, fix, parm, need) {
    if (value !== '' || condition.indexOf('null') >= 0 || fix === 'Y' || parm === 'Y') {
      that[querylist] = that[querylist].concat([
        {
          'Logic': lg,
          'LeftParenthesis': lp,
          'Field': field,
          'Condition': condition,
          'Value': value,
          'RightParenthesis': rp,
          'Fix': fix,
          'Parm': parm
        }])
    } else if (need === 'Y') {
      this.message(that, '条件中有必输字段')
    }
  },
  ischs: function (val) {
    var reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
    // ：^[\u4e00-\u9fa5],{0,}$
    if (reg.test(val)) {
      return true
    } else {
      return false
    }
  },
  isnumorchar: function (val) {
    var reg = new RegExp('^\\w+$')
    if (reg.test(val)) {
      return true
    } else {
      return false
    }
  },
  isnum: function (val) {
    var reg = new RegExp('^[0-9]*$')
    if (reg.test(val)) {
      return true
    } else {
      return false
    }
  },
  ischar: function (val) {
    var reg = new RegExp('^[A-Za-z]+$')
    if (reg.test(val)) {
      return true
    } else {
      return false
    }
  },
  todecimal(val, ws) {
    if (this.isnullorwhitespace(ws)) {
      ws = 2
    } else if (this.isnum(ws)) {
      if (ws < 1) {
        ws = 1
      }
    } else {
      ws = 2
    }
    if (isNaN(val)) {
      return 0
    } else {
      return Math.round(val * Math.pow(10, ws)) / Math.pow(10, ws)
    }
  },
  toyn(val) {
    if (val === true) {
      return 'Y'
    } else if (val === false) {
      return 'N'
    } else {
      return 'N'
    }
  },
  copyjson: function (val) {
    return JSON.parse(JSON.stringify(val))
  },
  arraysum(arr, field) {
    let s = 0
    arr.forEach(function (row, index) {
      s = s + row[field]
    })
    return s
  },
  listadd(lists, list, pkname) {
    this.listremove(lists, list[this.isnullorwhitespace(pkname) ? 'pk' : pkname], pkname)
    lists.push(list)
    return lists
  },
  listvalue(lists, pk, pkname) {
    let ls = []
    if (this.isnullorwhitespace(pkname)) {
      ls = lists.filter(c => c.pk === pk)
    } else {
      ls = lists.filter(c => c[pkname] === pk)
    }
    if (ls.length === 1) {
      return ls[0]
    } else {
      return null
    }
  },
  listremove(lists, pk, pkname) {
    let self = this
    let index = lists.findIndex(function (value, index, arr) {
      if (self.isnullorwhitespace(pkname)) {
        return value.pk === pk
      } else {
        return value[pkname] === pk
      }
    })
    if (index !== -1) {
      return lists.splice(index, 1)
    }
  }
}
