import Vue from 'vue';
import VueX from 'vuex';
import brainstormModules from './brainstorm';

Vue.use(VueX)


export default new VueX.Store({
    state: {
      titleStore: 'Brainstorm-anon',
      subIdeaStore: '',
      indexStore: 0,
    },
    getters: {},
    actions: {},
    mutations: {},
    modules: {
      brainstorm: brainstormModules
    }
});
