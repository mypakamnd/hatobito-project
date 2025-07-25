<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>Summer Ticket Summary</h2>
      <ul class="summary-table">
        <li class="summary-header">
          <span>สมาชิก</span>
          <span>จำนวนเงิน</span>
        </li>
        <li v-for="[member, total] in filteredMembers" :key="member" class="summary-row">
          <span>{{ member }}</span>
          <span>{{ total }} บาท</span>
        </li>
      </ul>
      <button class="btn-click" @click="$emit('close')">close</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  ticketData: Object,
});

const memberTotals = computed(() => {
  const totals = {};
  for (const booth in props.ticketData) {
    for (const slot in props.ticketData[booth]) {
      for (const member in props.ticketData[booth][slot]) {
        const val = props.ticketData[booth][slot][member];
        if (!totals[member]) totals[member] = 0;
        totals[member] += Number(val || 0);
      }
    }
  }
  return totals;
});

const filteredMembers = computed(() => Object.entries(memberTotals.value).filter(([_, total]) => total > 0));
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 320px;
  max-height: 80vh;
  overflow-y: auto;
}

h2 {
  color: #098ba2;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
}

.btn-click {
  color: #ffffff;
  background-color: #4ed7f1;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 5px;
  margin-top: 15px;
  width: 100%;
}

.btn-click:hover {
  background-color: #65c8da;
}

.summary-table {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0;
  margin: 10px 0;
  list-style: none;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  color: #098ba2;
  border-bottom: 2px solid #098ba2;
  padding-bottom: 4px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px solid #c0f0f7;
  color: #4ed7f1;
  font-weight: 500;
}
</style>
