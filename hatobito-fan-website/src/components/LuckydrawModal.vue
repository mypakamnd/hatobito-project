<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content flex flex-col md:flex-row gap-4">
      <!-- Lucky Draw Card -->
      <div class="bg-white p-6 flex-1">
        <h2 class="text-2xl font-bold text-center mb-6">❄ LUCKY DRAW ❄</h2>

        <!-- Select Ticket -->
        <div class="mb-4">
          <label class="block font-semibold mb-2"> เลือกบัตรเข้างาน </label>

          <select class="w-full rounded-xl px-4 py-3 bg-gray-50 font-semibold appearance-none" v-model="selectedTicket" @change="(e) => e.target.blur()">
            <option disabled value="">- เลือกรายการบัตร -</option>
            <option v-for="ticket in tickets" :key="ticket.name" :value="ticket.name">
              {{ ticket.name }}
            </option>
          </select>
        </div>

        <!-- Amount -->
        <div class="mb-4">
          <label class="block font-semibold mb-2"> จำนวนบัตร </label>
          <input class="w-full rounded-xl px-4 py-3 bg-gray-50 font-semibold" type="number" min="1" v-model.number="ticketCount" />
        </div>

        <!-- Result Box -->
        <div class="result-box rounded-xl text-center py-5">
          <p class="text-sm opacity-90 font-semibold">ผลลัพธ์ Lucky Draw ที่ได้รับ</p>
          <p class="text-4xl font-bold">{{ totalLuckyDraw }}</p>
        </div>
        <div class="tooltip rounded-xl text-center py-5 mt-4">
          <p class="tooltip-p">ⓘ Goods {{ formatPrice(grandTotal) }} / 600 = {{ luckyDrawFromTotal }} Lucky Draw</p>
          <p class="tooltip-p">{{ selectedTicket }} x {{ ticketCount }} = {{ luckyDrawFromTicket }} Lucky Draw</p>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Point card -->
      <div class="bg-white p-6 space-y-6 flex-1">
        <h2 class="text-2xl font-bold text-red-600 text-center mb-6">❄ POINT ❄</h2>

        <!-- Total -->
        <div class="mb-4">
          <label class="block font-semibold mb-2"> ยอดรวม </label>
          <div class="grand-total rounded-xl px-4 py-3 bg-gray-50 font-semibold">{{ formatPrice(grandTotal) }}</div>
        </div>

        <!-- Payment Method -->
        <div class="mb-4">
          <label class="block font-semibold mb-2"> รูปแบบการชำระเงิน </label>
          <select class="w-full rounded-xl px-4 py-3 bg-gray-50 font-semibold appearance-none" v-model="selectedPayment" @change="(e) => e.target.blur()">
            <option disabled value="">- เลือกรูปแบบการชำระเงิน -</option>
            <option v-for="pay in paymentTypes" :key="pay.name" :value="pay.name">
              {{ pay.name }}
            </option>
          </select>
        </div>

        <!-- Result Box -->
        <div class="result-box rounded-xl text-center py-5 mb-0">
          <p class="text-sm opacity-90 font-semibold">จำนวน Point ที่ได้รับ</p>
          <p class="text-4xl font-bold">{{ luckyDrawFromPayment }}</p>
        </div>
        <div class="tooltip rounded-xl text-center py-5 px-5 mt-4">
          <p class="tooltip-p">ⓘ Goods {{ formatPrice(grandTotal) }} / 600 = {{ baseLuckyDraw }} point</p>
          <p class="tooltip-p">ทุกการชำระด้วย{{ selectedPayment }} = {{ luckyDrawFromPayment }} point</p>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Postcard -->
      <div class="bg-white p-6 space-y-6 flex-1">
        <h2 class="text-2xl font-bold text-red-600 text-center mb-6">❄ POSTCARD ❄</h2>

        <!-- Total -->
        <div class="mb-4">
          <label class="block font-semibold mb-2"> ยอดรวม </label>
          <div class="grand-total rounded-xl px-4 py-3 bg-gray-50 font-semibold">{{ formatPrice(grandTotal) }}</div>
        </div>

        <!-- Result Box -->
        <div class="result-box rounded-xl text-center py-5 mb-0">
          <p class="text-sm opacity-90 font-semibold">จำนวน Postcard ที่ได้รับ</p>
          <p class="text-4xl font-bold">{{ postcardCal }}</p>
        </div>
        <div class="tooltip rounded-xl text-center py-5 px-5 mt-4">
          <p class="tooltip-p">ⓘ ทุก ๆ การซื้อ 1,000 บาทขึ้นไป สุ่มรับ Postcard 1 ใบ (มีเมมเบอร์ละ 1 แบบ / แบบกลุ่ม 1 แบบ รวมทั้งหมด 10 แบบ)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref } from "vue";
