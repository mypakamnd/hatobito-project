<template>
  <div class="civil-order-form">
    <h1 class="text-xl font-bold mb-4">HatoBito Civil War Goods</h1>

    <div class="overflow-x-auto">
      <table class="w-full min-w-max text-sm">
        <thead class="bg-sky-300">
          <tr>
            <!-- Goods column on mobile desktop -->
            <th class="px-4 py-2 hidden md:table-cell">Goods</th>
            <th class="px-4 py-2">Member</th>
            <th class="px-4 py-2">Amount</th>
            <th class="px-4 py-2">Summary</th>
            <th class="px-4 py-2 desktop-only">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in orders" :key="index" class="md:table-row">
            <!-- goods -->
            <td class="px-2 py-2 block md:table-cell" :data-label="'สินค้า'">
              <select v-model="item.product" @change="(e) => e.target.blur()" class="w-full rounded px-2 py-1">
                <option disabled value="">Select Goods</option>
                <option v-for="product in products" :key="product.name" :value="product.name">
                  {{ product.name }}
                </option>
              </select>
            </td>

            <!-- member on desktop -->
            <td class="desktop-only px-2 py-2" data-label="Member">
              <template v-if="requiresMemberCount(item.product) > 0">
                <select v-model="item.member1" @change="(e) => e.target.blur()" class="w-full rounded px-2 py-1 text-center">
                  <option disabled value="">- select member -</option>
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
              <select v-model="item.member1" @change="(e) => e.target.blur()" class="w-full rounded px-2 py-1 text-center">
                <option disabled value="">- select member -</option>
                <option v-for="member in getMemberList(item.product)" :key="member.id" :value="member.name">
                  {{ member.name }}
                </option>
              </select>
            </td>

            <!-- amount -->
            <td :data-label="'amount'">
              <div class="flex items-center justify-center gap-1">
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
                <svg xmlns="http://www.w3.org/2000/svg" class="delete-icon-desktop" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path
                    d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"
                  />
                </svg>
              </button>
              <button class="mobile-only delete-icon" @click="removeOrder(index)">
                <svg xmlns="http://www.w3.org/2000/svg" class="delete-icon" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path
                    d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"
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
      <button @click="showModalLuckyDraw = true" class="btn-click">คำนวณ Lucky Draw</button>
      <button @click="showModalPoint = true" class="btn-click">คำนวณ Point</button>
      <!-- <button @click="openSummary = true" class="btn-click">สรุปรายการ</button> -->
    </div>

    <div class="div-a">
      <a href="https://www.facebook.com/share/p/1EwNrTu2Dn/" target="_blank" class="text-sm font-bold flex items-center gap-1">
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
    <PointSummaryMadal :show="showModalPoint" :grand-total="pointTotal" @close="showModalPoint = false" />
    <OrderSummaryModal :show="showSummaryModal" :orders="orders" @close="closeSummary" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { computed } from "vue";
import LuckydrawModal from "./LuckydrawModal.vue";
import PointSummaryMadal from "./PointSummaryMadal.vue";
import OrderSummaryModal from "./OrderSummaryModal.vue";

const showModalLuckyDraw = ref(false);
const showModalPoint = ref(false);
const showSummaryModal = ref(false);

const grandTotal = computed(() => {
  return orders.value.reduce((sum, item) => sum + getTotalPrice(item), 0);
});

const pointTotal = computed(() => {
  return orders.value.reduce((sum, item) => sum + getTotalPrice(item), 0);
});

const orders = ref([{ product: "", member1: "", quantity: 1 }]);

const openSummary = () => {
  showSummaryModal.value = true;
};
const closeSummary = () => {
  showSummaryModal.value = false;
};

