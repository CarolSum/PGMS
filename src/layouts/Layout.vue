<template>
  <!--左侧导航-->
  <q-layout ref="layout" view="lHh Lpr lfr" :left-style="{width: '250px'}">
    <q-layout-header>
      <q-toolbar>
        <q-btn flat @click="showLeft = !showLeft">
          <q-icon name="menu"/>
        </q-btn>
        <q-toolbar-title>
          {{ this.activeSubsystemDisplayName }}
          <span slot="subtitle">
            中山大学 数据科学与计算机学院
          </span>
        </q-toolbar-title>

        <q-btn flat right>
          <q-icon name="settings"/>
          <!--popover 弹出框-->
          <q-popover v-model="settingPopoverVisible">
            <q-list separator link>
              <q-item @click="callModal">
                修改密码
              </q-item>
              <q-item @click="logout">
                退出登录
              </q-item>
            </q-list>
          </q-popover>
        </q-btn>
      </q-toolbar>

      <q-tabs>
        <q-route-tab v-for="(item, index) in activeItems"
          :key="index"
          replace
          slot="title"
          hide="icon"
          :icon="item.icon"
          :to="item.to"
          :label="item.name"
        />
      </q-tabs>
    </q-layout-header>

    <q-layout-drawer side="left" v-model="showLeft">
      <div class="row flex-center bg-white" style="width: 100%; height: 100px;">
        <img src="../assets/logo.svg" style="width: 200px"/>
      </div>
      <q-item-separator/>
      <q-list no-border>
        <template v-for="(item,index) in navigationItems">
          <q-item
            :key="index"
            replace
            item
            :to="item.to">
            <q-item-side :icon="item.icon"/>
            <q-item-main class="row flex-center" :label="item.name"/>
            <q-item-side right icon="chevron_right"/>
          </q-item>
        </template>
      </q-list>
    </q-layout-drawer>

    <!-- 子路由在这里注入: -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Layout',
  data () {
    return {
      modalVisible: false,
      settingPopoverVisible: false,
      showLeft: true
    }
  },
  computed: {
    // activeItems () {
    //   return {
    //     home: {to: './home', icon: 'home', name: '主页'},
    //     lectureManage: {to: './lecture-manage', icon: 'assignment turned in', name: '讲座'},
    //     record: {to: './record', icon: 'today', name: '签到'},
    //     leave: {to: './leave', icon: 'report problem', name: '请假'},
    //     personal: {to: './personal', icon: 'assignment turned in', name: '个人'}
    //   }
    // },
    // navigationItems () {
    //   return [
    //     {to: '/signin', icon: 'check', name: '签到考勤系统'},
    //     {to: '/bichoice', icon: 'check', name: '双选系统'}
    //   ]
    // },
    ...mapGetters([
      'activeItems', 'navigationItems', 'activeSubsystemDisplayName'
    ])
  },
  methods: {
    logout () {

    },
    callModal () {

    }
  }
}
</script>

<style scoped>

</style>
