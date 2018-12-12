<template>
  <transition name="component-fade" mode="out-in">
    <div class="layout-padding" v-if="currentPage === 1" key="1">
      <div class="bg-white">
        <q-table
          :data="studentList"
          :columns="studentColumns"
          :visible-columns="studentVisibleColumns"
          :filter="studentFilter">
          <template slot="top-left" slot-scope="props">
            <q-search
              hide-underline
              color="secondary"
              v-model="studentFilter"
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

          <q-td slot="body-cell-settingBtn" slot-scope="props" :props="props">
            <q-btn color="primary" @click="updateStudent(props.row.id)">
              <q-icon name="settings"/>
            </q-btn>
          </q-td>
          <q-td slot="body-cell-chooseBtn" slot-scope="props" :props="props">
            <q-btn color="green" @click="chooseStudent(props.row.id)">
              <q-icon name="add"/>
            </q-btn>
          </q-td>

        </q-table>
      </div>
    </div>
    <div class="layout-padding" v-else-if="currentPage === 2" key="2">
      <q-field>
        <q-btn color="primary" @click="currentPage=1">
          <q-icon name="arrow_back"/>
        </q-btn>
      </q-field>
      <div class="bg-white">
        <q-table
          :data="teacherList"
          :columns="teacherColumns"
          :visible-columns="teacherVisibleColumns"
          :filter="teacherFilter">

          <template slot="top-left" slot-scope="props">
            <q-search
              hide-underline
              color="secondary"
              v-model="teacherFilter"
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

          <q-td slot="body-cell-infoBtn" slot-scope="props" :props="props">
            <q-btn color="primary" @click="showTeacherInfo(props.row.id)">
              <q-icon name="person"/>
            </q-btn>
          </q-td>

          <q-td slot="body-cell-chooseBtn" slot-scope="props" :props="props">
            <q-btn loader color="red" v-if="haschoose(props.row.id)"
                   @click="(event) => studentCancelTeacher(event,props.row.id)">
              <q-icon name="delete"/>
            </q-btn>
            <q-btn loader color="green" v-else-if="choosable(props.row.id)"
                   @click="(event) => studentChooseTeacher(event,props.row.id)">
              <q-icon name="add"/>
            </q-btn>
          </q-td>

        </q-table>
      </div>
      <choose-teacher v-model="chooseTeacherActive" ref="teacherInfo"></choose-teacher>
    </div>
    <div class="layout-padding docs-input row" v-else-if="currentPage === 3" key="3">
      <q-list>
        <q-item>
          <q-field>
            <q-btn color="primary" @click="currentPage=1">
              <q-icon name="arrow_back"/>
            </q-btn>
          </q-field>
        </q-item>
        <q-item>
          <q-field
            icon="phone"
            label="手机"
            error-label="Wait, wait. Error!"
          >
            <q-input :value="currentStudent && currentStudent.personinfo && currentStudent.personinfo.phone"  @input="value => changeInfo('phone', value)"/>
          </q-field>
        </q-item>
        <q-item>
          <q-field
            icon="email"
            label="邮箱"
          >
            <q-input :value="currentStudent && currentStudent.personinfo && currentStudent.personinfo.mail" @input="value => changeInfo('mail', value)"/>
          </q-field>
        </q-item>
        <q-item>
          <q-field
            icon="person"
            label="性别"
          >
            <q-input :value="currentStudent && currentStudent.personinfo && currentStudent.personinfo.gender" @input="value => changeInfo('gender', value)"/>
          </q-field>
        </q-item>
        <q-item>
          <q-field
            icon="face"
            label="民族"
          >
            <q-input :value="currentStudent && currentStudent.personinfo && currentStudent.personinfo.ethnic_group" @input="value => changeInfo('ethnic_group', value)"/>
          </q-field>
        </q-item>
        <q-item>
          <q-field
            icon="home"
            label="家庭住址"
          >
            <q-input :value="currentStudent && currentStudent.personinfo && currentStudent.personinfo.household_register" @input="value => changeInfo('household_register', value)"/>
          </q-field>
        </q-item>
        <q-item>
          <q-field
            icon="school"
            label="本科专业"
          >
            <q-input :value="currentStudent && currentStudent.personinfo && currentStudent.personinfo.graduation_major" @input="value => changeInfo('graduation_major', value)"/>
          </q-field>
        </q-item>
        <q-item>
          <q-field
            icon="location_city"
            label="本科学校"
          >
            <q-input :value="currentStudent && currentStudent.personinfo && currentStudent.personinfo.graduation_university" @input="value => changeInfo('graduation_university', value)"/>
          </q-field>
        </q-item>
        <q-item>
          <q-card-actions>
            <q-btn
              loader
              color="green"
              class="btn-paddind,float-right"
              @click="updateInfo"
            >
              修改
            </q-btn>
          </q-card-actions>
        </q-item>
      </q-list>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import {
  GET_STUDENT_LIST,
  GET_TEACHER_LIST,
  GET_TEACHER_INFO,
  ADMIN_GET_STUDENT_SELECTED_LIST,
  ADMIN_GET_STUDENT_CHOOSABLE_LIST,
  ADMIN_STUDENT_CHOOSE_TEACHER,
  ADMIN_STUDENT_CANCEL_TEACHER,
  ADMIN_GET_STUDENT_INFO,
  ADMIN_UPDATE_STUDENT_INFO
} from '../../store/bichoice/actions'
import ChooseTeacher from '../share/ChooseTeacher.vue'
import { succeed, fail } from '../../util/notification'
import { ADMIN_UPDATE_STUDENT_PERSON_INFO } from '../../store/bichoice/mutations'

