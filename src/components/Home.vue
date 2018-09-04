<template>
  <div class="app">
    <div class='mainContainer'>
      <!-- Modal section -->
      <div class='modal' v-bind:class="{'modalVisible': showAlert}">
        <!--Loading spinner  -->
        <div class='invisibleModal' v-bind:class="{'loadModal': showLoading}">
          <div class='innerCircle'></div>
        </div>
        <!-- The add content modal for adding new sub ideas. -->
        <div class='invisibleModal' v-bind:class="{'modalAddContent modalSlide': addAlert}">
          <button class='closeButton' v-on:click='modalClose'>X</button>
          <form class='basicForm' @submit.prevent=''>
            Add an idea:</br>
            <textarea cols='42' rows='1' name='ideaTitle' placeholder='Got an idea...' class='ideaTitle' v-model="newData.title" lazy/></br></br>
            Add a short paragraph with basic details:</br>
            <textarea rows='10' cols='42' name='ideaDetail' placeholder='Add some details' class='ideaDetail' v-model='newData.sub' lazy/>
          </br></br>
            <input class=button type='submit' value='Submit' v-on:click='updateData'>
          </form>
        </div>
        <!-- The close modal for confirming the sub idea deletion -->
        <div class='invisibleModal' v-bind:class="{'closeModal modalSlide': closeAlert}">
          <button class='closeButton' v-on:click='modalClose'>X</button>
          <h1>This will delete this branch and all information contained inside</h1>
          <h2>Continue?</h2>
          <div>
            <button v-on:click='deleteIdea()'>Yes</button>
            <button v-on:click='modalClose'>No</button>
          </div>
        </div>
        <!-- Edit modal for editing the main idea -->
        <div class='invisibleModal' v-bind:class="{'editModal modalSlide': editAlert}">
          <button class='closeButton' v-on:click='modalClose'>X</button>
          <form clss='basicForm' @submit.prevent=''>
            Edit the central idea:</br>
            <textarea cols='42' rows='1' name='ideaTitle' :placeholder=centreIdea.title class='ideaTitle' v-model="centreIdea.title" lazy/></br></br>
            Ammend the details.</br>
            <textarea rows='10' cols='42' name='ideaDetail' :placeholder=centreIdea.sub class='ideaDetail' v-model='centreIdea.sub' lazy/>
          </br></br>
            <input class=button type='submit' value='Submit' v-on:click='modalClose'>
          </form>
        </div>
        <!-- Modal to warn about too many sub ideas -->
        <div class='invisibleModal' v-bind:class="{'lengthModal modalSlide': lengthAlert}">
          <button class='closeButton' v-on:click='modalClose'>X</button>
          <h1><br/>You may only have 8 arguments per centre idea.<br/><br/>
            Expand the brainstorm by creating new ideas within each sub idea.</h1>
        </div>
      </div>
      <!--Main container for the brainstorm  -->
      <div class='centreIdea'>
        <button class='simpleButton' v-on:click='modalOpen(); addIdea()'>+</button>
        <button class='simpleButton editButton' v-on:click='modalOpen(); editModalOpen()'>*</button>
        <button class='simpleButton saveButton' v-bind:class="{'showButton': saveAlert}" v-on:click='saveButton()'>
          <img v-bind:src="require('../Images/save.svg')" class='saveButtonImage'/>
          save
        </button>
        <h1>{{centreIdea.title}}</h1>
      </div>
      <div v-for="(data, index) in centreIdea.subIdeas" class='ideaCloud'>
          <div class='titleContainer' v-on:dblclick='selectNewIdea(data, index)'>
            <button class='deleteButton' v-on:click='modalOpen(); closeWarning(index)'>x</button>
            <h2>{{data.title}}</h2>
            <div v-on:click="openInfo(index, data)">
              <i class="fas fa-arrow-circle-down" ></i>
              <div v-bind:class='classAdd(index)'>{{data.sub}}</div>
            </div>
          </div>
      </div>
      <button v-on:click='goBack' class='backwardsButton'><</button>
      <button v-on:click='openHelpTab' class='helpButton'>?</button>
      <div class='helpPage' :class="{'helpPageOpen': helpAlert}">
        Welcome to Brainstorm-anon.
        <br/><br/>- Start by using the * button to change the central idea.
        <br/><br/>- You can add ideas by using the + button on the central box.
        <br/><br/>- To read the information on the sub ideas click the arrow underneath its title.
        <br/></br>- To move deeper into the brainstorm, double click on a surrounding idea to bring it to the center.
        <br/></br>- Use the < button to move back to the main ideas.
        <br/></br>- To save the brainstorm, click the save button at the bottom right of the central idea.
        <br/><br/>- Note: You must use the save button in order to return to your work.
      </div>
    </div>
  </div>
