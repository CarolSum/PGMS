<template>
  <div class="error-page window-height window-width bg-light column items-center no-wrap">
    <div class="error-code bg-primary flex flex-center">
      404
    </div>
    <div>
      <div class="error-card shadow-4 bg-white column flex-center no-wrap">
        <q-icon name="error_outline" color="grey-5"/>
        <p class="caption text-center">噢，我的老伙计，这里什么也没有......</p>
        <p class="text-center group">
          <q-btn
            v-if="canGoBack"
            color="primary"
            @click="goBack"
            icon="keyboard_arrow_left"
          >
            返回上一页
          </q-btn>
          <q-btn
            color="primary"
            @click="$router.replace('/')"
            icon-right="home"
          >
            返回主页
          </q-btn>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { QIcon, QBtn } from 'quasar'

export default {
  components: {
    QIcon,
    QBtn
  },
  data () {
    return {
      canGoBack: window.history.length > 1
    }
  },
  methods: {
    goBack () {
      window.history.go(-1)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .error-page
    .error-code
      height 50vh
      width 100%
      padding-top 15vh
      font-size 30vmax
      color rgba(255, 255, 255, .2)
      overflow hidden
    .error-card
      margin-top -25px
      width 90vw
      max-width 600px
      padding 50px
      i
        font-size 5rem
</style>
