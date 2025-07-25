<template>
  <div class="planner-card">
    <h2 class="text-xl font-bold mb-4">HatoBito Koiiro Summer Booth</h2>
    <button @click="openModal" class="btn-click">เลือกสมาชิก (Filter ตาราง)</button>

    <!-- Modal select member -->
    <div v-if="showModal" class="modal-overlay" @click.self="saveAndCloseModal">
      <div class="modal-content">
        <h3 class="select-member-header">เลือกสมาชิก</h3>
        <ul>
          <li v-for="member in allMembers" :key="member">
            <label>
              <input type="checkbox" class="member-select-input" :checked="tempSelectedMembers.includes(member)" @change="toggleGroup(member)" />
              {{ member }}
            </label>
          </li>
        </ul>
        <div class="btn-group">
          <button @click="saveAndCloseModal" class="btn-click">บันทึก</button>
          <button @click="clearSelection" class="btn-click">ล้างการเลือก</button>
        </div>
      </div>
    </div>

    <!-- table filter -->
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%">
      <thead>
        <tr>
          <th>Booth / Time</th>
          <th v-for="slot in timeSlots" :key="slot">{{ slot }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="booth in filteredBooths" :key="booth">
          <td>
            <strong>{{ booth }}</strong>
          </td>
          <td v-for="slot in timeSlots" :key="slot">
            <div class="member-list" v-if="filteredSchedule[booth][slot] && filteredSchedule[booth][slot].length">
              <div class="member" v-for="member in filteredSchedule[booth][slot]" :key="member" style="margin-bottom: 4px">
                <label style="display: flex; align-items: center; gap: 12px">
                  {{ member }}
                  <input v-if="booth !== 'Concept Booth' && booth !== 'Sponsor Booth'" type="number" min="0" v-model.number="inputValues[booth][slot][member]" />
                </label>
              </div>
            </div>
            <span v-else>-</span>
          </td>
        </tr>
      </tbody>
    </table>

    <button @click="showSummaryModal = true" style="margin-top: 16px" class="btn-click">ดูสรุปตั๋ว</button>
    <TicketSummaryModal v-if="showSummaryModal" :ticketData="inputValues" @close="showSummaryModal = false" />
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
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  max-height: 80vh;
  overflow-y: auto;
}

td {
  align-items: center;
  justify-items: center;
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

.btn-group {
  display: flex;
  flex-direction: column;
}

.planner-card {
  margin: auto;
  padding: 30px;
  background: rgba(255, 255, 255);
  border-radius: 20px;
}

h2 {
  color: #098ba2;
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
  padding: 6px;
}

input {
  border: none;
  color: #ff6bfd;
  border-bottom: 1px solid #ff6bfd;
  outline: none;
  text-align: center;
  width: 60px;
}

/* .member-list {
  display: flex;
  flex-direction: column;
  justify-items: center;
  justify-content: center;
}

.member {
  display: flex;
  flex-direction: column;
  justify-items: center;
  justify-content: center;
} */

label {
  flex-direction: row;
  justify-items: center;
  justify-content: center;
}

.select-member-header {
  font-size: 20px;
  color: #098ba2;
  font-weight: bold;
  margin-bottom: 1rem;
}

.member-select-input {
  margin-right: 4px;
  cursor: pointer;
  width: 20px;
}
</style>
