<template>
  <div class='loadContainer'>
    <h4>Load an Old Brainstorm or Start a New One</h4>
    <input type='text' placeholder='enter Id:' />
    <div>
      <input type='submit' value='Load' @click='submit'/>
      <input type='submit' value='New Idea' />
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      load() {
        console.log('click');
      }
    }
  }
</script>

<style>
  .loadContainer {
    width: 400px;
    height: auto;
    padding: 20px;
    display: grid;
    justify-items: center;
    background-color: gold;
  }

</style>
