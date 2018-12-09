<template>
  <q-modal v-model="active" minimized>
    <q-card square class="no-margin">
      <q-card-title>注册新讲座</q-card-title>
      <q-card-main>
        <div>
          <p class="text-grey">请在下面输入待注册讲座的标题、地点、起止日期时间等。<br>系统将根据地点和讲座起止时间将对应考勤机上的考勤记录作为该讲座的签到记录。</p>
        </div>
        <q-card-separator/>
        <q-input
          stack-label="标题"
          type="text"
          v-model="title"
        />
        <div style="margin-bottom: 24px;margin-top: 6px;">
          <q-field icon="date_range">
            <q-datetime
              float-label='开始日期'
              type="datetime"
              v-model="datetimeRange.from"
              format="YYYY/MM/DD HH:mm"
              class="full-width"
            />
          </q-field>
          <q-field icon="date_range">
            <q-datetime
              float-label='结束日期'
              type="datetime"
              v-model="datetimeRange.to"
              format="YYYY/MM/DD HH:mm"
              class="full-width"
            />
          </q-field>
        </div>
        <q-select
          stack-label="讲座地点"
          v-model="pos"
          :options="posOptions"
          multiple
          radio
        />
      </q-card-main>
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
          loader
          color="green"
          @click="addLecture"
          class="btn-padding"
        >
          确定
          <q-spinner-mat slot="loading"/>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-modal>
</template>

<script>
import { mapState } from 'vuex'

import { ADD_LECTURE } from '../../store/signin/actions'
import { fail, succeed, warn } from '../../util/notification'

export default {
  name: 'LectureManageRegisterModal',
  props: {
    value: Boolean
  },
  data () {
    return {
      title: '',
      introduction: '',
      datetimeRange: {
        from: null,
        to: null
      },
      pos: [],
      active: this.value
    }
  },
  computed: {
    ...mapState({
      posOptions: state => {
        let ret = []
        let positions = state.signin.positions
        for (let posId in positions) {
          if (!positions.hasOwnProperty(posId)) {
            continue
          }
          ret.push({
            label: positions[posId].name,
            value: positions[posId].id
          })
        }
        return ret
      }
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
        this.reset()
      }
      this.active = newValue
    }
  },
  methods: {
    reset () {
      this.title = ''
      this.introduction = ''
      this.datetimeRange = {
        from: null,
        to: null
      }
      this.pos = []
    },
    addLecture (event) {
      if (!this.title || !this.datetimeRange.from || !this.datetimeRange.to || !this.pos) {
        warn({info: '请输入所有内容'})
        return
      }

      this.$store.dispatch(ADD_LECTURE, {
        title: this.title,
        startTime: this.computeDateString(this.datetimeRange.from),
        endTime: this.computeDateString(this.datetimeRange.to),
        pos: this.pos
      }).then(() => {
        succeed({info: '添加讲座成功'})
        this.active = false
      }).catch(error => fail({info: error.message}))
    },
    computeDateString (date) {
      return date instanceof Date ? date.toISOString() : date
    }
  }
}
</script>

<style lang="stylus" scoped>
  .btn-padding
    padding: 0 16px
</style>
