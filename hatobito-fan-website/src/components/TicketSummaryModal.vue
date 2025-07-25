<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>Summer Ticket Summary</h2>
      <table class="summary-table">
        <thead>
          <tr>
            <th>สมาชิก</th>
            <th>จำนวนเงิน</th>
            <th>บัตร 100 บาท</th>
            <th>บัตร 50 บาท</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="[member, total] in filteredMembers" :key="member">
            <td>{{ member }}</td>
            <td>{{ total }} บาท</td>
            <td>{{ Math.floor(total / 100) }}</td>
            <td>{{ Math.floor((total % 100) / 50) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" style="text-align: right; padding-top: 12px; font-weight: bold; color: #098ba2">รวมทั้งหมด: {{ totalAmount }} บาท</td>
          </tr>
        </tfoot>
      </table>

      <div class="span-detail">
        <span class="detail">Koiiro Coupon จะมี 50 บาทและ 100 บาท</span>
        <span class="detail-2">** ระบบคำนวณจำนวนบัตรที่ต้องใช้ให้คร่าว ๆ อย่าลืมเตรียมบัตรให้พอดีต่อ</span>
        <span class="detail-2">บูธ/รายการ/member **</span>
      </div>
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

const totalAmount = computed(() => Object.values(memberTotals.value).reduce((acc, val) => acc + val, 0));
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
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-height: 80vh;
  overflow-y: auto;
  margin: 0px 10px;
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
  cursor: pointer;
}

.btn-click:hover {
  background-color: #65c8da;
}

.summary-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 12px;
}

.summary-table th,
.summary-table td {
  border-bottom: 1px solid #c0f0f7;
  padding: 6px 8px;
  text-align: left;
  font-size: 14px;
}

.summary-table thead th {
  color: #098ba2;
  border-bottom: 2px solid #098ba2;
  font-weight: bold;
}

.summary-table tbody td {
  text-align: center;
  color: #4ed7f1;
  font-weight: 500;
}

.summary-table tfoot td {
  font-size: 15px;
}

.span-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail {
  color: #098ba2;
  font-weight: 600;
  font-size: 14px;
}

.detail-2 {
  color: #ff5858;
  font-weight: 600;
  font-size: 14px;
}
</style>
