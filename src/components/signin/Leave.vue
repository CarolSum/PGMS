<template>
  <div class="layout-padding">
    <div v-if="userType === 'student' || userType === 'assistant'" style="padding-bottom: 20px">
      <q-btn color="green" icon="add" @click="callModalLeavingApply">申请请假</q-btn>
    </div>
    <div class="bg-white">
      <q-table
        :title="title"
        dense
        :data="leavingRecords"
        :filter="filter"
        :columns="userType === 'student' || userType === 'assistant' ? studentColumns : manageColumns"
        :visible-columns="visibleColumns"
        row-key='id'
        class="table-responsive">

        <template slot="top-left" slot-scope="props">
          <q-search
            hide-underline
            color="secondary"
            v-model="filter"
            class="col-6"
            clearable
          />
        </template>

        <template slot="top-right" slot-scope="props">
          <q-table-columns
            color="secondary"
            class="q-mr-sm"
            v-model="visibleColumns"
            label="显示项目"
            :columns="userType === 'student' || userType === 'assistant' ? studentColumns : manageColumns"
          />
          <q-btn
            flat round dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
          />
        </template>

        <q-td slot="body-cell-permission" slot-scope="props" :props="props">
          <div>
            <q-icon
              :color="permissionDisplay(props.row).color"
              :name="permissionDisplay(props.row).icon"
              style="font-size: 22px"/>
            <q-tooltip>{{ permissionDisplay(props.row).info }}</q-tooltip>
          </div>
        </q-td>

        <q-td slot="body-cell-lookup" slot-scope="props" :props="props">
          <q-btn
            :disable="busy"
            color="secondary"
            @click="(event, done) => callModalLeavingModify(event, done, props.row.id)"
          >
            <q-icon name="search"/>
            <q-spinner-mat slot="loading"/>
          </q-btn>
        </q-td>

        <q-td slot="body-cell-deleteBtn" slot-scope="props" :props="props">
          <q-btn
            color="red"
            @click="deleteRecord(props.row.id)"
            :disable="props.row.permission !== 0"
          >
            <q-icon name="delete forever"/>
            <q-tooltip
              v-if="props.row.permission !== 0"
            >已处理的请求不能修改
            </q-tooltip>
          </q-btn>
        </q-td>

        <q-td slot="body-cell-permit" slot-scope="props" :props="props">
          <q-btn
            :disable="busy"
            color="secondary"
            @click="(event, done) => callDialogLeavingPermit(event, done, props.row.id)"
          >
            <q-icon name="search"/>
            <q-spinner-mat slot="loading"/>
          </q-btn>
        </q-td>
      </q-table>
    </div>
    <leave-modal ref="leaveModal"/>
    <check-leave-modal ref="checkLeaveModal" />
  </div>
</template>
<script>
import { date } from '../../../node_modules/quasar-framework/dist/quasar.mat.esm.js'
import { mapState } from 'vuex'

import LeaveModal from './LeaveModal.vue'
import CheckLeaveModal from './CheckLeaveModal.vue'
import { deleteLeavingRecord, getLeavingRecord } from 'src/api/sign-in'
import { succeed, fail } from '../../util/notification'
import { GET_LEAVING_SUMMARY } from '../../store/signin/actions'
import { DELETE_LEAVING_RECORD } from '../../store/signin/mutations'

export function permissionDisplay (record) {
  let permission = record.permission
  let duration = date.getDateDiff(record.toDate, record.fromDate, 'days')

  const LEVEL_TWO_LIMIT = 3
  const TUTOR_PERMISSION = 0b01
  const OFFICE_PERMISSION = 0b10
  const ALL_PERMISSION = 0b11

  const UNHANDLED = {
    icon: 'help',
    color: 'warning',
    info: '未处理'
  }

  const VETOED = {
    icon: 'cancel',
    color: 'negative',
    info: '已否决'
  }
  const HALF_APPROVED = {
    icon: 'settings_ethernet',
    color: 'secondary',
    info: ''
  }
  const ALL_APPROVED = {
    icon: 'check circle',
    color: 'positive',
    info: '已批准'
  }

  if (permission === -1) {
    return VETOED
  } else if (permission === 0) {
    return UNHANDLED
  } else {
    let info = ''
    if (duration >= LEVEL_TWO_LIMIT) {
      if (permission === ALL_PERMISSION) {
        return ALL_APPROVED
      }

      if (permission & TUTOR_PERMISSION) {
        info += '已获导师批准'
      } else {
        info += '暂未获导师批准'
      }

      info += ' '

      if (permission & OFFICE_PERMISSION) {
        info += '已获办公室批准'
      } else {
        info += '暂未获办公室批准'
      }

      return Object.assign({}, {...HALF_APPROVED, info})
    } else {
      return ALL_APPROVED
    }
  }
}

