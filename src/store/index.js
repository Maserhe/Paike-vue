import { createStore } from 'vuex'

export default createStore({
  state: {
    userInfo: "",

  },

  mutations: {
    // set
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo))
    },
    REMOVE_INFO: (state) => {
      state.userInfo = {}
      sessionStorage.setItem("userInfo", JSON.stringify(state.userInfo))
    }

  },

  getters: {
    // get
    getUser: state => {
      return state.userInfo
    },


  },
  
  actions: {

  }


})
