<template>
  <div class="layout-padding">
    <div class="bg-white">
      <q-table
        :data="teacherList"
        :columns="columns"
        :visible-columns="visibleColumns"
        :filter="filter"
        title="选择列表">

        <template slot="top-left" slot-scope="props">
          <q-search
            hide-underline
            color="secondary"
            v-model="filter"
            class="col-6"
            style="margin-left:8px"
            clearable
          />
        </template>

        <template slot="top-right" slot-scope="props">
          <q-table-columns
            color="secondary"
            class="q-mr-sm"
            v-model="visibleColumns"
            label="显示项目"
            :columns="columns"
          />
        </template>

        <q-td slot="body-cell-chooseBtn" slot-scope="props" :props="props">
          <q-btn v-if="hasChoose(props.row.id)" color="red" @click="callChooseTeacher(props.row.id)">
            <q-icon name="delete"/>
          </q-btn>
          <q-btn v-else-if="choosableId.indexOf(props.row.id) !== -1" color="green" @click="callChooseTeacher(props.row.id)">
            <q-icon name="add"/>
          </q-btn>
        </q-td>
      </q-table>
    </div>
    <choose-teacher v-model="chooseTeacherActive"></choose-teacher>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ChooseTeacher from '../share/ChooseTeacher.vue'
import { DateFormat } from '../../util/date'
import {
  GET_TEACHER_LIST,
  GET_TEACHER_INFO,
  GET_SELECTED_LIST,
  GET_STUDENT_MAX_SELECT_NUM,
  GET_STUDENT_CHOOSABLE_ID
} from '../../store/bichoice/actions'
import { fail } from '../../util/notification'

export default {
  name: 'StudentHome',
  components: {
    ChooseTeacher
  },
  data () {
    return {
      chooseTeacherActive: false,
      filter: '',
      visibleColumns: ['idShow', 'name', 'chooseBtn'],
      columns: [
        {
          name: 'idShow',
          label: '序号',
          field: 'idShow',
          style: 'width: 100px',
          sortable: true,
          align: 'center',
          type: 'number'
        },
        {
          name: 'name',
          label: '老师名字',
          field: 'name',
          style: 'width: 200px',
          align: 'center',
          sortable: true,
          type: 'string'
        },
        {
          name: 'chooseBtn',
          label: '选择',
          field: 'chooseBtn',
          align: 'center',
          style: 'width: 100px'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      teacherList: state => {
        return state.bichoice.teacherList
          .sort((a, b) => a.id - b.id)
          .map((ele, index) => Object.assign(ele, {idShow: index + 1}))
      },
      selectedList: state => state.bichoice.selectedList,
      isMax: state => state.bichoice.studentMaxSelectedNum > Object.keys(state.bichoice.selectedList).length,
      choosableId: state => state.bichoice.studentChoosableId
    })
  },
  methods: {
    dateFormatter (value) {
      return new Date(value).toLocaleString('zh-cn', DateFormat.YYYYMMDDhhmm)
    },
    hasChoose (id) {
      return Object.values(this.selectedList).indexOf(id) !== -1
    },
    callChooseTeacher (id) {
      this.$store.state.bichoice.selectedId = id
      this.$store.dispatch(GET_TEACHER_INFO, {id}).catch(error => fail({info: error.message}))
      this.chooseTeacherActive = true
    }
  },
  mounted () {
    this.$store
      .dispatch(GET_TEACHER_LIST)
      .catch(error => fail({info: error.message}))
    this.$store.dispatch(GET_SELECTED_LIST)
    this.$store.dispatch(GET_STUDENT_MAX_SELECT_NUM)
    this.$store.dispatch(GET_STUDENT_CHOOSABLE_ID)
  }
}
</script>

<style scoped>
</style>