export default {
  name: 'Leave',
  components: {
    LeaveModal,
    CheckLeaveModal
  },
  data () {
    return {
      busy: false,
      title: '请假记录',
      checkLeaveModel: false,
      filter: '',
      visibleStudentColumns: ['id', 'fromDate', 'toDate', 'permission', 'lookup', 'deleteBtn'],
      visibleManageColumns: ['id', 'proposer', 'studentId', 'fromDate', 'toDate', 'permission', 'permit'],
      studentColumns: [
        {
          name: 'id',
          label: '记录号',
          field: 'id',
          style: 'width: 100px',
          align: 'center',
          sortable: true,
          type: 'number'
        }, {
          name: 'fromDate',
          label: '开始日期',
          field: 'fromDate',
          // v0.17.9+; if using scoped slots, apply this yourself instead
          style: 'width: 100px',
          align: 'center',
          sortable: true,
          type: 'date',
          format: (value) => this.dateFormatter(value)
        }, {
          name: 'toDate',
          label: '结束日期',
          field: 'toDate',
          style: 'width: 100px',
          sortable: true,
          align: 'center',
          type: 'date',
          format: (value) => this.dateFormatter(value)
        }, {
          name: 'permission',
          align: 'center',
          label: '审批状态',
          field: 'permission',
          style: 'width: 70px'
        }, {
          name: 'lookup',
          label: '查看',
          field: 'lookup',
          align: 'center',
          style: 'width: 80px'
        }, {
          name: 'deleteBtn',
          label: '删除',
          align: 'center',
          field: 'deleteBtn',
          style: 'width: 50px'
        }
      ],
      manageColumns: [
        {
          name: 'id',
          label: '记录号',
          field: 'id',
          width: '100px',
          align: 'center',
          sortable: true,
          type: 'number'
        }, {
          name: 'proposer',
          label: '申请人',
          field: 'name',
          width: '100px',
          sortable: true,
          align: 'center',
          type: 'string'
        }, {
          name: 'studentId',
          label: '学号',
          field: 'id',
          align: 'center',
          width: '50px'
        }, {
          name: 'fromDate',
          label: '开始日期',
          field: 'fromDate',
          width: '150px',
          align: 'center',
          sortable: true,
          type: 'date',
          format: (value) => this.dateFormatter(value)
        }, {
          name: 'toDate',
          label: '结束日期',
          field: 'toDate',
          width: '150px',
          sortable: true,
          align: 'center',
          type: 'date',
          format: (value) => this.dateFormatter(value)
        }, {
          name: 'permission',
          label: '审批状态',
          field: 'permission',
          align: 'center',
          width: '70px'
        }, {
          name: 'permit',
          align: 'center',
          label: '查看',
          field: 'permit',
          width: '80px'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      userType: 'userType',
      leavingRecords: state => state.signin.leavingRecords
    }),
    visibleColumns: {
      get: function () {
        return this.userType === 'student' || this.userType === 'assistant' ? this.visibleStudentColumns : this.visibleManageColumns
      },
      set: function (newValue) {
        if (this.userType === 'student' || this.userType === 'assistant') {
          this.visibleStudentColumns = newValue
        } else {
          this.visibleManageColumns = newValue
        }
      }
    }
  },
  methods: {
    dateFormatter (value) {
      return date.formatDate(new Date(value), 'YYYY年MM月DD日')
    },
    permissionDisplay,
    callModalLeavingModify (event, done, id) {
      this.busy = true
      getLeavingRecord(id)
        .then(record => this.$refs.leaveModal.open(record))
        .catch(error => fail({info: error.message}))
        .finally(() => {
          this.busy = false
        })
    },
    callModalLeavingApply () {
      this.$refs.leaveModal.open()
    },
    deleteRecord (id) {
      deleteLeavingRecord({id})
        .then(() => {
          succeed({info: '删除成功'})
          this.$store.commit(DELETE_LEAVING_RECORD, id)
        })
        .catch(error => fail({info: error.message}))
    },
    callDialogLeavingPermit (event, done, id) {
      this.busy = true
      this.showLeaveDialog(id)
        .catch(error => fail({info: error.message}))
        .finally(() => {
          this.busy = false
        })
    },
    async showLeaveDialog (id) {
      getLeavingRecord(id)
        .then(record => {
          let fromDate = date.formatDate(new Date(record.fromDate), 'YYYY年MM月DD日')
          let toDate = date.formatDate(new Date(record.toDate), 'YYYY年MM月DD日')
          this.$refs.checkLeaveModal.open(id, record, fromDate, toDate)
        })
    }
  },
  mounted () {
    this.$store.dispatch(GET_LEAVING_SUMMARY, true).catch(error => fail({info: error.message}))
  }
}
</script>

<style scoped lang="stylus">

</style>
