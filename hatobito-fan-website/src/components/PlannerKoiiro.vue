<template>
  <div class="planner-card">
    <h2 class="text-xl font-bold mb-4">HatoBito Koiiro Summer Booth</h2>
    <div class="btn-group">
      <button @click="openModal" class="btn-click flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
          />
        </svg>
        เลือกเมมเบอร์
      </button>
      <button @click="showSummaryModal = true" class="btn-click">สรุป Summer Coupon</button>
    </div>
    <span class="detail">** Koiiro Coupon จะมี 50 บาทและ 100 บาทเท่านั้น หากใส่ไม่ลงตัวระบบจะปิดทิ้ง **</span>

    <TicketSummaryModal v-if="showSummaryModal" :ticketData="inputValues" @close="showSummaryModal = false" />

    <!-- Modal select member -->
    <div v-if="showModal" class="modal-overlay" @click.self="saveAndCloseModal">
      <div class="modal-content">
        <h3 class="select-member-header">เลือกเมมเบอร์</h3>
        <ul class="checkbox-list">
          <li v-for="member in allMembers" :key="member">
            <label class="custom-checkbox" :class="{ 'checkbox-active': tempSelectedMembers.includes(member) }">
              <input type="checkbox" v-model="selected" class="hidden-checkbox" :checked="tempSelectedMembers.includes(member)" @change="toggleGroup(member)" />
              <span class="checkbox-text">{{ member }}</span>
            </label>
          </li>
        </ul>
        <div class="btn-group">
          <button @click="saveAndCloseModal" class="btn-click">บันทึก</button>
          <button @click="clearSelection" class="btn-clear">ล้างทั้งหมด</button>
        </div>
      </div>
    </div>

    <!-- table filter -->
    <div class="table-wrapper">
      <table class="responsive-table">
        <thead>
          <tr>
            <th class="sticky-column">Booth / Time</th>
            <th v-for="slot in timeSlots" :key="slot">{{ slot }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booth in filteredBooths" :key="booth">
            <td class="sticky-column">
              <label>{{ booth }}</label>
            </td>
            <td v-for="slot in timeSlots" :key="slot">
              <div class="member-list" v-if="filteredSchedule[booth][slot] && filteredSchedule[booth][slot].length">
                <div class="member" v-for="member in filteredSchedule[booth][slot]" :key="member">
                  <label style="display: flex; align-items: center; gap: 4px">
                    {{ member }}
                    <input v-if="booth !== 'Concept Booth' && booth !== 'Sponsor Booth'" type="number" min="0" v-model.number="inputValues[booth][slot][member]" />
                    <span v-if="booth !== 'Concept Booth' && booth !== 'Sponsor Booth'">บาท</span>
                  </label>
                </div>
              </div>
              <span v-else>-</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="div-a">
        <a href="https://www.facebook.com/share/p/1A1sFELmBm/" target="_blank" class="text-sm font-bold flex items-center gap-1">
          Official Time Table<svg
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from "vue";
import TicketSummaryModal from "./TicketSummaryModal.vue";

const showSummaryModal = ref(false);

const timeSlots = ["13.00-13.30", "13.30-14.00", "14.00-14.30", "14.30-15.00", "15.00-15.30", "15.30-16.00"];

const booths = ["Concept Booth", "Sponsor Booth", "Koiiro Dezato", "Koiiro Dorinku", "Koiiro Mini Game", "Koiiro Switch"];

const schedule = {
  "Concept Booth": {
    "13.00-13.30": ["Elleelle", "Music", "Gorya"],
    "13.30-14.00": ["Mobile", "Beam", "View"],
    "14.00-14.30": ["Pear", "Chelsea", "Punnhyaz"],
    "14.30-15.00": ["Milin", "Summer"],
    "15.00-15.30": ["Donut", "Smild"],
    "15.30-16.00": ["Airi", "Kana", "Nata"],
  },
  "Sponsor Booth": {
    "13.00-13.30": ["Airi", "Kana", "Nata"],
    "13.30-14.00": ["Elleelle", "Music", "Gorya"],
    "14.00-14.30": ["Mobile", "Beam", "View"],
    "14.30-15.00": ["Pear", "Chelsea", "Punnhyaz"],
    "15.00-15.30": ["Milin", "Summer"],
    "15.30-16.00": ["Donut", "Smild"],
  },
  "Koiiro Dezato": {
    "13.00-13.30": ["Donut", "Smild"],
    "13.30-14.00": ["Airi", "Kana", "Nata"],
    "14.00-14.30": ["Elleelle", "Music", "Gorya"],
    "14.30-15.00": ["Mobile", "Beam", "View"],
    "15.00-15.30": ["Pear", "Chelsea", "Punnhyaz"],
    "15.30-16.00": ["Milin", "Summer"],
  },
  "Koiiro Dorinku": {
    "13.00-13.30": ["Milin", "Summer"],
    "13.30-14.00": ["Donut", "Smild"],
    "14.00-14.30": ["Airi", "Kana", "Nata"],
    "14.30-15.00": ["Elleelle", "Music", "Gorya"],
    "15.00-15.30": ["Mobile", "Beam", "View"],
    "15.30-16.00": ["Pear", "Chelsea", "Punnhyaz"],
  },
  "Koiiro Mini Game": {
    "13.00-13.30": ["Pear", "Chelsea", "Punnhyaz"],
    "13.30-14.00": ["Milin", "Summer"],
    "14.00-14.30": ["Donut", "Smild"],
    "14.30-15.00": ["Airi", "Kana", "Nata"],
    "15.00-15.30": ["Elleelle", "Music", "Gorya"],
    "15.30-16.00": ["Mobile", "Beam", "View"],
  },
  "Koiiro Switch": {
    "13.00-13.30": ["Mobile", "Beam", "View"],
    "13.30-14.00": ["Pear", "Chelsea", "Punnhyaz"],
    "14.00-14.30": ["Milin", "Summer"],
    "14.30-15.00": ["Donut", "Smild"],
    "15.00-15.30": ["Airi", "Kana", "Nata"],
    "15.30-16.00": ["Elleelle", "Music", "Gorya"],
  },
};

const memberGroups = [
  { groupName: "Group 1", members: ["Airi", "Kana", "Nata"] },
  { groupName: "Group 2", members: ["Elleelle", "Music", "Gorya"] },
  { groupName: "Group 3", members: ["Mobile", "Beam", "View"] },
  { groupName: "Group 4", members: ["Pear", "Chelsea", "Punnhyaz"] },
  { groupName: "Group 5", members: ["Milin", "Summer"] },
  { groupName: "Group 6", members: ["Donut", "Smild"] },
];

const allMembers = [...new Set(Object.values(schedule).flatMap((times) => Object.values(times).flat()))];

const showModal = ref(false);
const selectedMembers = ref([]);
const tempSelectedMembers = ref([]);

// find member group
function findGroupByMember(name) {
  return memberGroups.find((g) => g.members.includes(name));
}

// watch all members after selectedMembers change
watch(
  tempSelectedMembers,
  (newVal) => {
    if (newVal.length === 0) return;
    let combined = new Set();
    for (const name of newVal) {
      const group = findGroupByMember(name);
      if (group) {
        group.members.forEach((m) => combined.add(m));
      } else {
        combined.add(name);
      }
    }
    const combinedArray = Array.from(combined);
    combinedArray.sort();
    if (combinedArray.length !== newVal.length || combinedArray.some((v, i) => v !== newVal[i])) {
      tempSelectedMembers.value = combinedArray;
    }
  },
  { deep: true }
);

function openModal() {
  tempSelectedMembers.value = [...selectedMembers.value];
  showModal.value = true;
}
function saveAndCloseModal() {
  selectedMembers.value = [...tempSelectedMembers.value];
  showModal.value = false;
}
function clearSelection() {
  tempSelectedMembers.value = [];
}

// filter schedule follow tempSelectedMembers
const filteredSchedule = computed(() => {
  const result = {};
  for (const booth of booths) {
    const boothSlots = {};
    for (const slot of timeSlots) {
      const membersHere = schedule[booth]?.[slot] || [];
      const filteredMembers = membersHere.filter((m) => tempSelectedMembers.value.includes(m));
      if (filteredMembers.length) {
        boothSlots[slot] = filteredMembers;
      }
    }
    if (Object.keys(boothSlots).length) {
      result[booth] = boothSlots;
    }
  }
  return result;
});

const filteredBooths = computed(() => Object.keys(filteredSchedule.value));

// add reactive for input values
const inputValues = reactive({});

// watch filteredSchedule
watch(
  filteredSchedule,
  (newSchedule) => {
    // reset inputValues
    for (const booth of Object.keys(newSchedule)) {
      if (!inputValues[booth]) inputValues[booth] = {};
      for (const slot of Object.keys(newSchedule[booth])) {
        if (!inputValues[booth][slot]) inputValues[booth][slot] = {};
        for (const member of newSchedule[booth][slot]) {
          if (!(member in inputValues[booth][slot])) {
            inputValues[booth][slot][member] = 0;
          }
        }
      }
      // delete slot schedule without present
      for (const slot in inputValues[booth]) {
        if (!newSchedule[booth][slot]) {
          delete inputValues[booth][slot];
        }
      }
    }
    // delete booth schedule
    for (const booth in inputValues) {
      if (!newSchedule[booth]) {
        delete inputValues[booth];
      }
    }
  },
  { immediate: true }
);

import { onMounted } from "vue";

// load localStorage
onMounted(() => {
  const saved = localStorage.getItem("boothTableState");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      selectedMembers.value = parsed.selectedMembers || [];
      tempSelectedMembers.value = [...(parsed.selectedMembers || [])]; // <-- สำคัญ!
      Object.assign(inputValues, parsed.inputValues || {});
    } catch (e) {
      console.error("Error parsing localStorage:", e);
    }
  }
});

