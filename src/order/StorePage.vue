<template>
    <div class="pagecontent">ctable
      <ctable :data="tabledata" :selection="false" @row-dblclick="btnselect" @pagechange="btndataload" :pagenum="pagenum" :pagesize="pagesize" :height="460"></ctable>
    </div>
</template>

<script>
import u from '../js/utility'
export default {
    data() {
      return {
        mm: [],
        CardNo: ''
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
            u.querypage(this, this.params[1], u.querypagesize(), this.pagenum, this.querylist, 'tabledata')
        },
        btnquery: function() {
            this.querylist = []
            u.addwhere(this, 'querylist', '', '', 'Name', 'like', this.queryvalue, '')
            this.btndataload(1)
        },
        btnadd: function() {
            u.getmodel(this, 'Connect', '', 'mm', '新增')
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
            u.getdata(that, 'Connect', u.isnullorwhitespace(that.mm.ts) ? 'Add' : 'Update', that.mm).then(function(r) {
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

