<template>
    <div class="login-page">
      <div class="login-box">
        <h1>Velkommen til</h1>
        <h2>Den <span class="bold">Røde Okse</span>s frokostportal</h2>
  
        <form @submit.prevent="handleLogin">
          <input v-model="email" type="email" placeholder="Brugernavn" required />
          <input v-model="password" type="password" placeholder="Kodeord" required />
          <button type="submit">Login</button>
        </form>
        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUser } from '../modules/useUser';
  
  const router = useRouter();
  const { user, login, logout, error } = useUser();
  
  const email = ref('');
  const password = ref('');
  
  const handleLogin = () => {
    login(email.value, password.value);
  };
  
  watch(user, (currentUser) => {
    if (currentUser) {
      if (currentUser.email === 'admin@admin.com') {
        router.push('/admin');
      } else {
        router.push('/bestilling');
      }
    }
  });
  </script>

<style scoped>
.login-page {
  background-image: url('../assets/baggrundsbillede.png');
  background-size: cover;
  background-position: center;
  min-height: calc(100vh - 160px); /* tager højde for header + footer */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  z-index: 0;
}

/* Mørkt gennemsigtigt overlay over baggrunden */
.login-page::before {
  content: "";
  position: absolute;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.35); /* sort med 35% gennemsigtighed */
  z-index: 1;
}

.login-box {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2; /* ligger over baggrunds-lag */
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

h2 {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.bold {
  font-weight: bold;
  color: #8B0000;
}

input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

button {
  padding: 0.75rem 1.25rem;
  background-color: #8B0000;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #a40000;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
