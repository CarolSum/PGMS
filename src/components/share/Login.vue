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
import { LOGIN } from '../../store/actions'
import { succeed, fail } from '../../util/notification'

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
      let data = {
        username: this.username,
        password: this.password
      }
      this.$store.dispatch(LOGIN, data)
        .then(() => {
          succeed({info: '登录成功'})
          this.$router.push(this.$store.getters.navigationItems[0].to)
        })
        .catch(error => fail({info: error.message}))
      // .finally(() => done())
    }
  },
  validations: {
    username: {required},
    password: {required}
  },
  mounted () {
    if (this.$store.state.isAuthenticated) {
      this.$router.push('/signin')
    }
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
