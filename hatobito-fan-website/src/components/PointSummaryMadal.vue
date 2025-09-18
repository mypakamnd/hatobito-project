<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="modal-close" @click="close">✖</button>
      <h2 class="modal-title">Point Calculation</h2>

      <table class="draw-table">
        <thead>
          <tr>
            <th>Point Form</th>
            <th>รูปแบบการจ่ายเงิน</th>
            <th>จำนวน Point</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ยอดรวม {{ formatPrice(grandTotal) }}</td>
            <td>
              <select v-model="selectedPayment" @change="(e) => e.target.blur()">
                <option disabled value="">— Select type —</option>
                <option v-for="pay in paymentTypes" :key="pay.name" :value="pay.name">
                  {{ pay.name }}
                </option>
              </select>
            </td>
            <td>{{ luckyDrawFromPayment }}</td>
          </tr>
        </tbody>
      </table>

      <h2 class="total">รวมทั้งหมด: {{ luckyDrawFromPayment }} point</h2>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref, watch, onMounted } from "vue";

const props = defineProps({
  show: Boolean,
  grandTotal: Number,
});

const emit = defineEmits(["close"]);
function close() {
  emit("close");
}

// payment type
const paymentTypes = [
  { name: "เงินสด", multiplier: 3 },
  { name: "QR Code", multiplier: 1 },
  { name: "บัตรเครดิต", multiplier: 1 },
];

const selectedPayment = ref("");

// load localStorage on mounted
onMounted(() => {
  const saved = localStorage.getItem("selectedPayment");
  if (saved) {
    selectedPayment.value = saved;
  }
});

// save selected payment type to localStorage
watch(selectedPayment, (newVal) => {
  if (newVal) {
    localStorage.setItem("selectedPayment", newVal);
  }
});

// select payment type object
const selectedPaymentObj = computed(() => paymentTypes.find((p) => p.name === selectedPayment.value));

// point calculation
const luckyDrawFromPayment = computed(() => {
  const base = Math.floor((props.grandTotal || 0) / 600);
  return selectedPaymentObj.value ? base * selectedPaymentObj.value.multiplier : 0;
});

// calculate total price format
function formatPrice(price) {
  return `${price.toLocaleString()} ฿`;
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  min-width: 500px;
  max-width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  position: relative;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: red;
}

.modal-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.draw-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.draw-table th,
.draw-table td {
  padding: 8px 24px;
  text-align: center;
}

.draw-table select,
.draw-table input {
  width: 100%;
  padding: 4px;
}

.total {
  font-weight: bold;
  font-size: 1.2rem;
  text-align: right;
}

select {
  text-align: center;
}

td {
  color: #098ba2;
  border: #098ba2 1px solid;
  font-weight: 600;
}

tr {
  color: #098ba2;
  border: #098ba2 1px solid;
}

th {
  color: #098ba2;
  background-color: #e1faff;
  border: #098ba2 1px solid;
}

h2 {
  color: #098ba2;
}

@media screen and (max-width: 768px) {
  .modal-content {
    padding: 1rem;
    min-width: 95%;
    max-width: 90%;
  }

  .draw-table th,
  .draw-table td {
    padding: 8px 8px;
    text-align: center;
  }
}
</style>
