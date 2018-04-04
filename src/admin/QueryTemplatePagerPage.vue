<template>
  <div class="pagecontent">
    <el-button-group>
      <el-button type="primary" @click="winvisible=true">查询</el-button>
      <el-button type="primary" @cilck="btntoexcel()" v-show="btnshow('btntoexcel')">导出</el-button>
    </el-button-group>
    <ctable :data="tabledata" :selection=false @row-dblclick="btnedit" @pagechange="btndataload" :pagenum="pagenum" :loading="loading"></ctable>
    <cquery :pk="params[1]" @queryclick="btnquery" v-model="winvisible"></cquery>
  </div>
</template>

<script>
  import u from '../js/utility'
  import e from '../js/excel'
  export default {
    data () {
      return {
        params: [],
        tabledata: {},
        loading: false,
        pagenum: 1,
        querylist: [],
        winvisible: false
      }
    },
    mounted: function () {
      this.params = u.getpageparmas(this)
      // that.btnquery()
    },
    methods: {
      btnshow: function (btnid) {
        return u.buttonshow(this, btnid)
      },
      btndataload: function (num) {
        if (num !== undefined) {
          this.pagenum = num
        }
        u.querypage(this, this.params[1], u.querypagesize(), this.pagenum, this.querylist, 'tabledata')
      },
      btnquery: function (querylist) {
        this.querylist = querylist
        this.btndataload(1)
      },
      btnedit: function (row) {
        if (!this.btnshow('btnedit')) {
          return
        }
        if (this.params.length === 3) {
          row = u.dtselectvalue(this, row)
          if (!u.isnullorwhitespace(row)) {
            u.addnewtab(this, this.params[2], row.pk)
          }
        }
      },
      btntoexcel: function () {
        e.exportxlsx(this.tabledata.rows)
      },
      btnprint: function () {
      }
    }
  }
</script>
