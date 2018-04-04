<template>
  <div>
    <el-container>
    <el-header id="header">
      <div class="headerimg">
      <img src="./img/logo2.png">
      <img src="./img/logo1.png">
      </div>
      <p class="headerline"><span></span></p>
      <p class="header_title">OIS系统</p>
      <ul>
        <li>{{userdata.UserCode}}{{userdata.UserName}}</li>
        <li><el-tooltip class="item" effect="light" content="清除缓存" placement="bottom-start"><i class="el-icon-delete" @click="btnclear"></i></el-tooltip></li>
        <li><el-tooltip class="item" effect="light" content="修改密码" placement="bottom-start"><i class="el-icon-edit" @click="changepwddialog=true"></i></el-tooltip></li>
        <li><el-tooltip class="item" effect="light" content="退出系统" placement="bottom-start"><i class="el-icon-circle-close" @click="btnexit"></i></el-tooltip></li>
      </ul>
    </el-header>
    <el-container>
      <el-aside>
      <div :style="menuopen===false?containerY:''" class="sidemenu">
        <el-menu class="el-menu-vertical-demo" :collapse="menuopen">
          <p class="toggle_menu" @click="menutoggle"><i class="my-icon-qiehuan"></i></p>
          <el-submenu v-for="submenu in userdata.WebPowers" :key="submenu.code" :index="submenu.code"  class="mymenu">
            <template slot="title">
              <el-tooltip :content="submenu.title"  effect="light" placement="top"><i :class="submenu.nodeicon"></i></el-tooltip>
              <span slot="title">{{submenu.title}}</span>
            </template>
              <el-menu-item v-for="child in submenu.childrens" :key="child.pk_Power" :index="child.pk_Power"  @click="menu_click(child)">{{child.Name}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      </el-aside>
      <el-main :style="menuopen===true?ml240:ml100">
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
    </el-container>
    <el-dialog title="修改密码" :visible="changepwddialog" size="tiny" :show-close="false">
      <div class="order_input">
        <cinput title="原密码" :password="true" :length="0.5"></cinput>
        <cinput title="新密码" :password="true" :length="0.5"></cinput>
        <cinput title="确认密码" :password="true" :length="0.5"></cinput>
      </div>
      <el-button-group class="btnright">
        <el-button class="btnright" type="primary" @click="changepwddialog=false">取消</el-button>
        <el-button class="btnright" type="primary" @click="btnchangepwd">确认</el-button>
      </el-button-group>
    </el-dialog>
    <a id="href"></a>
  </div>
</template>

<script>
  //  import Vue from 'vue'
  import u from './js/utility'
  import $ from 'jquery'

  export default {
    data () {
      return {
        ml240: {marginLeft: '-236px'},
        ml100: {marginLeft: '-100px'},
        containerY: {overflow: 'auto'},
        menuopen: true,
        changepwddialog: false,
        userdata: JSON.parse(window.localStorage.getItem('user')),
        tabCurrent: '',
        tabsArray: [],
        tabparams: '',
        timecalarate: '',
        excelfilename: '',
        winheight: document.body.offsetHeight
      }
    },
    mounted: function () {
      let that = this
      document.body.style.background = 'none'
      $('.sidemenu').css('height', that.winheight - 60)
    },
    watch: {
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
        u.addtab(this, child)
      },
      btnexit () {
        console.log(2)
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
      }
    }
  }
</script>
<style>
  @import './css/icon/iconfont.css';
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    /*min-height: 400px;*/
  }
  .el-menu-vertical-demo p {
    text-align: center;
    margin-bottom: 10px;
  }
  #app .el-main{
    padding:0 ;
    overflow: hidden;
  }
  #app .el-menu{
    border-right:0
  }
  #app .el-aside{
    overflow: scroll;
  }
  #header{
    line-height: 60px;
    background-color: #409EFF;
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
  .toggle_menu{
    cursor:pointer
  }
  .item{
    cursor: pointer;
  }
</style>
