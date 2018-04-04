<template v-if="showtable">
  <div>
    <el-table v-loading.body="loading"  :data="data.rows" highlight-current-row :height="currentheight" @selection-change="btnselect" @row-dblclick="btndblclick" >
      <el-table-column v-if="selection" type="selection">
      </el-table-column>
      <el-table-column v-for="c in data.columns" :sortable="c.title!=='序号'"
      :align="c.title!==undefined?getcolumnstyle({title:c.title,style:'align'}):getcolumnstyle({title:c,style:'align'})"
      :width="c.title!==undefined?getcolumnstyle({title:c.title,style:'width'}):getcolumnstyle({title:c,style:'width'})"
      :prop="c.key||c"
      :label="c.title||c"
      :key="c.key||c">
      </el-table-column>
      <el-table-column type="expand" v-if="tableexpand">
        <template scope="props">
          <el-form label-position="left" inline>
            <el-form-item v-for="c in data.expands" :label="c.title" :key="c.key">
              <span>{{ props.row['expand'+c.key] }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column min-width="1">
      </el-table-column>
    </el-table>
    <el-pagination @current-change="btnpagechange" :page-size="pagesize" :current-page="pagenum" :total="pagetotal">
    </el-pagination>
  </div>
</template>

<script>
import u from '../js/utility'
export default {
  props: {
    data: {},
    selection: {
      type: Boolean,
      default: true
    },
    norowhide: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    pagenum: {
      type: Number,
      default: 1
    },
    pagesize: {
      type: Number,
      default: u.querypagesize()
    },
    height: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      currentheight: 500,
      pagetotal: 0,
      showtable: true,
      tableexpand: false
    }
  },
  watch: {
    data: function(val, oldValue) {
      if (val === oldValue || u.isnullorwhitespace(val)) {
        return
      }
      if (val.expands === undefined) {
        this.pagetotal = 1
        return
      }
      this.tableexpand = val.expands.length > 0
      if (!this.norowhide) {
        this.showtable = true
      } else {
        this.showtable = val.total > 0
      }
      if (this.pagenum === 1) {
        this.pagetotal = val.total
      }
    }
  },
  created: function() {
    if (this.height === 500) {
      this.currentheight = u.gettableheight(this)
    } else {
      this.currentheight = this.height
    }
  },
  mounted() {
  },
  methods: {
    getcolumnstyle(obj) {
      return u.getcolumnstyle(obj)
    },
    btnselect(rows) {
      this.$emit('selection-change', rows)
    },
    btndblclick(row) {
      this.$emit('row-dblclick', row)
    },
    btnpagechange(num) {
      this.$emit('pagechange', num)
    }
  }
}
</script>
<style>
.el-table th{
  background: #F6F7FB;
  height: 40px;
  line-height: 40px;
  padding-top: 0px;
  padding-bottom: 0px;
  border-right: 1px solid #fff;
}
#app .el-table__header-wrapper thead div{
  overflow: hidden;
  text-align: left;
  font-size: 12px;
}
#app  td{
  line-height: 25px;
  height: auto;
  overflow-y: visible;
  padding: 10px 16px;
  text-align: left;
  color: #333;
  font-size: 12px
}

#app .el-table {
  border-bottom: none
}

#app .el-pagination {
  padding:10px;
  font-weight: lighter;
  /*padding:*/
  background-color: #fff
}
.el-pagination button{
  color: #999999;
  cursor: not-allowed;
  background-color: #ffffff;
  border:1px solid #dddddd;
}
.el-pagination button.disabled i {
  font-weight: lighter;
  font-size:8px;
}

.el-pager li {
  border: 1px solid #dddddd;
  border-left:none
}
.el-pager li:last-child{
  border-right: none;
}
.el-pagination button{padding:0 12px}
.el-pagination__editor .el-input__inner{border-radius: 0}
</style>
