<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content flex flex-col md:flex-row gap-4">
      <!-- Lucky Draw Card -->
      <div class="bg-white p-6 flex-1">
        <h2 class="text-2xl font-bold text-center mb-6">♦ LUCKY DRAW ♦</h2>

        <div class="mb-4">
          <label class="block font-semibold mb-2">SELECT TICKET</label>
          <select v-model="selectedTicket" @change="(e) => e.target.blur()" class="w-full rounded-xl px-4 py-3 font-semibold">
            <option disabled value="">- SELECT TICKET -</option>
            <option v-for="ticket in tickets" :key="ticket.name" :value="ticket.name">
              {{ ticket.name }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block font-semibold mb-2">TICKET AMOUNT</label>
          <div class="input-amount w-full rounded-xl px-4 py-3 font-semibold">
            <button type="button" class="amount-button" @click="if (ticketCount > 1) ticketCount--;">-</button>
            <input type="number" min="1" v-model.number="ticketCount" />
            <button type="button" class="amount-button" @click="ticketCount++">+</button>
          </div>
        </div>

        <div class="result-box rounded-xl text-center py-5">
          <p class="text-sm opacity-90 font-semibold">LUCKY DRAW CALCULATE</p>
          <p class="text-4xl font-bold mt-2 mb-2">{{ totalLuckyDraw }}</p>
        </div>

        <div class="notice rounded-xl text-center py-5 mt-4">
          <p class="notice-p">ⓘ Goods {{ formatPrice(grandTotal) }} / 600 = {{ luckyDrawFromTotal }} Lucky Draw</p>
          <p class="notice-p">{{ selectedTicket }} x {{ ticketCount }} = {{ luckyDrawFromTicket }} Lucky Draw</p>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Point Card -->
      <div class="bg-white p-6 space-y-6 flex-1">
        <h2 class="text-2xl font-bold text-center mb-6">♦ POINT ♦</h2>

        <div class="mb-4">
          <label class="block font-semibold mb-2">ORDER TOTAL</label>
          <div class="display-box rounded-xl px-4 py-3 font-semibold">{{ formatPrice(grandTotal) }}</div>
        </div>

        <div class="mb-4">
          <label class="block font-semibold mb-2">PAYMENT TYPE</label>
          <select v-model="selectedPayment" @change="(e) => e.target.blur()" class="w-full rounded-xl px-4 py-3 font-semibold">
            <option disabled value="">- PAYMENT TYPE -</option>
            <option v-for="pay in paymentTypes" :key="pay.name" :value="pay.name">
              {{ pay.name }}
            </option>
          </select>
        </div>

        <div class="result-box rounded-xl text-center py-5">
          <p class="text-sm opacity-90 font-semibold">POINT CALCULATE</p>
          <p class="text-4xl font-bold mt-2 mb-2">{{ luckyDrawFromPayment }}</p>
        </div>

        <div class="notice rounded-xl text-center py-5 px-5 mt-4">
          <p class="notice-p">ⓘ Goods {{ formatPrice(grandTotal) }} / 600 = {{ baseLuckyDraw }} point</p>
          <p class="notice-p">ทุกการชำระด้วย{{ selectedPayment }} = {{ luckyDrawFromPayment }} point</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";

// ── Props & Emits ──────────────────────────────────────────
const props = defineProps({
  show: Boolean,
  grandTotal: { type: Number, default: 0 },
});

const emit = defineEmits(["close"]);
function close() {
  emit("close");
}

// ── Constants ──────────────────────────────────────────────
const APP_VERSION = "1.0.6";
const STORAGE_KEY_VERSION = "app_version";
const STORAGE_KEY_PAYMENT = "selectedPayment";
const STORAGE_KEY_TICKET = "luckyDrawTicket";

const tickets = [
  { name: "NORMAL TICKET (+ 0)", luckyPerTicket: 0 },
  { name: "GIRLS KNOW TICKET (+ 2)", luckyPerTicket: 2 },
  { name: "S TICKET (+ 3)", luckyPerTicket: 3 },
];

const paymentTypes = [
  { name: "เงินสด x 3", multiplier: 3 },
  { name: "QR Code x 1", multiplier: 1 },
  { name: "บัตรเครดิต x 1", multiplier: 1 },
];

// ── State ──────────────────────────────────────────────────
const selectedTicket = ref("");
const ticketCount = ref(0);
const selectedPayment = ref("");

// ── Lifecycle ──────────────────────────────────────────────
onMounted(() => {
  const savedVersion = localStorage.getItem(STORAGE_KEY_VERSION);
  if (savedVersion !== APP_VERSION) {
    localStorage.removeItem(STORAGE_KEY_PAYMENT);
    localStorage.removeItem(STORAGE_KEY_TICKET);
    localStorage.setItem(STORAGE_KEY_VERSION, APP_VERSION);
  }

  const savedPayment = localStorage.getItem(STORAGE_KEY_PAYMENT);
  if (savedPayment) selectedPayment.value = savedPayment;

  const savedTicket = localStorage.getItem(STORAGE_KEY_TICKET);
  if (savedTicket) {
    try {
      const parsed = JSON.parse(savedTicket);
      selectedTicket.value = parsed.ticketName || "";
      ticketCount.value = parsed.ticketCount || 0;
    } catch (e) {
      console.error("Failed to load luckyDrawTicket from localStorage:", e);
    }
  }
});

// ── Watchers ───────────────────────────────────────────────
watch(selectedPayment, (val) => {
  if (val) localStorage.setItem(STORAGE_KEY_PAYMENT, val);
});

watch(
  [() => tickets.find((t) => t.name === selectedTicket.value), ticketCount],
  ([ticket, count]) => {
    if (ticket) {
      localStorage.setItem(STORAGE_KEY_TICKET, JSON.stringify({ ticketName: ticket.name, ticketCount: count }));
    }
  },
  { immediate: true }
);

// ── Helpers ────────────────────────────────────────────────
function baseDrawCount() {
  return Math.floor((props.grandTotal || 0) / 600);
}

function formatPrice(price) {
  return `${price.toLocaleString()} บาท`;
}

// ── Computed ───────────────────────────────────────────────
const selectedPaymentObj = computed(() => paymentTypes.find((p) => p.name === selectedPayment.value));

const baseLuckyDraw = computed(() => baseDrawCount());
const luckyDrawFromTotal = computed(() => baseDrawCount());
const luckyDrawFromTicket = computed(() => {
  const ticket = tickets.find((t) => t.name === selectedTicket.value);
  return ticket ? ticket.luckyPerTicket * ticketCount.value : 0;
});
const luckyDrawFromPayment = computed(() => {
  return selectedPaymentObj.value ? baseLuckyDraw.value * selectedPaymentObj.value.multiplier : 0;
});
const totalLuckyDraw = computed(() => luckyDrawFromTicket.value + luckyDrawFromTotal.value);
</script>

<style scoped>
/* ── Modal ───────────────────────────────────────────────── */
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
  border-radius: 16px;
  padding: 1.5rem;
  width: 80%;
  max-height: 70vh;
  overflow-y: auto;
}

