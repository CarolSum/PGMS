<template>
  <div class="layout-padding">
    <q-card style="width: 500px; max-width: 95%;" class="bg-white">
      <q-card-title>
        您好, {{ name }} {{ userType === 'teacher' ? '老师' : '同学' }}
        <span slot="subtitle">签到数据库更新时间：{{ updateDate }}</span>
      </q-card-title>
      <q-card-separator/>
      <q-card-main>
        <q-list class="no-border">
          <q-item>
            <q-item-side>
              <q-item-tile icon="content paste"/>
            </q-item-side>
            <q-item-main>
              <q-item-tile>{{ feedback }}</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item-separator/>
          <template v-if="(userType === 'student' || userType === 'assistant') && lastRegister">
            <q-item>
              <q-item-side>
                <q-item-tile icon="check"/>
              </q-item-side>
              <q-item-main>
                您的最近一次签到详情：
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-side>
                <q-item-tile icon="access time"/>
              </q-item-side>
              <q-item-main>
                {{ lastRegisterDateString }}
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-side>
                <q-item-tile icon="place"/>
              </q-item-side>
              <q-item-main>
                {{ lastRegister.place }}
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-side>
                <q-item-tile icon="code"/>
              </q-item-side>
              <q-item-main>
                {{ lastRegister.registerName }}
              </q-item-main>
            </q-item>
          </template>
        </q-list>
      </q-card-main>
    </q-card>
    <template v-for="(item, index) in leavingRecords">
      <q-card inline  style="width: 400px; max-width: 95%" class="bg-white" :key="index" >
        <q-card-title>
          当前活跃的请假申请
        </q-card-title>
        <q-card-separator/>
        <q-list class="no-border">
          <q-item v-if="userType === 'teacher'">
            <q-item-side>
              <q-item-tile icon="account circle"/>
            </q-item-side>
            <q-item-main>
              {{ item.name }}
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile icon="first page"/>
            </q-item-side>
            <q-item-main>
              {{ formatDate(item.fromDate) }}
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile icon="last page"/>
            </q-item-side>
            <q-item-main>
              {{ formatDate(item.toDate) }}
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile
                :color="permissionDisplay(item).color"
                :icon="permissionDisplay(item).icon"
              ></q-item-tile>
            </q-item-side>
            <q-item-main>
              {{ permissionDisplay(item).info }}
            </q-item-main>
          </q-item>
        </q-list>
      </q-card>
    </template>
  </div>
</template>

<script>
import { date } from '../../../node_modules/quasar-framework/dist/quasar.mat.esm.js'
import { mapState } from 'vuex'
import { DateFormat } from '../../util/date'
import { GET_FEEDBACK, GET_LEAVING_SUMMARY } from '../../store/signin/actions'
import { fail } from '../../util/notification'
import { permissionDisplay } from './Leave.vue'

export default {
  name: 'Home',
  computed: {
    ...mapState({
      name: 'name',
      updateDate: state => state.signin.recordUpdateDate.toLocaleString('zh-cn', DateFormat.MMDDhhmm),
      userType: 'userType',
      feedback: state => state.signin.feedback,
      lastRegister: state => state.signin.student.lastRegister,
      lastRegisterDateString:
        state => state.signin.student.lastRegister.date &&
          state.signin.student.lastRegister.date.toLocaleString('zh-cn', DateFormat.MMDDhhmm),
      leavingRecords: state => [...state.signin.leavingRecords]
        .filter(value => new Date(value.toDate) >= date.subtractFromDate(Date.now(), {days: 1}) && value.permission !== -1)
    })
  },
  methods: {
    permissionDisplay,
    formatDate (v) {
      return date.formatDate(v, 'YYYY年MM月DD日')
    }
  },
  mounted () {
    let dispatch = this.$store.dispatch
    Promise.all([dispatch(GET_FEEDBACK), dispatch(GET_LEAVING_SUMMARY, false)])
      .catch(error => fail({info: error.message}))
  }
}
</script>

<style scoped>

</style>
