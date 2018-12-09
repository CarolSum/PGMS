<template>
  <q-dialog
    v-model="ifShowDialog"
    prevent-close
    @ok="onOk"
    @cancel="onCancel">
    <!-- This or use "title" prop on <q-dialog> -->
    <span slot="title">{{msg.title}}</span>

    <!-- This or use "message" prop on <q-dialog> -->
    <span slot="message">{{msg.message}}</span>

    <div slot="body">
      <q-slider
        v-model="newInterval"
        :min="1"
        :max="3"
        :step="1"
        label-always
      />
    </div>

    <template slot="buttons" slot-scope="props">
      <q-btn flat label="取消" @click="props.cancel" />
      <q-btn color="primary" label="确定" @click="props.ok" />
    </template>
  </q-dialog>
</template>

<script>

export default {
  data () {
    return {
      msg: {
        title: '',
        message: ''
      },
      newInterval: 2,
      ifShowDialog: false
    }
  },
  computed: {

  },
  methods: {
    open (msg) {
      this.msg = msg
      this.ifShowDialog = true
    },
    // when props.ok() gets called
    onOk (data) {
      console.log(data)
      this.$emit('setInterval', this.newInterval)
    },

    // when props.cancel() gets called
    onCancel () { this.ifShowDialog = false }
  }
}
</script>

<style lang="stylus" scoped>

</style>
