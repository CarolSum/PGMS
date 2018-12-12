<template>
  <transition name="component-fade" mode="out-in">
    <div class="layout-padding" v-if="currentPage === 1" key="1">
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

          <q-td slot="body-cell-settingBtn" slot-scope="props" :props="props">
            <q-btn color="primary" @click="updateTeacher(props.row.id)">
              <q-icon name="settings"/>
            </q-btn>
          </q-td>

          <q-td slot="body-cell-chooseBtn" slot-scope="props" :props="props">
            <q-btn color="green" @click="chooseTeacher(props.row.id)">
              <q-icon name="add"/>
            </q-btn>
          </q-td>

          <q-td slot="body-cell-recruitBtn" slot-scope="props" :props="props">
            <q-btn color="primary" @click="updateRecruit(props.row.id)">
              <q-icon name="assessment"/>
            </q-btn>
          </q-td>
        </q-table>
      </div>
    </div>
    <div class="layout-padding" v-else-if="currentPage === 2" key="2">
      <q-field>
        <q-btn color="primary" @click="currentPage=1" class="table-header-button">
          <q-icon name="arrow_back"/>
        </q-btn>
      </q-field>
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

          <q-td slot="body-cell-infoBtn" slot-scope="props" :props="props">
            <q-btn color="primary" @click="showStudentInfo(props.row.id)">
              <q-icon name="person"/>
            </q-btn>
          </q-td>

          <q-td slot="body-cell-chooseBtn" slot-scope="props" :props="props">
            <q-btn loader color="red" v-if="haschoose(props.row.id)"
                   @click="(event) => studentCancelTeacher(event,props.row.id)">
              <q-icon name="delete"/>
            </q-btn>
            <q-btn loader color="green" v-else-if="choosable(props.row.id)"
                   @click="(event) => teacherChooseStudent(event,props.row.id)">
              <q-icon name="add"/>
            </q-btn>
          </q-td>
        </q-table>
      </div>
      <choose-student v-model="chooseStudentActive" ref="studentInfo"></choose-student>
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
            icon="domain"
            label="研究所"
            error-label="Wait, wait. Error!"
          >
            <q-input :value="currentTeacher && currentTeacher.personinfo && currentTeacher.personinfo.belong_to"
                     @input="value => changeInfo('belong_to', value)"/>
          </q-field>
        </q-item>
        <q-item>
          <q-field
            icon="school"
            label="研究领域"
          >
            <q-input :value="currentTeacher && currentTeacher.personinfo && currentTeacher.personinfo.research_area"
                     @input="value => changeInfo('research_area', value)"/>
          </q-field>
        </q-item>
        <q-item>
          <q-field
            icon="public"
            label="个人主页"
          >
            <q-input :value="currentTeacher && currentTeacher.personinfo && currentTeacher.personinfo.personal_page"
                     @input="value => changeInfo('personal_page', value)"/>
          </q-field>
        </q-item>
        <q-item>
          <q-field
            icon="group"
            label="性别"
          >
            <q-input :value="currentTeacher && currentTeacher.personinfo && currentTeacher.personinfo.gender"
                     @input="value => changeInfo('gender', value)"/>
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
    <div class="layout-padding docs-input row" v-else-if="currentPage === 4" key="4">
      <q-field>
        <q-btn color="primary" @click="currentPage=1" class="table-header-button">
          <q-icon name="arrow_back"/>
        </q-btn>
        <q-btn color="green" @click="addRecruit" :disable="this.currentTeacher.recruitList && this.currentTeacher.recruitList.length === 0" class="table-header-button">
          <q-icon name="add"/>
        </q-btn>
      </q-field>
      <q-modal v-model="openAddRecruitModal" minimized>
        <q-card flat>
          <q-card-title>
            添加
          </q-card-title>
          <q-card-main>
            <q-select
              v-model="recruit"
              :options="currentTeacher.recruitList && this.currentTeacher.recruitList.map(ele =>{return {'label':ele,'value':ele}})">
            </q-select>
            <q-slider
              v-model="recruitNum"
              :label-value="`人数: ${recruitNum}`"
              :min="1"
              :max="8"
              :step="1"
              label
              snap
              :markers=true
            />
          </q-card-main>
          <q-card-actions align="end">
            <q-btn @click="openAddRecruitModal = false" color="negative">取消</q-btn>
            <q-btn color="positive" @click="addRecruitClick">确定</q-btn>
          </q-card-actions>
        </q-card>
      </q-modal>
      <div class="bg-white">
        <q-table
          :data="currentTeacher.personinfo && currentTeacher.personinfo.degree_type"
          :columns="recruitColumns"
          :visible-columns="recruitVisibleColumns"
          :filter="recruitFilter">

          <template slot="top-left" slot-scope="props">
            <q-search
              hide-underline
              color="secondary"
              v-model="recruitFilter"
              class="col-6"
              style="margin-left:8px"
              clearable
            />
          </template>

          <template slot="top-right" slot-scope="props">
            <q-table-columns
              color="secondary"
              class="q-mr-sm"
              v-model="recruitVisibleColumns"
              label="显示项目"
              :columns="recruitColumns"
            />
          </template>

          <q-td slot="body-cell-editBtn" slot-scope="props" :props="props">
            <q-btn color="primary" @click="updateRecruitNum(props.row)">
              <q-icon name="settings"/>
            </q-btn>
          </q-td>

          <q-td slot="body-cell-deleteBtn" slot-scope="props" :props="props">
            <q-btn color="red"
                   @click="deleteRecruit(props.row)">
              <q-icon name="delete"/>
            </q-btn>
          </q-td>
        </q-table>
      </div>
      <recruit-num-dialog ref="RecruitNumDialog" @setNum="setRecruitNum"/>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import RecruitNumDialog from './RecruitNumDialog.vue'
