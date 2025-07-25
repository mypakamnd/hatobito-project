<!-- TicketSummaryModal.vue -->
<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>Summer Ticket Summary</h2>
      <ul>
        <li v-for="[member, total] in filteredMembers" :key="member">{{ member }} : {{ total }} บาท</li>
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
  width: 300px;
}

h2 {
  color: #098ba2;
  font-weight: bold;
}

.btn-click {
  color: #ffffff;
  background-color: #098ba2;
  padding: 10px 20px;
  margin-right: 10px;
  font-weight: bold;
  border-radius: 5px;
  margin: 5px 0px 10px 0px;
}

.btn-click:hover {
  background-color: #65c8da;
}

ul {
  margin: 10px 0px;
}
</style>
