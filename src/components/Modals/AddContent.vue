<template>
  <div class= 'modalAddContent modalSlide'>
    <button class='closeButton' @click='modalClose'>X</button>
    <form class='basicForm' @submit.prevent=''>
      {{layerTwoIndex}}
      Add an idea:</br>
      <textarea cols='42' rows='1' name='ideaTitle' placeholder='Got an idea...' class='ideaTitle' v-model='newData.title'/></br></br>
      Add a short paragraph with basic details:</br>
      <textarea rows='10' cols='42' name='ideaDetail' placeholder='Add some details' class='ideaDetail' v-model='newData.sub' />
    </br></br>
      <input class=button type='submit' value='Submit' @click='updateData'>
    </form>
  </div>
</template>

<script>
export default {
  props: ['layerOneIndex', 'layerTwoIndex', 'nestingNumber'],
  methods: {
    modalClose() {
      this.$emit('modalClose')
    },
    updateData() {
      if (this.nestingNumber == 0) {
        this.$store.commit('brainstorm/UPDATE_BRAINSTORM', this.newData)
      } else if (this.nestingNumber == 1) {
        this.$store.commit('brainstorm/UPDATE_LAYER2_BRAINSTORM', {index: this.layerOneIndex, subAddition: this.newData})
      } else {
        this.$store.commit('brainstorm/UPDATE_LAYER3_BRAINSTORM', {index:this.layerOneIndex, index2: this.layerTwoIndex, subAddition: this.newData})
      }
      this.newData = {
        title: '',
        sub: '',
        subIdeas: []
      }
      this.modalClose()
    }
  },
  data() {
    return {
      newData: {
        title: '',
        sub: '',
        subIdeas: []
      },
    }
  }
}
</script>

<style>

</style>
