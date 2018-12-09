<template>
  <div class="layout-padding table-fix" id="record">
    <div class="bg-white">
      <q-card v-if="userType === 'student' || userType === 'assistant'" class="record-card">
        <q-card-title>
          {{ title }}
          <q-toggle slot="right" v-model="lectureFiltered" color="secondary" label="只显示讲座签到"/>
        </q-card-title>
        <q-table
          :visible-columns="studentVisibleColumns"
          :data="signInRecordsShow"
          :filter="studentfilter"
          :columns="studentColumns">
          <template slot="top-left" slot-scope="props">
            <q-search
              hide-underline
              color="secondary"
              v-model="studentfilter"
              class="col-6"
              style="margin-left:8px"
              clearable
            />
          </template>

          <template slot="top-right" slot-scope="props">
            <q-table-columns
              color="secondary"
              class="q-mr-sm"
              v-model="studentVisibleColumns"
              label="显示项目"
              :columns="studentColumns"
            />
          </template>
        </q-table>
      </q-card>
      <q-card v-else class="record-card">
        <q-card-title>
          {{ title }}
        </q-card-title>
        <q-table
          :data="studentsInfo"
          :filter="teacherfilter"
          :columns="teacherColumns"
          selection="multiple"
          :selected.sync="selected"
          color="secondary"
          :visible-columns="teacherVisibleColumns">

          <template slot="top-left" slot-scope="props">
            <q-search
              hide-underline
              color="secondary"
              v-model="teacherfilter"
              class="col-6"
              style="margin-left:8px"
              clearable
            />
          </template>

          <template slot="top-right" slot-scope="props">
            <q-table-columns
              color="secondary"
              class="q-mr-sm"
              v-model="teacherVisibleColumns"
              label="显示项目"
              :columns="teacherColumns"
            />
          </template>

          <q-td slot="body-cell-interval" slot-scope="props" :props="props">
            <div style="display: inline-block; width: 50px">
              {{ props.row.interval + '天'}}
            </div>
            <q-btn flat @click="callDialog([props.row])">
              <q-icon name="edit"/>
            </q-btn>
          </q-td>

          <q-td slot="body-cell-status" slot-scope="props" :props="props">
            <div v-if="props.row.status">
              <q-icon color="warning" name="info" style="font-size: 22px"/>
              <q-tooltip>请假中</q-tooltip>
            </div>
            <div v-else>
              <q-icon color="positive" name="check circle" style="font-size: 22px"/>
              <q-tooltip>正常</q-tooltip>
            </div>
          </q-td>

          <template slot="top-selection" slot-scope="props">
            <q-btn color="secondary"  label="批量修改签到间隔" class="q-mr-sm" @click="callDialog(selected)" />
            <div class="col" />
          </template>

        </q-table>
      </q-card>
    </div>
    <change-interval-dialog ref="ChangeIntervalDialog" @setInterval="setSigninInterval"/>
  </div>
</template>

<script>
import { date } from '../../../node_modules/quasar-framework/dist/quasar.mat.esm.js'
import { mapState } from 'vuex'
import ChangeIntervalDialog from './ChangeIntervalDialog.vue'
import { succeed, fail, warn } from '../../util/notification'
import { SET_INTERVAL, GET_RECORD } from '../../store/signin/actions'

