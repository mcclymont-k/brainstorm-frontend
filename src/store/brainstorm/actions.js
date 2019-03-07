import {HTTP} from '../../services/Api.js'

export default {
  async fetchIdeas({ commit }) {
    try {
      const ideaResponse = await HTTP.get('brainstorm');
      console.log(ideaResponse.data)
      commit('SET_IDEAS', ideaResponse.data);
    } catch (error) {
      console.log(error)
    }
  },

  async setIdeas({ state }) {
    try {
      await HTTP.post('brainstorm', state.ideas)
        .then(state.saveNotify = true)
    } catch(error) {
      console.log(error)
    }
  }
}
