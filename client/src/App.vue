<template>
  <div class="app">
    <video class="=bg-video" autoplay muted loop playsinline object-fit="cover">
      <source src="@client/public/video/video1.mp4" type="video/mp4" />
    </video>

    <div class="overlay"></div>

    <nav class="navbar">
      <div class="logo">Jewellery Shop</div>
      
      <ul class="nav-links">
        <li><router-link to="/"> Home</router-link></li>
        <li><router-link to="/products"> Products</router-link></li>
        <li><router-link to="/support"> Support</router-link></li>
      </ul>
    </nav>

    <router-view/>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
  .app{
    height: 100vh;
    width: 100%;
    position:relative;
    overflow: hidden;
  }

  .bg-video{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -2;
  }
  
  .overlay{
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: -1;
  }

  .navbar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 50px;
    background: rgb(0, 0, 0,0.4);
    color: white;
  }

  .logo{
    font-size: 24px;
    font-weight: bold;
    font-style: oblique;
    font-variant-caps: titling-caps;
  }

  .nav-links a{
    list-style: none;
    display: flex;
    gap: 30px;
  }

  .nav-links a:hover{
    color: purple;
    transition: 0.3s ease-in-out;
  }
</style>
