<template>
  <div id="home" class="layout-padding">

  </div>
</template>

<script>
import { date } from 'quasar'

export default {
  name: 'Home',
  computed: {

  },
  methods: {
    formatDate (v) {
      return date.formatDate(v, 'YYYY年MM月DD日')
    }
  },
  mounted () {

  }
}
</script>

<style scoped>

</style>