import { addTeacherRecruitList, putTeacherRecruitList } from '../../api/bichoice'

import {
  GET_STUDENT_LIST,
  GET_TEACHER_LIST,
  GET_STUDENT_INFO,
  ADMIN_GET_TEACHER_SELECTED_LIST,
  ADMIN_GET_TEACHER_CHOOSABLE_LIST,
  ADMIN_TEACHER_CHOOSE_STUDENT,
  ADMIN_TEACHER_CANCEL_STUDENT,
  ADMIN_GET_TEACHER_INFO,
  ADMIN_UPDATE_TEACHER_INFO,
  ADMIN_GET_RECRUIT_LIST
} from '../../store/bichoice/actions'
import ChooseStudent from '../share/ChooseStudent.vue'
import { succeed, fail } from '../../util/notification'
import { ADMIN_UPDATE_TEACHER_PERSON_INFO } from '../../store/bichoice/mutations'

export default {
  name: 'AdminStudent',
  components: {
    ChooseStudent,
    RecruitNumDialog
  },
  data () {
    return {
      chooseStudentActive: false,
      openAddRecruitModal: false,
      currentPage: 1,
      selectedTeacher: 0,
      recruit: '',
      recruitNum: 1,
      teacherFilter: '',
      teacherVisibleColumns: ['idShow', 'name', 'settingBtn', 'chooseBtn', 'recruitBtn'],
      teacherColumns: [
        {
          name: 'idShow',
          label: '序号',
          field: 'idShow',
          style: 'width: 100px',
          align: 'center',
          sortable: true,
          type: 'number'
        },
        {
          name: 'name',
          label: '老师名字',
          field: 'name',
          style: 'width: 200px',
          sortable: true,
          align: 'center',
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
          label: '选择',
          field: 'chooseBtn',
          align: 'center',
          style: 'width: 30px'
        },
        {
          name: 'recruitBtn',
          label: '招生',
          align: 'center',
          field: 'recruitBtn',
          style: 'width: 100px'
        }
      ],
      studentFilter: '',
      studentVisibleColumns: ['idShow', 'name', 'infoBtn', 'chooseBtn'],
      studentColumns: [
        {
          name: 'idShow',
          label: '序号',
          align: 'center',
          field: 'idShow',
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
      ],
      recruitFilter: '',
      recruitVisibleColumns: ['DegreeType', 'Major', 'Num', 'editBtn', 'deleteBtn'],
      recruitColumns: [
        {
          name: 'DegreeType',
          label: '招生类型',
          field: 'DegreeType',
          style: 'width: 200px',
          sortable: true,
          type: 'string'
        },
        {
          name: 'Major',
          label: '招生专业',
          field: 'Major',
          style: 'width: 200px',
          sortable: true,
          type: 'string'
        },
        {
          name: 'Num',
          label: '数量',
          field: 'Num',
          style: 'width: 200px',
          sortable: true,
          type: 'string'
        },
        {
          name: 'editBtn',
          label: '编辑',
          field: 'editBtn',
          style: 'width: 40px'
        },
        {
          name: 'deleteBtn',
          label: '删除',
          field: 'deleteBtn',
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
      currentTeacher (state) {
        return state.bichoice.teacherList.find(ele => ele.id === this.selectedTeacher)
      }
    })
  },
  methods: {
    chooseTeacher (id) {
      this.currentPage = 2
      this.selectedTeacher = id
      this.$store.dispatch(ADMIN_GET_TEACHER_SELECTED_LIST, id)
      this.$store.dispatch(ADMIN_GET_TEACHER_CHOOSABLE_LIST, id)
    },
    haschoose (id) {
      let tmpTea = this.teacherList.find(ele => ele.id === this.selectedTeacher)
      return tmpTea && tmpTea.selectedList && Object.values(tmpTea.selectedList).indexOf(id) !== -1
    },
    choosable (id) {
      let tmpTea = this.teacherList.find(ele => ele.id === this.selectedTeacher)
      return tmpTea && tmpTea.selectedList && tmpTea.choosableList.indexOf(id) !== -1
    },
    teacherChooseStudent (event, id) {
      this.$store.dispatch(ADMIN_TEACHER_CHOOSE_STUDENT, [this.selectedTeacher, id]).then(() => {
        succeed({info: '成功选择'})
      }).catch(() => {
        fail({info: '选择失败'})
      }).finally(() => {
        this.$store.dispatch(ADMIN_GET_TEACHER_SELECTED_LIST, this.selectedTeacher)
        this.$store.dispatch(ADMIN_GET_TEACHER_CHOOSABLE_LIST, this.selectedTeacher)
      })
    },
    studentCancelTeacher (event, id) {
      this.$store.dispatch(ADMIN_TEACHER_CANCEL_STUDENT, [this.selectedTeacher, id]).then(() => {
        succeed({info: '成功取消选择'})
      }).catch(() => {
        fail({info: '取消选择失败'})
      }).finally(() => {
        this.$store.dispatch(ADMIN_GET_TEACHER_SELECTED_LIST, this.selectedTeacher)
        this.$store.dispatch(ADMIN_GET_TEACHER_CHOOSABLE_LIST, this.selectedTeacher)
      })
    },
    showStudentInfo (id) {
      this.$store.state.bichoice.selectedId = id
      this.$store.dispatch(GET_STUDENT_INFO, {id}).catch(error => fail({info: error.message}))
      this.chooseStudentActive = true
      this.$refs.studentInfo.open(this.selectedTeacher)
    },
    updateTeacher (id) {
      this.currentPage = 3
      this.selectedTeacher = id
      this.$store.dispatch(ADMIN_GET_TEACHER_INFO, id)
    },
    updateInfo (event) {
      this.$store.dispatch(ADMIN_UPDATE_TEACHER_INFO, [this.selectedTeacher, this.currentTeacher.personinfo]).then(() => {
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
      this.$store.commit(ADMIN_UPDATE_TEACHER_PERSON_INFO, [this.selectedTeacher, name, value])
    },
    updateRecruit (id) {
      this.currentPage = 4
      this.selectedTeacher = id
      this.$store.dispatch(ADMIN_GET_TEACHER_INFO, id)
      this.$store.dispatch(ADMIN_GET_RECRUIT_LIST, id)
    },
    deleteRecruit (data) {
      let teacherId = this.selectedTeacher
      let store = this.$store
      this.$q.dialog({
        title: '警告',
        message: '此操作会清空该老师当前专业方向已选择的学生',
        ok: '同意',
        cancel: '取消'
      }).then(() => {
        putTeacherRecruitList(teacherId, {'type': data.Major + ' ' + data.DegreeType, 'num': 0}).then(() => {
          succeed({info: '成功删除'})
        }).catch(() => {
          fail({info: '删除失败'})
        }).finally(() => {
          store.dispatch(ADMIN_GET_TEACHER_INFO, teacherId)
          store.dispatch(ADMIN_GET_RECRUIT_LIST, teacherId)
        })
      }).catch(() => {})
    },
    setRecruitNum (data) {
      let teacherId = this.selectedTeacher
      let store = this.$store
      putTeacherRecruitList(teacherId, {'type': data.Major + ' ' + data.DegreeType, 'num': data.Num}).then(() => {
        succeed({info: '成功修改'})
      }).catch(() => {
        fail({info: '修改失败'})
      }).finally(() => {
        store.dispatch(ADMIN_GET_TEACHER_INFO, teacherId)
        store.dispatch(ADMIN_GET_RECRUIT_LIST, teacherId)
      })
    },
    updateRecruitNum (data) {
      this.$refs.RecruitNumDialog.open(data)
    },
    addRecruit () {
      this.recruit = this.currentTeacher.recruitList[0]
      this.openAddRecruitModal = true
    },
    addRecruitClick () {
      addTeacherRecruitList(this.selectedTeacher, {'type': this.recruit, 'num': this.recruitNum}).then(() => {
        succeed({info: '成功添加'})
      }).catch(() => {
        fail({info: '添加失败'})
      }).finally(() => {
        this.openAddRecruitModal = false
        this.$store.dispatch(ADMIN_GET_TEACHER_INFO, this.selectedTeacher)
        this.$store.dispatch(ADMIN_GET_RECRUIT_LIST, this.selectedTeacher)
      })
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

  .table-header-button {
    margin-bottom: 1rem;
    margin-right: 1rem;
  }
</style>
