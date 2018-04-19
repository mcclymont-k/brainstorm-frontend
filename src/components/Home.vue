<template>
  <div class="app">
    <div class='mainContainer'>
      <!-- Modal section -->
      <div class='modal' v-bind:class="{'modalVisible': showAlert}">
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
        <button class='simpleButton saveButton' v-on:click='saveButton()'>Save</button>
        <h1>{{this.centreIdea.title}}</h1>
      </div>
      <div v-for="(data, index) in this.centreIdea.subIdeas" class='ideaCloud'>
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
        <br/></br>- To delve into the brainstorm, double click on a surrounding idea to bring it to the center.
        <br/></br>- Use the < button to move back to the main ideas.
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { HTTP } from '../services/Api'

export default {
  name: 'Home',
  data() {
    return {
      num: 0,
      id: 0,
      name: '',
      showAlert: false,
      addAlert: false,
      closeAlert: false,
      editAlert: false,
      helpAlert: false,
      lengthAlert: false,
      nestingNumber: 0,
      indexWatch: 0,
      newData: {
        title: '',
        sub: '',
        subIdeas: []
      },
      centreIdea: {
        title: 'Brainstorm-anon',
        sub: '',
        index: 0,
        subIdeas: [
          ]
      },
      fakeData: {}
    };
  },


  methods: {

    saveButton() {
      console.log(JSON.stringify(this.centreIdea))
      console.log(JSON.stringify(this.fakeData))
      if (this.fakeData.title) {
        console.log('working...')
        HTTP.post('brainstorm', this.fakeData)
      }
    },

    openHelpTab() {
      this.helpAlert ? this.helpAlert = false : this.helpAlert = true
      HTTP.post('names', {id: this.id, title: 'Kieran', age: this.num})
      this.updateFromDb()
      this.num += 1
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
      this.indexWatch = index
    },

    modalClose() {
      this.showAlert = false
      this.addAlert = false
      this.closeAlert = false
      this.editAlert = false
      this.lengthAlert = false
    },

    deleteIdea() {
      let index = this.indexWatch
      this.showAlert = true
      this.centreIdea.subIdeas.splice(index, 1)
      this.modalClose()
    },

    updateData() {
      let subIdeas = this.centreIdea.subIdeas
      subIdeas.push(this.newData)
      this.newData = {
        title: '',
        sub: '',
        subIdeas: []
      }
      if (this.nestingNumber === 0) {
        this.fakeData = this.centreIdea
      }
      this.modalClose();
    },

    editModalOpen() {
      this.editAlert = true
    },

    selectNewIdea(data, index) {
      this.nestingNumber +=1
      if (this.nestingNumber === 1) {
        this.indexWatch = index
        this.centreIdea = {}
        this.centreIdea = data
      } else if (this.nestingNumber === 2) {
        this.centreIdea = {}
        this.centreIdea = data
      } else {this.nestingNumber -=1}
    },

    openInfo(index, data) {
      const currentTab = '.infoTab' + index
      let selectDiv = document.querySelector(currentTab)
      selectDiv.classList.toggle('infoTabOpen')
    },

    goBack() {
      this.nestingNumber -= 1
      if (this.nestingNumber < 0) {
        this.nestingNumber += 1
      } else if (this.nestingNumber === 0) {
        this.centreIdea = this.fakeData
      } else if (this.nestingNumber === 1) {
        this.centreIdea = this.fakeData.subIdeas[this.indexWatch]
      }
    },

    classAdd(index) {
      const currentIndex = 'infoTab' + index
      return 'infoTab ' + currentIndex
    },

    updateFromDb() {
      HTTP.get('brainstorm')
      .then((response) => {
        if (response.data[0]) {
          this.fakeData = response.data[0]
          this.centreIdea = this.fakeData
        }
      })
    },
  },

  created() {
    this.updateFromDb()
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
    margin: 50px;
    cursor: pointer;
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
    top: auto;
    bottom: 0;
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

  @media screen and (max-width: 1097px){
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
  }
</style>
