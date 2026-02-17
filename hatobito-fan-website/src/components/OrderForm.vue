<template>
  <div class="civil-order-form">
    <h1 class="text-xl font-bold">Watashi No Katachi</h1>
    <h1 class="text-xl font-bold mb-4">❄ Goods ❄</h1>

    <div class="overflow-x-auto">
      <table class="text-sm">
        <thead class="bg-sky-300">
          <tr>
            <!-- Goods column on mobile desktop -->
            <th class="px-6 py-2 hidden md:table-cell">Goods</th>
            <th class="px-6 py-2">Member</th>
            <th class="px-6 py-2">Amount</th>
            <th class="px-6 py-2">Summary</th>
            <th class="px-6 py-2 desktop-only">Manage</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in orders" :key="index" class="md:table-row">
            <!-- goods -->
            <td class="px-2 py-2 block md:table-cell" :data-label="'สินค้า'">
              <select v-model="item.product" @change="(e) => e.target.blur()" class="w-full rounded px-2 py-1">
                <option disabled value="">- Select Goods -</option>
                <option v-for="product in products" :key="product.name" :value="product.name">
                  {{ product.name }}
                </option>
              </select>
            </td>

            <!-- member on desktop -->
            <td class="desktop-only px-2 py-2" data-label="Member">
              <template v-if="requiresMemberCount(item.product) > 0">
                <select v-model="item.member1" @change="(e) => e.target.blur()" class="w-full rounded px-2 py-1 text-center">
                  <option disabled value="">- Select Member -</option>
                  <option v-for="member in getMemberList(item.product)" :key="member.id" :value="member.name">
                    {{ member.name }}
                  </option>
                </select>
              </template>
              <template v-else>
                <span class="text-gray-400">-</span>
              </template>
            </td>

            <!-- member on mobile -->
            <td v-if="requiresMemberCount(item.product) > 0" class="mobile-only" data-label="Member">
              <select v-model="item.member1" @change="(e) => e.target.blur()" class="w-full rounded">
                <option disabled value="">- Select Member -</option>
                <option v-for="member in getMemberList(item.product)" :key="member.id" :value="member.name">
                  {{ member.name }}
                </option>
              </select>
            </td>

            <!-- amount -->
            <td :data-label="'amount'">
              <div class="flex items-center justify-center gap-1 px-2">
                <button type="button" @click="if (item.quantity > 1) item.quantity--;">-</button>
                <input type="number" min="1" v-model.number="item.quantity" class="w-16 text-center" />
                <button type="button" @click="item.quantity++">+</button>
              </div>
            </td>

            <!-- summary -->
            <td class="px-2 py-2 text-right block md:table-cell" :data-label="'Summary'">
              {{ formatPrice(getTotalPrice(item)) }}
            </td>

            <!-- delete row -->
            <td class="delete-cell px-2 py-2 text-center block md:table-cell relative">
              <button class="desktop-only text-red-500 hover:text-red-700" @click="removeOrder(index)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="delete-icon-desktop" viewBox="0 0 16 16">
                  <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"
                  />
                </svg>
              </button>
              <button class="mobile-only delete-icon" @click="removeOrder(index)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
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
            <td colspan="4" class="text-right font-bold py-3 pr-2 text-base">Summary</td>
            <td colspan="2" class="grand-total">{{ formatPrice(getGrandTotal()) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="group-button">
      <button @click="addOrder" class="btn-click">+ เพิ่มรายการ</button>
      <button @click="showModalLuckyDraw = true" class="btn-click">Point และ Lucky Draw</button>
    </div>

    <div class="div-a">
      <a href="https://www.facebook.com/share/p/17sejQ4Jzr/" target="_blank" class="text-sm font-bold flex items-center gap-1">
        Official Goods Sample<svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-square-arrow-out-up-right-icon lucide-square-arrow-out-up-right"
        >
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>
    <LuckydrawModal :show="showModalLuckyDraw" :grand-total="grandTotal" @close="showModalLuckyDraw = false" />
    <!-- <OrderSummaryModal :show="showSummaryModal" :orders="orders" @close="closeSummary" /> -->
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { computed } from "vue";
import LuckydrawModal from "./LuckydrawModal.vue";

const showModalLuckyDraw = ref(false);
const showSummaryModal = ref(false);

// If version mismatch, clear localStorage
const APP_VERSION = "1.0.2";

const grandTotal = computed(() => {
  return orders.value.reduce((sum, item) => sum + getTotalPrice(item), 0);
});

const pointTotal = computed(() => {
  return orders.value.reduce((sum, item) => sum + getTotalPrice(item), 0);
});

const orders = ref([{ product: "", member1: "", quantity: 1 }]);

onMounted(() => {
  const savedVersion = localStorage.getItem("app_version");

  if (savedVersion !== APP_VERSION) {
    // If version mismatch, clear localStorage
    localStorage.clear();

    localStorage.setItem("app_version", APP_VERSION);
  }

  const savedOrders = localStorage.getItem("orders");
  if (savedOrders) {
    orders.value = JSON.parse(savedOrders);
  }
});

watch(
  orders,
  (newOrders) => {
    localStorage.setItem("orders", JSON.stringify(newOrders));
  },
  { deep: true }
);

const products = [
  { name: "Costume Keychain", price: 250, memberCount: 0, memberType: "members" },
  { name: "Photoset", price: 250, memberCount: 0, memberType: "members" },
  { name: "Badge", price: 150, memberCount: 1, memberType: "watashi" },
  { name: "Member Standy Acrylic", price: 350, memberCount: 1, memberType: "watashi" },
  { name: "Member Poster", price: 350, memberCount: 1, memberType: "watashi" },
  { name: "Group Poster", price: 500, memberCount: 0, memberType: "members" },
  { name: "T-Shirt", price: 690, memberCount: 0, memberType: "members" },
  { name: "T-Shirt Special Edition", price: 690, memberCount: 0, memberType: "members" },
  { name: "HatoBito Photo Card Collection Vol.3", price: 200, memberCount: 0, memberType: "members" },
  { name: "Mini Snap", price: 300, memberCount: 1, memberType: "members" },
  { name: "Snap", price: 400, memberCount: 1, memberType: "members" },
];

const members = [
  { id: 1, name: "Airi" },
  { id: 2, name: "Beam" },
  { id: 3, name: "Music" },
  { id: 4, name: "Pear" },
  { id: 5, name: "Punnhyaz" },
  { id: 6, name: "Smild" },
  { id: 7, name: "Summer" },
  { id: 8, name: "View" },
  { id: 9, name: "Gorya" },
  { id: 10, name: "Kana" },
  { id: 11, name: "Chelsea" },
  { id: 12, name: "Donut" },
  { id: 13, name: "Elleelle" },
  { id: 14, name: "Milin" },
  { id: 15, name: "Nata" },
  { id: 16, name: "Mobile" },
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

function addOrder() {
  orders.value.push({ product: "", member1: "", quantity: 1 });
}

function removeOrder(index) {
  orders.value.splice(index, 1);
}

function requiresMemberCount(productName) {
  const product = products.find((p) => p.name === productName);
  return product?.memberCount || 0;
}

function getUnitPrice(productName) {
  const product = products.find((p) => p.name === productName);
  return product?.price || 0;
}

function getTotalPrice(item) {
  return getUnitPrice(item.product) * (item.quantity || 0);
}

function formatPrice(price) {
  return `${price.toLocaleString()} ฿`;
}

// select member list from product
function getMemberList(productName) {
  const product = products.find((p) => p.name === productName);
  if (!product) return [];
  if (product.memberType === "watashi") return watashi;
  return members;
}

function getGrandTotal() {
  return orders.value.reduce((sum, item) => sum + getTotalPrice(item), 0);
}
</script>

<style scoped>
table {
  width: 100%;
}
.civil-order-form {
  width: 90%;
  max-width: 1200px;
  margin: auto;
  padding: 30px 0px;
  background: rgba(255, 255, 255);
  border-radius: 20px;
}

td {
  color: #70c0d8;
  border: #70c0d8 1px solid;
  font-weight: 600;
}

tr {
  color: #ffffff;
  border: #370079 1px solid;
}

th {
  color: #70c0d8;
  background: #e7f8ff;
  border: #70c0d8 1px solid;
  font-size: 16px;
}

h1 {
  color: #70c0d8;
  font-size: 28px;
}

.div-a {
  display: flex;
  justify-content: center;
  color: #70c0d8;
  margin-top: 20px;
}

.btn-click {
  color: #ffffff;
  background: #70c0d8;
  padding: 10px 20px;
  margin-right: 10px;
  font-weight: bold;
  border-radius: 5px;
  border: #70c0d8 2px solid;
}

.btn-click:hover {
  color: #70c0d8;
  background: #ffffff;
}

input {
  border: none;
  border-bottom: 1px solid #b1d4e0;
  outline: none;
}

.group-button {
  margin: 20px 0px 10px 0px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.mobile-only {
  display: none;
}

/* delete icon on mobile dektop */
.delete-icon {
  position: absolute;
  bottom: 5px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #d87070;
}

.delete-icon-desktop {
  width: 18px;
  height: 18px;
  fill: #d87070;
  cursor: pointer;
}

/* Desktop by default */
.mobile-only {
  display: none;
}
.desktop-only {
  display: table-cell;
}

select {
  background-image: url("data:image/svg+xml;utf8,<svg fill='%2370c0d8' height='30' viewBox='0 0 24 24' width='30' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 24px;
  padding-right: 30px;
}

/* Mobile */
@media screen and (max-width: 768px) {
  .mobile-only {
    display: table-cell;
    padding: 6px;
  }
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: inline-block;
    width: 100%;
  }

  .delete-icon {
    width: 16px;
    height: 16px;
    bottom: 18px;
    fill: #d87070;
    cursor: pointer;
  }

  td[data-label="สินค้า"] {
    display: block !important;
    width: 100% !important;
    text-align: center;
    padding: 0.5rem 0;
  }

  td[data-label="สินค้า"]::before {
    text-align: center;
    content: none !important;
  }

  td[data-label="สินค้า"] select {
    width: 100%;
    text-align: center;
    text-align-last: center; /* สำคัญมากบน iOS */
    padding: 0;
    margin: 0 auto;
    font-size: 16px;
    color: #70c0d8;

    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    background-color: #fff;
  }

  td[data-label="Summary"] {
    border: none;
    color: #70c0d8;
  }

  td[data-label="amount"] {
    border: none;
    color: #70c0d8;
  }

  td[data-label="Member"] {
    color: #70c0d8;
    padding-left: 0 !important;
    text-align: center;
  }

  td[data-label="Member"] select {
    width: 100%;
    padding-right: 2rem;
    text-align: end;
    text-align-last: end; /* for iOS */
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
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
    border: none;
    color: #70c0d8;
  }

  input {
    border: none;
    border-bottom: 1px solid #70c0d8;
    outline: none;
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
    border: 2px solid #70c0d8;
    border-radius: 10px;
    padding: 10px;
    background-color: #ffffff;
    width: 100%;
  }

  td {
    position: relative;
    padding-left: 8rem;
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
    border: none;
    border-bottom: 1px solid #70c0d8;
  }

  td::before {
    position: absolute;
    top: 10px;
    left: 10px;
    padding-right: 10px;
    white-space: nowrap;
    content: attr(data-label);
    font-weight: bold;
    color: #99daee;
    text-transform: uppercase;
    width: 7rem;
  }

  td:last-child {
    border-bottom: none;
  }

  .civil-order-form {
    margin: auto;
    width: 100%;
    padding: 15px 0px 0px 0px;
  }

  .btn-click {
    display: flex;
    justify-content: center;
    margin: 5px 30px 5px 30px;
  }

  .group-button {
    margin: 0px 0px 0px 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
}

@media screen and (max-width: 375px) {
  tr {
    width: 260px;
  }

  .delete-icon {
    width: 14px;
    height: 14px;
    bottom: 20px;
  }

  .card-container {
    padding: 10px;
  }
}
</style>