/* ── Typography ──────────────────────────────────────────── */
h2 {
  color: #c00707;
}
label {
  color: #000000;
}

/* ── Form Controls ───────────────────────────────────────── */
select {
  color: #c00707;
  background-color: #ffefef;
  border: 1px solid #c00707;
  text-align: center;
  text-align-last: center;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='%23c00707' height='30' viewBox='0 0 24 24' width='30' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 24px;
  padding-right: 30px;
}

select:focus {
  outline: none;
}

.input-amount {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #c00707;
  background-color: #ffefef;
  border: 1px solid #c00707;
  text-align: center;
}

input[type="number"] {
  width: 60px;
  text-align: center;
  border: none;
  outline: none;
  background: transparent;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.amount-button {
  font-size: 20px;
}

/* ── Boxes ───────────────────────────────────────────────── */
.display-box {
  color: #c00707;
  background-color: #ffefef;
  border: 1px solid #c00707;
}

.result-box {
  color: #fff;
  background: #c00707;
  background: linear-gradient(90deg, rgba(192, 7, 7, 1) 40%, rgba(0, 0, 0, 1) 100%);
}

.notice {
  background: #ffefef;
}
.notice-p {
  color: #c00707;
  font-weight: 400;
  font-size: 14px;
}

/* ── Divider ─────────────────────────────────────────────── */
.divider {
  width: 1px;
  background: #c00707;
  margin: 0 20px;
  flex-shrink: 0;
}

/* ── Mobile ──────────────────────────────────────────────── */
@media (max-width: 767px) {
  .modal-content {
    flex-direction: column;
    padding: 1rem;
    min-width: 95%;
    max-width: 90%;
  }
  .divider {
    width: 100%;
    height: 1px;
    margin: 20px 0;
  }
  .notice-p {
    font-size: 12px;
  }
}
</style>
