<template>
  <q-modal v-model="active" minimized>
    <q-card square class="no-margin" style="width: 500px; max-width: 100%;">
      <q-card-title>{{ displayTitle }}</q-card-title>
      <q-card-separator/>
      <q-card-main>
        <div>申请人：{{ username }}</div>
        <div style="margin-bottom: 24px;margin-top: 6px;">
          <q-field icon="date_range">
            <q-datetime
              float-label='开始日期'
              type="date"
              v-model="dateRange.from"
              format="YYYY年MM月DD日"
              class="full-width"
            />
          </q-field>
          <q-field icon="date_range">
            <q-datetime
              float-label='结束日期'
              type="date"
              v-model="dateRange.to"
              format="YYYY年MM月DD日"
              class="full-width"
            />
          </q-field>
        </div>
        <q-radio v-model="leaveoption" val="opt1" color="red" label="事假" />
        <q-radio v-model="leaveoption" val="opt2" color="red" label="病假" style="margin-left: 30px"/>
        <q-radio v-model="leaveoption" val="opt3" color="red" label="出差" style="margin-left: 30px"/>
        <q-input
          type="textarea"
          v-model="reason"
          float-label="请假原因"
          :max-height="100"
          rows="7"
        />
      </q-card-main>
      <q-card-actions align="end">
        <q-btn
          flat
          @click="() => this.active = false"
          color="primary"
          class="btn-padding"
        >
          取消
        </q-btn>
        <q-btn
          loader
          color="green"
          @click="applyAction"
          class="btn-padding"
          :disable="processed"
        >
          {{ displayCheckButton }}
          <q-spinner-mat slot="loading"/>
          <q-tooltip v-if="processed">已处理的请求不能修改</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-modal>
</template>

<script>
import { mapState } from 'vuex'

import { applyForLeaving, modifyLeavingRecord } from '../../api/sign-in'
import { succeed, fail, warn } from '../../util/notification'
import { ADD_LEAVING_RECORD, RENEW_LEAVING_RECORD } from '../../store/signin/mutations'

export default {
  name: 'LeaveModal',
  data () {
    return {
      id: undefined,
      name: '',
      dateRange: {
        from: null,
        to: null
      },
      reason: '',
      permission: undefined,
      active: false,
      leaveoption: 'opt1'
    }
  },
  computed: {
    displayTitle () {
      let userType = this.$store.state.userType
      if (userType === 'student' || userType === 'assistant') {
        return this.id === undefined ? '申请请假' : '修改请假申请'
      } else {
        return '批准请假'
      }
    },
    displayCheckButton () {
      return this.id === undefined ? '申请' : '修改'
    },
    ...mapState({
      username: 'name'
    }),
    processed () {
      return this.permission === 1 || this.permission === -1
    }
  },
  methods: {
    open (record) {
      if (!record) {
        record = {}
      }
      this.id = record.id
      this.name = record.name || this.username
      this.dateRange.from = record.fromDate
      this.dateRange.to = record.toDate
      this.permission = record.permission
      this.reason = record.reason
      this.active = true
    },
    applyAction (event, done) {
      if ([this.dateRange.from, this.dateRange.to, this.reason].some(value => !value)) {
        warn({info: '请输入所有必要信息'})
        done()
        return
      }
      let record = {
        fromDate: this.computeDateString(this.dateRange.from),
        toDate: this.computeDateString(this.dateRange.to),
        reason: this.reason
      }

      if (this.id) {
        record.id = parseInt(this.id)
        modifyLeavingRecord(record)
          .then(() => {
            succeed({info: '修改成功'})
            this.$store.commit(RENEW_LEAVING_RECORD, record)
          })
          .catch(error => fail(error.message))
          .finally(() => {
            done()
            this.active = false
          })
      } else {
        applyForLeaving(record).then(response => {
          record.id = response.id
          record.name = this.username
          record.permission = 0
          succeed({info: '申请成功'})
          this.$store.commit(ADD_LEAVING_RECORD, record)
        })
          .catch(error => fail({info: error.message}))
          .finally(() => {
            done()
            this.active = false
          })
      }
    },
    computeDateString (date) {
      return date instanceof Date ? date.toISOString() : date
    }
  }
}
</script>

<style lang="stylus" scoped>
  .btn-padding
    padding: 0 16px
</style>
