<template>
  <div class="layout-padding">
    <div style="padding-bottom: 20px">
      <q-btn color="green" icon="add" @click="callRegisterLectureModal">注册讲座</q-btn>
    </div>
    <div class="bg-white">
      <q-table
        :visible-columns="vsibleColumns"
        :data="lectureList"
        :filter="lectureFilter"
        :columns="columns">
        <template slot="top-left" slot-scope="props">
          <q-search
            hide-underline
            color="secondary"
            v-model="lectureFilter"
            class="col-6"
            style="margin-left:8px"
            clearable
          />
        </template>

        <template slot="top-right" slot-scope="props">
          <q-table-columns
            color="secondary"
            class="q-mr-sm"
            v-model="vsibleColumns"
            label="显示项目"
            :columns="columns"
          />
        </template>

        <q-td slot="body-cell-deleteBtn" slot-scope="props" :props="props">
          <q-btn color="red" @click="deleteLecture(props.row.id)">
            <q-icon name="delete forever"/>
          </q-btn>
        </q-td>
      </q-table>
    </div>
    <!-- <register-modal v-model="registerModalActive"/> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import RegisterModal from '../share/LectureManageModalRegister.vue'
import { DateFormat } from '../../util/date'
import { DELETE_LECTURE, GET_LECTURE_LIST, GET_POSITION } from '../../store/signin/actions'
import { succeed, fail } from '../../util/notification'

export default {
  name: 'LectureManage',
  components: {
    RegisterModal
  },
  data () {
    return {
      registerModalActive: false,
      lectureFilter: '',
      vsibleColumns: ['idShow', 'title', 'startTime', 'endTime', 'pos', 'deleteBtn'],
      columns: [
        {
          name: 'idShow',
          label: '序号',
          field: 'idShow',
          style: 'width: 100px',
          align: 'center',
          sortable: true,
          type: 'number'
        }, {
          name: 'title',
          label: '标题',
          field: 'title',
          align: 'center',
          style: 'width: 200px',
          sortable: true,
          type: 'string'
        }, {
          name: 'startTime',
          label: '讲座开始时间',
          field: 'startTime',
          align: 'center',
          style: 'width: 110px',
          sortable: true,
          type: 'date',
          format: (value) => this.dateFormatter(value)
        }, {
          name: 'endTime',
          label: '讲座结束时间',
          field: 'endTime',
          style: 'width: 110px',
          align: 'center',
          sortable: true,
          type: 'date',
          format: (value) => this.dateFormatter(value)
        }, {
          name: 'pos',
          label: '签到地点',
          field: 'pos',
          align: 'center',
          style: 'width: 150px',
          type: 'string'
        }, {
          name: 'deleteBtn',
          label: '删除',
          align: 'center',
          field: 'deleteBtn',
          style: 'width: 100px'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      lectureList: state => {
        return state.signin.lectureList
          .sort((a, b) => a.id - b.id).map((ele, index) => Object.assign(ele, {idShow: index + 1}))
      }
    })
  },
  methods: {
    dateFormatter (value) {
      return new Date(value).toLocaleString('zh-cn', DateFormat.YYYYMMDDhhmm)
    },
    callRegisterLectureModal () {
      this.registerModalActive = true
    },
    deleteLecture (id) {
      this.$store.dispatch(DELETE_LECTURE, {id})
        .then(() => succeed({info: '删除讲座成功'}))
        .catch(error => fail({info: error.message}))
    }
  },
  mounted () {
    this.$store.dispatch(GET_LECTURE_LIST)
      .catch(error => fail({info: error.message}))
    this.$store.dispatch(GET_POSITION)
      .catch(error => fail({info: error.message}))
  }
}
</script>

<style scoped>

</style>
