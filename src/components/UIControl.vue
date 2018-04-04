<template>
  <div ref="uicontent">

  </div>
</template>

<script>
import u from '../js/utility'
export default {
  props: {
    value: {},
    pk: [String]
  },
  watch: {
    mm: {
      handler: function(newmm, oldmm) {
        this.$emit('input', newmm)
      },
      deep: true
    },
    value: function(val, oldValue) {
      if (val === this.mm) {
        return
      }
      this.mm = val
    },
    pk: function(val, oldValue) {
      if (val === this.oldValue) {
        return
      }
      u.loadui(this, this.pk, 'uicontent')
    }
  },
  data() {
    return {
      mm: this.value
    }
  },
  created: function() {
  },
  mounted: function() {
    u.loadui(this, this.pk, 'uicontent')
  },
  methods: {
  }
}
</script>
