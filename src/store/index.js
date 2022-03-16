import { createStore } from 'vuex'
import { toCode, fromCode } from '@/utils/validate'

export default createStore({
  state: {
    userInfo: "",
  },

  mutations: {
    // set
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
      sessionStorage.setItem("userInfo", toCode(JSON.stringify(userInfo)))
    },
    REMOVE_INFO: (state) => {
      state.userInfo = {}
      sessionStorage.setItem("userInfo", toCode(JSON.stringify(state.userInfo)))
    }

  },

  getters: {
    // get
    getUser: state => {
      return fromCode(state.userInfo)
    },


  },
  
  actions: {

  }


})
