<template>
    <el-container style="height: 100%">
          <el-menu class="el-menu-vertical-demo" :collapse="menuopen" text-color="#fff">
            <p class="toggle_menu"><img src="./img/logo3.png" width="40px"></p>
            <div id="menugroup" @mouseover="mouseaction" @mouseout="mouseaction">
                <p class="toggle_menuleft" v-if="menuopen===true"><i class="el-icon-arrow-right"></i></p>
                <p class="toggle_menuleft" v-else><span><i class="el-icon-menu"></i>系统导航</span><i class="el-icon-arrow-right toggle_istyle"></i></p>
              <div id="menu">
                  <div v-for="submenu in userdata.WebPowers" class="tds">
                    <h3>{{submenu.title}}</h3>
                    <ul>
                      <li v-for="child in submenu.childrens">
                        <a class="inactive" @click="menu_click(child)">
                          {{child.Name}}
                        </a>
                      </li>
                      </li>
                    </ul>
                  </div>
              </div>
            </div>
            <el-menu-item v-for="submenu in userdata.UserdefLinks" :key="submenu.pk_Power" :index="submenu.pk_Power" class="mymenu" @click="menu_click(submenu)">
              <i class="el-icon-star-on"></i>
              <span slot="title">{{submenu.Name}}</span>
            </el-menu-item>
            <p class="toggle_menu toggle_icon">
              <span v-if="menuopen===false" @click="getmydefinenav('opennav')"><i class="el-icon-setting">自定义导航</i></span>
              <i class="el-icon-d-arrow-right" v-show="menuopen===true"  @click="menutoggle"></i>
              <i class="el-icon-d-arrow-left"v-show="menuopen===false" @click="menutoggle"></i>
            </p>
          </el-menu>
      <el-container class="menuright" :style="containwidth">
        <el-header id="header">
          <p class="header_title">OIS系统</p>
          <ul>
            <li>{{userdata.UserCode}}{{userdata.UserName}}</li>
            <li><el-tooltip class="item" effect="light" content="清除缓存" placement="bottom-start"><i class="el-icon-delete" @click="btnclear"></i></el-tooltip></li>
            <li><el-tooltip class="item" effect="light" content="修改密码" placement="bottom-start"><i class="el-icon-edit" @click="changepwddialog=true"></i></el-tooltip></li>
            <li><el-tooltip class="item" effect="light" content="退出系统" placement="bottom-start"><i class="el-icon-circle-close" @click="btnexit"></i></el-tooltip></li>
          </ul>
        </el-header>
        <el-main>
          <el-tabs v-model="tabCurrent" class="tabpanel" type="border-card" :closable="true" @tab-remove="removeTab">
            <el-tab-pane class="tabpanel"
                         v-for="(item, index) in tabsArray"
                         :label="item.title"
                         :name="item.tabpath"
                         :key="item.tabpath">
              <component v-bind:is="item.content"></component>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
      <a id="href"></a>
      <el-dialog title="自定义导航" :visible.sync="mynavdialog" width="960px" center id="mynavspace" @close="getmydefinenav">
        <div class="dialog_body">
          <div class="dialog_body_leftlist">
            <h3>系统列表</h3>
            <div v-for="item in navitems">
              <div class="lists">
                <div class="list_item">{{item | filtercheck}}<i class="el-icon-circle-close" @click="deletenavitem(item)"></i></div>
              </div>
            </div>
            <span class="list_span">已选{{navitems.length}}/可选10</span>
          </div>
          <div class="dialog_body_rightcontent">
            <div v-for="submenu in userdata.WebPowers" :key="submenu.code">
              <h3>{{submenu.title}}</h3>
              <el-checkbox-group v-model="navitems" @change="addnavitemcheck" :max="10">
                <el-checkbox v-for="child in submenu.childrens" :label="child.pk_Power" :key="child.pk_Power">{{child.Name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <span slot="footer">
          <el-button type="primary" @click="addmydefinenav">确 定</el-button>
          <el-button @click="mynavdialog = false">取 消</el-button>
       </span>
      </el-dialog>
    </el-container>
</template>

<script>
  //  import Vue from 'vue'
  import u from './js/utility'
  import $ from 'jquery'

  export default {
    data () {
      return {
        mm: {},
        menuopen: true,
        changepwddialog: false,
        userdata: JSON.parse(window.localStorage.getItem('user')),
        tabCurrent: 'IndexPage',
        tabsArray: [],
        tabparams: '',
        timecalarate: '',
        excelfilename: '',
        containwidth: {width: document.body.offsetWidth - 64 + 'px'},
        mynavdialog: false,
        navitems: []
      }
    },
    filters: {
      filtercheck (item) {
        let userdata = JSON.parse(window.localStorage.getItem('user'))
        for (let i in userdata.WebPowers) {
          for (let s in userdata.WebPowers[i].childrens) {
            if (item === userdata.WebPowers[i].childrens[s].pk_Power) {
              return userdata.WebPowers[i].childrens[s].Name
            }
          }
        }
      }
    },
    created: function () {
    },
    mounted: function () {
      let that = this
      let indexobj = {Name: '首页', PageClass: 'admin/IndexPage', Parameter: '', pk_Power: 'IndexPage'}
      u.addtab(that, indexobj)
      document.body.style.background = 'none'
      that.getmydefinenav()
    },
    watch: {
      menuopen (val) {
        let wid = document.body.offsetWidth
        if (val === true) {
          this.containwidth = {width: wid - 64 + 'px'}
        } else {
          this.containwidth = {width: wid - 140 + 'px'}
        }
      },
      tabCurrent (val) {
        let that = this
        if (val === 0) {
          return
        }
        for (let i in that.tabsArray) {
          if (that.tabsArray[i].tabpath === val) {
            that.excelfilename = that.tabsArray[i].title
          }
        }
        $('#href').attr('download', that.excelfilename + '.xlsx')
      }
    },
    computed: {},
    methods: {
      menutoggle () {
        if (this.menuopen === true) {
          this.menuopen = false
        } else {
          this.menuopen = true
        }
      },
      menu_click (child) {
        let that = this
        let ishasflag = false
        let pk_Powerarray = []
        for (let m in this.userdata.WebPowers) {
          for (let i in this.userdata.WebPowers[m].childrens) {
            if (child.pk_Power === this.userdata.WebPowers[m].childrens[i].pk_Power) {
              ishasflag = true
              pk_Powerarray.push(this.userdata.WebPowers[m].childrens[i])
              break
            }
          }
        }
        if (ishasflag === true) {
          u.addtab(that, child)
        } else {
          this.$confirm('您的该权限已被系统删除，关闭后被收回的权限将被删除', '提示', {
            showCancelButton: false,
            confirmButtonText: '确定',
            type: 'warning',
            hashchange: 'false',
            callback () {
              that.userdata.UserdefLinks = pk_Powerarray
            }
          })
        }
        $('#menu').stop().hide()
      },
      btnexit () {
        this.$confirm('是否退出系统?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.localStorage.clear()
          this.$router.push({name: 'Login'})
        }).catch(() => {
          // 取消触发事件
        })
      },
      btnclear () {
        this.$confirm('是否清除缓存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
      }).catch(() => {
          // 取消触发事件
        })
      },
      btnchangepwd () {
      },
      removeTab (targetName) {
        u.removetab(this, targetName)
      },
      mouseaction () {
        $('#menugroup').mouseover(function () {
          $('#menu').stop().show('fast')
        })
        $('#menugroup').on('mouseout', function () {
          $('#menu').stop().hide('fast')
        })
      },
      addnavitemcheck (val) {
        let that = this
        if (val.length < 11) {
          that.navitems = val
          if (val.length === 10) {
            u.messagenotify(that, '最多只能添加十个自定义项!')
          }
        }
      },
      addmydefinenav () {
        let that = this
        that.mynavdialog = false
        let pk_powerArray = []
        if (that.navitems.length > 0) {
          for (let i in that.navitems) {
            pk_powerArray.push(that.navitems[i])
          }
          u.getdata(that, 'UserdefLink', 'Add', {'pk_power': pk_powerArray}).then(function (r) {
            if (r.ok) {
              u.messagesuccess(that)
              u.getdata(that, 'UserdefLink', 'GetList', {}).then(function (r) {
                if (r.ok) {
                  that.userdata.UserdefLinks = r.data
                } else {
                  u.messagenotify(that, r.message)
                }
              })
            } else {
              u.messagenotify(that, r.message)
            }
          })
        }
      },
      getmydefinenav (ifopen) {
        let that = this
        if (ifopen === 'opennav') {
          this.mynavdialog = true
        }
        u.getdata(that, 'UserdefLink', 'GetList', {}).then(function (r) {
          if (r.ok) {
            that.navitems = []
            for (let i in r.data) {
              that.navitems.push(r.data[i].pk_Power)
            }
          } else {
            u.messagenotify(that, r.message)
          }
        })
      },
      deletenavitem (item) {
        for (let i in this.navitems) {
          if (this.navitems[i] === item) {
            this.navitems.splice(i, 1)
          }
        }
      }
    }
  }
