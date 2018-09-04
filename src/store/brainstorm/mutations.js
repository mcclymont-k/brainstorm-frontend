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
  DELETE_SUB_IDEA(state, index) {
    state.ideas.subIdeas.splice(index, 1)
  },
  DELETE_SUBIDEA_IDEA(state, {index, deleteIndex}) {
    state.ideas.subIdeas[index].subIdeas.splice(deleteIndex, 1)
  },
}
