<template>
  <div id="q-app">
    <router-view />
      <q-ajax-bar
        :position="'bottom'"
        :size="'6px'"
        :color="'info'"
      />
  </div>
</template>

<script>
import { QAjaxBar } from 'quasar'
require('quasar-extras/roboto-font')

export default {
  name: 'App',
  components: {
    QAjaxBar
  }
}
</script>

<style lang="stylus">
  body
    background-color #f5f5f5
</style>
