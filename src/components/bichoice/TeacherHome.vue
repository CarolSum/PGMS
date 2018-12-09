<template>
  <div class="layout-padding">
    <transition name="component-fade" mode="out-in">
      <div class="bg-white" v-if="!chooseStudentActive" key="1">
        <q-table
          :data="studentList"
          :columns="columns"
          :visible-columns="visibleColumns"
          :filter="filter">

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

          <q-td slot="body-cell-infoBtn" slot-scope="props" :props="props">
            <q-btn color="primary" @click="callChooseStudent(props.row.id)">
              <q-icon name="person"/>
            </q-btn>
          </q-td>

          <q-td slot="body-cell-chooseBtn" slot-scope="props" :props="props">
            <q-btn v-if="hasChoose(props.row.id)" color="red" loader
                   @click="(event) => btnCancelStudent(props.row.id,event)">
              <q-icon name="delete"/>
            </q-btn>
            <q-btn v-else-if="choosableId.indexOf(props.row.id) !== -1" color="green"
                   @click="(event) => btnChooseStudent(props.row.id,event)">
              <q-icon name="add"/>
            </q-btn>
          </q-td>

        </q-table>
      </div>
      <div v-else key="2">
        <q-card>
          <q-list flat>
            <q-item>
              <q-item-side>
                <q-btn color="primary" @click="chooseStudentActive = false">
                  <q-icon name="arrow_back"></q-icon>
                </q-btn>
              </q-item-side>
              <q-item-side>
                <q-btn color="green" v-if="!hasChoose(this.$store.state.bichoice.selectedId)" loader
                       @click="chooseStudent">
                  <q-icon name="add"></q-icon>
                </q-btn>
                <q-btn color="red" v-else @click="cancelStudent">
                  <q-icon name="delete"></q-icon>
                </q-btn>
              </q-item-side>
            </q-item>
            <q-item>
              <q-item-main>
                <img :src="'/'+ (student && student.data && student.data.image)" width="200px">
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-side>
                <q-item-tile color="primary" icon="person"/>
              </q-item-side>
              <q-item-main>
                <q-item-tile label>名字</q-item-tile>
                <q-item-tile sublabel>{{student && student.name }}</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-side>
                <q-item-tile color="primary" icon="wc"/>
              </q-item-side>
              <q-item-main>
                <q-item-tile label>性别</q-item-tile>
                <q-item-tile sublabel>{{student && student.data && student.data.gender }}</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-side>
                <q-item-tile color="primary" icon="domain"/>
              </q-item-side>
              <q-item-main>
                <q-item-tile label>本科学校</q-item-tile>
                <q-item-tile sublabel>{{student && student.data && student.data.graduation_university}}</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-side>
                <q-item-tile color="primary" icon="location_city"/>
              </q-item-side>
              <q-item-main>
                <q-item-tile label>本科学校类型</q-item-tile>
                <q-item-tile sublabel>{{student && student.data && student.data.source}}</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-side>
                <q-item-tile color="primary" icon="school"/>
              </q-item-side>
              <q-item-main>
                <q-item-tile label>本科专业</q-item-tile>
                <q-item-tile sublabel>{{student && student.data && student.data.graduation_major}}</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-side>
                <q-item-tile color="primary" icon="poll"/>
              </q-item-side>
              <q-item-main>
                <q-item-tile label>全国研究生入学考试成绩</q-item-tile>
                <q-item-tile sublabel>{{student && student.data && student.data.score}}</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-side>
                <q-item-tile color="primary" icon="poll"/>
              </q-item-side>
              <q-item-main>
                <q-item-tile label>研究生入学考试机试成绩</q-item-tile>
                <q-item-tile sublabel v-if="studentScorePdf"><a target="_blank" :href="'/'+studentScorePdf">{{decodeURI(studentScorePdf.split('/').pop())}}</a>
                </q-item-tile>
                <q-item-tile sublabel v-else>无</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-side>
                <q-item-tile color="primary" icon="group"/>
              </q-item-side>
              <q-item-main>
                <q-item-tile label>学生类型</q-item-tile>
                <q-item-tile sublabel>{{student && student.data && student.data.degree_type.DegreeType +
                  ' '+student.data.degree_type.Major }}
                </q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-side>
                <q-item-tile color="primary" icon="mood"/>
              </q-item-side>
              <q-item-main>
                <q-item-tile label>是否保送</q-item-tile>
                <q-item-tile sublabel>{{student && student.data && student.data.recommended ? '是' : '否'}}</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-side>
                <q-item-tile color="primary" icon="place"/>
              </q-item-side>
              <q-item-main>
                <q-item-tile label>家庭住址</q-item-tile>
                <q-item-tile sublabel>{{student && student.data && student.data.household_register }}</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-side>
                <q-item-tile color="primary" icon="people"/>
              </q-item-side>
              <q-item-main>
                <q-item-tile label>民族</q-item-tile>
                <q-item-tile sublabel>{{student && student.data && student.data.ethnic_group }}</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-side>
                <q-item-tile color="primary" icon="phone"/>
              </q-item-side>
              <q-item-main>
                <q-item-tile label>手机</q-item-tile>
                <q-item-tile sublabel>{{student && student.data && student.data.phone }}</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-side>
                <q-item-tile color="primary" icon="mail_outline"/>
              </q-item-side>
              <q-item-main>
                <q-item-tile label>邮箱</q-item-tile>
                <q-item-tile sublabel>{{student && student.data && student.data.mail }}</q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </q-card>
        <q-card v-if="student && student.data &&student.data.files.length !== 0">
          <q-card-title flat>
            <q-list flat>
              <q-item v-for="file in student.data.files" :key="file">
                <q-item-tile icon="insert_drive_file"/>
                <q-item-main>
                  <a target="_blank" :href="'/'+file">{{decodeURI(file.split('/').pop())}}</a>
                </q-item-main>
              </q-item>
            </q-list>
          </q-card-title>
        </q-card>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { DateFormat } from '../../util/date'
