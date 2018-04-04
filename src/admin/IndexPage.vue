<template>
  <div id="indexpage">
    <!--<crighttabs :tabtitles="tabs"></crighttabs>-->
    <div class="indexpage_left">
        <ul class="indexpage_left_tips">
          <li class="indexpage_left_tips_li">
            <span class="indexpage_title">公告信息</span>
            <el-carousel indicator-position="outside" height="156px">
              <el-carousel-item>
                <p class="banner_title">关于恩施儿女福利通知通知</p>
                <p class="banner_content">
                  算法试图分析数据的内在结图分析数据的内在结构，不过降低维度算法是以非监督图分析数据的内在结构，不过降低维度算法是以非监督图分析数据的内在结构，不过降低维度算法是以非监督图分析数据的内在结构，不过降低维度算法是以非监督图分析数据的内在结构，不过降低维度算法是以非监督图分析数据的内在结构，不过降低维度算法是以非监督图分析数据的内在结构，不过降低维度算法是以非监督图分析数据的内在结构，不过降低维度算法是以非监督图分析数据的内在结构，<不过降低维度算法是以非监督></不过降低维度算法是以非监督>构，不过降低维度算法是以非监督学习的方式试图算法试图分析数据的内在结构，不过降低维度算法是以非监督学习的方式试图算法试图分析数据的内在结构，不过降低维度算法是以非监督学习的方式试图算法试图分析数据的内在结构，不过降低维度算法是以非监督学习的方式试图利用较少的信息来归纳或者解释数据。这类算法可以用于高维数据的可视化或者用来简化数据以便监督式学习使用。常见的算法包括：主成份分析（Principle Component Analysis， PCA）
                </p>
              </el-carousel-item>
              <el-carousel-item>
                <p class="banner_title">测试而已了额福利通知通知</p>
                <p class="banner_content">
                  的方式试图利用较少的信息来归纳或者解释数据。这类算法可以用于高维数据的可视化或者用来简化数据以便监督式学习使用。常见的算法包括：主成份分析（Principle Component Analysis， PCA）
                </p>
              </el-carousel-item>
            </el-carousel>
          </li>
          <li class="indexpage_left_tips_li">
            <span class="indexpage_title">待办事项</span>
          </li>
          <li class="indexpage_left_tips_special">
            <span class="indexpage_title">其它</span>
            <div class="weather" v-for="(weath,index) in weather" v-show="index===0">
              <span>{{weath.days}} {{weath.week}}</span>
              <span>{{weath.citynm}} {{weath.weather}}</span>
              <span>{{weath.temperature}} {{weath.wind}} {{weath.winp}}</span>
            </div>
            <div class="colorpick" @click="btnbgchange(true)">
              <div class="colorpick_title">炫酷皮肤</div>
              <div class="colorpick_icon"><i class="el-icon-document"></i></div>
            </div>
            <div class="colorpick">
              <div class="colorpick_title">
                <a href="http://wpa.qq.com/msgrd?v=3&uin=380336397&site=qq&menu=yes" target="_blank">联系我们</a>
              </div>
              <div class="colorpick_icon"><i class="el-icon-document"></i></div>
            </div>
          </li>
        </ul>
        <ul class="indexpage_left_main">
          <li class="indexpage_left_main_left">
            <span class="indexpage_title">图表测试</span>
          <div id="main" style="width: 100%;height:400px;"></div>
          </li>
          <li class="indexpage_left_main_right">
            <span class="indexpage_title">工作绩效</span>
            <ul class="working_score">
              <li class="working_score_li">
                <div class="bgleft"><i class="el-icon-star-on"></i></div>
                <div class="working_score_content">
                  <span class="working_title">当天工作</span>
                  <ul>
                    <li><span class="working_content">新增客户数:10</span></li>
                    <li><span class="working_content">新增订单数:8</span></li>
                    <li><span class="working_content">新增联系数:4</span></li>
                    <li><span class="working_content">新增联系数:4</span></li>
                    <li><span class="working_content">新增联系数:4</span></li>
                    <li><span class="working_content">新增联系数:4</span></li>
                    <li><span class="working_content">新增联系数:4</span></li>
                  </ul>
                </div>
              </li>
              <li class="working_score_li">
                <div class="bgleft"><i class="el-icon-star-on"></i></div>
                <div class="working_score_content">
                  <span class="working_title">当月工作</span>
                  <ul>
                    <li><span class="working_content">新增客户数:10</span></li>
                    <li><span class="working_content">新增订单数:8</span></li>
                    <li><span class="working_content">新增联系数:4</span></li>
                  </ul>
                </div>
              </li>
              <li class="working_score_li">
                <div class="bgleft"><i class="el-icon-star-on"></i></div>
                <div class="working_score_content">
                  <span class="working_title">当天工作</span>
                  <ul>
                    <li><span class="working_content">新增客户数:10</span></li>
                    <li><span class="working_content">新增联系数:4</span></li>
                  </ul>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div id="bgpitcure">
        <div class="bginpicture">
          <p class="bginpicture_p"><img src="../img/spring.png" alt=""><span class="bginpicture_span">春</span></p>
          <p class="bginpicture_p"><img src="../img/summer.png" alt=""><span class="bginpicture_span">夏</span></p>
          <p class="bginpicture_p"><img src="../img/autumn.png" alt=""><span class="bginpicture_span">秋</span></p>
          <p class="bginpicture_p"><img src="../img/winter.png" alt=""><span class="bginpicture_span">冬</span></p>
          <p class="bginpicture_p"><img src="../img/flower.png" alt=""><span class="bginpicture_span">蒲公英</span></p>
          <p class="bginpicture_p"><img src="../img/duanwu.png" alt=""><span class="bginpicture_span">端午节</span></p>
          <p class="bginpicture_p"><img src="../img/zhongqiu.png" alt=""><span class="bginpicture_span">中秋节</span></p>
          <p class="bginpicture_p"><img src="../img/chunjie.png" alt=""><span class="bginpicture_span">春节</span></p>
        </div>
        <span class="footer">
          <el-button type="primary" @click="btnbgchange(false)">确 定</el-button>
          <el-button @click="btnbgchange(false)">取 消</el-button>
       </span>
      </div>
    </div>
