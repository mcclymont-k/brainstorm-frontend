import actions from './actions';
import mutations from './mutations';

const state = {
  ideas: {},
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
