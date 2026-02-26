<template>
  <div class="civil-order-form">
    <h1 class="text-xl font-bold">G-D! GOODS</h1>
    <h1 class="text-xl font-bold mb-4">♦ ORDER ♦</h1>

    <div class="overflow-x-auto">
      <table class="text-sm">
        <thead>
          <tr>
            <th class="px-6 py-2 hidden md:table-cell">GOODS</th>
            <th class="px-6 py-2">MEMBER</th>
            <th class="px-6 py-2">AMOUNT</th>
            <th class="px-6 py-2">SUMMARY</th>
            <th class="px-6 py-2 desktop-only">MANAGE</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in orders" :key="index">
            <!-- Goods -->
            <td class="px-2 py-2 block md:table-cell" data-label="goods">
              <select v-model="item.product" @change="onProductChange(item, $event)" class="w-full rounded px-2 py-1">
                <option disabled value="">- SELECT GOODS -</option>
                <option v-for="product in products" :key="product.name" :value="product.name">
                  {{ product.name }}
                </option>
              </select>
            </td>

            <!-- Member -->
            <td class="px-2 py-2" data-label="Member" :class="{ 'mobile-hidden': requiresMemberCount(item.product) === 0 }">
              <template v-if="requiresMemberCount(item.product) > 0">
                <select v-model="item.member1" @change="(e) => e.target.blur()" class="w-full rounded px-2 py-1 text-center">
                  <option disabled value="">- MEMBER -</option>
                  <option v-for="member in getMemberList(item.product)" :key="member.id" :value="member.name">
                    {{ member.name }}
                  </option>
                </select>
              </template>
              <template v-else>
                <span class="text-gray-400 desktop-only">-</span>
              </template>
            </td>

            <!-- Amount -->
            <td data-label="amount">
              <div class="flex items-center justify-center gap-1 px-2">
                <button type="button" class="amount-button" @click="if (item.quantity > 1) item.quantity--;">-</button>
                <input type="number" min="1" v-model.number="item.quantity" class="w-16 text-center" />
                <button type="button" class="amount-button" @click="item.quantity++">+</button>
              </div>
            </td>

            <!-- Summary -->
            <td class="px-2 py-2 text-right block md:table-cell" data-label="Summary">
              {{ formatPrice(getTotalPrice(item)) }}
            </td>

            <!-- Delete -->
            <td class="delete-cell px-2 py-2 text-center block md:table-cell relative">
              <button @click="removeOrder(index)" class="delete-btn" aria-label="Remove item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>

        <tfoot>
          <tr class="py-3">
            <td colspan="4" class="text-center font-bold py-3 pr-2 text-base">SUMMARY</td>
            <td colspan="2" class="grand-total">{{ formatPrice(grandTotal) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="group-button">
      <button @click="addOrder" class="btn-click">+ ADD GOODS</button>
    </div>

    <div class="divider"></div>

    <h1 class="text-xl font-bold">♦ SUMMARY ♦</h1>
    <SummarySection :orders="orders" />

    <div class="div-a">
      <a href="https://www.facebook.com/share/p/1Awr7bB2A9/" target="_blank" class="text-sm font-bold flex items-center gap-1">
        Official Goods Sample
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, nextTick } from "vue";
import SummarySection from "./SummarySection.vue";

// ── Constants ──────────────────────────────────────────────
const APP_VERSION = "1.0.6";
const STORAGE_KEY_ORDERS = "orders";
const STORAGE_KEY_VERSION = "app_version";

const DEFAULT_ORDER = () => ({ product: "", member1: "", quantity: 1, price: 0, goodsType: "", memberCount: 0 });

// ── Data ───────────────────────────────────────────────────
const products = [
  { name: "G-D! PHOTOSET", price: 250, memberCount: 0, memberType: "members", goodsType: "goods" },
  { name: "G-D! MEMBER POSTER", price: 350, memberCount: 1, memberType: "members", goodsType: "goods" },
  { name: "G-D! GROUP POSTER", price: 500, memberCount: 0, memberType: "members", goodsType: "goods" },
  { name: "G-D! T-SHIRT", price: 590, memberCount: 0, memberType: "members", goodsType: "goods" },
  { name: "G-D! COIN", price: 50, memberCount: 0, memberType: "members", goodsType: "gdcoin" },
  { name: "MINI SNAP", price: 300, memberCount: 1, memberType: "members", goodsType: "snap" },
  { name: "SNAP", price: 400, memberCount: 1, memberType: "members", goodsType: "snap" },
];

const members = [
  { id: 1, name: "AIRI" },
  { id: 2, name: "BEAM" },
  { id: 5, name: "PUNNHYAZ" },
  { id: 6, name: "SMILD" },
  { id: 7, name: "SUMMER" },
];

const watashi = [
  { id: 1, name: "Chelsea" },
  { id: 2, name: "Summer" },
  { id: 3, name: "Beam" },
  { id: 4, name: "View" },
  { id: 5, name: "Punnhyaz" },
  { id: 6, name: "Smild" },
  { id: 7, name: "Kana" },
  { id: 8, name: "Milin" },
  { id: 9, name: "Mobile" },
  { id: 10, name: "Nata" },
];

// ── State ──────────────────────────────────────────────────
const orders = ref([DEFAULT_ORDER()]);

// ── Lifecycle ──────────────────────────────────────────────
onMounted(() => {
  const savedVersion = localStorage.getItem(STORAGE_KEY_VERSION);
  if (savedVersion && savedVersion !== APP_VERSION) {
    localStorage.removeItem(STORAGE_KEY_ORDERS);
  }
  localStorage.setItem(STORAGE_KEY_VERSION, APP_VERSION);

  const savedOrders = localStorage.getItem(STORAGE_KEY_ORDERS);
  if (savedOrders) {
    orders.value = JSON.parse(savedOrders);
  }
});

watch(
  orders,
  (val) => {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(val));
  },
  { deep: true }
);

