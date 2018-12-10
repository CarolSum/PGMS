<template>
  <q-modal v-model="active" id="upload">
    <div class="upload-bg">
      <q-field
        :label-width="3"
        >
        <q-uploader float-label="上传文件" url="/api/bichoice/files/" extensions='.jpg,.png,.pdf'
          multiple @finish="updateList" :headers="{'X-CSRFToken':csrf}">
        </q-uploader>
      </q-field>
    </div>
  </q-modal>
</template>

<script>
import { STUDENT_GET_FILE_LIST } from '../../store/bichoice/actions'

export default {
  name: 'UploadModal',
  data () {
    return {
      active: false,
      csrf: this.getCookie('csrftoken')
    }
  },
  methods: {
    open () {
      this.active = true
    },
    updateList () {
      this.$store.dispatch(STUDENT_GET_FILE_LIST)
    },
    getCookie (name) {
      let match = document.cookie.match(new RegExp(name + '=([^;]+)'))
      if (match) return match[1]
    }
  }
}
</script>

<style scope lang="stylus">
#upload
  .upload-bg
    padding: 10px
    min-width: 340px
  .modal-content
    overflow-y inherit
</style>