import {
  GET_STUDENT_LIST,
  GET_STUDENT_INFO,
  GET_SELECTED_LIST,
  GET_TEACHER_CHOOSABLE_ID,
  CHOOSE_STUDENT,
  CANCEL_STUDENT
} from '../../store/bichoice/actions'
import { succeed, fail } from '../../util/notification'

export default {
  name: 'ChooseManage',
  data () {
    return {
      chooseStudentActive: false,
      filter: '',
      visibleColumns: ['idShow', 'name', 'infoBtn', 'chooseBtn'],
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
          style: 'width: 100px',
          field: 'chooseBtn'
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
      selectedList: state => state.bichoice.selectedList,
      choosableId: state => state.bichoice.teacherChoosableId,
      student: state => {
        return state.bichoice.studentList.find(value => value.id === state.bichoice.selectedId)
      },
      studentScorePdf: state => {
        let student = state.bichoice.studentList.find(value => value.id === state.bichoice.selectedId)
        if (student.data && student.data.files) {
          let file = student.data.files.find(value => decodeURI(value.split('/').pop()).indexOf('中山大学研究生入学考试机试成绩') !== -1)
          console.log(student.data.files)
          return file
        }
      }
    })
  },
  methods: {
    dateFormatter (value) {
      return new Date(value).toLocaleString('zh-cn', DateFormat.YYYYMMDDhhmm)
    },
    hasChoose (id) {
      return Object.values(this.selectedList).indexOf(id) !== -1
    },
    callChooseStudent (id) {
      this.$store.state.bichoice.selectedId = id
      this.$store.dispatch(GET_STUDENT_INFO, {id}).catch(error => fail({info: error.message}))
      this.chooseStudentActive = true
    },
    chooseStudent (event) {
      let store = this.$store
      this.$q.dialog.create({
        title: '警告',
        message: '请您确认是否有足够经费支撑硕士研究生未来几年的科研活动支出（如会议注册费、版面费、专利申请费等）。学院将会抽查确认。',
        buttons: [
          {
            label: '放弃',
            color: 'negative',
            outline: true
          },
          {
            label: '确定招收',
            color: 'positive',
            outline: true,
            handler () {
              store.dispatch(CHOOSE_STUDENT, {id: store.state.bichoice.selectedId}).then(() => {
                succeed({info: '选择成功'})
              }).catch(error => {
                if (error.response.status === 405) {
                  fail({info: '选择失败,已选择过该学生'})
                } else if (error.response.status === 406) {
                  fail({info: '选择失败,已超过最大选择数量'})
                } else {
                  fail({info: '选择失败'})
                }
              }).finally(() => {
                store.dispatch(GET_SELECTED_LIST)
                store.dispatch(GET_TEACHER_CHOOSABLE_ID)
              })
            }
          }
        ]
      })
    },
    cancelStudent (event) {
      this.$store.dispatch(CANCEL_STUDENT, {id: this.$store.state.bichoice.selectedId}).then(() => {
        succeed({info: '取消选择成功'})
        this.active = false
      }).catch(error => {
        if (error.response.status === 405) {
          fail({info: '你没有选择该学生'})
        } else {
          fail({info: '取消选择失败'})
        }
      }).finally(() => {
        this.$store.dispatch(GET_SELECTED_LIST)
        this.$store.dispatch(GET_TEACHER_CHOOSABLE_ID)
      })
    },
    btnChooseStudent (id, event) {
      this.$store.state.bichoice.selectedId = id
      this.chooseStudent(event)
    },
    btnCancelStudent (id, event) {
      this.$store.state.bichoice.selectedId = id
      this.cancelStudent(event)
    }
  },
  mounted () {
    this.$store
      .dispatch(GET_STUDENT_LIST)
      .catch(error => fail({info: error.message}))
    this.$store.dispatch(GET_SELECTED_LIST)
    this.$store.dispatch(GET_TEACHER_CHOOSABLE_ID)
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
