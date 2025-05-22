<template>
    <div class="admin-overview">
      <h2>DU ER LOGGET IND SOM ADMIN</h2>
  
      <!-- Uge skifter -->
      <div class="week-switcher">
        <button @click="prevWeek">&#x25C0;</button>
        <span>Uge {{ currentWeek }} - {{ currentYear }}</span>
        <button @click="nextWeek">&#x25B6;</button>
      </div>
  
      <h3>Bestillinger uge {{ currentWeek }} - {{ currentYear }}</h3>
  
      <div class="day-list">
        <div v-for="(label, index) in dayLabels" :key="index" class="day-item">
          <span>{{ label }}</span>
          <button class="overview-btn" @click="showOverview(index)">Gå til oversigt</button>
        </div>
      </div>
  
      <div v-if="selectedOverview">
        <h4 class="overview-title">Oversigt for {{ selectedLabel }}</h4>
        <button class="print-btn" @click="printOverview">Udskriv oversigt</button>
        <table class="overview-table">
          <thead>
            <tr>
              <th>Kunde</th>
              <th v-for="type in mealTypes" :key="type">{{ type }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, customer) in selectedOverview" :key="customer">
              <td>{{ customer }}</td>
              <td v-for="type in mealTypes" :key="type">
                <input type="number" :value="data[type] || 0" readonly />
              </td>
            </tr>
            <tr class="total-row">
              <td><strong>Total</strong></td>
              <td v-for="type in mealTypes" :key="type">
                <strong>{{ calculateTotal(type) }}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { db } from '../modules/firebase';
  import { collection, query, where, getDocs } from 'firebase/firestore';
  
  const today = new Date();
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return { week: weekNo, year: d.getUTCFullYear() };
  };
  
  const { week, year } = getWeekNumber(today);
  const currentWeek = ref(week);
  const currentYear = ref(year);
  
  const days = ['man', 'tir', 'ons', 'tor', 'fre'];
  const dayKeys = ['MAN', 'TIR', 'ONS', 'TOR', 'FRE'];
  const mealTypes = ['alm_frokost', 'vegetar', 'vegetar_fisk', 'minus_svinekoed', 'fjerkrae_fisk', 'aftentallerken'];
  
  const getMondayOfWeek = (week, year) => {
    const jan4 = new Date(year, 0, 4);
    const jan4Day = jan4.getDay() || 7;
    const monday = new Date(jan4);
    monday.setDate(jan4.getDate() - jan4Day + 1 + (week - 1) * 7);
    return monday;
  };
  
  const dayLabels = computed(() => {
    const labels = [];
    const start = getMondayOfWeek(currentWeek.value, currentYear.value);
    for (let i = 0; i < 5; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      labels.push(
        `${days[i].charAt(0).toUpperCase() + days[i].slice(1)}dag d. ${date.getDate()}/${date.getMonth() + 1}`
      );
    }
    return labels;
  });
  
  const orders = ref([]);
  const selectedOverview = ref(null);
  const selectedLabel = ref('');
  
  const fetchOrders = async () => {
    orders.value = [];
    try {
      const q = query(
        collection(db, 'ordre'),
        where('week', '==', currentWeek.value),
        where('year', '==', currentYear.value)
      );
      const snapshot = await getDocs(q);
      snapshot.forEach(doc => {
        orders.value.push(doc.data());
      });
    } catch (err) {
      console.error('Fejl ved hentning af bestillinger:', err);
    }
  };
  
  onMounted(fetchOrders);
  watch([currentWeek, currentYear], fetchOrders);
  
  const showOverview = (dayIndex) => {
    const key = dayKeys[dayIndex];
    const result = {};
    selectedLabel.value = dayLabels.value[dayIndex];
  
    orders.value.forEach(order => {
      const meals = order.data[key];
      if (meals) {
        if (!result[order.customerName]) {
          result[order.customerName] = {};
        }
        for (const type in meals) {
          result[order.customerName][type] = (result[order.customerName][type] || 0) + meals[type];
        }
      }
    });
  
    selectedOverview.value = result;
  };
  
  const calculateTotal = (type) => {
    let total = 0;
    for (const customer in selectedOverview.value) {
      total += selectedOverview.value[customer][type] || 0;
    }
    return total;
  };
  
  const prevWeek = () => {
    if (currentWeek.value === 1) {
      currentWeek.value = 52;
      currentYear.value -= 1;
    } else {
      currentWeek.value--;
    }
  };
  
  const nextWeek = () => {
    if (currentWeek.value === 52) {
      currentWeek.value = 1;
      currentYear.value++;
    } else {
      currentWeek.value++;
    }
  };
  
  const printOverview = () => {
    const printContent = document.querySelector('.overview-table').outerHTML;
    const win = window.open('', '', 'width=900,height=700');
    win.document.write(`
      <html>
        <head>
          <title>Udskriv oversigt</title>
          <style>
            body { font-family: sans-serif; padding: 2rem; }
            h2 { text-transform: uppercase; font-size: 1.2rem; margin-bottom: 1rem; }
            table { border-collapse: collapse; width: 100%; margin-top: 1rem; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
            th { background-color: #f4f4f4; }
            input { border: none; background: transparent; font-weight: bold; font-size: 1rem; text-align: center; }
          </style>
        </head>
        <body>
          <h2>Oversigt for ${selectedLabel.value}</h2>
          ${printContent}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };
  </script>
  
  <style scoped>
  .admin-overview {
    max-width: 1000px;
    margin: 2rem auto;
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
  }
  
  .week-switcher {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
    background: #f3f3f3;
    border-radius: 12px;
    padding: 0.5rem 1rem;
    width: fit-content;
    margin-inline: auto;
  }
  
  .week-switcher button {
    background: none;
    border: none;
    font-size: 1.2rem;
    color: #1f3b4d;
    cursor: pointer;
  }
  
  .day-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .day-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f4f4f4;
    padding: 1rem;
    border-radius: 10px;
  }
  
  .overview-btn {
    background-color: #bc4d4d;
    color: white;
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
  }
  
  .overview-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 2rem;
    background: #f9f9f9;
  }
  
  .overview-table th,
  .overview-table td {
    border: 1px solid #ccc;
    padding: 0.5rem;
    text-align: center;
  }
  
  .overview-table th {
    background-color: #ececec;
    font-weight: bold;
  }
  
  .overview-table input {
    width: 50px;
    text-align: center;
    border: none;
    background: transparent;
    font-weight: 500;
  }
  
  .overview-title {
    margin-top: 2rem;
    font-size: 1.2rem;
    font-weight: bold;
    text-transform: uppercase;
  }
  
  .total-row {
    background-color: #ececec;
  }
  
  .print-btn {
    background-color: #4d4d4d;
    color: white;
    padding: 0.5rem 1.25rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    margin-top: 1rem;
    cursor: pointer;
  }
  .print-btn:hover {
    background-color: #333;
  }
  </style>