// ── Computed ───────────────────────────────────────────────
const grandTotal = computed(() => orders.value.reduce((sum, item) => sum + getTotalPrice(item), 0));

// ── Helpers ────────────────────────────────────────────────
function findProduct(productName) {
  return products.find((p) => p.name === productName);
}

function requiresMemberCount(productName) {
  return findProduct(productName)?.memberCount ?? 0;
}

function getMemberList(productName) {
  const product = findProduct(productName);
  return product?.memberType === "watashi" ? watashi : members;
}

function getUnitPrice(productName) {
  return findProduct(productName)?.price ?? 0;
}

function getTotalPrice(item) {
  return getUnitPrice(item.product) * (item.quantity || 0);
}

function formatPrice(price) {
  return `${price.toLocaleString()} ฿`;
}

// ── Order Actions ──────────────────────────────────────────
function addOrder() {
  orders.value.push(DEFAULT_ORDER());
}

function removeOrder(index) {
  orders.value.splice(index, 1);
}

function onProductChange(item, event) {
  nextTick(() => event.target.blur());

  const selected = findProduct(item.product);
  if (selected) {
    item.price = selected.price;
    item.goodsType = selected.goodsType;
    item.memberCount = selected.memberCount;
    item.member1 = "";
  } else {
    item.price = 0;
    item.goodsType = "";
    item.memberCount = 0;
  }
}
</script>

<style scoped>
/* ── Layout ─────────────────────────────────────────────── */
.civil-order-form {
  width: 90%;
  max-width: 1200px;
  margin: auto;
  padding: 30px 0;
  background: #fff;
  border-radius: 20px;
}

table {
  width: 100%;
}

/* ── Colors ─────────────────────────────────────────────── */
h1 {
  color: #c00707;
  font-size: 28px;
}
th {
  color: #134e8e;
  background: #ffedd3;
  border: 1px solid #c00707;
  font-size: 16px;
}
td {
  color: #c00707;
  border: 1px solid #c00707;
  font-weight: 600;
}
tr {
  color: #fff;
  border: 1px solid #370079;
}

