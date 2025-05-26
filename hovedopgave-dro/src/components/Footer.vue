<template>
    <footer class="footer">
      <div class="footer-content">
        <div class="left">
          <h2>Du finder os her:</h2>
          <div class="info">
            <p>75 15 15 00</p>
            <p>Kontakt@dro.dk</p>
            <p>Stenhuggervej 5, 6710 Esbjerg V</p>
            <p>CVR: 33861850</p>
          </div>
        </div>
        <div class="right">
          <img :src="logoRight" alt="Logo Den Røde Okse" />
        </div>
      </div>
  
      <p class="copyright">© {{ currentYear }} Den Røde Okse. Alle rettigheder forbeholdes.</p>
    </footer>
  </template>
  
  <script setup>
  import logoRight from '../assets/logo_u_tekst.png';
  const currentYear = new Date().getFullYear();
  </script>
  
  <style scoped>
  .footer {
    background-color: #1F2129;
    color: white;
    width: 100%;
    padding: 2rem 1rem 1rem 1rem;
  }
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 2rem;
  }
  
  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .left h2 {
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .info p {
    margin: 0.25rem 0;
    text-align: center;
  }
  
  .right {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 2rem; /* ryk logo lidt ind mod midten */
  }
  
  .right img {
    max-height: 200px;
    width: auto;
    object-fit: contain;
  }
  
  .copyright {
    text-align: center;
    margin-top: 2rem;
    font-size: 0.875rem;
    opacity: 0.8;
  }
  </style>
  