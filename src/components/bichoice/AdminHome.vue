<template>
  <div class="layout-padding docs-input row inline">
    <div class="col-12">
      <q-card>
        <q-list>
          <q-item>
            <q-item-side>
              <q-item-tile icon="accessibility"></q-item-tile>
            </q-item-side>
            <q-item-side>
              <q-item-tile label>学生总人数</q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-chip square>
                {{systemInfo.student_count}}
              </q-chip>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile icon="accessibility"></q-item-tile>
            </q-item-side>
            <q-item-side>
              <q-item-tile label>老师总人数</q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-chip square>
                {{systemInfo.teacher_count}}
              </q-chip>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile icon="accessibility"></q-item-tile>
            </q-item-side>
            <q-item-side>
              <q-item-tile label>可以选学生的老师总数</q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-chip square>
                <q-knob
                  v-model="systemInfo.teacher_recruitable"
                  :min=0
                  :max="systemInfo.teacher_count"
                  color="primary"
                  readonly
                >
                  {{systemInfo.teacher_recruitable}}/{{systemInfo.teacher_count}}
                </q-knob>
              </q-chip>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile icon="accessibility"></q-item-tile>
            </q-item-side>
            <q-item-side>
              <q-item-tile label>学生已上传资料的人数</q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-knob
                v-model="systemInfo.student_uploaded"
                :min=0
                :max="systemInfo.student_count"
                color="primary"
                readonly
              >
                {{systemInfo.student_uploaded}}/{{systemInfo.student_count}}
              </q-knob>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile icon="accessibility"></q-item-tile>
            </q-item-side>
            <q-item-side>
              <q-item-tile label>已选择老师的学生的人数</q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-knob
                v-model="systemInfo.student_choosed"
                :min=0
                :max="systemInfo.student_count"
                color="primary"
                readonly
              >
                {{systemInfo.student_choosed}}/{{systemInfo.student_count}}
              </q-knob>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile icon="accessibility"></q-item-tile>
            </q-item-side>
            <q-item-side>
              <q-item-tile label>已选择学生的老师的人数</q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-knob
                v-model="systemInfo.teacher_choosed"
                :min=0
                :max="systemInfo.teacher_count"
                color="primary"
                readonly
              >
                {{systemInfo.teacher_choosed}}/{{systemInfo.teacher_recruitable}}
              </q-knob>
            </q-item-main>
          </q-item>
        </q-list>
      </q-card>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { getSystemInfo } from '../../api/bichoice'

export default {
  name: 'AdminHome',
  data () {
    return {
      systemInfo: {
        student_count: 0,
        teacher_count: 0,
        teacher_recruitable: 0,
        student_uploaded: 0,
        student_choosed: 0,
        teacher_choosed: 0
      }
    }
  },
  mounted () {
    getSystemInfo().then(data => {
      Vue.set(this, 'systemInfo', data)
    })
  }
}
</script>

<style scoped>

</style>