</template>

<script>
import DisableAutocomplete from 'vue-disable-autocomplete'
import { mapState, mapActions } from 'vuex'
import { HTTP } from '../services/Api'
import Vue from 'vue'
Vue.use(DisableAutocomplete)

export default {
  name: 'Home',
  data() {
    return {
      layerOneIndex: 0,
      layerTwoIndex: 0,
      layerThreeIndex: 0,
      nestingNumber: 0,
      showLoading: false,
      showAlert: false,
      addAlert: false,
      closeAlert: false,
      editAlert: false,
      helpAlert: false,
      lengthAlert: false,
      saveAlert: false,
      newData: {
        title: '',
        sub: '',
        subIdeas: []
      },
      centreIdea: {},
    };
  },
  computed: {
    ...mapState('brainstorm', ['ideas']),
    mainIdea() {
      if(this.nestingNumber === 0) {
        this.centreIdea = this.ideas
      } else {
        this.centreIdea = this.ideas.subIdeas[this.layerOneIndex]
      }
    }
  },
  methods: {
    ...mapActions('brainstorm', ['fetchIdeas', 'setIdeas']),

    saveButton() {
      this.setIdeas()
    },

    openHelpTab() {
      this.helpAlert ? this.helpAlert = false : this.helpAlert = true
    },

    modalOpen() {
      this.showAlert = true
    },

    addIdea() {
      if (this.centreIdea.subIdeas.length === 8) {
        this.lengthAlert = true
      } else {
        this.addAlert = true;
      }
    },

    closeWarning(index) {
      this.closeAlert = true
      this.layerTwoIndex = index
    },

    modalClose() {
      this.showAlert = false
      this.addAlert = false
      this.closeAlert = false
      this.editAlert = false
      this.lengthAlert = false
      this.showLoading = false
    },

    deleteIdea() {
      if(this.nestingNumber < 1) {
        this.$store.commit('brainstorm/DELETE_SUB_IDEA', this.layerOneIndex)
      } else if(this.nestingNumber < 2) {
        this.$store.commit('brainstorm/DELETE_SUBIDEA_IDEA', {index:this.layerOneIndex, layerTwoIndex:this.layerTwoIndex})
      }

      this.showAlert = true
      this.modalClose()
    },

    updateData() {
      this.mainIdea
      if (this.nestingNumber == 0) {
        this.$store.commit('brainstorm/UPDATE_BRAINSTORM', this.newData)
      } else {
        this.$store.commit('brainstorm/UPDATE_LAYER2_BRAINSTORM', {index:this.layerOneIndex, subAddition:this.newData})
      }
      this.newData = {
        title: '',
        sub: '',
        subIdeas: []
      }
      this.modalClose()
    },

    editModalOpen() {
      this.editAlert = true
    },

    selectNewIdea(data, index) {
      this.layerOneIndex = index
      this.nestingNumber += 1
      this.mainIdea
    },

    openInfo(index, data) {
      const currentTab = '.infoTab' + index
      let selectDiv = document.querySelector(currentTab)
      selectDiv.classList.toggle('infoTabOpen')
    },

    goBack() {
      this.nestingNumber -= 1
      if(this.nestingNumber < 0) {
       this.nestingNumber += 1
      }
      this.mainIdea
    },

    classAdd(index) {
      const currentIndex = 'infoTab' + index
      return 'infoTab ' + currentIndex
    },

    async updateFromDb() {
      await this.fetchIdeas()
      this.centreIdea = this.ideas
      this.modalClose()
    },
  },

  created() {
    this.updateFromDb()
    this.showAlert=true
    this.showLoading=true
  }

  };

</script>

<style>
  body {
    margin: 0 ;
  }
</style>