import { watch, onMounted } from "vue";

// payment type
const paymentTypes = [
  { name: "เงินสด x 3", multiplier: 3 },
  { name: "QR Code x 1", multiplier: 1 },
  { name: "บัตรเครดิต x 1", multiplier: 1 },
];

const selectedPayment = ref("");

// If version mismatch, clear localStorage
const APP_VERSION = "1.0.2";

// load localStorage on mounted
onMounted(() => {
  const savedVersion = localStorage.getItem("app_version");

  if (savedVersion !== APP_VERSION) {
    // If version mismatch, clear localStorage
    localStorage.clear();

    localStorage.setItem("app_version", APP_VERSION);
  }

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

const baseLuckyDraw = computed(() => {
  return Math.floor((props.grandTotal || 0) / 600);
});

const postcardCal = computed(() => {
  return Math.floor((props.grandTotal || 0) / 1000);
});

// calculate total price format
function formatPrice(price) {
  return `${price.toLocaleString()} บาท`;
}

const tickets = [
  { name: "NORMAL TICKET (+ 0)", luckyPerTicket: 0 },
  { name: "WINTER TICKET (+ 2)", luckyPerTicket: 2 },
  { name: "S TICKET (+ 3)", luckyPerTicket: 3 },
  { name: "SS TICKET (+ 5)", luckyPerTicket: 5 },
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
      console.error("load local storage failed.", e);
    }
  }
});

const props = defineProps({
  show: Boolean,
  grandTotal: Number, // from OrderKoiiro.vue
  grandTotal: Number,
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
  gap: 8px;
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  width: 80%;
  max-height: 70vh;
  overflow-y: auto;
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
  background-image: url("data:image/svg+xml;utf8,<svg fill='%2370c0d8' height='30' viewBox='0 0 24 24' width='30' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 24px;
  padding-right: 30px;
}

input,
select {
  text-align: center;
  color: #70c0d8;
  background-color: #f8fdff;
  border: #70c0d8 1px solid;
  appearance: auto;
  -webkit-appearance: none;
  -moz-appearance: none;
  text-align-last: center; /* สำคัญมากบน iOS */
}

h2 {
  color: #70c0d8;
}

label {
  color: #1399c2;
}

.grand-total {
  color: #70c0d8;
  background-color: #f8fdff;
  border: #70c0d8 1px solid;
}
.result-box {
  color: #ffffff;
  background: #70c0d8;
  background: linear-gradient(90deg, rgba(112, 192, 216, 1) 0%, rgba(140, 230, 255, 1) 100%, rgba(112, 224, 255, 1) 50%);
}

.tooltip {
  background: #ebf9ff;
  /* border: #1399c2 1px solid; */
}

.tooltip-p {
  color: #70c0d8;
  font-weight: 400;
  font-size: 14px;
}

.divider {
  width: 1px;
  background: #70c0d8;
  margin: 0 20px;
  flex-shrink: 0;
}

@media (max-width: 767px) {
  .modal-content {
    flex-direction: column;
    padding: 1rem;
    min-width: 95%;
    max-width: 90%;
  }

  .draw-table th,
  .draw-table td {
    padding: 8px 8px;
    text-align: center;
  }

  .divider {
    width: 100%;
    height: 1px;
    margin: 20px 0;
    flex-shrink: 0;
  }

  .tooltip-p {
    font-size: 12px;
  }
}
</style>
