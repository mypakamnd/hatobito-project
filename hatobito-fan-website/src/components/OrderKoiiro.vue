<template>
  <div class="koiiro-order-form">
    <h2 class="text-xl font-bold mb-4">HatoBito Koiiro Summer Goods</h2>

    <div class="overflow-x-auto">
      <table class="w-full min-w-max text-sm">
        <thead class="bg-sky-300">
          <tr>
            <th class="px-4 py-2">สินค้า</th>
            <th class="px-4 py-2">Member 1</th>
            <th class="px-4 py-2">Member 2</th>
            <th class="px-4 py-2">จำนวน</th>
            <th class="px-4 py-2">ราคารวม</th>
            <th class="px-4 py-2">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in orders" :key="index" class="md:table-row">
            <td class="px-2 py-2 block md:table-cell" :data-label="'สินค้า'">
              <select v-model="item.product" @change="(e) => e.target.blur()" class="w-full rounded px-2 py-1">
                <option disabled value="">เลือกสินค้า</option>
                <option v-for="product in products" :key="product.name" :value="product.name">
                  {{ product.name }}
                </option>
              </select>
            </td>

            <td class="px-2 py-2 block md:table-cell" :data-label="'Member 1'">
              <select v-if="requiresMemberCount(item.product) >= 1" v-model="item.member1" @change="(e) => e.target.blur()" class="w-full rounded px-2 py-1 text-center">
                <option disabled value="">เลือกสมาชิก</option>
                <option v-for="member in getMemberList(item.product)" :key="member.id" :value="member.name">
                  {{ member.name }}
                </option>
              </select>
              <span v-else class="text-gray-400">-</span>
            </td>

            <td class="px-2 py-2 block md:table-cell" :data-label="'Member 2'">
              <select v-if="requiresMemberCount(item.product) === 2" v-model="item.member2" @change="(e) => e.target.blur()" class="w-full rounded px-2 py-1 text-center">
                <option disabled value="">เลือกสมาชิก</option>
                <option v-for="member in getMemberList(item.product)" :key="member.id" :value="member.name">
                  {{ member.name }}
                </option>
              </select>
              <span v-else class="text-gray-400">-</span>
            </td>

            <td class="px-2 py-2 text-center block md:table-cell" :data-label="'จำนวน'">
              <input type="number" min="1" v-model.number="item.quantity" class="w-16 text-center px-1 py-0.5" />
            </td>

            <td class="px-2 py-2 text-right block md:table-cell" :data-label="'ราคารวม'">
              {{ formatPrice(getTotalPrice(item)) }}
            </td>

            <td class="px-2 py-2 text-center block md:table-cell" :data-label="'จัดการ'">
              <button @click="removeOrder(index)" class="text-red-500 hover:text-red-700">✖</button>
            </td>
          </tr>
        </tbody>

        <tfoot>
          <tr class="py-3">
            <td colspan="4" class="text-right font-bold py-3 pr-2 text-base">รวมทั้งหมด</td>
            <td colspan="2" class="font-bold py-3 text-base">{{ formatPrice(getGrandTotal()) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="group-button">
      <button @click="addOrder" class="btn-click">+ เพิ่มรายการ</button>
      <button @click="showModal = true" class="btn-click">คำนวณ Lucky Draw</button>
    </div>

    <LuckydrawModal :show="showModal" :grand-total="grandTotal" @close="showModal = false" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { computed } from "vue";
import LuckydrawModal from "./LuckydrawModal.vue";

const showModal = ref(false);
const grandTotal = computed(() => {
  return orders.value.reduce((sum, item) => sum + getTotalPrice(item), 0);
});

const orders = ref([{ product: "", member1: "", member2: "", quantity: 1 }]);

// โหลดจาก localStorage ตอนเริ่มต้น
onMounted(() => {
  const savedOrders = localStorage.getItem("orders");
  if (savedOrders) {
    orders.value = JSON.parse(savedOrders);
  }
});

// บันทึกลง localStorage ทุกครั้งที่ orders เปลี่ยน
watch(
  orders,
  (newOrders) => {
    localStorage.setItem("orders", JSON.stringify(newOrders));
  },
  { deep: true }
);

// รายการสินค้า
const products = [
  { name: "Towel (ผ้าเช็ดตัว)", price: 450, memberCount: 0, memberType: "members" },
  { name: "Handheld Fan (พัดลม)", price: 300, memberCount: 0, memberType: "members" },
  { name: "Tumbler (กระบอกน้ำ)", price: 690, memberCount: 0, memberType: "members" },
  { name: "SHIKISHI BOARD", price: 350, memberCount: 0, memberType: "members" },
  { name: "Costume Keychain", price: 250, memberCount: 0, memberType: "members" },
  { name: "Standy Acrylic 9 แบบ", price: 350, memberCount: 1, memberType: "senbatsu" },
  { name: "Couple Keychain 32 แบบ", price: 200, memberCount: 2, memberType: "members" },
  { name: "Acrylic Block 9 แบบ", price: 350, memberCount: 1, memberType: "senbatsu" },
  { name: "ID Photo Sticker 16 แบบ", price: 100, memberCount: 1, memberType: "members" },
  { name: "Random Mini Photo Card", price: 150, memberCount: 0, memberType: "members" },
  { name: "Random Mini pin snap(MV)", price: 200, memberCount: 0, memberType: "members" },
  { name: "Drinking Water Can", price: 50, memberCount: 0, memberType: "members" },
  { name: "Furin + 1 Member sign", price: 250, memberCount: 1, memberType: "members" },
  { name: "Badge 9 แบบ", price: 150, memberCount: 1, memberType: "senbatsu" },
  { name: "Photo Collection VOL.13", price: 250, memberCount: 0, memberType: "members" },
  { name: "Beach Shirt", price: 750, memberCount: 0, memberType: "members" },
  { name: "Koiiro Summer POSTER", price: 500, memberCount: 0, memberType: "members" },
  { name: "Koiiro Member POSTER", price: 350, memberCount: 1, memberType: "senbatsu" },
  { name: "HatoBito Snap", price: 400, memberCount: 1, memberType: "members" },
  { name: "HatoBito Mini Snap", price: 300, memberCount: 1, memberType: "members" },
  { name: "Coupon 100 THB", price: 100, memberCount: 1, memberType: "members" },
  { name: "Coupon 50 THB", price: 50, memberCount: 1, memberType: "members" },
];

// รายชื่อสมาชิก
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

const senbatsu = [
  { id: 1, name: "Airi" },
  { id: 2, name: "Beam" },
  { id: 3, name: "Music" },
  { id: 4, name: "Smild" },
  { id: 5, name: "Gorya" },
  { id: 6, name: "Kana" },
  { id: 7, name: "Chelsea" },
  { id: 8, name: "Nata" },
  { id: 9, name: "Mobile" },
];

// const orders = reactive([{ product: "", member1: "", member2: "", quantity: 1 }]);

// เพิ่มแถวใหม่
function addOrder() {
  orders.value.push({ product: "", member1: "", member2: "", quantity: 1 });
}

// ลบแถว
function removeOrder(index) {
  orders.value.splice(index, 1);
}

// ตรวจสอบจำนวนสมาชิกที่ต้องเลือก
function requiresMemberCount(productName) {
  const product = products.find((p) => p.name === productName);
  return product?.memberCount || 0;
}

// ราคาต่อชิ้น
function getUnitPrice(productName) {
  const product = products.find((p) => p.name === productName);
  return product?.price || 0;
}

// คำนวณราคารวม
function getTotalPrice(item) {
  return getUnitPrice(item.product) * (item.quantity || 0);
}

// แสดงราคาสวย ๆ
function formatPrice(price) {
  return `${price.toLocaleString()} ฿`;
}

// เลือก member list ตาม product
function getMemberList(productName) {
  const product = products.find((p) => p.name === productName);
  if (!product) return [];
  return product.memberType === "senbatsu" ? senbatsu : members;
}

function getGrandTotal() {
  return orders.value.reduce((sum, item) => sum + getTotalPrice(item), 0);
}
</script>

<style scoped>
.koiiro-order-form {
  margin: auto;
  padding: 30px;
  background: rgba(255, 255, 255);
  border-radius: 20px;
}

td {
  color: #098ba2;
  border: #098ba2 1px solid;
}

tr {
  color: #098ba2;
  border: #098ba2 1px solid;
}

th {
  color: #098ba2;
  background-color: #9bf0ff;
  border: #098ba2 1px solid;
}

h2 {
  color: #098ba2;
}

.btn-click {
  color: #ffffff;
  background-color: #098ba2;
  padding: 10px 20px;
  margin-right: 10px;
  font-weight: bold;
  border-radius: 5px;
}

.btn-click:hover {
  background-color: #65c8da;
}

input {
  border: none;
  border-bottom: 1px solid #098ba2;
  outline: none;
}

.btn-click {
  display: flex;
  justify-content: center; /* ตรงกลางแนวนอน */
  margin: 20px 10px 0px 0px;
}

.group-button {
  display: flex;
  flex-direction: row;
  justify-content: center; /* ตรงกลางแนวนอน */
}

@media screen and (max-width: 768px) {
  table,
  thead,
  tbody,
  th,
  td,
  tfoot,
  tr {
    display: block;
    margin: 0 auto; /* ← ตัวนี้ทำให้ชิดกลาง */
  }

  thead {
    display: none;
  }

  tr {
    margin-bottom: 1rem;
    border: 1px solid #098ba2;
    border-radius: 10px;
    padding: 10px;
    background-color: #f0faff;
    max-width: 310px;
  }

  td {
    position: relative;
    padding-left: 35%;
    padding-right: 10px;
    text-align: center;
    border: none;
    border-bottom: 1px solid #098ba2;
  }

  td::before {
    position: absolute;
    top: 10px;
    left: 10px;
    padding-right: 10px;
    white-space: nowrap;
    content: attr(data-label);
    font-weight: bold;
    color: #098ba2;
    text-transform: uppercase;
  }

  td:last-child {
    border-bottom: none;
  }

  .koiiro-order-form {
    margin: auto;
    padding: 20px;
  }

  .btn-click {
    display: flex;
    justify-content: center; /* ตรงกลางแนวนอน */
    margin: 5px 0px 5px 0px;
  }

  .group-button {
    display: flex;
    flex-direction: column;
    justify-content: center; /* ตรงกลางแนวนอน */
  }

  select {
    text-align: center;
  }
}
</style>
