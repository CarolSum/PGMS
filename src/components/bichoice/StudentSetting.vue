<template>
  <div class="layout-padding docs-input row inline">
    <div class="col-12">
      <q-card>
        <q-list>
          <q-item>
            <q-card flat>
              <q-card-title>
                <img :src="personInfo && '/'+ personInfo.image" width="200px">
                <input type="file" hidden ref="avatar" accept="image/*" name="avatar" @change="uploadAvatar">
              </q-card-title>
            </q-card>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile icon="phone"></q-item-tile>
            </q-item-side>
            <q-item-side>
              <q-item-tile label>手机</q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-input :value="personInfo && personInfo.phone" @input="value => changeInfo('phone', value)"/>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile icon="mail"/>
            </q-item-side>
            <q-item-side>
              <q-item-tile label>邮箱</q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-input :value="personInfo && personInfo.mail" @input="value => changeInfo('mail', value)"
                       class="full-width"/>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile icon="place"/>
            </q-item-side>
            <q-item-side>
              <q-item-tile label>家庭住址</q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-input :value="personInfo && personInfo.household_register"
                       @input="value => changeInfo('household_register', value)"
                       class="full-width"/>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile icon="person"/>
            </q-item-side>
            <q-item-side>
              <q-item-tile label>姓名</q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-input disable v-model="name"
                       class="full-width"/>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile icon="domain"/>
            </q-item-side>
            <q-item-side>
              <q-item-tile label>本科学校</q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-input disable :value="personInfo && personInfo.graduation_university"
                       class="full-width"/>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile icon="location_city"/>
            </q-item-side>
            <q-item-side>
              <q-item-tile label>本科学校类型</q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-input disable :value="personInfo && personInfo.source"
                       class="full-width"/>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile icon="school"/>
            </q-item-side>
            <q-item-side>
              <q-item-tile label>本科专业</q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-input disable :value="personInfo && personInfo.graduation_major"
                       class="full-width"/>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile icon="people"/>
            </q-item-side>
            <q-item-side>
              <q-item-tile label>民族</q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-input disable :value="personInfo && personInfo.ethnic_group"
                       class="full-width"/>
            </q-item-main>
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
              <q-btn color="green" @click="selectAvatar">
                点击上传头像（Max: 2mb）
              </q-btn>
            </q-card-actions>
          </q-item>
        </q-list>
      </q-card>
    </div>
    <div class="col-12" style="margin-top: 20px;">
      <q-card>
        <q-card-title>
          <q-item>
            <q-item-side>上传资料（单个文件最大20mb）</q-item-side>
            <q-item-side right>
              <q-btn @click="upload" color="primary">
                <q-icon name="add"></q-icon>
              </q-btn>
            </q-item-side>
          </q-item>
        </q-card-title>
        <q-card-main>
          <q-list flat v-if="personInfo && personInfo.files.length !== 0">
            <q-item v-for="file in personInfo.files" :key="file">
              <q-item-tile icon="insert_drive_file"/>
              <q-item-main>
                <a target="_blank" :href="'/'+file">{{decodeURI(file.split('/').pop())}}</a>
              </q-item-main>
              <q-item-side right>
                <q-btn color="red" loader @click="(event,done) => deleteFile(event,done,file)">
                  <q-icon name="delete"></q-icon>
                </q-btn>
              </q-item-side>
            </q-item>
          </q-list>
        </q-card-main>
      </q-card>
      <upload-modal ref="uploader"></upload-modal>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  GET_PERSON_INFO,
  UPLOAD_PERSON_INFO,
  STUDENT_DELETE_FILE,
  STUDENT_GET_FILE_LIST
} from '../../store/bichoice/actions'
import { UPDATE_PERSON_INFO } from '../../store/bichoice/mutations'
import { required, email } from 'vuelidate/lib/validators'
import { succeed, fail } from '../../util/notification'
import UploadModal from '../share/UploadModal.vue'
import axios from 'axios'

export default {
  name: 'StudentSetting',
  components: {
    UploadModal
  },
  data () {
    return {
      image: {}
    }
  },
  methods: {
    changeInfo (name, value) {
      this.$store.commit(UPDATE_PERSON_INFO, [name, value])
    },
    updateInfo (event, done) {
      this.$store.dispatch(UPLOAD_PERSON_INFO, this.$store.state.bichoice.personinfo.data).then(() => {
        succeed({info: '成功更新'})
      }).catch(error => {
        if (error.response.status === 405) {
          fail({info: '邮箱错误'})
        } else if (error.response.status === 406) {
          fail({info: '手机号码错误'})
        } else {
          fail({info: '修改失败'})
        }
      }).finally(() => {
        done()
      })
    },
    upload () {
      this.$refs.uploader.open()
    },
    deleteFile (event, done, file) {
      this.$store.dispatch(STUDENT_DELETE_FILE, {file}).finally(() => {
        this.$store.dispatch(STUDENT_GET_FILE_LIST).finally(() => {
          done()
        })
      })
    },
    selectAvatar () {
      this.$refs.avatar.click()
    },

    uploadAvatar (event) {
      let data = new FormData()
      data.append('avatar', event.target.files[0])
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      axios.post('/api/bichoice/avatar/', data, config).then(() => {
        succeed({info: '上传头像成功'})
      }).catch(() => {
        fail({info: '上传头像失败'})
      }).finally(() => {
        this.$store.dispatch(GET_PERSON_INFO)
      })
    }

  },
  computed: {
    ...mapState({
      personInfo: state => state.bichoice.personinfo.data,
      name: state => state.bichoice.personinfo.name
    })
  },
  mounted () {
    this.$store.dispatch(GET_PERSON_INFO)
  },
  validations: {
    email: {required, email}
  }
}
</script>

<style scoped>
</style>
