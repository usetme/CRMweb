<template>
    <div class="pagecontent">
      <div>
        <el-button-group>
            <el-button type="primary" @click="btnquery()">查询</el-button>
            <el-button type="primary" @click="btndataload()">刷新</el-button>
        </el-button-group>
      </div>
      <ctable :data="tabledata" @selection-change="btnselect" @row-dblclick="btnedit" @pagechange="btndataload" :pagenum="pagenum"></ctable>
    </div>
</template>

<script>
  import u from '../js/utility'
  import e from '../js/excel'
  export default {
    data() {
      return {
        params: [],
        tabledata: {},
        loading: false,
        selectrows: [],
        pagenum: 1,
        queryvalue: '',
        querylist: [],
        mm: [],
        winvisible: false,
        wintitle: '',
        menudata: []
      }
    },
    created: function() {
    },
    mounted: function() {
      this.params = u.getpageparmas(this)
      this.btnquery()
    },
    computed: {},
    methods: {
      employeechange(data) {
        if (u.isnullorwhitespace(this.mm.pk_Dept)) {
          this.mm.pk_Dept = data[0].pk_Dept
        }
      },
      btnshow: function(btnid) {
        return u.buttonshow(this, btnid)
      },
      btnselect: function(rows) {
        this.selectrows = rows
      },
      btndataload: function(num) {
        if (num !== undefined) {
          this.pagenum = num
        }
        u.querypage(this, '86d20289-d72c-48e1-b7f4-a82400f8499b', u.querypagesize(), this.pagenum, this.querylist, 'tabledata')
      },
      btnquery: function() {
        this.querylist = []
        u.addwhere(this, 'querylist', '', '', 'Name', 'like', this.queryvalue, '')
        this.btndataload(1)
      },
      btnadd: function() {
        u.getmodel(this, 'Order', '', 'mm', '新增')
      },
      btnedit: function(row) {
        if (!this.btnshow('btnedit')) {
          return
        }
        row = u.dtselectvalue(this, row)
        if (!u.isnullorwhitespace(row)) {
          u.getmodel(this, 'Order', row.pk, 'mm', '编辑')
        }
      },
      btnsave: function(row) {
        let that = this
        u.getdata(that, 'Order', u.isnullorwhitespace(that.mm.ts) ? 'Add' : 'Update', that.mm).then(function(r) {
          if (r.ok) {
            u.messagesuccess(that)
            that.winvisible = false
            that.btndataload(1)
          } else {
            u.messagenotify(that, r.message)
          }
        })
      },
      btndelete: function() {
        u.messagedelete(this).then(() => {
          u.pagebatchoperate(this, 'Connect', 'Delete')
      }).catch((e) => {
          console.log(e)
      })
      },
      btntoexcel: function() {
        e.exportxlsx(this.tabledata.rows)
      }
    }
  }
</script>