export default {
  name: 'Record',
  components: {
    ChangeIntervalDialog
  },
  data () {
    return {
      title: this.$store.state.userType === 'teacher' ? '学生情况' : '签到记录',
      studentfilter: '',
      studentVisibleColumns: ['date', 'place', 'registerName'],
      studentColumns: [
        {
          name: 'date',
          label: '日期',
          field: 'date',
          style: 'width: 200px',
          classes: 'record-table-column',
          align: 'center',
          sortable: true,
          type: 'date',
          format: (value) => this.dateFormatter(value)
        }, {
          name: 'place',
          label: '地点',
          field: 'place',
          align: 'center',
          style: 'width: 200px',
          classes: 'record-table-column'
        }, {
          name: 'registerName',
          label: '签到类型',
          field: 'registerName',
          style: 'width: 200px',
          align: 'center',
          classes: 'record-table-column'
        }
      ],
      teacherfilter: '',
      teacherVisibleColumns: ['name', 'interval', 'lastRegisterDate', 'lastRegisterPlace'],
      teacherColumns: [
        {
          name: 'name',
          label: '姓名',
          field: 'name',
          width: '100px',
          align: 'center',
          classes: 'record-table-column'
        }, {
          name: 'interval',
          label: '签到间隔',
          field: 'interval',
          align: 'center',
          width: '106px',
          classes: 'record-table-column'
        }, {
          name: 'lastRegisterDate',
          label: '上次签到时间',
          field: 'lastRegisterDate',
          width: '100px',
          align: 'center',
          classes: 'record-table-column',
          format: (value) => this.dateFormatter(value)
        }, {
          name: 'lastRegisterPlace',
          label: '上次签到地点',
          field: 'lastRegisterPlace',
          width: '100px',
          align: 'center',
          classes: 'record-table-column'
        }
      ],
      lectureFiltered: false,
      dialogInterval: 2,
      selected: [],
      ids: []
    }
  },
  computed: {
    ...mapState({
      userType: 'userType',
      signInRecords: state => state.signin.student.records,
      studentsInfo: state => {
        let data = []
        let map = state.signin.teacher.studentsMap
        for (let id in map) {
          if (!map.hasOwnProperty(id)) {
            continue
          }
          data.push({
            id: id,
            name: map[id].name,
            interval: map[id].interval,
            isLeaving: map[id].isLeaving,
            lastRegisterDate: map[id].date,
            lastRegisterName: map[id].registerName || '无',
            lastRegisterPlace: map[id].place || '无'
          })
        }
        return data
      },
      studentsMap: state => state.signin.teacher.studentsMap
    }),
    lectureSignInRecords () {
      return this.signInRecords.filter(item => item.registerName !== '日常考勤')
    },
    signInRecordsShow () {
      return this.lectureFiltered ? this.lectureSignInRecords : this.signInRecords
    }
  },
  methods: {
    callDialog: function (selection) {
      console.log(selection)
      this.ids = selection.map(item => item.id)
      this.$refs.ChangeIntervalDialog.open({
        title: '修改签到间隔',
        message: `正在修改${this.ids.map(item => this.studentsMap[item].name).join(', ')}的签到间隔`
      })
    },

    setSigninInterval (newInterval) {
      if (this.ids.every(id => newInterval === this.studentsMap[id].interval)) {
        warn({info: '请输入与当前设定不同的间隔'})
      } else if (newInterval < 0) {
        warn({info: '请输入大于0的间隔'})
      } else {
        this.$store.dispatch(SET_INTERVAL, {
          ids: this.ids,
          newInterval
        }).then(() => succeed({info: '修改成功'}))
          .catch(error => fail({info: error.message}))
      }
    },

    dateFormatter (value) {
      if (!value) {
        return '无'
      }
      return date.formatDate(new Date(value), 'YYYY年MM月DD日 HH:mm')
    }
  },
  mounted () {
    this.$store.dispatch(GET_RECORD).catch(error => fail({info: error.message}))
  }
}
</script>

<style lang="stylus">
  // These styles are used to fix the improper cell height that data table component in quasar 0.14 produces
  // when rendering Chinese characters with multiple selection enabled.
  // You may inactivate these styles to see the problem and teach me how to fix it more elegantly. :)
  // .table-fix > div > div > div.q-data-table-container > div:nth-child(4) > table > thead > tr
  //   height 36px

  // .table-fix > div > div > div.q-data-table-container > div:nth-child(3) > table > tbody > tr:first-child > td
  //   height 55px

  // .table-fix > div > div > div.q-data-table-container > div:nth-child(3) > table > tbody > tr:not(:first-child) > td
  //   height 52px

  #record
    .record-card
      margin 0

    .record-table-column
      text-align center
      height 53px
      @media (max-width: 600px) {
        text-align left
        height 40px
      }

    table.q-table.horizontal-separator thead tr th
      text-align center

    table.q-table.horizontal-separator thead tr
      height 36px

</style>
