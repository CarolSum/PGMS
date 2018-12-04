<template>
  <!--左侧导航-->
  <q-layout ref="layout" view="lHh Lpr lfr" :left-style="{width: '250px'}">
    <q-layout-header>
      <q-toolbar>
        <q-btn flat @click="showLeftSider = !showLeftSider">
          <q-icon name="menu"/>
        </q-btn>
        <q-toolbar-title>
          {{ this.activeSubsystemDisplayName }}
          <span slot="subtitle">
            中山大学 数据科学与计算机学院
          </span>
        </q-toolbar-title>

        <q-btn-dropdown flat right icon="settings"  v-model="settingPopoverVisible">
          <!-- dropdown content -->
          <q-list link>
            <q-item>
              <q-item-main>
                <q-item-tile label @click.native="callModal">修改密码</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-main>
                <q-item-tile label @click.native="logout">退出登录</q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </q-btn-dropdown>
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

    <q-layout-drawer side="left" v-model="showLeftSider">
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
    <change-pwd-modal v-model="modalVisible"/>
    <!-- 子路由在这里注入: -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { lostConnection } from '../util/notification'
import { LOGOUT } from '../store/actions'
import ChangePwdModal from '../components/share/ChangePwdModal.vue'

export default {
  name: 'Layout',
  components: {
    ChangePwdModal
  },
  data () {
    return {
      modalVisible: false,
      settingPopoverVisible: false,
      showLeftSider: true
    }
  },
  computed: {
    ...mapGetters([
      'activeItems', 'navigationItems', 'activeSubsystemDisplayName'
    ])
  },
  methods: {
    logout () {
      this.settingPopoverVisible = false
      this.$store.dispatch(LOGOUT)
        .then(() => this.$router.push('/login'))
        .catch(() => lostConnection())
    },
    callModal () {
      this.settingPopoverVisible = false
      this.modalVisible = true
    }
  }
}
</script>

<style scoped>

</style>