// save localStorage
watch(
  [selectedMembers, inputValues],
  () => {
    const state = {
      selectedMembers: selectedMembers.value,
      inputValues: JSON.parse(JSON.stringify(inputValues)), // deep clone
    };
    localStorage.setItem("boothTableState", JSON.stringify(state));
  },
  { deep: true }
);

function toggleGroup(member) {
  const group = findGroupByMember(member);
  const groupMembers = group ? group.members : [member];

  const isAllSelected = groupMembers.every((m) => tempSelectedMembers.value.includes(m));

  if (isAllSelected) {
    tempSelectedMembers.value = tempSelectedMembers.value.filter((m) => !groupMembers.includes(m));
  } else {
    const set = new Set(tempSelectedMembers.value);
    groupMembers.forEach((m) => set.add(m));
    tempSelectedMembers.value = Array.from(set);
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10; /* ✅ เพิ่ม z-index ให้มากกว่าตาราง */
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 11;
}

td {
  align-items: center;
  justify-items: center;
}

.btn-click {
  color: #4ed7f1;
  background-color: #fffbb2;
  padding: 10px 20px;
  margin-right: 10px;
  font-weight: 600;
  border-radius: 5px;
  margin: 5px 10px 10px 0px;
  border: #4ed7f1 2px solid;
}

.btn-click:hover {
  color: #f0faff;
  background-color: #4ed7f1;
}

.btn-clear {
  color: #4ed7f1;
  background-color: #ffffff;
  padding: 10px 20px;
  margin-right: 10px;
  font-weight: 600;
  border-radius: 5px;
  margin: 5px 10px 20px 0px;
  border: #4ed7f1 2px solid;
}

.btn-clear:hover {
  color: #f0faff;
  background-color: #f14e4e;
}

.btn-group {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.planner-card {
  margin: auto;
  padding: 30px;
  background: rgba(255, 255, 255);
  border-radius: 20px;
}

h2 {
  color: #4ed7f1;
  margin-bottom: 1px;
}

.div-a {
  display: flex;
  justify-content: center; /* ตรงกลางแนวนอน */
  color: #2b8fa3;
  margin-top: 20px;
}

td {
  color: #2b8fa3;
  border: #2b8fa3 2px solid;
  font-size: 14px;
  z-index: 1;
  font-weight: 600;
}

tr {
  color: #2b8fa3;
  border: #2b8fa3 2px solid;
  font-size: 14px;
}

th {
  color: #2b8fa3;
  background-color: #e1faff;
  border: #2b8fa3 2px solid;
  padding: 4px;
  font-size: 14px;
  z-index: 1;
}

table td:first-child,
table th:first-child {
  background-color: #fffbb2;
  font-weight: bold;
}

input {
  border: none;
  color: #e9a5f1;
  border-bottom: 1px solid #e9a5f1;
  outline: none;
  text-align: center;
  width: 60px;
  font-weight: 600;
}

label {
  flex-direction: row;
  justify-items: center;
  justify-content: center;
  font-size: 14px;
}

.select-member-header {
  font-size: 20px;
  color: #4ed7f1;
  font-weight: bold;
  margin-bottom: 1rem;
}

.member-select-input {
  margin-right: 4px;
  cursor: pointer;
  width: 20px;
}

.table-wrapper {
  overflow-x: auto;
  max-width: 100%;
}

.responsive-table {
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
}

.responsive-table th,
.responsive-table td {
  border: 1px solid #adf1ff;
  padding: 8px;
  text-align: center;
  vertical-align: top;
}

.sticky-column {
  position: sticky;
  left: 0;
  background-color: white;
  z-index: 2;
}

thead .sticky-column {
  z-index: 3;
}

.hidden-checkbox {
  display: none;
}

.custom-checkbox {
  display: inline-flex;
  align-items: center;
  margin: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.checkbox-text {
  border-radius: 6px;
  background-color: #ffffff;
  color: #4ed7f1;
  border: #4ed7f1 2px solid;
  font-weight: bold;
  transition: all 0.2s ease;
  width: 120px;
  height: 40px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.checkbox-active .checkbox-text {
  background-color: #4ed7f1;
  color: white;
}

.checkbox-list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 20px;
}

li {
  display: flex;
  align-items: center;
  font-size: 16px;
  justify-content: center;
}

.detail {
  color: #ff5858;
  font-weight: 600;
  font-size: 16px;
  padding: 20px;
}

@media screen and (max-width: 768px) {
  .planner-card {
    padding: 15px;
  }

  .btn-group {
    flex-direction: column;
    align-items: center;
  }

  .btn-click {
    width: 250px;
    margin: 0px 0px 10px 0px;
    justify-content: center;
  }

  .btn-clear {
    width: 250px;
    margin: 0px 0px 10px 0px;
    justify-content: center;
  }

  input {
    width: 50px;
    font-size: 14px;
  }

  .responsive-table {
    font-size: 14px;
    min-width: 500px;
  }

  h2 {
    margin-bottom: 10px;
  }

  .modal-content {
    width: 300px;
  }

  .checkbox-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .detail {
    font-size: 14px;
  }
}
</style>