onMounted(() => {
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
  { name: "Badge", price: 150, memberCount: 0, memberType: "members" },
  { name: "Yume Dake POSTER", price: 500, memberCount: 0, memberType: "members" },
  { name: "Flickering Light POSTER", price: 500, memberCount: 0, memberType: "members" },
  { name: "Yume Dake Member POSTER", price: 350, memberCount: 1, memberType: "yumeDake" },
  { name: "Flickering Light Member POSTER", price: 350, memberCount: 1, memberType: "flickeringLight" },
  { name: "Photoset Collection Vol.14", price: 250, memberCount: 0, memberType: "members" },
  { name: "Cheki Box", price: 250, memberCount: 0, memberType: "members" },
  { name: "Shot Glass", price: 200, memberCount: 0, memberType: "members" },
  { name: "Hand Fan", price: 50, memberCount: 0, memberType: "members" },
  { name: "Pin Logo", price: 150, memberCount: 0, memberType: "members" },
  { name: "Costume Keychain", price: 250, memberCount: 0, memberType: "members" },
  { name: "Photo Card Collection", price: 200, memberCount: 0, memberType: "members" },
  { name: "HatoBito Snap", price: 400, memberCount: 1, memberType: "members" },
  { name: "HatoBito Mini Snap", price: 300, memberCount: 1, memberType: "members" },
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

const yumeDake = [
  { id: 1, name: "Pchi" },
  { id: 2, name: "Airi" },
  { id: 3, name: "Smild" },
  { id: 4, name: "View" },
  { id: 5, name: "ElleElle" },
  { id: 6, name: "Gorya" },
  { id: 7, name: "Kana" },
  { id: 8, name: "Nata" },
];

const flickeringLight = [
  { id: 1, name: "Music" },
  { id: 2, name: "Summer" },
  { id: 3, name: "Punnhyaz" },
  { id: 4, name: "Beam" },
  { id: 5, name: "Chelsea" },
  { id: 6, name: "Donut" },
  { id: 7, name: "Milin" },
  { id: 8, name: "Mobile" },
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

// selcet member list from product
function getMemberList(productName) {
  const product = products.find((p) => p.name === productName);
  if (!product) return [];
  if (product.memberType === "yumeDake") return yumeDake;
  if (product.memberType === "flickeringLight") return flickeringLight;
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
  margin: auto;
  padding: 30px;
  background: rgba(255, 255, 255);
  border-radius: 20px;
}

td {
  color: #7700f0;
  border: #7700f0 1px solid;
  font-weight: 600;
}

tr {
  color: #7700f0;
  border: #7700f0 1px solid;
}

th {
  color: #ffffff;
  background-color: #9428ff;
  border: #7700f0 1px solid;
}

h1 {
  color: #ff4d4f;
}

.div-a {
  display: flex;
  justify-content: center;
  color: #ff4d4f;
  margin-top: 20px;
}

.btn-click {
  color: #ffffff;
  background-color: #ff0004;
  padding: 10px 20px;
  margin-right: 10px;
  font-weight: bold;
  border-radius: 5px;
  border: #9428ff 2px solid;
}

.btn-click:hover {
  color: #f0faff;
  background-color: #9428ff;
}

input {
  border: none;
  border-bottom: 1px solid #7700f0;
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
  color: #ff4d4f;
}

.delete-icon-desktop {
  width: 16px;
  height: 16px;
  fill: #7700f0;
  cursor: pointer;
}

/* Desktop by default */
.mobile-only {
  display: none;
}
.desktop-only {
  display: table-cell;
}

/* Mobile */
@media screen and (max-width: 768px) {
  .mobile-only {
    display: table-cell;
  }
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: inline-block;
    width: 100%;
  }

  .delete-icon {
    width: 18px;
    height: 18px;
    fill: #5c00b9;
    cursor: pointer;
  }

  td[data-label="สินค้า"] {
    display: block !important;
    width: 100% !important;
    text-align: center;
    padding: 0.5rem 0;
  }

  td[data-label="สินค้า"]::before {
    content: none !important;
  }

  td[data-label="สินค้า"] select {
    width: 100%;
    text-align: center;
    margin: 0 auto;
    font-size: 16px;
    color: #ff4d4f;
  }

  td[data-label="Summary"] {
    border: none;
    color: #ff4d4f;
  }

  td[data-label="amount"] {
    border: none;
    color: #ff4d4f;
  }

  td[data-label="Member"] {
    color: #ff4d4f;
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
    padding-left: 35%;
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
    border: none;
    color: #ff4d4f;
  }

  input {
    border: none;
    border-bottom: 1px solid #ff4d4f;
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
  }

  thead {
    display: none;
  }

  tr {
    margin-bottom: 1rem;
    border: 1px solid #5c00b9;
    border-radius: 10px;
    padding: 10px;
    background-color: #ffffff;
    max-width: 310px;
  }

  td {
    position: relative;
    padding-left: 35%;
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
    border: none;
    border-bottom: 1px solid #5c00b9;
  }

  td::before {
    position: absolute;
    top: 10px;
    left: 10px;
    padding-right: 10px;
    white-space: nowrap;
    content: attr(data-label);
    font-weight: bold;
    color: #5c00b9;
    text-transform: uppercase;
  }

  td:last-child {
    border-bottom: none;
  }

  .civil-order-form {
    margin: auto;
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

  .btn-click:hover {
    color: #f0faff;
    background-color: #ff4d4f;
  }

  select {
    text-align: center;
  }
}
</style>
