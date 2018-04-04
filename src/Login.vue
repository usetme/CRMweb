<template>
  <div class="logn">
    <div class="opcity"></div>
    <div class="login">
      <span class="log">OIS系统登录</span>
      <el-input placeholder="请输入用户名" v-model="user"  :autofocus="'1'==='1'" @keyup.enter.native="btnenter('user')" class="mt30" size="large" >
        <template slot="prepend">用户</template>
      </el-input>
      <el-input type="password" placeholder="请输入密码" v-model="pwd"  on-focus @keyup.enter.native="btnenter('pwd')" size="large" class="mt30" ref="inputpwd">
        <template slot="prepend">密码</template>
      </el-input>
      <el-button :plain="true" type="info" class="logbtn" @click="submit" >登录</el-button>
    </div>
  </div>
</template>

<script>
  import u from './js/utility'
  export default {
    data () {
      return {
        user: '',
        pwd: ''
      }
    },
    created () {
    },
    activated: function () {
      let that = this
      let l = window.localStorage.getItem('user')
      l = JSON.parse(l)
      if (l.LoginTime <= u.datetimeadd(new Date(), -24)) {
        window.localStorage.removeItem('user')
      } else {
        that.$router.push({name: 'MainPage'})
      }
    },
    computed: {},
    methods: {
      btnenter (input) {
        if (input === 'user') {
          this.$refs.inputpwd.$refs.input.focus() // 只能找到原生input控件foucs  vue的自定义指令也只能针对原生控件
        } else if (input === 'pwd') {
          this.submit()
        }
      },
      submit: function () {
        let that = this
        window.localStorage.clear()
        let userdata = {usercode: that.user, password: that.pwd}
        u.getdata(that, 'User', 'Login', userdata).then(function (r) {
          if (r.ok) {
            window.localStorage.setItem('user', JSON.stringify(r.data))
            that.$router.push({name: 'MainPage'})
          } else {
            that.$message(r.message)
          }
        })
      }
    }
  }
</script>
