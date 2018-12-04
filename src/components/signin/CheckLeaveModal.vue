<template>
  <q-dialog
    v-model="checkLeaveModal"
    prevent-close
    @ok="onOk"
    @cancel="onCancel"
    @show="onShow"
    @hide="onHide">
    <!-- This or use "title" prop on <q-dialog> -->
    <span slot="title">请假详情</span>

    <!-- This or use "message" prop on <q-dialog> -->
    <span slot="message">
    </span>

    <div slot="body">
      <div>
        申请人：{{record.name}}
        <br>
        <br>
        开始日期：{{fromDate}}
        <br>
        结束日期：{{toDate}}
        <br><br>
        请假原因：<br> {{ leaveReason }}
      </div>
    </div>

    <template slot="buttons" slot-scope="props">
      <q-btn color="primary" label="批准" @click.native="choose(props.ok, 'permit')" />
      <q-btn color="negative" label="否决" @click="choose(props.ok, 'deny')" />
      <q-btn flat label="取消" @click="props.cancel" />
    </template>
  </q-dialog>
</template>

<script>
import { PERMIT_LEAVING } from '../../store/signin/actions'
import { succeed, fail } from '../../util/notification'

export default {
  data () {
    return {
      checkLeaveModal: false,
      name: 'checkLeaveModal',
      record: {},
      fromDate: '',
      toDate: '',
      id: null
    }
  },
  computed: {
    leaveReason () {
      if (this.record && this.record.reason && typeof this.record.reason === 'string') {
        return this.record.reason.replace('\n', '<br>')
      } else return ''
    }
  },
  methods: {
    open (id, record, fromDate, toDate) {
      this.record = record
      this.fromDate = fromDate
      this.toDate = toDate
      this.id = id
      this.checkLeaveModal = true
    },
    // when props.ok() gets called
    onOk (data) { },

    // when props.cancel() gets called
    onCancel () { this.checkLeaveModal = false },

    // when we show it to the user
    onShow () { },

    // when it gets hidden
    onHide () { },

    // custom handler
    async choose (okFn, type) {
      if (type === 'deny') {
        this.$store.dispatch(PERMIT_LEAVING, {id: this.id, value: -1})
          .then(() => succeed({info: '否决成功'}))
          .catch(error => fail({info: error.message}))
          .finally(() => { this.checkLeaveModal = false })
      } else if (type === 'permit') {
        this.$store.dispatch(PERMIT_LEAVING, {id: this.id, value: true})
          .then(() => succeed({info: '批准成功'}))
          .catch(error => fail({info: error.message}))
          .finally(() => { this.checkLeaveModal = false })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
