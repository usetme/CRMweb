<template>
  <div class="querycontrol">
    <cwindow title="查询" style="width: 498px" v-model="winvisible">
      <el-table :data="tabledata" min-height="520">
        <el-table-column label="逻辑" width="70">
          <template scope="scope">
            <el-select v-model="scope.row.Logic" size="small">
              <el-option label="并且" value="and"></el-option>
              <el-option label="或者" value="or"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="(" width="70">
          <template scope="scope">
            <el-select v-model="scope.row.LeftParenthesis" size="small">
              <el-option label="空白" value=" "></el-option>
              <el-option label="(" value="("></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="字段" width="88">
          <template scope="scope1">
            <el-select v-model="scope1.row.Field" @change="fieldselect(scope1.row)" size="small">
              <el-option v-for="item in fieldlists" :key="item.Field" :label="item.Name" :value="item.Field"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="条件" width="88">
          <template scope="scope">
            <el-select v-model="scope.row.Condition" size="small">
              <el-option label="等于" value="="></el-option>
              <el-option label="大于等于" value=">="></el-option>
              <el-option label="小于等于" value="<="></el-option>
              <el-option label="不等于" value="<>"></el-option>
              <el-option label="包含" value="like"></el-option>
              <el-option label="不包含" value="not like"></el-option>
              <el-option label="以开始" value="begin"></el-option>
              <el-option label="以结束" value="end"></el-option>
              <el-option label="为空" value="is null"></el-option>
              <el-option label="非空" value="is not null"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="值" width="112">
          <template scope="scope">
            <el-input v-if="scope.row.Consult==='39dbb9ae-4341-4287-a370-99b100afc1a1'" v-model="scope.row.Value"
                      width="160" size="small"></el-input>
            <el-date-picker v-if="scope.row.Consult==='2f9b0b51-d7fb-4174-970c-a2bf00c05c61'"
                            v-model="scope.row.Value"
                            type="month"
                            size="small">
            </el-date-picker>
            <el-date-picker v-if="scope.row.Consult==='3a2863ca-0439-4c2c-9f88-99b100afcd96'"
                            v-model="scope.row.Value"
                            type="date"
                            size="small">
            </el-date-picker>
            <el-select
              v-if="scope.row.Consult!=='39dbb9ae-4341-4287-a370-99b100afc1a1'&&scope.row.Consult!=='2f9b0b51-d7fb-4174-970c-a2bf00c05c61'&&scope.row.Consult!=='3a2863ca-0439-4c2c-9f88-99b100afcd96'"
              v-model="scope.row.Value"
              size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="item in scope.row.ConsultList"
                         :key="item.Value"
                         :label="item.Text"
                         :value="item.Value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label=")" width="68">
          <template scope="scope">
            <el-select v-model="scope.row.RightParenthesis" size="small">
              <el-option label="空白" value=" "></el-option>
              <el-option label=")" value=")"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <div class="btnright mt10">
          <el-button @click="btnaddline()" v-show="showadd">增行</el-button>
          <el-button @click="loadtabledata()">清除</el-button>
          <el-button @click="btnquerylist()">查询</el-button>
      </div>
      <div>
        <el-checkbox v-model="fstj">附上条件</el-checkbox>
        <el-button type="text" v-for="item in fixlists" :key="item.pk_QueryList" @click="btnqueryfix(item)">
{{item.Name}}
        </el-button>
      </div>
    </cwindow>
  </div>
</template>

