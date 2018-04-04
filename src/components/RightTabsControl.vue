<template>
  <div>
  <div id="righttabs">
    <el-button plain @click="jump (0)">回到顶部</el-button>
    <p v-for="(title,index) in tabtitles">
      <el-button plain @click="jump (index+1)">{{title}}</el-button>
    </p>
  </div>
  <slot></slot>
  </div>
</template>

<script>
  import u from '../js/utility'
  import $ from 'jquery'
  export default {
    props: {
      tabtitles: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        num: 0,
        flag: ''
      }
    },
    mounted: function () {
      let that = this
      $('.el-main').on('scroll', function () {
        that.onScroll()
      })
    },
    methods: {
      toggletabs () {
        $("#righttabs .el-button:focus").addClass("focustabs")
        $("#righttabs .el-button").not(':focus').removeClass("focustabs")
      },
      onScroll () {
        let that = this
        if (that.flag === 'jump') {
          setTimeout(function () {
            that.flag = ''
          }, 80)
          return
        }
        let btns = $('#righttabs .el-button')
        let scrolled = $('.el-main').scrollTop() - 10
        let jump = document.querySelectorAll('.scrollertabs')
        for (let i = 0; i < jump.length; i++) {
          if (scrolled >= jump[i].offsetTop) {
            that.num = i
          }
        }
        btns[that.num].focus()
        that.toggletabs()
      },
      jump (index) {
        let that = this
        that.toggletabs()
        if (index === 0) {
          $('.el-main').animate({scrollTop: 0}, 50)
        } else {
          let jump = document.querySelectorAll('.scrollertabs')
          let total = jump[index].offsetTop - 10
          $('.el-main').animate({scrollTop: total}, 50)
        }
        that.flag = 'jump'
      }
    }
  }
</script>
