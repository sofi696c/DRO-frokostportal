<template>
    <div class="page-header">
      <h2>DU BESTILLER NU MAD TIL {{ displayName }}</h2>
    </div>
  
    <div class="bestilling-container">
  
      <div class="week-switcher">
        <button @click="prevWeek" class="arrow-btn">❮</button>
        <span class="week-text">Uge {{ currentWeek }} - {{ currentYear }}</span>
        <button @click="nextWeek" class="arrow-btn">❯</button>
      </div>
  
      <h3>Bestilling til uge {{ currentWeek }} - {{ currentYear }}</h3>

      <!-- Tabs til Frokost og Diverse -->
      <div class="tab-switcher">
        <button :class="{ active: activeTab === 'FROKOST' }" @click="activeTab = 'FROKOST'">Frokost</button>
        <button :class="{ active: activeTab === 'DIVERSE' }" @click="activeTab = 'DIVERSE'">Diverse</button>
      </div>
  
      <table>
        <thead>
            <tr>
                <th>Dag</th>
                <th v-for="(day, index) in days" :key="day">
                <div style="font-weight: 700;">{{ day }}</div>
                <div>{{ dayLabels[day] }}</div>
                </th>
            </tr>
        </thead>
        <tbody>
          <tr v-for="(type, index) in currentMealTypes" :key="index">
            <td>{{ type.label }}</td>
            <td v-for="day in days" :key="day">
              <input type="number" min="0" v-model.number="orders[activeTab][day][type.key]" class="order-input" />
            </td>
          </tr>
        </tbody>
      </table>
  
      <button class="bestil" @click="submitOrder">Godkend og bestil</button>
      <p v-if="success" class="success">{{ success }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useUser } from '../modules/useUser';
  import { db } from '../modules/firebase';
  import { collection, addDoc } from 'firebase/firestore';
  
  const { user, displayName } = useUser();
  
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
  
  const days = ['MAN', 'TIR', 'ONS', 'TOR', 'FRE'];
  
  function getMondayOfWeek(week, year) {
    const jan4 = new Date(year, 0, 4);
    const jan4Day = jan4.getDay() || 7;
    const monday = new Date(jan4);
    monday.setDate(jan4.getDate() - jan4Day + 1 + (week - 1) * 7);
    return monday;
  }
  
  const dayLabels = computed(() => {
    const labels = {};
    const startDate = getMondayOfWeek(currentWeek.value, currentYear.value);
    days.forEach((day, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      labels[day] = date.toLocaleDateString('da-DK', {
        day: '2-digit',
        month: '2-digit'
      });
    });
    return labels;
  });
  
  const mealTypesFrokost = [
    { label: 'Antal kuverter - Alm. frokost', key: 'alm_frokost' },
    { label: 'Antal kuverter - Vegetar', key: 'vegetar' },
    { label: 'Antal kuverter - Vegetar m. fisk', key: 'vegetar_fisk' },
    { label: 'Antal kuverter - minus svinekød', key: 'minus_svinekoed' },
    { label: 'Antal kuverter - Fjerkræ og fisk', key: 'fjerkrae_fisk' },
    { label: 'Antal kuverter - aftentallerken', key: 'aftentallerken' }
  ];
  
  const mealTypesDiverse = [
    { label: 'Antal protein salater', key: 'protein_salater' },
    { label: 'Antal halve sandwiches', key: 'halve_sandwiches' },
    { label: 'Antal hele sandwiches', key: 'hele_sandwiches' },
    { label: 'Antal stk. frisk frugt', key: 'frisk_frugt' },
    { label: 'Antal mælk (1L)', key: 'mælk' },
    { label: 'Antal salatdreessing', key: 'salatdressing' },
    { label: 'Antal smør (kasse á 100 stk.)', key: 'smør' }
  ];
  
  const activeTab = ref('FROKOST');
  const currentMealTypes = computed(() => activeTab.value === 'FROKOST' ? mealTypesFrokost : mealTypesDiverse);
  
  const orders = ref({ FROKOST: {}, DIVERSE: {} });
  
  function initOrders() {
    ['FROKOST', 'DIVERSE'].forEach(category => {
      orders.value[category] = {};
      days.forEach(day => {
        orders.value[category][day] = {};
        const types = category === 'FROKOST' ? mealTypesFrokost : mealTypesDiverse;
        types.forEach(type => {
          orders.value[category][day][type.key] = 0;
        });
      });
    });
  }
  initOrders();
  
  const nextWeek = () => {
    if (currentWeek.value === 52) {
      currentWeek.value = 1;
      currentYear.value += 1;
    } else {
      currentWeek.value++;
    }
    initOrders();
  };
  
  const prevWeek = () => {
    if (currentWeek.value === 1) {
      currentWeek.value = 52;
      currentYear.value -= 1;
    } else {
      currentWeek.value--;
    }
    initOrders();
  };
  
  const success = ref('');
  const error = ref('');
  
  const submitOrder = async () => {
    success.value = '';
    error.value = '';
    try {
      await addDoc(collection(db, 'ordre'), {
        userId: user.value.uid,
        customerName: displayName.value,
        week: currentWeek.value,
        year: currentYear.value,
        data: orders.value
      });
      success.value = 'Bestilling gemt!';
    } catch (err) {
      console.error(err);
      error.value = 'Noget gik galt. Prøv igen.';
    }
  };
  </script>
  
  
  <style scoped>
  .page-header {
    text-align: center;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
  .page-header h2 {
    font-size: 1.25rem;
    text-transform: uppercase;
    font-weight: 700;
  }
  
  .bestilling-container {
    max-width: 800px;
    margin: 0 auto 2rem auto;
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
  }
  
  .week-switcher {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    background-color: #f3f3f3;
    border-radius: 20px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 0.5rem 1.5rem;
    width: 25%;
    margin: 0 auto 1.5rem auto;
  }
  
  .arrow-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #1f3b4d;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }
  
  .arrow-btn:hover {
    color: #1f3b4d;
    background-color: transparent;
  }
  
  .week-text {
    font-weight: 600;
    font-size: 1.1rem;
    text-align: center;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
  }
  
  th, td {
    padding: 0.5rem;
    text-align: center;
  }
  
  th:first-child,
  td:first-child {
    text-align: left;
    font-weight: 500;
  }
  
  th:first-child {
    text-align: left;
    font-weight: 700;
    font-size: 1rem;
  }
  
  .order-input {
    width: 60px;
    padding: 0.3rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    background-color: #BC4D4D;
    color: white;
    padding: 0.75rem 2rem;
    border: none;
    cursor: pointer;
    font-weight: 600;
    display: block;
    font-size: 1rem;
    border-radius: 6px;
  }
  
  button:hover {
    background-color: #a13737;
  }

  .bestil{
    margin: 1rem auto;
    width: 50%;
    text-align: center;
  }
  
  .success {
    color: green;
    margin-top: 1rem;
    text-align: center;
  }
  
  .error {
    color: red;
    margin-top: 1rem;
    text-align: center;
  }

  .tab-switcher {
  display: flex;
  justify-content: center;
  margin: 1.5rem auto;
  background-color: #f3f3f3;
  border-radius: 20px;
  overflow: hidden;
  width: fit-content;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tab-switcher button {
  padding: 0.6rem 2rem;
  border: none;
  background-color: transparent;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s;
  color: #1f1f1f;
}

.tab-switcher button.active {
  background-color: #bc4d4d;
  color: white;
}
  </style>