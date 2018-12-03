<template>
  <div class="layout-padding">
    <div v-if="userType === 'student' || userType === 'assistant'" style="padding-bottom: 20px">
      <q-btn color="green" icon="add" @click="callModalLeavingApply">申请请假</q-btn>
    </div>
    <div class="bg-white">
      <q-data-table
        :data="leavingRecords"
        :config="config"
        :columns="userType === 'student' || userType === 'assistant' ? studentColumns : manageColumns"
      >

        <template slot="col-permission" slot-scope="cell">
          <div>
            <q-icon
              :color="permissionDisplay(cell.row).color"
              :name="permissionDisplay(cell.row).icon"
              style="font-size: 22px"/>
            <q-tooltip>{{ permissionDisplay(cell.row).info }}</q-tooltip>
          </div>
        </template>

        <template slot="col-lookup" slot-scope="cell">
          <q-btn
            :disable="busy"
            color="secondary"
            @click="(event, done) => callModalLeavingModify(event, done, cell.row.id)"
          >
            <q-icon name="search"/>
            <q-spinner-mat slot="loading"/>
          </q-btn>
        </template>

        <template slot="col-deleteBtn" slot-scope="cell">
          <q-btn
            color="red"
            @click="deleteRecord(cell.row.id)"
            :disable="cell.row.permission !== 0"
          >
            <q-icon name="delete forever"/>
            <q-tooltip
              v-if="cell.row.permission !== 0"
            >已处理的请求不能修改
            </q-tooltip>
          </q-btn>
        </template>

        <template slot="col-permit" slot-scope="cell">
          <q-btn
            :disable="busy"
            color="secondary"
            @click="(event, done) => callDialogLeavingPermit(event, done, cell.row.id)"
          >
            <q-icon name="search"/>
            <q-spinner-mat slot="loading"/>
          </q-btn>
        </template>

      </q-data-table>
    </div>
    <leave-modal ref="leaveModal"/>
  </div>
</template>
<script>
import { date } from '../../../node_modules/quasar-framework/dist/quasar.mat.esm.js'
import { mapState } from 'vuex'

import LeaveModal from './LeaveModal.vue'
import { deleteLeavingRecord, getLeavingRecord } from 'src/api/sign-in'
import { succeed, fail } from 'src/util/notification'
import { PERMIT_LEAVING, GET_LEAVING_SUMMARY } from '../../store/signin/actions'
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
    LeaveModal
  },
  data () {
    return {
      busy: false,
      config: {
        rowHeight: '53px',
        title: '请假记录',
        bodyStyle: {
          /* auto */
        },
        responsive: true,
        pagination: {
          rowsPerPage: 10,
          options: [5, 10, 15, 30, 50, 100]
        },
        selection: false,
        messages: {
          noData: '没有数据',
          noDataAfterFiltering: '没有符合条件的记录'
        },
        columnPicker: true,
        labels: {
          columns: '显示项目',
          allCols: '在所有列中查找',
          rows: '每页行数',
          search: '查找',
          all: '全部'
        },
        rightStickyColumns: 3
      },
      studentColumns: [
        {
          label: '记录号',
          field: 'id',
          width: '100px',
          sort: true,
          filter: true,
          type: 'number'
        }, {
          label: '开始日期',
          field: 'fromDate',
          width: '100px',
          sort: true,
          type: 'date',
          format: (value) => this.dateFormatter(value)
        }, {
          label: '结束日期',
          field: 'toDate',
          width: '100px',
          sort: true,
          type: 'date',
          format: (value) => this.dateFormatter(value)
        }, {
          label: '申请类型',
          field: 'type',
          width: '100px',
          filter: true
        }, {
          label: '审批状态',
          field: 'permission',
          width: '70px',
          filter: true
        }, {
          label: '查看',
          field: 'lookup',
          width: '80px'
        }, {
          label: '删除',
          field: 'deleteBtn',
          width: '50px'
        }
      ],
      manageColumns: [{
        label: '记录号',
        field: 'id',
        width: '100px',
        sort: true,
        filter: true,
        type: 'number'
      }, {
        label: '申请人',
        field: 'name',
        width: '100px',
        sort: true,
        filter: true,
        type: 'string'
      }, {
        label: '学号',
        field: 'id',
        width: '50px',
        filter: true
      }, {
        label: '开始日期',
        field: 'fromDate',
        width: '150px',
        sort: true,
        type: 'date',
        format: (value) => this.dateFormatter(value)
      }, {
        label: '结束日期',
        field: 'toDate',
        width: '150px',
        sort: true,
        type: 'date',
        format: (value) => this.dateFormatter(value)
      }, {
        label: '申请类型',
        field: 'type',
        width: '100px',
        filter: true
      }, {
        label: '审批状态',
        field: 'permission',
        width: '70px',
        filter: true
      }, {
        label: '查看',
        field: 'permit',
        width: '80px'
      }]
    }
  },
  computed: {
    ...mapState({
      userType: 'userType',
      leavingRecords: state => state.signin.leavingRecords
    })
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
          done()
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
      getLeavingRecord(id)
        .then(record => {
          let fromDate = date.formatDate(new Date(record.fromDate), 'YYYY年MM月DD日')
          let toDate = date.formatDate(new Date(record.toDate), 'YYYY年MM月DD日')
          this.$q.dialog.create({
            title: '请假详情',
            message: `<div>申请人：${record.name}<br><br>开始日期：${fromDate}<br>结束日期：${toDate}<br><br>请假原因：<br>${record.reason.replace('\n', '<br>')}</div>`,
            buttons: [
              '取消',
              {
                label: '否决',
                color: 'negative',
                raised: true,
                handler: () => {
                  this.$store.dispatch(PERMIT_LEAVING, {id, value: -1})
                    .then(() => succeed({info: '否决成功'}))
                    .catch(error => fail({info: error.message}))
                }
              },
              {
                label: '批准',
                color: 'positive',
                raised: true,
                handler: () => {
                  this.$store.dispatch(PERMIT_LEAVING, {id, value: true})
                    .then(() => succeed({info: '批准成功'}))
                    .catch(error => fail({info: error.message}))
                }
              }
            ]
          })
        })
        .catch(error => fail({info: error.message}))
        .finally(() => {
          this.busy = false
          done()
        })
    }
  },
  mounted () {
    this.$store.dispatch(GET_LEAVING_SUMMARY, true).catch(error => fail({info: error.message}))
  }
}
</script>

<style scoped>

</style>
