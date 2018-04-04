import XLSX from 'xlsx'
export default {
// 以下是导出
  exportxlsx (json, type) {
    var tmpDown
    var tmpdata = json[0]
    json.unshift({})
    var keyMap = []
    for (var k in tmpdata) {
      keyMap.push(k)
      json[0][k] = k
    }
    tmpdata = []
    json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
      v: v[k],
      position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
    }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
      v: v.v
    })
    var outputPos = Object.keys(tmpdata)
    // 文字转码时 null为保留字符 只能用字符串进行替换
    for (let i in tmpdata) {
      if (tmpdata[i].v === null) {
        tmpdata[i].v = 'null'
      }
    }
    var tmpWB = {
      SheetNames: ['mySheet'],
      Sheets: {
        'mySheet': Object.assign({},
          tmpdata,
          {
            '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1]
          })
      }
    }
    tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,
      {bookType: (type === undefined ? 'xlsx' : type), bookSST: false, type: 'binary'}
    ))], {
      type: ''
    })
    var href = URL.createObjectURL(tmpDown)
    document.getElementById('href').href = href
    document.getElementById('href').click()
    json.splice(0, 1)
    setTimeout(function () {
      URL.revokeObjectURL(tmpDown)
    }, 100)
  },

  s2ab (s) {
    var buf = new ArrayBuffer(s.length)
    var view = new Uint8Array(buf)
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
    return buf
  },
  getCharCol (n) {
    let temCol = ''
    let s = ''
    let m = 0
    while (n > 0) {
      m = n % 26 + 1
      s = String.fromCharCode(m + 64) + s
      n = (n - m) / 26
    }
    return s
  },
// 以上是导出

// 以下是导入
  importxlsx (fls, that) {
    var ImportFile = null
    if (fls.target.files && fls.target.files.length > 0) {
      ImportFile = fls.target.files[0]
      var fileX = ImportFile.name.split('.').reverse()[0]
      var fileXyes = false
      var arr = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw', 'csv']
      arr.forEach(function (value, index, array) {
        if (fileX === value) {
          fileXyes = true
        }
      })
      if (fileXyes) {
        var fileInfo = {
            name: '',
            size: 0
          }
        fileInfo.name = ImportFile.name
        fileInfo.size = ImportFile.size
        this.file2Xce(ImportFile, that).then(function (t) {
          console.log('执行完毕')
          if (t && t.length > 0) {
            var tmpHead = []
            var pmodel = {}
            for (var itm in t[0]) {
              tmpHead.push(itm)
              pmodel[itm] = itm
            }
            that.tabledata = {
              columns: [],
              rows: []
            }
            that.tabledata.columns = tmpHead
            that.tabledata.rows = t
          }
        })
      } else {
        alert('格式错误！请重新选择')
      }
    }
  },
  file2Xce (f, that) {
    var wb
    var rABS = false
    return new Promise(function (resolve, reject) {
      var reader = new FileReader()
      reader.onload = function (e) {
        var data = e.target.result
        if (rABS) {
          wb = XLSX.read(btoa(this.fixdata(data)), {
            type: 'base64'
          })
        } else {
          wb = XLSX.read(data, {
            type: 'binary'
          })
        }
        resolve(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]))
      }
      if (rABS) {
        reader.readAsArrayBuffer(f)
      } else {
        reader.readAsBinaryString(f)
      }
    })
  },
  fixdata (data) {
    let o = ''
    let l = 0
    let w = 10240
    for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
    return o
  }
// 以上是导入
}
