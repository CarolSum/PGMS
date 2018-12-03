<template>
  <div id="personal" class="layout-padding">
    <q-card class="user-card bg-white">
      <q-card-title>
        您好, {{ name }} {{ userType === 'teacher' ? '老师' : '同学' }}
        <span slot="subtitle">当前状态：{{ profile.status }}</span>
        <q-btn slot="right" color="green">修改信息</q-btn>
      </q-card-title>
      <q-card-separator/>
      <q-card-main>
        <div class="card-wrapper">
          <div id="avatar-wrapper" class="panel">
            <img src="../../assets/user.jpg" alt="User Avatar" class="user-avatar">
            <div class="user-status">当前状态：{{ profile.status }}</div>
          </div>
          <div class="card-separator"></div>
          <div class="panel">
            <q-list v-if="userType==='student'" class="no-border">
              <q-item>
                <span>姓名 :</span>
                <q-item-main>
                  {{ name }}
                </q-item-main>
              </q-item>
              <q-item>
                <span>学号 :</span>
                <q-item-main>
                  {{ profile.id }}
                </q-item-main>
              </q-item>
              <q-item>
                <span>年级 :</span>
                <q-item-main>
                  {{ profile.grade }}
                </q-item-main>
              </q-item>
              <q-item>
                <span>导师 :</span>
                <q-item-main>
                  {{ profile.tutor }}
                </q-item-main>
              </q-item>
              <q-item>
                <span>电话 :</span>
                <q-item-main>
                  {{ profile.phone }}
                </q-item-main>
              </q-item>
              <q-item>
                <span>邮箱 :</span>
                <q-item-main>
                  {{ profile.email }}
                </q-item-main>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-main>
    </q-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapState({
      name: 'name',
      userType: 'userType'
    }),
    profile: function () {
      return {
        grade: '大三',
        id: '16340000',
        email: '123456789@gmail.com',
        phone: '1392222222',
        tutor: 'Mr. Pan',
        status: '正常'
      }
    }
  },
  methods: {
  },
  mounted () {
    // TODO: add GET user/info/:id api
    // TODO: add POST user/info/:id api
    // TODO: add GET user/avatar/:id api
  }
}
</script>

<style lang="stylus" scoped>
#personal
  .user-card
    max-width 1000px

  .card-wrapper
    display flex
    flex-direction row
    .panel
      display flex
      flex-direction column
      justify-content center
      align-items center
      width 50%
      min-height 400px
      .user-avatar
        max-width 200px
        max-height 200px
      .user-status
        margin-top 36px
      @media (max-width: 600px)
        width 100%
        min-height 300px

    .card-separator
      border solid .5px rgba(0,0,0,0.1);
      @media (max-width: 600px)
        display none

  #avatar-wrapper
    @media (max-width: 600px)
      display none
</style>
