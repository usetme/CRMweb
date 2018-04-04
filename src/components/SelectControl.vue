<template>
  <div class="order_line">
    <span v-if="title" class="controlspan">{{title}}</span>
    <span class="controlspans">
      <el-select v-model="currentvalue" class="mydefinewidth" :size="size" :disabled="disabled" :placeholder="placeholder" @change="valuechange">
        <el-option v-for="item in itemlists.rows" :key="item.Value" :label="item.Text" :value="item.Value"></el-option>
      </el-select>
    </span>
  </div>
</template>

<script>
import u from '../js/utility'
export default {
  props: {
    value: [String],
    title: [String],
    size: {
      type: String,
      default: 'small'
    },
    length: {
      type: Number,
      default: 1
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    userdata: String,
    disabled: Boolean,
    querypk: String,
    deflistpk: String,
    pk: String
  },
  data() {
    return {
      currentvalue: this.value,
      itemlists: []
    }
  },
  watch: {
    value: function(val, oldValue) {
      if (val === this.currentvalue) {
        return
      }
      this.currentvalue = val
    }
  },
  created: function() {
    if (!u.isnullorwhitespace(this.querypk)) {
      u.querydatacache(this, 'QueryQuery', 'Query', { pk: this.querypk }, 'itemlists')
    } else if (!u.isnullorwhitespace(this.deflistpk)) {
      u.querydatacache(this, 'QueryQuery', 'ConsultItem', { pk: this.deflistpk }, 'itemlists')
    } else {
      if (this.pk === 'YN') {
        this.itemlists.rows = [{ Value: 'Y', Text: 'Y' }, { Value: 'N', Text: 'N' }]
      } else if (this.pk === 'Sex') {
        this.itemlists.rows = [{ Value: '男', Text: '男' }, { Value: '女', Text: '女' }]
      } else if (this.pk === 'State') {
        this.itemlists.rows = [{ Value: 0, Text: '制单' }, { Value: 1, Text: '审批' }]
      } else if (this.pk === 'SZDJ') {
        this.itemlists.rows = [{ Value: 0, Text: '自己' }, { Value: 1, Text: '所在公司' }, { Value: 2, Text: '部门及下级' }, { Value: 3, Text: '所在部门' }]
      } else if (this.pk === 'ZXLX') {
        this.itemlists.rows = [{ Value: '0', Text: '普通坐席' }, { Value: '0', Text: '班长坐席' }]
      } else {
        u.querydatacache(this, 'QueryQuery', 'Query', {
          pk: '74651db8-1724-4952-9357-a7ad009db7b9',
          lists: [{ 'Field': 'pk_Def', 'Parm': 'Y', 'Value': this.pk }]
        }, 'itemlists')
      }
    }
  },
  mounted() {
    let that = this
    u.setcontrolwidth(this, 'mydefinewidth')
  },
  methods: {
    valuechange: function(val) {
      this.$emit('input', val)
      this.$emit('change', [val, this.userdata])
    }
  }
}
</script>
