export default {
  SET_IDEAS(state, ideas) {
    state.ideas = ideas[0]
  },
  UPDATE_BRAINSTORM(state, subAddition) {
    state.ideas.subIdeas.push(subAddition)
  },
  UPDATE_LAYER2_BRAINSTORM(state, {index, subAddition}) {
    state.ideas.subIdeas[index].subIdeas.push(subAddition)
  },
  UPDATE_LAYER3_BRAINSTORM(state, {index, index2, subAddition}) {
    state.ideas.subIdeas[index].subIdeas[index2].subIdeas.push(subAddition)
  },
  DELETE_SUB_IDEA(state, index) {
    console.log(index);
    state.ideas.subIdeas.splice(index, 1)
  },
  DELETE_SUBIDEA_IDEA(state, {index, deleteIndex}) {
    state.ideas.subIdeas[index].subIdeas.splice(deleteIndex, 1)
  },
  UPDATE_ID(state, id) {
    state.id = id
  },

  CLEAR_IDEA(state) {
    state.ideas = {
      id: Math.floor(Math.random() * 10000),
      title: "Brainstorm-anon",
      sub: "Add any ideas here. Each section is limited to 8 ideas. Ensure you save any time you add or any time you delete!!! The save button is on the main page in the bottom right of the centre box.",
      subIdeas: []
    }
  }
}