<script>
  import u from '../js/utility'
  export default {
    props: {
      pk: {
        type: String,
        default: ''
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        currentPk: this.pk,
        winvisible: this.value,
        results: [],
        datalists: [],
        querylist: [],
        consultlists: [],
        fixlists: [],
        tabledata: [],
        fieldlists: [],
        showadd: true,
        fstj: false
      }
    },
    created: function () {
      this.loaddata()
    },
    mounted () {
    },
    watch: {
      pk (val, oldValue) {
        if (val === this.currentPk) return
        this.currentPk = val
        this.loaddata()
      },
      value (val, oldValue) {
        if (val === this.winvisible) {
          return
        }
        this.winvisible = val
      },
      winvisible (val, oldValue) {
        this.$emit('input', val)
      }
    },
    methods: {
      btnaddline: function () {
        let that = this
        if (this.tabledata.length >= 6) {
          u.messagenotify(that, '查询条件最多允许6行')
          return
        } else {
          let rows = that.datalists.filter(c => c.Parm === 'N' && c.Fix === 'N')
          if (rows.length === 0) {
            u.messagenotify(that, '没有适合增加的条件行')
            return
          } else {
            let row = rows[0]
            let list = that.consultlists.filter(c => c.Consult === row.Consult)
            if (list.length > 0) {
              row.ConsultList = list[0].ConsultList
              // console.log(row.Consult)
            } else {
              row.ConsultList = []
            }
            that.tabledata.push(JSON.parse(JSON.stringify(row)))
          }
        }
      },
      btnquerylist () {
        let that = this
        that.querylist = []
        that.tabledata.forEach(function (v) {
          u.addwhere(that, 'querylist', v.Logic, v.LeftParenthesis, v.Field, v.Condition, v.Value, v.RightParenthesis, v.Fix, v.Parm, v.Need)
        })
        // console.log(that.querylist)
        that.$emit('queryclick', that.querylist)
        that.winvisible = false
      },
      btnqueryfix (row) {
        let that = this
        that.querylist = []
        if (this.fstj) {
          that.tabledata.forEach(function (v) {
            u.addwhere(that, 'querylist', v.Logic, v.LeftParenthesis, v.Field, v.Condition, v.Value, v.RightParenthesis, v.Fix, v.Parm, v.Need)
          })
        }
        u.addwhere(this, 'querylist', row.Logic, row.LeftParenthesis, row.Field, row.Condition, row.Value, row.RightParenthesis, row.Fix, row.Parm, row.Need)
        that.$emit('queryclick', that.querylist)
        that.winvisible = false
      },
      loaddata: function () {
        let that = this
        if (u.isnullorwhitespace(that.currentPk)) {
          that.results = []
        } else {
          u.getdata(that, 'QueryQuery', 'ConsultLists', {pk: that.currentPk}).then(function (rc) {
            if (rc.ok) {
              that.consultlists = rc.data
              // console.log(rc.data)
              u.getdata(that, 'QueryQuery', 'QueryLists', {pk: that.currentPk}).then(function (r) {
                if (r.ok) {
                  that.datalists = r.data
                  if (that.datalists.length === 0) {
                    that.btnquerylist()
                    return
                  } else if (that.datalists.length >= 6) {
                    that.showadd = false
                  }
                  that.fixlists = that.datalists.filter(f => f.Fix === 'Y')
                  // console.log(that.fixlists)
                  that.fieldlists = []
                  that.datalists.forEach(function (val) {
                    that.fieldlists.push({Field: val.Field, Name: val.Name})
                  })
                  that.loadtabledata()
                  // console.log(that.tabledata)
                } else {
                  that.$message(r.message)
                }
              })
            } else {
              that.$message(rc.message)
            }
          })
        }
      },
      loadtabledata: function () {
        let that = this
        that.tabledata = []
        for (let i = 0; i < (that.datalists.length > 6 ? 6 : that.datalists.length); i++) {
          let row = that.datalists[i]
          let list = that.consultlists.filter(c => c.Consult === row.Consult)
          if (list.length > 0) {
            row.ConsultList = list[0].ConsultList
            // console.log(row.Consult)
          } else {
            row.ConsultList = []
          }
          that.tabledata.push(JSON.parse(JSON.stringify(row)))
        }
      },
      fieldselect: function (row) {
        row.Value = ''
        let ql = this.datalists.filter(c => c.Field === row.Field)[0]
        row.Consult = ql.Consult
        row.Need = ql.Need
        row.Parm = ql.Parm
        row.Fix = ql.Fix
        let list = this.consultlists.filter(c => c.Consult === row.Consult)
        if (list.length > 0) {
          row.ConsultList = list[0].ConsultList
        } else {
          row.ConsultList = []
        }
      }
    }
  }
</script>
