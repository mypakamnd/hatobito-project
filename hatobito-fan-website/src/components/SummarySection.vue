<template>
  <div class="container">
    <div class="mb-4 mt-4">
      <!-- <label class="block font-semibold mb-2">Member Tier</label> -->
      <select v-model="selectedTier" class="w-full rounded px-3 py-2 border font-semibold">
        <option v-for="tier in tiers" :key="tier.name" :value="tier.name">{{ tier.name }} ( discount {{ tier.discount }}% )</option>
      </select>
    </div>

    <table>
      <thead class="bg-sky-300">
        <tr>
          <!-- Goods column on mobile desktop -->
          <th class="px-4 py-2">Goods</th>
          <th class="px-4 py-2">Amount</th>
          <th class="px-4 py-2">Sum</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in orders" :key="index">
          <td class="td-goods">
            {{ item.product }}
            <template v-if="item.memberCount > 0">
              <span class="member"> ( {{ item.member1 }} ) </span>
            </template>
          </td>
          <td>{{ formatPrice(item.quantity) }}</td>
          <td>{{ formatPrice(item.price * item.quantity) }}</td>
        </tr>
      </tbody>

      <tfoot>
        <tr class="py-3">
          <td colspan="2">Summary</td>
          <td colspan="1">{{ formatPrice(total) }}</td>
        </tr>
      </tfoot>
    </table>

    <table class="summary-table">
      <tbody class="summary-tbody">
        <tr class="summary-tr">
          <td class="calculate-td-left">Mini Snap / Snap Total</td>
          <td class="calculate-td-right">{{ formatPrice(snapTotal) }}</td>
        </tr>
        <tr class="summary-tr">
          <td class="calculate-td-left">Goods Total</td>
          <td class="calculate-td-right">{{ formatPrice(goodsTotal) }}</td>
        </tr>
        <tr class="summary-tr">
          <td class="calculate-td-left" style="color: #d87070">Goods Discount</td>
          <td class="calculate-td-right" style="color: #d87070">- {{ formatPrice(goodsDiscount) }}</td>
        </tr>
      </tbody>
    </table>

    <div class="dashed-custom"></div>

    <table class="summary-table">
      <tbody class="summary-tbody">
        <tr class="summary-tr">
          <td class="calculate-td-left">Final Total</td>
          <td class="calculate-td-right">{{ formatPrice(finalTotal) }}</td>
        </tr>
      </tbody>
    </table>

    <div class="tooltip rounded-xl text-center py-5 px-5 mt-4">
      <p class="tooltip-p">ⓘ ส่วนลดจาก Tier ใช้ได้เฉพาะสินค้าประเภท Goods เท่านั้น Snap / Mini Snap จะไม่ได้รับส่วนลด</p>
    </div>

    <div class="group-button">
      <button @click="openWithTier" class="btn-cal-with-tier">คำนวณด้วย tier</button>

      <button @click="openWithoutTier" class="btn-cal-without-tier">คำนวนแบบไม่มี tier</button>
    </div>

    <LuckydrawModal :show="showModalLuckyDraw" :grand-total="modalTotal" @close="showModalLuckyDraw = false" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import LuckydrawModal from "./LuckydrawModal.vue";

const props = defineProps({
  orders: Array,
});

const selectedTier = ref("Normal");
const showModalLuckyDraw = ref(false);
const modalTotal = ref(0);

// If version mismatch, clear localStorage
const APP_VERSION = "1.0.3";

onMounted(() => {
  const savedVersion = localStorage.getItem("app_version");

  if (savedVersion !== APP_VERSION) {
    // If version mismatch, clear localStorage
    localStorage.clear();

    localStorage.setItem("app_version", APP_VERSION);
  }

  const saved = localStorage.getItem("selectedTier");
  if (saved) {
    selectedTier.value = saved;
  }
});

watch(selectedTier, (newTier) => {
  localStorage.setItem("selectedTier", newTier);
});

