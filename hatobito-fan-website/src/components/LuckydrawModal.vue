<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="modal-close" @click="close">✖</button>
      <h2 class="modal-title">Lucky Draw Calculation</h2>

      <table class="draw-table">
        <thead>
          <tr>
            <th>Lucky Draw From</th>
            <th>จำนวนบัตรเข้างาน</th>
            <th>จำนวน Lucky Draw</th>
          </tr>
        </thead>
        <tbody>
          <!-- Row 1 -->
          <tr>
            <td>
              <select v-model="selectedTicket" @change="(e) => e.target.blur()">
                <option disabled value="">- เลือกรายการบัตร -</option>
                <option v-for="ticket in tickets" :key="ticket.name" :value="ticket.name">
                  {{ ticket.name }}
                </option>
              </select>
            </td>
            <td>
              <input type="number" min="1" v-model.number="ticketCount" />
            </td>
            <td>{{ luckyDrawFromTicket }}</td>
          </tr>

          <!-- Row 2 -->
          <tr>
            <td>ยอดรวม {{ formatPrice(grandTotal) }}</td>
            <td>-</td>
            <td>{{ luckyDrawFromTotal }}</td>
          </tr>
        </tbody>
      </table>

      <h2 class="total">รวมทั้งหมด: {{ totalLuckyDraw }} Lucky Draw</h2>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref } from "vue";
import { watch, onMounted } from "vue";

const tickets = [
  { name: "Normal Ticket", luckyPerTicket: 0 },
  { name: "Koiiro Ticket", luckyPerTicket: 2 },
  { name: "S Ticket", luckyPerTicket: 3 },
  { name: "SS Ticket", luckyPerTicket: 5 },
];

const selectedTicket = ref("");
const ticketCount = ref(0);

const selectedTicketObj = computed(() => tickets.find((t) => t.name === selectedTicket.value));

watch(
  [selectedTicketObj, ticketCount],
  ([ticket, count]) => {
    if (ticket) {
      localStorage.setItem(
        "luckyDrawTicket",
        JSON.stringify({
          ticketName: ticket.name,
          ticketCount: count,
        })
      );
    }
  },
  { immediate: true }
);

onMounted(() => {
  const saved = localStorage.getItem("luckyDrawTicket");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      selectedTicket.value = parsed.ticketName || "";
      ticketCount.value = parsed.ticketCount || 0;
    } catch (e) {
      console.error("❌ ไม่สามารถแปลง JSON จาก localStorage ได้:", e);
    }
  }
});

const props = defineProps({
  show: Boolean,
  grandTotal: Number, // from OrderKoiiro.vue
});

const emit = defineEmits(["close"]);

function close() {
  emit("close");
}

const luckyDrawFromTicket = computed(() => {
  const ticket = tickets.find((t) => t.name === selectedTicket.value);
  return ticket ? ticket.luckyPerTicket * ticketCount.value : 0;
});

const luckyDrawFromTotal = computed(() => {
  return Math.floor((props.grandTotal || 0) / 600);
});

const totalLuckyDraw = computed(() => {
  return luckyDrawFromTicket.value + luckyDrawFromTotal.value;
});

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
  padding: 0.5rem;
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

input {
  text-align: center;
  border: none;
  border-bottom: 1px solid #098ba2;
  outline: none;
}

input:focus {
  border-bottom: 2px solid #005261;
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
    min-width: 300px;
    max-width: 90%;
  }
}
</style>
