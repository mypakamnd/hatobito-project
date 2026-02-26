<template>
  <div class="container">
    <!-- Tier Selector -->
    <div class="my-4">
      <select v-model="selectedTier" class="tier-select w-full rounded px-3 py-2 border font-semibold">
        <option v-for="tier in tiers" :key="tier.name" :value="tier.name">{{ tier.name }} ( discount {{ tier.discount }}% )</option>
      </select>
    </div>

    <!-- Order Table -->
    <table>
      <thead>
        <tr>
          <th class="px-4 py-2">GOODS</th>
          <th class="px-4 py-2">AMOUNT</th>
          <th class="px-4 py-2">SUM</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in sortedOrders" :key="index">
          <td class="td-goods">
            {{ item.product }}
            <span v-if="item.memberCount > 0" class="member">( {{ item.member1 }} )</span>
          </td>
          <td>{{ formatPrice(item.quantity) }}</td>
          <td>{{ formatPrice(item.price * item.quantity) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2">Summary</td>
          <td>{{ formatPrice(total) }}</td>
        </tr>
      </tfoot>
    </table>

    <!-- Breakdown Table -->
    <table class="summary-table">
      <tbody>
        <tr class="tr-summary">
          <td class="td-left">MINI SNAP / SNAP TOTAL</td>
          <td class="td-right">{{ formatPrice(snapTotal) }}</td>
        </tr>
        <tr class="tr-summary">
          <td class="td-left">G-D! COIN TOTAL</td>
          <td class="td-right">{{ formatPrice(gdCoinTotal) }}</td>
        </tr>
        <tr class="tr-summary">
          <td class="td-left">GOODS TOTAL</td>
          <td class="td-right">{{ formatPrice(goodsTotal) }}</td>
        </tr>
        <tr class="tr-summary">
          <td class="td-left discount">Goods Discount</td>
          <td class="td-right discount">- {{ formatPrice(goodsDiscount) }}</td>
        </tr>
      </tbody>
    </table>

    <div class="dashed-divider"></div>

    <!-- Final Total -->
    <table class="summary-table">
      <tbody>
        <tr class="tr-summary">
          <td class="td-left">Final Total</td>
          <td class="td-right">{{ formatPrice(finalTotal) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Notice -->
    <div class="notice rounded-xl text-center py-5 px-5 mt-4">
      <p>ⓘ แจ้งพนักงานหากต้องการรับส่วนลด ส่วนลดจาก Tier ใช้ได้เฉพาะสินค้าประเภท Goods เท่านั้น SNAP และ G-D! Coin จะไม่ได้รับส่วนลด</p>
    </div>

    <!-- Actions -->
    <div class="group-button">
      <button @click="openWithoutTier" class="btn-primary">POINT / LUCKY DRAW</button>
    </div>

    <LuckydrawModal :show="showModalLuckyDraw" :grand-total="modalTotal" @close="showModalLuckyDraw = false" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import LuckydrawModal from "./LuckydrawModal.vue";

// ── Props ──────────────────────────────────────────────────
const props = defineProps({
  orders: Array,
});

// ── Constants ──────────────────────────────────────────────
const APP_VERSION = "1.0.6";
const STORAGE_KEY_TIER = "selectedTier";
const STORAGE_KEY_VERSION = "app_version";

const tiers = [
  { name: "Normal", discount: 0 },
  { name: "Silver", discount: 5 },
  { name: "Gold", discount: 5 },
  { name: "Platinum", discount: 10 },
];

const GOODS_TYPE_RANK = { goods: 1, gdcoin: 2 };
const SNAP_RANK = { SNAP: 3, "MINI SNAP": 4 };

// ── State ──────────────────────────────────────────────────
const selectedTier = ref("Normal");
const showModalLuckyDraw = ref(false);
const modalTotal = ref(0);

// ── Lifecycle ──────────────────────────────────────────────
onMounted(() => {
  const savedVersion = localStorage.getItem(STORAGE_KEY_VERSION);
  if (savedVersion !== APP_VERSION) {
    localStorage.removeItem(STORAGE_KEY_TIER);
    localStorage.setItem(STORAGE_KEY_VERSION, APP_VERSION);
  }

  const saved = localStorage.getItem(STORAGE_KEY_TIER);
  if (saved) selectedTier.value = saved;
});

watch(selectedTier, (val) => {
  localStorage.setItem(STORAGE_KEY_TIER, val);
});

// ── Helpers ────────────────────────────────────────────────
function sumByType(type) {
  return props.orders.reduce((sum, item) => (item.goodsType === type ? sum + item.price * item.quantity : sum), 0);
}

function getOrderRank(item) {
  if (item.goodsType === "snap") return SNAP_RANK[item.product] ?? 99;
  return GOODS_TYPE_RANK[item.goodsType] ?? 99;
}

function formatPrice(value) {
  return Number(value || 0).toLocaleString("en-US");
}

// ── Computed ───────────────────────────────────────────────
const selectedTierObj = computed(() => tiers.find((t) => t.name === selectedTier.value));

const total = computed(() => props.orders.reduce((sum, o) => sum + o.price * o.quantity, 0));
const goodsTotal = computed(() => sumByType("goods"));
const snapTotal = computed(() => sumByType("snap"));
const gdCoinTotal = computed(() => sumByType("gdcoin"));

const goodsDiscount = computed(() => goodsTotal.value * ((selectedTierObj.value?.discount || 0) / 100));
const finalTotal = computed(() => goodsTotal.value - goodsDiscount.value + snapTotal.value + gdCoinTotal.value);

const sortedOrders = computed(() => [...props.orders].sort((a, b) => getOrderRank(a) - getOrderRank(b)));

// ── Actions ────────────────────────────────────────────────
function openWithoutTier() {
  modalTotal.value = total.value;
  showModalLuckyDraw.value = true;
}
</script>

<style scoped>
/* ── Layout ──────────────────────────────────────────────── */
table {
  width: 100%;
  margin: 16px 0;
}
th {
  color: #000000;
  background: #ffefef;
  border: 1px solid #c00707;
  font-size: 14px;
  padding: 8px;
}
td {
  color: #c00707;
  border: 1px solid #c00707;
  font-weight: 600;
  font-size: 14px;
  padding: 8px;
}
tr {
  color: #fff;
  border: 1px solid #c00707;
}

/* ── Tier Select ─────────────────────────────────────────── */
.tier-select {
  color: #c00707;
  background-color: #ffefef;
  border: 1px solid #c00707;
  width: 30%;
  text-align: center;
  text-align-last: center;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='%23C00707' height='30' viewBox='0 0 24 24' width='30' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 24px;
  padding-right: 30px;
}

.tier-select:focus {
  outline: none;
}

/* ── Order Table ─────────────────────────────────────────── */
.td-goods {
  text-align: left;
  white-space: normal;
  word-break: break-word;
}
.member {
  white-space: nowrap;
  color: #000000;
}

/* ── Summary Table ───────────────────────────────────────── */
.summary-table td {
  border: none;
  font-size: 16px;
  padding: 2px;
}

.td-left {
  text-align: left;
  color: #000000;
}
.td-right {
  text-align: right;
  color: #000000;
}

.td-left.discount,
.td-right.discount {
  color: #c00707;
}

.tr-summary {
  border: none;
}

/* ── Divider ─────────────────────────────────────────────── */
.dashed-divider {
  height: 2px;
  background: repeating-linear-gradient(to right, #c00707 0px, #c00707 8px, transparent 8px, transparent 16px);
}

/* ── Notice ──────────────────────────────────────────────── */
.notice {
  background: #ffefef;
}
.notice p {
  color: #c00707;
  font-weight: 400;
  font-size: 14px;
}

/* ── Buttons ─────────────────────────────────────────────── */
.group-button {
  margin: 24px 30px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
}

.btn-primary {
  color: #fff;
  background: #c00707;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 5px;
  border: 2px solid #c00707;
  cursor: pointer;
}
.btn-primary:hover {
  color: #ffffff;
  background: #c00707;
}

/* ── Mobile ──────────────────────────────────────────────── */
@media screen and (max-width: 768px) {
  .group-button {
    flex-direction: column;
  }
  .tier-select {
    width: 100%;
  }
}
</style>