const tiers = [
  { name: "Normal", discount: 0 },
  { name: "Silver", discount: 5 },
  { name: "Gold", discount: 5 },
  { name: "Platinum", discount: 10 },
];

const selectedTierObj = computed(() => tiers.find((t) => t.name === selectedTier.value));

const total = computed(() =>
  props.orders.reduce((sum, order) => {
    return sum + order.price * order.quantity;
  }, 0)
);

const goodsTotal = computed(() =>
  props.orders.reduce((sum, item) => {
    if (item.goodsType === "goods") {
      return sum + item.price * item.quantity;
    }
    return sum;
  }, 0)
);

const snapTotal = computed(() =>
  props.orders.reduce((sum, item) => {
    if (item.goodsType === "snap") {
      return sum + item.price * item.quantity;
    }
    return sum;
  }, 0)
);

const goodsDiscount = computed(() => {
  const percent = selectedTierObj.value?.discount || 0;
  return goodsTotal.value * (percent / 100);
});

const finalTotal = computed(() => {
  return goodsTotal.value - goodsDiscount.value + snapTotal.value;
});

function openWithTier() {
  modalTotal.value = finalTotal.value;
  showModalLuckyDraw.value = true;
}

function openWithoutTier() {
  modalTotal.value = total.value;
  showModalLuckyDraw.value = true;
}

const formatPrice = (value) => {
  if (!value && value !== 0) return "0";
  return Number(value).toLocaleString("en-US");
};
</script>

<style scoped>
.btn-cal-with-tier {
  color: #ffffff;
  background: #70c0d8;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 5px;
  border: #70c0d8 2px solid;
}

.btn-cal-with-tier:hover {
  color: #70c0d8;
  background: #ffffff;
}

.btn-cal-without-tier {
  color: #70c0d8;
  background: #ffffff;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 5px;
  border: #70c0d8 2px solid;
}

.btn-cal-without-tier:hover {
  color: #70c0d8;
  background: #ffffff;
}

.group-button {
  margin: 24px 30px 24px 30px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
}

table {
  width: 100%;
  margin: 16px 0px;
}

td {
  color: #70c0d8;
  border: #70c0d8 1px solid;
  font-weight: 600;
  font-size: 14px;
  padding: 8px;
  align-items: end;
}

tr {
  color: #ffffff;
  border: #370079 1px solid;
}

th {
  color: #70c0d8;
  background: #e7f8ff;
  border: #70c0d8 1px solid;
  font-size: 14px;
}

.td-goods {
  text-align: left;
  white-space: normal;
  word-break: break-word;
}

.member {
  white-space: nowrap;
  color: #2a98b9;
}

span {
  text-align: left;
}

.item-product {
  padding-right: 4px;
}

select {
  background-image: url("data:image/svg+xml;utf8,<svg fill='%2370c0d8' height='30' viewBox='0 0 24 24' width='30' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 24px;
  padding-right: 30px;
}

select {
  text-align: center;
  color: #70c0d8;
  width: 30%;
  background-color: #f8fdff;
  border: #70c0d8 1px solid;
  appearance: auto;
  -webkit-appearance: none;
  -moz-appearance: none;
  text-align-last: center;
}

.summary-table,
.summary-tbody,
.summary-tr,
.summary-td-right,
.summary-td-left {
  border: none;
  font-size: 16px;
}

.summary-td-right,
.calculate-td-right {
  text-align: right;
}

.summary-td-left,
.calculate-td-left {
  text-align: left;
}

.calculate-td-left,
.calculate-td-right {
  padding: 2px;
  border: none;
  font-size: 16px;
}

.dashed-custom {
  height: 2px;
  background: repeating-linear-gradient(to right, #94d7eb 0px, #94d7eb 8px, transparent 8px, transparent 16px);
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

/* Mobile */
@media screen and (max-width: 768px) {
  .group-button {
    flex-direction: column;
  }

  select {
    width: 100%;
  }
  table {
    width: 100%;
  }
}
</style>