<style scoped>
  button {
    background-color: rgba(0,0,0);
    color: white;
    border: 1px solid black;
    border-radius: 15%;
  }

  .mainContainer {
    display: grid;
    grid-gap: 10px;
    height: 100vh;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    grid-gap: 10px;
  }

  .backwardsButton {
    position: absolute;
    margin: 20px;
  }

  .backwardsButton:hover {
    cursor: pointer;
  }

  .helpButton {
    position: absolute;
    margin: 20px;
    right: 10px;
  }

  .helpPage {
    visibility: hidden;
    width: 300px;
    height: auto;
    border: 2px solid gold;
    position: absolute;
    right: 20px;
    top: 60px;
    padding: 5px;
    font-size: 13px;
    z-index: 3;
    background-color: white;
  }

  .helpPageOpen {
    visibility: visible;
  }

  .helpButton:hover {
    cursor: pointer;
  }

  .fa-arrow-circle-down:hover {
    background-color: #e1c00d;
    border-radius: 50%;
    cursor: pointer;
    transition: 0.3s;
  }

  .invisibleModal{
    display: none;
  }

  .editModal {
    display: grid;
    background-color: gold;
    transition: 0.5s;
    padding: 20px;
    padding-top: 30px;
  }

  .loadModal {
    display: grid;
    width: 40px;
    height: 40px;
    background: linear-gradient(black, white);
    border-radius: 50%;
    align-items: center;
    justify-items: center;
    animation: rotate 0.3s infinite linear
  }

  @keyframes rotate {
    from{transform: rotate(0deg)}
    to{transform: rotate(360deg)}
  }

  .innerCircle {
    width: 30px;
    height: 30px;
    background-color: #999999;
    border-radius: 50%;
    justify-items: center;
    align-items: center;
  }

  .lengthModal {
    font-size: 0.6em;
    display: grid;
    transition: 0.5s;
    height: 400px;
    width: 250px;
    background-color: gold;
    padding: 10px;
  }

  .closeButton{
    position: absolute;
    left: 0;
    top: 0;
    margin: 5px;
  }

  .ideaCloud {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
  }

  .ideaCloud h2 {
    padding: 5px;
    margin: 20px;
    font-size: 1vw;
    max-height: 250px;
    overflow: auto;
    user-select: none;
  }

  .titleContainer {
    border: 2px solid black;
    display: grid;
    min-height: 150px;
    width: 400px;
    position: relative;
    align-items: center;
    justify-items: center;
    transition: 0.3s;
  }

  .titleContainer h2 {
    transition: 0.5s;
  }

  .titleContainer:hover {
    cursor: pointer;
    border: 2px solid #e1c00d;
  }

  .simpleButton {
    position: absolute;
    right: 0;
    top: 0;
    margin: 30px;
    cursor: pointer;
    background: white;
    border: none;
    color: black;
    font-size: 30px
  }

  .simpleButton:hover {
    color: #e1c00d
  }

  .deleteButton {
    position: absolute;
    top: 0;
    right: 0;
    margin: 20px;
  }

  .infoTab {
    display: none;
    border: none;
    padding: 20px;
  }

  .infoTabOpen {
    display: block;
    position: absolute;
    background: gold;
    min-height: 200px;
    width: 90%;
    top: 10em;
    overflow-wrap: break-word;
    left: 0;
    z-index: 1;
    border-bottom:10px solid white;
  }

  .infoTabOpen h2 {
    border: none !important;
    font-size: 0.75vw;
  }

  .editButton {
    left: 0;
    top: 0;
  }

  .saveButton {
    display: grid;
    background-color: white;
    border: none;
    top: auto;
    bottom: 0;
    font-size: 10px;
  }

  .saveButtonImage {
    width: 20px;
  }

  .showButton {
    display:none;
  }

  .modal {
    display: none;
  }

  .modalVisible {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
    align-items: center;
    justify-content: center;
  }

  .modalVisible:hover .modalSlide {
    transform: translateY(0);

  }

  .modalSlide {
    transform: translateY(200%);
  }

  .modalAddContent {
    display: grid;
    background-color: gold;
    transition: 0.5s;
  }

  .closeModal {
    display: grid;
    align-items: center;
    justify-items: center;
    width: 300px;
    height: 400px;
    background-color: gold;
    text-align: center;
    transition: 0.5s;
  }

  .closeModal h1 {
    font-size: 20px;
  }

  .closeModal h2 {
    font-size: 15px;
  }

  .closeModal button {
    width: auto;
  }

  .ideaDetail {
    word-break: break-word;
    resize: none;
    width: 100%;
  }

  .ideaTitle {
    width: 100%;
    word-break: break-word;
    resize: none;
  }

  .basicForm {
    height: 400px;
    width: 300px;
    margin: 30px;
    background-color: gold;
  }

  .centreIdea {
    grid-column-start: 2;
    grid-row-start: 2;
    display: grid;
    position: relative;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border: 2px solid #e1c00d;
  }

  .centreIdea h1 {
    max-height: 150px;
    overflow: auto;
    margin: 0 10px 0 10px
  }

  @media screen and (max-width: 1150px){
    .mainContainer {
      grid-template-columns: 1fr;
      grid-template-rows: repeat(9, 300px);
      grid-auto-flow: column;
    }

    .ideaCloud {
      border-top: 1px solid black;
      margin: 20px;
      display:flex;
    }

    .ideaCloud h2 {
      font-size: 2.5vw;
    }

    .centreIdea {
      grid-column-start: 1;
      grid-row-start: 1;
      border: none;
      color: gold;
    }

    .simpleButton {
      margin: 50px;
    }
  }
</style>