export default {
  name: 'AdminStudent',
  components: {
    ChooseTeacher
  },
  data () {
    return {
      chooseTeacherActive: false,
      currentPage: 1,
      selectedStudent: 0,
      studentFilter: '',
      studentVisibleColumns: ['idShow', 'name', 'settingBtn', 'chooseBtn'],
      studentColumns: [
        {
          name: 'idShow',
          label: '序号',
          field: 'idShow',
          align: 'center',
          style: 'width: 100px',
          sortable: true,
          type: 'number'
        },
        {
          name: 'name',
          label: '学生名字',
          field: 'name',
          align: 'center',
          style: 'width: 200px',
          sortable: true,
          type: 'string'
        },
        {
          name: 'settingBtn',
          label: '设置',
          align: 'center',
          field: 'settingBtn',
          style: 'width: 30px'
        },
        {
          name: 'chooseBtn',
          align: 'center',
          label: '选择',
          field: 'chooseBtn',
          style: 'width: 100px'
        }
      ],
      teacherFilter: '',
      teacherVisibleColumns: ['idShow', 'name', 'infoBtn', 'chooseBtn'],
      teacherColumns: [
        {
          name: 'idShow',
          label: '序号',
          field: 'idShow',
          align: 'center',
          style: 'width: 100px',
          sortable: true,
          type: 'number'
        },
        {
          name: 'name',
          label: '老师名字',
          field: 'name',
          align: 'center',
          style: 'width: 200px',
          sortable: true,
          type: 'string'
        },
        {
          name: 'infoBtn',
          label: '信息',
          align: 'center',
          field: 'infoBtn',
          style: 'width: 30px'
        },
        {
          name: 'chooseBtn',
          label: '选择',
          align: 'center',
          field: 'chooseBtn',
          style: 'width: 100px'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      studentList: state => {
        return state.bichoice.studentList
          .sort((a, b) => a.id - b.id)
          .map((ele, index) => Object.assign(ele, {idShow: index + 1}))
      },
      teacherList: state => {
        return state.bichoice.teacherList
          .sort((a, b) => a.id - b.id)
          .map((ele, index) => Object.assign(ele, {idShow: index + 1}))
      },
      currentStudent (state) {
        return state.bichoice.studentList.find(ele => ele.id === this.selectedStudent)
      }
    })
  },
  methods: {
    chooseStudent (id) {
      this.currentPage = 2
      this.selectedStudent = id
      this.$store.dispatch(ADMIN_GET_STUDENT_SELECTED_LIST, id)
      this.$store.dispatch(ADMIN_GET_STUDENT_CHOOSABLE_LIST, id)
    },
    haschoose (id) {
      let tmpStu = this.studentList.find(ele => ele.id === this.selectedStudent)
      return tmpStu && tmpStu.selectedList && Object.values(tmpStu.selectedList).indexOf(id) !== -1
    },
    choosable (id) {
      let tmpStu = this.studentList.find(ele => ele.id === this.selectedStudent)
      return tmpStu && tmpStu.selectedList && tmpStu.choosableList.indexOf(id) !== -1
    },
    studentChooseTeacher (event, id) {
      this.$store.dispatch(ADMIN_STUDENT_CHOOSE_TEACHER, [this.selectedStudent, id]).then(() => {
        succeed({info: '成功选择'})
      }).catch(() => {
        fail({info: '选择失败'})
      }).finally(() => {
        this.$store.dispatch(ADMIN_GET_STUDENT_SELECTED_LIST, this.selectedStudent)
        this.$store.dispatch(ADMIN_GET_STUDENT_CHOOSABLE_LIST, this.selectedStudent)
      })
    },
    studentCancelTeacher (event, id) {
      this.$store.dispatch(ADMIN_STUDENT_CANCEL_TEACHER, [this.selectedStudent, id]).then(() => {
        succeed({info: '成功取消选择'})
      }).catch(() => {
        fail({info: '取消选择失败'})
      }).finally(() => {
        this.$store.dispatch(ADMIN_GET_STUDENT_SELECTED_LIST, this.selectedStudent)
        this.$store.dispatch(ADMIN_GET_STUDENT_CHOOSABLE_LIST, this.selectedStudent)
      })
    },
    showTeacherInfo (id) {
      this.$store.state.bichoice.selectedId = id
      this.$store.dispatch(GET_TEACHER_INFO, {id}).catch(error => fail({info: error.message}))
      this.chooseTeacherActive = true
      this.$refs.teacherInfo.open(this.selectedStudent)
    },
    updateStudent (id) {
      this.currentPage = 3
      this.selectedStudent = id
      this.$store.dispatch(ADMIN_GET_STUDENT_INFO, id)
    },
    updateInfo (event) {
      this.$store.dispatch(ADMIN_UPDATE_STUDENT_INFO, [this.selectedStudent, this.currentStudent.personinfo]).then(() => {
        succeed({info: '成功更新'})
      }).catch(error => {
        if (error.response.status === 405) {
          fail({info: '邮箱错误'})
        } else if (error.response.status === 406) {
          fail({info: '手机号码错误'})
        } else {
          fail({info: '修改失败'})
        }
      })
    },
    changeInfo (name, value) {
      this.$store.commit(ADMIN_UPDATE_STUDENT_PERSON_INFO, [this.selectedStudent, name, value])
    }
  },
  mounted () {
    this.$store
      .dispatch(GET_STUDENT_LIST)
      .catch(error => fail({info: error.message}))
    this.$store
      .dispatch(GET_TEACHER_LIST)
      .catch(error => fail({info: error.message}))
  }
}
</script>

<style scoped>
  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .5s ease;
  }

  .component-fade-enter, .component-fade-leave-to
    /* .component-fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }
</style>
