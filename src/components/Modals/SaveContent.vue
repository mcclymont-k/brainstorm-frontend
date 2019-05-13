<template>
  <div class= 'modalSave modalSlide'>
    <button class='closeButton' @click='modalClose'>X</button>
    {{this.id}}
    <form class='saveForm'
          @submit.prevent=''>
      <h3>Thank you for using brainstorm-anon, your ideas will be saved for another day...</h3>
      <input class=button type='submit' value='Submit' @click='saveIt'>
    </form>
  </div>
</template>

<script>
export default {

  methods: {
    modalClose() {
      this.$emit('modalClose')
    },
    async saveIt() {
      await this.$store.commit('brainstorm/UPDATE_ID')
      this.$emit('saveIt')
      this.modalClose()
    }
  }
}
</script>

<style>
  .modalSave {
    display: grid;
    background-color: gold;
    transition: 0.5s;
  }

  .saveForm {
    padding: 20px
  }
</style>
