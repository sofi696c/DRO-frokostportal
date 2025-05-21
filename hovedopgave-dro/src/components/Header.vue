<template>
    <header class="header">
      <div class="container">
        <div class="logo-area">
          <img :src="logoUrl" alt="Den Røde Okse logo" class="logo" />
        </div>
        <nav class="nav">
          <router-link to="/kontakt">Gå til hovedside</router-link>
        </nav>
      </div>
    </header>
  </template>
  
  <script setup>
  import logoUrl from '../assets/logo.png';
  </script>
  
  <style scoped>
  .header {
    background-color: #fff;
    color: black;
    padding: 1rem;
    position: sticky;
    top: 0;
    z-index: 1000;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .logo-area {
    display: flex;
    align-items: center;
  }
  
  .logo {
    height: 50px;
    width: auto;
    object-fit: contain;
  }
  

  
  .nav {
    display: flex;
  }
  
  .nav a {
    color: white;
    text-decoration: none;
    font-weight: 500;
  }
  
  .nav a:hover {
    text-decoration: underline;
  }
  </style>
  