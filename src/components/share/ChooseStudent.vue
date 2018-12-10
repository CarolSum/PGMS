<template>
  <q-modal v-model="active" minimized>
    <q-card flat class="">
      <q-card-title>学生信息</q-card-title>
      <q-card flat class="q-ma-sm">
        <q-list>
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
              <q-item-tile color="primary" icon="group"/>
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
              <q-item-tile label>成绩</q-item-tile>
              <q-item-tile sublabel>{{student && student.data && student.data.score}}</q-item-tile>
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
          v-if="isSelected"
          loader
          color="red"
          class="btn-padding"
          @click="cancelStudent"
        >
          取消选择
          <q-spinner-mat slot="loading"/>
        </q-btn>
        <q-btn
          v-else
          loader
          color="green"
          :disable="isDisabled"
          class="btn-padding"
          @click="chooseStudent"
        >
          选择
          <q-spinner-mat slot="loading"/>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-modal>
</template>

<script>
import { mapState } from 'vuex'
import {
  CHOOSE_STUDENT,
  GET_SELECTED_LIST,
  CANCEL_STUDENT,
  GET_TEACHER_CHOOSABLE_ID,
  ADMIN_TEACHER_CHOOSE_STUDENT,
  ADMIN_GET_TEACHER_SELECTED_LIST,
  ADMIN_GET_TEACHER_CHOOSABLE_LIST,
  ADMIN_TEACHER_CANCEL_STUDENT
} from '../../store/bichoice/actions'
import { succeed, fail } from '../../util/notification'

export default {
  name: 'ChooseStudent',
  props: {
    value: Boolean
  },
  data () {
    return {
      active: this.value,
      adminSelectedTeacher: 0
    }
  },
  computed: {
    ...mapState({
      student: state => {
        return state.bichoice.studentList.find(value => value.id === state.bichoice.selectedId)
      },
      isSelected (state) {
        if (state.userType === 'biadmin') {
          let tmpTeacher = this.$store.state.bichoice.teacherList.find(ele => ele.id === this.adminSelectedTeacher)
          if (tmpTeacher && tmpTeacher.selectedList) {
            return Object.values(tmpTeacher.selectedList).indexOf(state.bichoice.selectedId) !== -1
          }
        }
        return Object.values(state.bichoice.selectedList).indexOf(state.bichoice.selectedId) !== -1
      },
      isDisabled (state) {
        if (state.userType === 'biadmin') {
          let tmpTeacher = this.$store.state.bichoice.teacherList.find(ele => ele.id === this.adminSelectedTeacher)
          if (tmpTeacher && tmpTeacher.choosableList) {
            return tmpTeacher.choosableList.indexOf(state.bichoice.selectedId) === -1
          }
        }
        return false
      },
      userType: 'userType'
    })
  },
  watch: {
    active (newValue) {
      if (this.value !== newValue) {
        this.$emit('input', newValue)
      }
    },
    value (newValue) {
      if (newValue) {
      }
      this.active = newValue
    }
  },
  methods: {
    open (id) {
      this.adminSelectedTeacher = id
    },
    chooseStudent (event, done) {
      if (this.userType === 'biadmin') {
        this.$store.dispatch(ADMIN_TEACHER_CHOOSE_STUDENT, [this.adminSelectedTeacher, this.$store.state.bichoice.selectedId]).then(() => {
          succeed({info: '选择成功'})
          this.active = false
        }).catch(error => {
          if (error.response.status === 405) {
            fail({info: '选择失败,已选择过该学生'})
          } else if (error.response.status === 406) {
            fail({info: '选择失败,已超过最大选择数量'})
          } else {
            fail({info: '选择失败'})
          }
        }).finally(() => {
          done()
          this.$store.dispatch(ADMIN_GET_TEACHER_SELECTED_LIST, this.adminSelectedTeacher)
          this.$store.dispatch(ADMIN_GET_TEACHER_CHOOSABLE_LIST, this.adminSelectedTeacher)
        })
      } else {
        this.$store.dispatch(CHOOSE_STUDENT, {id: this.$store.state.bichoice.selectedId}).then(() => {
          succeed({info: '选择成功'})
          this.active = false
        }).catch(error => {
          if (error.response.status === 405) {
            fail({info: '选择失败,已选择过该学生'})
          } else if (error.response.status === 406) {
            fail({info: '选择失败,已超过最大选择数量'})
          } else {
            fail({info: '选择失败'})
          }
        }).finally(() => {
          done()
          this.$store.dispatch(GET_SELECTED_LIST)
          this.$store.dispatch(GET_TEACHER_CHOOSABLE_ID)
        })
      }
    },
    cancelStudent (event, done) {
      if (this.userType === 'biadmin') {
        this.$store.dispatch(ADMIN_TEACHER_CANCEL_STUDENT, [this.adminSelectedTeacher, this.$store.state.bichoice.selectedId]).then(() => {
          succeed({info: '取消选择成功'})
          this.active = false
        }).catch(error => {
          if (error.response.status === 405) {
            fail({info: '你没有选择该学生'})
          } else {
            fail({info: '取消选择失败'})
          }
        }).finally(() => {
          done()
          this.$store.dispatch(ADMIN_GET_TEACHER_SELECTED_LIST, this.adminSelectedTeacher)
          this.$store.dispatch(ADMIN_GET_TEACHER_CHOOSABLE_LIST, this.adminSelectedTeacher)
        })
      } else {
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
          done()
          this.$store.dispatch(GET_SELECTED_LIST)
          this.$store.dispatch(GET_TEACHER_CHOOSABLE_ID)
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .btn-padding
    padding: 0 16px
</style>
