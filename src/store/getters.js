let subsystemNameMap = {
  signIn: '签到考勤系统',
  bichoice: '双选系统'
}

export default {
  navigationItems (state) {
    let userType = state.userType

    let signIn = {to: '/signin', icon: 'check', name: subsystemNameMap['signIn']}

    let bichoice = {to: '/bichoice', icon: 'check', name: subsystemNameMap['bichoice']}
    let config = {
      student: [signIn],
      teacher: [signIn, bichoice],
      assistant: [signIn],
      bistudent: [bichoice],
      biadmin: [bichoice]
    }
    if (userType in config) {
      return config[userType]
    }
    return []
  },

  activeItems (state) {
    let userType = state.userType

    let signIn = {
      home: {to: './home', icon: 'home', name: '主页'},
      lectureManage: {to: './lecture-manage', icon: 'assignment turned in', name: '讲座'},
      record: {to: './record', icon: 'today', name: '签到'},
      leave: {to: './leave', icon: 'report problem', name: '请假'},
      personal: {to: './personal', icon: 'assignment turned in', name: '个人'}
    }

    let bichoice = {
      studentHome: {to: './studentHome', icon: 'home', name: '主页'},
      teacherHome: {to: './teacherHome', icon: 'home', name: '主页'},
      studentSetting: {to: './studentSetting', icon: 'settings', name: '设置'},
      teacherSetting: {to: './teacherSetting', icon: 'settings', name: '设置'},
      adminHome: {to: './adminHome', icon: 'home', name: '系统状态'},
      adminStudent: {to: './adminStudent', icon: 'people', name: '管理学生'},
      adminTeacher: {to: './adminTeacher', icon: 'people', name: '管理老师'}
    }

    let config = {
      signIn: {
        student: [signIn.home, signIn.record, signIn.leave, signIn.personal],
        teacher: [signIn.home, signIn.record, signIn.leave, signIn.personal],
        assistant: [signIn.home, signIn.record, signIn.lectureManage, signIn.leave, signIn.personal]
      },
      bichoice: {
        bistudent: [bichoice.studentHome, bichoice.studentSetting],
        teacher: [bichoice.teacherHome, bichoice.teacherSetting],
        biadmin: [bichoice.adminHome, bichoice.adminStudent, bichoice.adminTeacher]
      }
    }

    let currentConfig = config[state.activeSubsystem]

    if (currentConfig && userType in currentConfig) {
      return currentConfig[userType]
    }
    return []
  },

  activeSubsystemDisplayName (state) {
    return subsystemNameMap[state.activeSubsystem]
  }
}