</script>
<style>
  @import './css/icon/iconfont.css';
  #menu{
    min-height: 300px;
    display: none;
    width: 1100px;
    background: rgba(7, 19, 46, 0.8);
    min-width: 850px;
    position: absolute;
    top: 0;
    left: 100%;
    text-align: inherit;
    z-index: 99999;
    border-collapse: separate;
    border-spacing: 0;
    vertical-align:top;
    font-weight: inherit;
    font-style: inherit;
    font-family: inherit;
    font-size: 12px;
    padding-left:18px
  }
  #menu .tds{
    overflow: hidden;
    float: left;
  }
  #menu .tds{
    height: 220px;
    margin-top: 20px;
    text-align: left;
    font-weight: normal;
  }
  #menu .tds li {
    margin-right: 10px;
    float: left;
    width: 74px;
    margin-top: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
  }

  #menu .tds h3 {
    color: #8D99B0;
    font-weight: inherit;
    font-size: 12px;
    border-bottom: 1px solid #263251;
    padding-bottom: 8px;
  }

  #menu .tds ul {
    width: 170px;
    padding: 0;
    height: 100%;
  }

  .toggle_menuleft .el-icon-menu {
    color: #fff;
    margin-right: 6px
  }

  #menugroup > .toggle_menuleft {
    height: 40px;
    position: relative;
    font-size:13px;
    color: #fff;
    line-height: 40px;
    margin-bottom: 0;
    border-bottom: 1px solid #eee;
  }

  #menugroup > .toggle_menuleft span {
    display: inline-block;
    position: absolute;
    left: 6px
  }
  .toggle_istyle {
    display: inline-block;
    position: absolute;
    right: 6px;
    padding-top: 14px;
    /*line-height: 40px;*/
    height: 40px;
  }
  #menugroup > .toggle_menuleft:hover {
    background: #409EFF;
  }

  #menu .tds a {
    color: #ffffff;
    text-decoration: none;
  }
  #menu .tds a:hover{
    /*text-decoration: none;*/
    color: #108cee;
  }
  .sub-nav-section{
    min-width: 150px;
    max-width: 210px;
    padding:20px 20px 0 0;
    vertical-align: top
  }
  .el-menu-vertical-demo{
    width: 10%;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 140px;
  }
  .el-menu-vertical-demo p {
    text-align: center;
    margin-bottom: 10px;
  }
  #app .el-main{
    padding:0 ;
    /*overflow: hidden;*/
  }
  .menuright,#app .tabpanel{
    background:#E8ECF0;
  }
  /*#app .el-tabs__content{height: 100%}*/
  #app .el-menu{
    background:rgba(229,229,229,0.1);
    border-right:0;
    height: 100%;
  }
  #header{
    font-weight: lighter;
    line-height: 60px;
    background-color:transparent;
    color:#fff
  }
  #header img{
    float: left;
    height:40px;
    margin-left:10px;
  }
  #header .header_title{
    float: left;
    display: inline-block;
    color:#fff;
    font-weight: lighter;
    font-size: 18px;
  }
  .headerline{
    float: left;
    display: inline-block;
    height: 60px;
    padding-top: 10px;
  }
  .headerline span{
    display: inline-block;
    height: 40px;
    border-left: 1px solid #fff;
    margin:0 20px;
  }
  .headerimg{float: left;height: 60px;padding-top:10px;}
  #header ul{
    float: right;
    display: inline-block;
    margin-top: 0;
  }
  #header ul li{
    color:#fff;
    font-size:14px;
    list-style: none;
    float: left;
    margin-right:40px;
  }
 .el-menu .el-icon-d-arrow-right, .el-menu .el-icon-d-arrow-left{
    color:#fff
  }
  .toggle_menu{
    color:#fff;
    cursor:pointer;
  }
  .toggle_menu:first-child{
    padding:10px 0;
    height: 40px;
    background: transparent;
  }
  .el-menu-vertical-demo .toggle_icon{
    text-align: inherit;
    margin-bottom: 0;
    height: 40px;
    line-height: 40px;
    background: transparent;
    letter-spacing: 1px;
    position: absolute;
    width: 100%;
    bottom: 0;
    right: 0;
  }
  .el-menu .toggle_icon i{
    color: #fff;
    font-size: 12px;
  }
  .el-menu .toggle_icon .el-icon-d-arrow-left,.el-menu .toggle_icon .el-icon-d-arrow-right{
    display: inline-block;
    width: 36px;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .el-menu .toggle_icon .el-icon-d-arrow-right{
    width: 62px;
  }
  .el-menu .toggle_icon i:hover,.toggle_icon span:hover{
    color:#108cee
  }
  .toggle_icon span{
    height: 40px;
    font-size:13px;
    text-align: center;
    display: inline-block;
    border-right: 1px solid #303B59;
    width: 90px;
    color: #fff;
  }
  #menugroup{
    cursor: pointer;
    display: block;
    position: relative;
    left:0;
    z-index: inherit;
  }
  .item{
    cursor: pointer;
  }
  .el-menu .el-menu-item{
    height: 40px;
    display: block;
    line-height: 40px;
    padding: 0 10px 0 18px;
    color: #FFF;
    white-space: nowrap;
    overflow: hidden
  }
  .el-menu .el-menu-item span{
    /*margin-left: 4px;*/
    max-width: 120px;
    vertical-align: middle;
    display: inline-block;
    zoom: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size:13px;
  }
  #app .el-menu-item i{
    color:#fff
  }
  #mynavspace .el-dialog{
    padding:0;
    font-weight: inherit;
    font-family: inherit;
  }
  #mynavspace .el-dialog__header{
    text-align: left;
    color: #333333;
    position: relative;
    background-color: #f6f7fb;
    padding:0;
    height: 40px;
  }
  #mynavspace .el-dialog__header .el-dialog__title{
    padding-left: 20px;
    line-height: 40px;
    font-size: 14px;
    padding-right: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #mynavspace .dialog_body_leftlist{
    float: left;
    width: 200px;
    border-right: 1px solid #E5E5E5;
  }
  #mynavspace .dialog_body_leftlist h3{
    margin-bottom: 10px;
    color: #333;
    font-size: 12px;
    font-weight: inherit;
  }
  #mynavspace .dialog_body_leftlist .list_item{
    position: relative;
    padding: 3px 20px 3px 15px;
    margin: 0 20px 10px 0;
    background-color: #EAF6FE;
    border: 2px solid transparent;
    color: #108CEE;
    font-size: 12px;
  }
  #mynavspace .dialog_body_leftlist .list_item i{
    cursor:pointer;
    position: absolute;
    right:4px;
    top:10px
  }
  #mynavspace .dialog_body_leftlist .list_span{
    font-size: 12px;
    font-weight: inherit;
    margin-top: 5px;
    margin-right: 20px;
    float: right;
  }

  #mynavspace .dialog_body_rightcontent{
    padding-left:20px;
    float: left;
    width: 684px;
    height: 500px;
    overflow: auto;
  }
  #mynavspace .dialog_body_rightcontent .el-checkbox__label{
    font-size: 12px;
  }
  #mynavspace .el-checkbox+.el-checkbox{
    margin-left:0
  }
  #mynavspace .dialog_body_rightcontent .el-checkbox{
    width:160px;
    float: left;
    display: inline-block
  }
  #mynavspace .dialog_body_rightcontent h3{
    color: #333;
    font-size: 12px;
    font-weight: inherit;
    margin-bottom: 0;
  }
  #mynavspace .el-dialog--center .el-dialog__footer{
    padding-bottom:10px;
    text-align: right;
  }
  #mynavspace .el-button{
    border-radius: 0;
    padding: 8px 18px;
    font-size: 13px
  }

  .el-tabs--border-card > .el-tabs__header .el-tabs__item:first-child span {
    display: none
  }

  .el-container {
    background-image: url("img/zhongqiu.png");
    background-repeat: no-repeat;
    background-size: cover;
  }
  #app .el-tabs--border-card > .el-tabs__content{
    /*background-color: inherit !important;*/
  }
  #app .el-tabs__content{
    background-color: #E8ECF0;
  }
</style>
