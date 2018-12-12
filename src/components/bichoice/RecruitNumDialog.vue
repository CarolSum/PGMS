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
        v-model="newNum"
        :min="1"
        :max="8"
        :step="1"
        label-always
        :label-value="`当前数量: ${newNum}`"
        snap
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
        title: '改变数量',
        message: '如果改变的数量比原来的小的话，会清空当前专业方向已选择的学生'
      },
      newNum: 2,
      data: {},
      ifShowDialog: false
    }
  },
  computed: {
  },
  methods: {
    open (data) {
      this.data = data
      this.newNum = data.Num
      this.ifShowDialog = true
    },
    // when props.ok() gets called
    onOk () {
      this.data.Num = this.newNum
      this.$emit('setNum', this.data)
    },

    // when props.cancel() gets called
    onCancel () { this.ifShowDialog = false }
  }
}
</script>

<style lang="stylus" scoped>

</style>