</template>

<script>
  import u from '../js/utility'
  import $ from 'jquery'
  var echarts = require('echarts')
  require('echarts/lib/chart/bar')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  export default {
    data () {
      return {
        tabs: [1, 2, 3, 4, 5],
        weather: [],
        bgcolor: '#E8ECF0'
      }
    },
    mounted: function () {
      let that = this
      u.getweather().then(function (r) {
        for (let i = 0; i < 3; i++) {
          that.weather.push(r[i])
        }
      })
      var myChart = echarts.init(document.getElementById('main'))
      myChart.setOption({
        tooltip: {},
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      });
      $(' .bginpicture .bginpicture_p img').click(function () {
        $(this).addClass('img_click')
        $(' .bginpicture .bginpicture_p img').not(this).removeClass('img_click')
      })
    },
    watch: {
      bgcolor (val) {
        $('#app .tabpanel,.menuright').css('backgroundColor', val)
      }
    },
    computed: {},
    methods: {
      btnbgchange (ifopen) {
        if (ifopen === false) {
          $('#bgpitcure').hide('fast')
          $('.el-container').css('background-image', "url('" + $('.img_click')[0].src + "')")
        } else {
          $('#bgpitcure').show('fast')
        }
      }
    }
  }
</script>
<style>
  #indexpage{
    padding:20px 0px 20px 20px
  }
  #indexpage .indexpage_left_tips,  #indexpage .indexpage_left .indexpage_left_main{
    overflow: hidden;
  }
  #indexpage .indexpage_left .indexpage_left_tips .indexpage_left_tips_li{
    background-color:#fff;
    height:200px;
    margin-right:2%;
    float: left;
    width: 38%;
  }

  #indexpage .indexpage_left .indexpage_left_tips .indexpage_left_tips_special {
    width: 18%;
    height:200px;
    margin-right:2%;
    float: left;
    background-color:#fff;
  }

  #indexpage .indexpage_left .indexpage_left_main {
    margin-top: 20px;
  }

  #indexpage .indexpage_left .indexpage_left_main .indexpage_left_main_left {
    float: left;
    background-color: #fff;
    width:78%;
    height:400px;
    margin-right:2%
  }
  #indexpage .indexpage_left .indexpage_left_main .indexpage_left_main_right{
    float: left;
    height: 400px;
    background-color:#fff;
    width:18%;
  }
  #indexpage .indexpage_title{
    font-size: 14px;
    font-weight: lighter;
    display: inline-block;
    padding-left:10px
  }
  #indexpage .banner_title{
    font-size: 14px;
  font-weight: lighter;
    width:90%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height:10px;
    padding:10px 20px;
    text-align: center;
    color:#555;
  }
  #indexpage .banner_content{
    font-weight: lighter;
    width:90%;
    height: 106px;
    font-size: 13px;
    padding:10px 20px;
    letter-spacing: 1px;
    overflow: auto;
    text-indent:26px;
    color:#000
  }
  #indexpage .demonstration{
    font-size: 12px;
    font-weight: lighter;
  }
  #indexpage .el-color-picker{
    display: inherit;
  }
  #indexpage .colorpick{
    background-color: #f6f7fb;
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    margin: 10px;
  }
  #indexpage .colorpick .colorpick_title{
    font-size: 12px;
    width: 150px;
    font-weight: inherit;
    color:#333;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: left
  }
  #indexpage .colorpick .colorpick_title a{
    text-decoration: none;
    color:#333;
  }
  #indexpage .colorpick .colorpick_icon{
    float: right;
    font-size: 14px;
    color: #999;
    vertical-align: middle;
    margin-left: 3px;
  }
  #indexpage .colorpick:hover>.colorpick_title>a, #indexpage .colorpick:hover>.colorpick_title{
    color:#108cee
  }
  #indexpage .indexpage_left_main_right .working_score_content{
    overflow: auto;
    height: 100%;
  }
  #indexpage .indexpage_left_main_right .working_score{
    margin:10px
  }
  #indexpage .indexpage_left_main_right .working_score{
    overflow: auto;
    height: 370px;
  }
  #indexpage .indexpage_left_main_right .working_score .working_score_li{
    height: 100px;
    margin-bottom:20px;
    padding:0 0px 0 74px;
    border: 1px solid #f2f2f2;
    position: relative;
    border-left:none;
    font-weight:lighter ;
  }
  #indexpage .indexpage_left_main_right .working_score .working_score_li .bgleft{
    background-color: #f5f5f6;
    width: 58px;
    height: 100px;
    position: absolute;
    left: 0;
    top: 0;
    line-height: 100px;
    text-align: center;
    color: #E8ECF0
  }
  #indexpage .indexpage_left_main_right .working_score .working_score_li .working_title{
    font-size: 13px;
    color:#555;
    display: inline-block;
    width: 80%;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #indexpage .indexpage_left_main_right .working_score .working_score_li ul .working_content{
    color:#000;
    font-size: 12px;
  }
  .weather{
    font-weight: lighter;
    padding:10px 10px 0px 10px;
    position: relative;
  }

.weather span{
  display: block;
  background:#f6f7fb;
  color:#333
}
  #bgpitcure{
    display: none;
    position: fixed;
    width: 100%;
    height: 100%;
    background:rgba(47,79,79,0.7);
    top:0;
    left:0;
    z-index: 99999;
  }
  .bginpicture{
    width: 80%;
    height: 80%;
    position: relative;
    left:10%;
    top:10%;
  }
  .bginpicture .bginpicture_p{
    position: relative;
    float: left;
    margin:23px;
  }
  .bginpicture .bginpicture_p img{
    width: 256px;
    height: 176px;
    cursor: pointer;
    border:2px solid transparent;
  }
  .bginpicture .bginpicture_span{
    position: absolute;
    overflow: hidden;
    bottom: 5px;
    left: 1px;
    width: 99%;
    height: 20px;
    line-height: 20px;
    color: #ffffff;
    text-align: center;
    background-color: rgba(85, 85, 85, 0.5);
    display: block;
  }
  #bgpitcure .footer{
    width: 100%;
    display: inline-block;
    position: absolute;
    left: 75%;
  }

  .img_click {
    border: 2px solid #409EFF !important;
  }
</style>
