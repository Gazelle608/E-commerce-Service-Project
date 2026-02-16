import { createStore } from 'vuex';

const store = createStore({
  state: {
    isAuthenticated: false,
    user: null,
    cart: [],
    destinations: []
  },
  mutations: {
    setAuthenticated(state, value) {
      state.isAuthenticated = value
    },
    setUser(state, user) {
      state.user = user
    },
    logout(state) {
      state.isAuthenticated = false
      state.user = null
    },
    addToCart(state, item) {
      state.cart.push(item)
    },
    removeFromCart(state, itemId) {
      state.cart = state.cart.filter(item => item.id !== itemId)
    },
    clearCart(state) {
      state.cart = []
    }
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    user: (state) => state.user,
    cartCount: (state) => state.cart.length,
    cartItems: (state) => state.cart,
    cartTotal: (state) => state.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  },
  actions: {
    login({ commit }, user) {
      commit('setAuthenticated', true)
      commit('setUser', user)
    },
    register({ commit }, user) {
      commit('setAuthenticated', true)
      commit('setUser', user)
    },
    logout({ commit }) {
      commit('logout')
    }
  }
});

export default store