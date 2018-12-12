<template>
  <q-modal v-model="active" minimized>
    <q-card flat class="">
      <q-card-title>老师信息</q-card-title>
      <q-card flat class="q-ma-sm">
        <q-list>
          <q-item>
            <q-item-side>
              <q-item-tile color="primary" icon="person"/>
            </q-item-side>
            <q-item-main>
              <q-item-tile label>名字</q-item-tile>
              <q-item-tile sublabel>{{teacher ? teacher.name : ''}}</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile color="primary" icon="group"/>
            </q-item-side>
            <q-item-main>
              <q-item-tile label>性别</q-item-tile>
              <q-item-tile sublabel>{{teacher && teacher.data && teacher.data.gender}}</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile color="primary" icon="domain"/>
            </q-item-side>
            <q-item-main>
              <q-item-tile label>研究所</q-item-tile>
              <q-item-tile sublabel>{{teacher && teacher.data && teacher.data.belong_to }}</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile color="primary" icon="school"/>
            </q-item-side>
            <q-item-main>
              <q-item-tile label>研究领域</q-item-tile>
              <q-item-tile sublabel>{{teacher && teacher.data && teacher.data.research_area }}</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile color="primary" icon="public"/>
            </q-item-side>
            <q-item-main>
              <q-item-tile label>邮箱</q-item-tile>
              <q-item-tile sublabel>{{teacher && teacher.data && teacher.data.personal_page}}</q-item-tile>
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
          @click="cancelTeacher"
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
          @click="chooseTeacher"
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
  CHOOSE_TEACHER,
  GET_SELECTED_LIST,
  CANCEL_TEACHER,
  ADMIN_STUDENT_CHOOSE_TEACHER,
  ADMIN_STUDENT_CANCEL_TEACHER,
  ADMIN_GET_STUDENT_SELECTED_LIST,
  ADMIN_GET_STUDENT_CHOOSABLE_LIST,
  GET_STUDENT_CHOOSABLE_ID
} from '../../store/bichoice/actions'
import { succeed, fail } from '../../util/notification'

export default {
  name: 'ChooseTeacher',
  props: {
    value: Boolean
  },
  data () {
    return {
      active: this.value,
      adminSelectedStudent: 0
    }
  },
  computed: {
    ...mapState({
      teacher: state => {
        return state.bichoice.teacherList.find(value => value.id === state.bichoice.selectedId)
      },
      isSelected (state) {
        if (state.userType === 'biadmin') {
          let tmpStudent = this.$store.state.bichoice.studentList.find(ele => ele.id === this.adminSelectedStudent)
          if (tmpStudent && tmpStudent.selectedList) {
            return Object.values(tmpStudent.selectedList).indexOf(state.bichoice.selectedId) !== -1
          }
        }
        return Object.values(state.bichoice.selectedList).indexOf(state.bichoice.selectedId) !== -1
      },
      isDisabled (state) {
        if (state.userType === 'biadmin') {
          let tmpStudent = state.bichoice.studentList.find(ele => ele.id === this.adminSelectedStudent)
          if (tmpStudent && tmpStudent.choosableList) {
            return tmpStudent.choosableList.indexOf(state.bichoice.selectedId) === -1
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
      this.adminSelectedStudent = id
    },
    chooseTeacher (event) {
      if (this.userType === 'biadmin') {
        this.$store.dispatch(ADMIN_STUDENT_CHOOSE_TEACHER, [this.adminSelectedStudent, this.$store.state.bichoice.selectedId]).then(() => {
          succeed({info: '选择成功'})
          this.active = false
        }).catch(error => {
          if (error.response.status === 405) {
            fail({info: '选择失败,已选择过该老师'})
          } else if (error.response.status === 406) {
            fail({info: '选择失败,已超过最大选择数量'})
          } else {
            fail({info: '选择失败'})
          }
        }).finally(() => {
          this.$store.dispatch(ADMIN_GET_STUDENT_SELECTED_LIST, this.adminSelectedStudent)
          this.$store.dispatch(ADMIN_GET_STUDENT_CHOOSABLE_LIST, this.adminSelectedStudent)
        })
      } else {
        this.$store.dispatch(CHOOSE_TEACHER, {id: this.$store.state.bichoice.selectedId}).then(() => {
          succeed({info: '选择成功'})
          this.active = false
        }).catch(error => {
          if (error.response.status === 405) {
            fail({info: '选择失败,已选择过该老师'})
          } else if (error.response.status === 406) {
            fail({info: '选择失败,已超过最大选择数量'})
          } else {
            fail({info: '选择失败'})
          }
        }).finally(() => {
          this.$store.dispatch(GET_SELECTED_LIST)
          this.$store.dispatch(GET_STUDENT_CHOOSABLE_ID)
        })
      }
    },
    cancelTeacher (event) {
      if (this.userType !== 'biadmin') {
        this.$store.dispatch(CANCEL_TEACHER, {id: this.$store.state.bichoice.selectedId}).then(() => {
          succeed({info: '取消选择成功'})
          this.active = false
        }).catch(error => {
          if (error.response.status === 405) {
            fail({info: '你没有选择该老师'})
          } else {
            fail({info: '取消选择失败'})
          }
        }).finally(() => {
          this.$store.dispatch(GET_SELECTED_LIST)
          this.$store.dispatch(GET_STUDENT_CHOOSABLE_ID)
        })
      } else {
        this.$store.dispatch(ADMIN_STUDENT_CANCEL_TEACHER, [this.adminSelectedStudent, this.$store.state.bichoice.selectedId]).then(() => {
          succeed({info: '取消选择成功'})
          this.active = false
        }).catch(error => {
          if (error.response.status === 405) {
            fail({info: '你没有选择该老师'})
          } else {
            fail({info: '取消选择失败'})
          }
        }).finally(() => {
          this.$store.dispatch(ADMIN_GET_STUDENT_SELECTED_LIST, this.adminSelectedStudent)
          this.$store.dispatch(ADMIN_GET_STUDENT_CHOOSABLE_LIST, this.adminSelectedStudent)
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
