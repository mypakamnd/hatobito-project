<template>
  <div v-if="props.show" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <button class="modal-close" @click="emit('close')">✖</button>
      <h2 class="modal-title">Point Calculation</h2>
      <ul>
        <li v-for="(o, i) in sortedOrders" :key="i">{{ o.product }} - {{ o.member1 }} - {{ o.quantity }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  show: { type: Boolean, required: true },
  orders: { type: Array, required: true },
});

const emit = defineEmits(["close"]);

const priorityList = ["Yume Dake POSTER", "Flickering Light POSTER", "Yume Dake Member POSTER", "Flickering Light Member POSTER", "HatoBito Snap", "HatoBito Mini Snap"];

const sortedOrders = computed(() => {
  return [...props.orders].sort((o1, o2) => {
    const t1 = priorityList.findIndex((p) => o1.product.startsWith(p));
    const t2 = priorityList.findIndex((p) => o2.product.startsWith(p));
    return (t1 === -1 ? priorityList.length : t1) - (t2 === -1 ? priorityList.length : t2);
  });
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

h2 {
  color: #ff4d4f;
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
