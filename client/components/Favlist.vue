<template>
  <div class="wrapper">
    <div v-for="n in 10">div is a div</div>
  </div>
</template>

<style>
  html{
    background: green;
    .bb{
      font-size: 12px;
    }
  }
</style>

<script>
  export default {
    data() {
      return {
        msg: 'hello world!'
      }
    }
  }
</script>
