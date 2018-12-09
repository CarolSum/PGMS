<template>
  <div class="layout-padding docs-input row">
    <q-list>
      <q-item>
        <q-field
          icon="public"
          error-label="Wait, wait. Error!">
          <q-input float-label="个人主页" :value="personInfo && personInfo.personal_page" @input="value => changeInfo('personal_page', value)"/>
        </q-field>
      </q-item>
      <q-item>
        <q-card-actions>
          <q-btn
            loader
            color="green"
            class="btn-paddind,float-right"
            @click="updateInfo">
            修改
          </q-btn>
        </q-card-actions>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { GET_PERSON_INFO, UPLOAD_PERSON_INFO } from '../../store/bichoice/actions'
import { UPDATE_PERSON_INFO } from '../../store/bichoice/mutations'
import { required, email } from 'vuelidate/lib/validators'
import { succeed, fail } from '../../util/notification'

export default {
  name: 'StudentSetting',
  methods: {
    changeInfo (name, value) {
      this.$store.commit(UPDATE_PERSON_INFO, [name, value])
    },
    updateInfo (event) {
      this.$store.dispatch(UPLOAD_PERSON_INFO, this.$store.state.bichoice.personinfo.data).then(() => {
        succeed({info: '成功更新'})
      }).catch(error => {
        fail({info: '修改失败' + error.message})
      })
    }
  },
  computed: {
    ...mapState({
      personInfo: state => state.bichoice.personinfo.data
    })
  },
  mounted () {
    this.$store.dispatch(GET_PERSON_INFO)
  },
  validations: {
    email: {required, email}
  }
}
</script>

<style scoped>
</style>
