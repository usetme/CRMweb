<template>
    <div class="pagecontent">
        <el-button-group>
            <el-button type="primary" @click="btnedit()" v-show="btnshow('btnedit')">编辑</el-button>
        </el-button-group>
      <el-checkbox-group class="checkboxgroup" v-model="s" >
        <el-checkbox v-for="check in checkList.rows" :label="check.Text" :key="check.Value"></el-checkbox>
      </el-checkbox-group>
    </div>
</template>

<script>
  import u from '../js/utility'
  import e from '../js/excel'
  export default {
    data() {
      return {
        s: [],
        checkList: [],
        onlyread: false,
        loading: false,
        querylist: []
      }
    },
    created: function () {
    },
    mounted: function () {
      u.addwhere(this, 'querylist', '', '', 'pk_Def', '=', '5797e5ba-a291-4762-b02e-9a9c00fb7bc7', '', '', 'Y')
      u.querypage(this, '74651db8-1724-4952-9357-a7ad009db7b9', this.pagesize, this.pagenum, this.querylist, 'checkList')
    },
    computed: {},
    methods: {
        btnshow: function(btnid) {
            return u.buttonshow(this, btnid)
        },
        btnedit: function(row) {
            if (!this.btnshow('btnedit')) {
                return
            }
            row = u.dtselectvalue(this, row)
            if (!u.isnullorwhitespace(row)) {
                u.getmodel(this, 'Connect', row.pk, 'mm', '编辑')
            }
        },
        btnsave: function(row) {
            let that = this
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
<style>
  .checkboxgroup {
    padding: 10px
  }

  .checkboxgroup .el-checkbox {
    width: 10%;
  }

  .checkboxgroup .el-checkbox__label {
    font-size: 12px;
  }

  .checkboxgroup .el-checkbox + .el-checkbox {
    margin-left: 0
  }
</style>
