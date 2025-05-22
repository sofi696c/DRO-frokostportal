<template>
    <div class="form-container">
      <router-link to="/admin" class="back-button">← Tilbage til adminside</router-link>
  
      <h2>Opret ny kunde</h2>
      <form @submit.prevent="createCustomer">
        <input v-model="name" placeholder="Navn" required />
        <input v-model="email" placeholder="Email" type="email" required />
        <input v-model="password" placeholder="Adgangskode" type="password" required />
        <button type="submit">Opret</button>
      </form>
      <p v-if="success" class="success">{{ success }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { collection, addDoc } from 'firebase/firestore';
  import { auth, db } from '../modules/firebase';
  
  const name = ref('');
  const email = ref('');
  const password = ref('');
  const success = ref('');
  const error = ref('');
  
  const createCustomer = async () => {
    success.value = '';
    error.value = '';
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email.value, password.value);
  
      await addDoc(collection(db, 'users'), {
        displayName: name.value,
        email: email.value,
        role: 'customer'
      });
  
      success.value = 'Brugeren er oprettet!';
      name.value = '';
      email.value = '';
      password.value = '';
    } catch (err) {
      console.error(err);
      error.value = 'Noget gik galt. Tjek oplysningerne.';
    }
  };
  </script>
  
  <style scoped>
  .form-container {
    max-width: 400px;
    margin: 2rem auto;
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .back-button {
    display: inline-block;
    margin-bottom: 1rem;
    color: #8b0000;
    text-decoration: none;
    font-weight: 500;
  }
  .back-button:hover {
    text-decoration: underline;
  }
  
  input {
    width: 100%;
    margin-bottom: 1rem;
    padding: 0.75rem;
    border-radius: 6px;
    border: 1px solid #ccc;
  }
  
  button {
    background-color: #BC4D4D;
    color: white;
    padding: 0.75rem;
    border: none;
    width: 100%;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
  }
  button:hover {
    background-color: #a13737;
  }
  
  .success {
    color: green;
    margin-top: 1rem;
  }
  .error {
    color: red;
    margin-top: 1rem;
  }
  </style>
  