/* ── Components ─────────────────────────────────────────── */
.btn-click {
  color: #fff;
  background: #c00707;
  padding: 10px 20px;
  margin-right: 10px;
  font-weight: bold;
  border-radius: 5px;
  border: 2px solid #c00707;
  cursor: pointer;
}
.btn-click:hover {
  color: #ffffff;
  background: #c00707;
}

.group-button {
  margin: 20px 0 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.divider {
  background: #c00707;
  width: 100%;
  height: 1px;
  margin: 40px 0;
}

.div-a {
  display: flex;
  justify-content: center;
  color: #c00707;
  margin: 20px 0;
}

.amount-button {
  font-size: 20px;
}

.delete-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #c00707;
  fill: #c00707;
}
.delete-btn:hover {
  color: #8b0000;
}

/* ── Form Controls ──────────────────────────────────────── */
input {
  border: none;
  border-bottom: 1px solid #c00707;
  outline: none;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

select {
  background-image: url("data:image/svg+xml;utf8,<svg fill='%23C00707' height='30' viewBox='0 0 24 24' width='30' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 24px;
  padding-right: 10px;
}

select:focus {
  outline: none;
}

/* ── Responsive: Desktop ────────────────────────────────── */
.mobile-only {
  display: none;
}
.desktop-only {
  display: table-cell;
}

/* ── Responsive: Mobile ─────────────────────────────────── */
@media screen and (max-width: 768px) {
  .mobile-only {
    display: inline-block;
    width: 100%;
  }
  .desktop-only {
    display: none;
  }

  .civil-order-form {
    width: 100%;
    padding: 15px 0 0;
  }

  .group-button {
    margin: 0;
    flex-direction: column;
  }

  .btn-click {
    display: flex;
    justify-content: center;
    margin: 5px 30px;
  }

  table,
  thead,
  tbody,
  th,
  td,
  tfoot,
  tr {
    display: block;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }

  thead {
    display: none;
  }

  tr {
    margin-bottom: 1rem;
    border: 2px solid #c00707;
    border-radius: 10px;
    padding: 10px;
    background: #fff;
  }

  td {
    position: relative;
    padding: 10px 10px 10px 8rem;
    text-align: center;
    border: none;
    border-bottom: 1px solid #c00707;
  }
  td:last-child {
    border-bottom: none;
  }

  td::before {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 7rem;
    white-space: nowrap;
    content: attr(data-label);
    font-weight: bold;
    color: #000000;
    text-transform: uppercase;
  }

  td[data-label="goods"] {
    display: block !important;
    width: 100% !important;
    text-align: center;
    padding: 0.5rem 0;
  }
  td[data-label="goods"]::before {
    content: none !important;
  }
  td[data-label="goods"] select {
    width: 100%;
    text-align: center;
    text-align-last: center;
    padding: 0;
    margin: 0 auto;
    font-size: 16px;
    color: #c00707;
    appearance: none;
    -webkit-appearance: none;
    background-color: #fff;
  }

  td[data-label="Summary"],
  td[data-label="amount"] {
    border: none;
    color: #c00707;
  }

  td[data-label="Member"] {
    color: #c00707;
    padding-left: 0 !important;
    text-align: center;
  }
  td[data-label="Member"] select {
    width: 100%;
    text-align: end;
    text-align-last: end;
  }

  .mobile-hidden {
    display: none !important;
  }

  td.delete-cell {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    text-align: right;
  }
  td.delete-cell::before {
    content: none !important;
  }

  .grand-total {
    position: relative;
    padding: 10px;
    text-align: center;
    border: none;
    color: #c00707;
  }

  select {
    text-align: right;
    width: 100%;
    padding-right: 3rem;
    -webkit-appearance: none;
    appearance: none;
    background-color: transparent;
    border: none;
    font-size: 16px;
  }

  .delete-btn {
    position: absolute;
    bottom: 5px;
    right: 10px;
  }
}

@media screen and (max-width: 375px) {
  tr {
    width: 260px;
  }
}
</style>
