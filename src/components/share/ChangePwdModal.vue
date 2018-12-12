<!--
  A modal which is used to change password.
  Usage: <modal-password-change v-model="Visibility"/>
-->
<template>
  <q-modal v-model="active" minimized>
    <q-card square class="no-margin" style="width: 500px; max-width: 100%;">
      <q-card-title>修改密码</q-card-title>
      <q-card-main>
        <q-input
          :stack-label="oldPasswordLabel"
          type="password"
          no-pass-toggle
          v-model.trim="oldPassword"
          @blur="$v.oldPassword.$touch"
          :error="$v.oldPassword.$error"
        />
        <q-input
          :stack-label="passwordLabel"
          type="password"
          no-pass-toggle
          v-model="password"
          @blur="$v.password.$touch"
          :error="$v.password.$error"
        />
        <q-input
          :stack-label="repeatPasswordLabel"
          type="password"
          no-pass-toggle
          v-model="repeatPassword"
          @blur="$v.repeatPassword.$touch"
          :error="$v.repeatPassword.$error"
          @keyup.enter="changePassword"
        />
      </q-card-main>
      <q-card-actions class="row">
        <q-btn
          @click="() => { this.active = false }"
          color="primary"
          class="auto-grow"
        >
          取消
        </q-btn>
        <q-btn
          loader
          @click="changePassword"
          :color="$v.$invalid ? 'warning' : 'positive'"
          :disable="$v.$invalid"
          class="auto-grow"
        >
          确定
          <q-spinner-mat slot="loading"/>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-modal>
</template>

<script>
import { required, minLength, numeric, sameAs } from 'vuelidate/lib/validators'

import { CHANGE_PASSWORD } from '../../store/actions'
import { fail, succeed } from '../../util/notification'

export default {
  name: 'ChangePwdModal',
  props: {
    value: Boolean
  },
  data () {
    return {
      oldPassword: '',
      password: '',
      repeatPassword: '',
      active: this.value
    }
  },
  watch: {
    active (newValue) {
      if (newValue) {
        this.$v.$reset()
        this.oldPassword = ''
        this.password = ''
        this.repeatPassword = ''
      }
      if (this.value !== newValue) {
        this.$emit('input', newValue)
      }
    },
    value (newValue) {
      this.active = newValue
    }
  },
  computed: {
    oldPasswordLabel () {
      return !this.$v.oldPassword.$error ? '原密码' : '请输入原密码'
    },
    passwordLabel () {
      let message = {
        required: '请输入新密码',
        minLength: `新密码至少需要${this.$v.password.$params.minLength.min}位`,
        notNumeric: '新密码不能为纯数字'
      }
      if (!this.$v.password.$error) {
        return '新密码'
      } else {
        for (let item in message) {
          if (!this.$v.password[item]) {
            return message[item]
          }
        }
      }
    },
    repeatPasswordLabel () {
      let message = {
        required: '请重复新密码',
        notNumeric: '新密码不能为纯数字',
        sameAsPassword: '输入的新密码必须一致'
      }
      if (!this.$v.repeatPassword.$error) {
        return '重复新密码'
      } else {
        for (let item in message) {
          if (!this.$v.repeatPassword[item]) {
            return message[item]
          }
        }
      }
    }
  },
  validations: {
    oldPassword: {required},
    password: {
      required,
      minLength: minLength(8),
      notNumeric: value => !numeric(value)
    },
    repeatPassword: {
      required,
      notNumeric: value => !numeric(value),
      sameAsPassword: sameAs('password')
    }
  },
  methods: {
    changePassword (event) {
      if (this.$v.$invalid) {
        return
      }

      let data = {
        oldPassword: this.oldPassword,
        newPassword: this.password
      }

      this.$store.dispatch(CHANGE_PASSWORD, data)
        .then(() => {
          succeed({info: '修改密码成功'})
          this.$router.push('/')
        })
        .catch(error => fail({info: error.message}))
    }
  }
}
</script>

<style lang="stylus" scoped>
  .auto-grow
    flex-grow: 1
</style>
