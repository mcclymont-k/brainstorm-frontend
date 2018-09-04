<template>
  <div class='centreIdea'>
    <button class='simpleButton' v-on:click='modalOpen(); addIdea()'>+</button>
    <button class='simpleButton editButton' v-on:click='modalOpen(); editModalOpen()'>*</button>
    <button class='simpleButton saveButton' v-bind:class="{'showButton': saveAlert}" v-on:click='saveButton()'>
      <img v-bind:src="require('../Images/save.svg')" class='saveButtonImage'/>
      save
    </button>
    <h1>{{this.centreIdea.title}}</h1>
  </div>
</template>

<script>
export default {

}
</script>
