<template>
    <header class="header">
      <div class="container">
        <!-- Logo -->
        <div class="logo-area">
          <img :src="logoUrl" alt="Den Røde Okse logo" class="logo" />
        </div>
  
        <!-- Midt-menu -->
        <nav class="nav">
          <router-link
            v-if="role === 'admin'"
            to="/opret-kunde"
            class="create-customer-btn"
          >
            Opret ny kunde
          </router-link>
        </nav>
  
        <!-- Højre brugerinfo og logout -->
        <div class="user-actions" v-if="user">
          <div class="user-btn">
            <i class="icon">👤</i>
            {{ displayName }}
          </div>
          <button class="logout-btn" @click="handleLogout">Log ud</button>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  import { useUser } from '../modules/useUser';
  import { useRouter } from 'vue-router';
  import logoUrl from '../assets/logo.png';
  
  const { user, logout, displayName, role } = useUser();
  const router = useRouter();
  
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };
  </script>
  
  <style scoped>
  .header {
    background-color: #fff;
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 1000;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
  }
  
  .logo-area img {
    height: 40px;
    object-fit: contain;
  }
  
  /* Nav-links */
  .nav {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .nav-link {
    color: black;
    text-decoration: none;
    font-weight: 500;
    font-size: 1rem;
    padding: 0.4rem 0.75rem;
  }
  
  .nav-link:hover {
    text-decoration: underline;
  }
  
  .create-customer-btn {
    background-color: #BC4D4D;
    color: white !important;
    padding: 0.5rem 1rem;
    border-radius: 999px;
    text-decoration: none;
    font-weight: 500;
  }
  .create-customer-btn:hover {
    background-color: #a13737;
  }
  
  /* Brugersektion */
  .user-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .user-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #f2f2f2;
    padding: 0.5rem 1.25rem;
    height: 40px;
    border-radius: 999px;
    font-weight: 500;
    font-size: 1rem;
    box-shadow: #2a2a2a 0px 0px 1px 0px;
  }
  
  .icon {
    font-style: normal;
    font-size: 1.2rem;
    line-height: 1;
  }
  
  .logout-btn {
    background-color: #1F2129;
    color: white;
    border: none;
    padding: 0.5rem 1.25rem;
    height: 40px;
    border-radius: 999px;
    cursor: pointer;
    font-weight: 500;
    font-size: 1rem;
    display: flex;
    align-items: center;
  }
  .logout-btn:hover {
    background-color: #010101;
  }
  </style>
  