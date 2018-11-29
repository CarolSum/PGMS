<template>
  <div class="layout-padding row justify-center items-center window-height window-width">
    <div id="main-container">
      <div>
        <img src="../../assets/logo.svg">
      </div>
      <q-card square class="white full-width" style="padding: 5px">
        <q-card-main>
          <q-input
            stack-label="用户名"
            type="text"
            v-model="username"
            @blur="$v.username.$touch"
            :error="$v.username.$error"
            @keyup.enter="login" />
          <q-input
            stack-label="密码"
            type="password"
            no-pass-toggle
            v-model="password"
            @blur="$v.password.$touch"
            :error="$v.password.$error"
            @keyup.enter="login" />
        </q-card-main>
        <q-card-actions style="margin-bottom: 5px">
          <q-btn
            loader
            @click="login"
            class="full-width"
            :color="$v.$invalid ? 'warning' : 'primary'"
            :disable="$v.$invalid">
            登录
            <q-spinner-mat slot="loading"/>
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      onLoading: false
    }
  },
  methods: {
    login (event, done) {
      if (this.$v.$invalid) {
        return false
      }
    }
  },
  validations: {
    username: {required},
    password: {required}
  },
  mounted () {
  }
}
</script>

<style lang="stylus" scoped>
  .white
    background-color #fff

  #main-container
    width 500px
    max-width 90vw
    margin-top -50px
</style>
