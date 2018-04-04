<template>
  <div>
    <el-tabs class="btntabs">
      <slot></slot>
      <el-tab-pane :label="tab.tabitem" v-for="(tab,index) in tabsdata" :key="index">
        <component v-bind:is="tab.tabname"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

  <script>
  import u from '../js/utility'
  import Vue from 'vue'
  export default {
    props: {
      pk: {
        type: String,
        default: ''
      },
      cdirectory: {
        type: String,
        default: ''
      },
      value: {}
    },
    data () {
      return {
        mm: this.value,
        tabsdata: [],
        querylist: [],
        pagesize: 100,
        pagenum: 1,
        currentvalue: this.value,
        onlyread: false
      }
    },
    mounted: function () {
      let that = this
      u.addwhere(that, 'querylist', '', '', 'pk_DefList', '=', that.pk, '', '', 'Y')
      u.querypage(that, '9f6abfbd-0039-4e09-88ec-a82000c188ad', that.pagesize, that.pagenum, that.querylist).then(function (r) {
        if (r.ok) {
          let tabitem = r.data.rows[0].Value.match(/[\u4e00-\u9fa5]+/g)
          let tabname = r.data.rows[0].Value.match(/[A-Za-z]+/g)
          for (let i in tabitem) {
            that.tabsdata.push({
              tabitem: tabitem[i],
              tabname: tabname[i]
            })
          }
          for (let i in that.tabsdata) {
            Vue.component(that.tabsdata[i].tabname, function (resolve) {
              if (that.cdirectory === 'order') {
                require(['../order/' + that.tabsdata[i].tabname], resolve)
              } else if (that.cdirectory === 'customer') {
                require(['../customer/' + that.tabsdata[i].tabname], resolve)
              }
            })
          }
        } else {
          u.message(that, r.message)
        }
      })
    },
    watch: {
      value: function (val, oldValue) {
        if (val === this.currentvalue) {
          return
        }
        this.currentvalue = val
      }
    }
  }
</script>
<style>
  .btntabs {
    background-color: #fff;
    padding: 10px 0;
    margin-top: 10px
  }

  .btntabs .el-tabs__item {
    color: #108cee;
    background-color: #eaf6fe;
    border-right: 1px solid #fff;
    font-size: 12px;
    min-width: 58px;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
  }

  .btntabs .el-tabs__active-bar {
    display: none;
  }

  .btntabs .el-tabs__item.is-active {
    color: #fff;
    background-color: #108cee;
  }
</style>
