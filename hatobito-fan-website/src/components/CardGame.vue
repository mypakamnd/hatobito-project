<template>
  <div class="game-container">
    <h1 class="text-xl font-bold">GIRLS KNOW</h1>
    <h1 class="text-xl font-bold mb-4">♦ GAME ♦</h1>

    <!-- TOP UP -->
    <div class="section mt-4">
      <label class="block font-semibold">เติม G-D Coin</label>

      <div class="row">
        <input type="number" class="gd-input" v-model.number="topUpAmount" min="1" placeholder="ระบุ G-D! Coin" />
        <small class="error" v-if="topUpError">{{ topUpError }}</small>
        <div v-if="topUpAmount > 0" class="tooltip rounded-xl text-center py-4 px-4">
          <p class="tooltip-p">ⓘ มูลค่า {{ formatPrice(topUpAmount * 50) }}</p>
        </div>
        <button @click="handleTopUp">ซื้อ G-D! Coin</button>
      </div>
    </div>

    <!-- WALLET -->
    <div class="wallet rounded-xl text-center py-5 px-5 mb-4">
      <div class="gd-coin">G-D! Coin : {{ gdCoin }}</div>
      <div class="divider"></div>
      <div class="gold-coin">Gold Coin : {{ goldCoin }}</div>
    </div>

    <!-- PHASE 1 : BET -->
    <div v-if="gameState === 'bet'" class="section">
      <label class="put-coin block font-semibold">วางเดิมพัน ( 1-5 G-D! Coin )</label>

      <div class="row">
        <input type="number" v-model.number="betAmount" min="1" max="5" placeholder="วาง G-D! Coin" />
        <small class="error" v-if="betError">{{ betError }}</small>
        <button class="confirm-bet" @click="confirmBet">ยืนยันเดิมพัน</button>
      </div>
    </div>

    <!-- PHASE 2 : DRAW -->
    <div v-if="gameState === 'draw' || gameState === 'result'" class="section">
      <p class="highlight">◉ เดิมพันแล้ว {{ currentBet }} G-D ◉</p>
      <!-- <p class="select-card" v-if="gameState === 'draw'">เลือกการ์ด 1 ใบ</p> -->

      <div class="card-area">
        <div v-for="(card, index) in cards" :key="index" class="card-wrapper" @click="pickCard(card)">
          <div class="card" :class="{ flipped: card.flipped }">
            <div class="front">?</div>
            <div class="back">{{ card.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- RESULT -->
    <div v-if="gameState === 'result'" class="result">
      <div class="result-box rounded-xl text-center py-4 px-4 mb-4">
        <h2 class="result-message">คุณหยิบได้ไพ่ : {{ resultMessage }}</h2>
        <h2 class="result-text">( {{ resultText }} )</h2>
      </div>

      <button @click="resetGame" class="primary-btn">เล่นอีกครั้ง</button>
    </div>

    <!-- HISTORY -->
    <div class="history">
      <label class="block font-semibold">• ประวัติ ( ลงเดิมพันทั้งหมด {{ totalBetCoins }} เหรียญ ) •</label>

      <div v-for="(h, index) in history.slice(0, 100)" :key="index" class="history-item">เดิมพัน {{ h.bet }} coin → {{ h.card }} ({{ h.result }})</div>
    </div>
    <button class="clear mt-4" @click="clearGameData">ล้างการเล่นทั้งหมด</button>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";

const gdCoin = ref(0);
const goldCoin = ref(0);

const betAmount = ref(1);
const currentBet = ref(0);

const cards = ref([]);
const resultMessage = ref("");
const resultText = ref("");
const history = ref([]);
const topUpAmount = ref(null);

const betError = ref("");
const topUpError = ref("");

const gameState = ref("bet"); // bet | draw | result

const mainDeck = ["WIN!!", "LOST!!"];
const itemDeck = ["SUPER WIN!!", "PENALTY!!", "SHARE!!", "BOMB!!"];

// If version mismatch, clear localStorage
const APP_VERSION = "1.0.4";

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function formatPrice(price) {
  return Number(price).toLocaleString() + " บาท";
}

/* ---------------- VALIDATION ---------------- */

function validateTopUp() {
  if (!topUpAmount.value || topUpAmount.value <= 0) {
    topUpError.value = "โปรดระบุเหรียญ G-D! มากกว่า 0";
    return false;
  }

  topUpError.value = "";
  return true;
}

const isValidBet = computed(() => {
  if (!betAmount.value) {
    betError.value = "โปรดระบุเหรียญ G-D! มากกว่า 0";
    return false;
  }

  if (betAmount.value > 5) {
    betError.value = "ลงเดิมพันได้ไม่เกิน 5 เหรียญ";
    return false;
  }

  betError.value = "";
  return true;
});

/* ---------------- TOP UP ---------------- */

function handleTopUp() {
  if (!validateTopUp()) return;

  gdCoin.value += topUpAmount.value;

  topUpAmount.value = "";
  topUpError.value = "";
}

/* ---------------- BET ---------------- */

function confirmBet() {
  if (!isValidBet.value) return;
  if (gdCoin.value < betAmount.value) {
    betError.value = "เหรียญไม่พอ";
    return;
  }

  currentBet.value = betAmount.value;
  gdCoin.value -= currentBet.value;

  const drawn = [...shuffle(mainDeck).slice(0, 2), ...shuffle(itemDeck).slice(0, 2)];

  cards.value = shuffle(drawn).map((c) => ({
    name: c,
    flipped: false,
  }));

  gameState.value = "draw";
}

/* ---------------- DRAW ---------------- */

function pickCard(cardObj) {
  if (gameState.value !== "draw") return;

  cardObj.flipped = true;

  const bet = currentBet.value;
  const card = cardObj.name;

  let message = "";
  let resultDetail = "";

  switch (card) {
    case "WIN!!":
      goldCoin.value += bet * 2;
      message = "WIN";
      resultDetail = `ได้รับ ${bet * 2} Gold Coin`;
      break;

    case "LOST!!":
      message = "LOST";
      resultDetail = "เสียเหรียญเดิมพันทั้งหมด";
      break;

    case "SUPER WIN!!":
      goldCoin.value += bet * 2;
      gdCoin.value += bet;
      message = "SUPER WIN";
      resultDetail = `ได้รับ ${bet * 2} Gold Coin + คืน ${bet} G-D! Coin`;
      break;

    case "PENALTY!!":
      const penalty = Math.ceil(bet / 2);
      gdCoin.value -= penalty;
      message = "PENALTY";
      resultDetail = `เสีย ${penalty} G-D! Coin ให้ Dealer`;
      break;

    case "SHARE!!":
      const dealerShare = Math.ceil(bet / 2);
      const nextPlayerShare = bet - dealerShare;

      message = "SHARE";
      resultDetail = `เสีย ${bet} G-D! Coin → Dealer ${dealerShare} / ผู้เล่นถัดไป ${nextPlayerShare} `;
      break;

    case "BOMB!!":
      message = "BOMB";
      resultDetail = "เสียเหรียญเดิมพันทั้งหมด";
      break;
  }

  resultMessage.value = message;
  resultText.value = resultDetail;

  history.value.unshift({
    time: new Date().toLocaleTimeString(),
    bet,
    card,
    result: resultDetail,
  });

  setTimeout(() => {
    cards.value.forEach((c) => (c.flipped = true));
    gameState.value = "result";
  }, 500);
}

/* ---------------- RESET ---------------- */

function resetGame() {
  currentBet.value = 0;
  cards.value = [];
  resultMessage.value = "";
  gameState.value = "bet";
}

function clearGameData() {
  const confirmReset = confirm("คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลเกมทั้งหมด?");
  if (!confirmReset) return;

  // delete local storage
  localStorage.removeItem("gdCoin");
  localStorage.removeItem("goldCoin");
  localStorage.removeItem("gdHistory");

  // reset state
  gdCoin.value = 0;
  goldCoin.value = 0;
  history.value = [];
  currentBet.value = 0;
  cards.value = [];
  resultMessage.value = "";
  gameState.value = "bet";
  resultText.value = "";
}

/* ---------------- TOTAL BET ---------------- */

const totalBetCoins = computed(() => history.value.reduce((sum, h) => sum + (h.bet || 0), 0));

/* ---------------- STORAGE ---------------- */

onMounted(() => {
  gdCoin.value = Number(localStorage.getItem("gdCoin")) || 0;
  goldCoin.value = Number(localStorage.getItem("goldCoin")) || 0;
  history.value = JSON.parse(localStorage.getItem("gdHistory")) || [];

  const savedVersion = localStorage.getItem("app_version");

  if (savedVersion !== APP_VERSION) {
    // If version mismatch, clear localStorage
    localStorage.clear();

    localStorage.setItem("app_version", APP_VERSION);
  }
});

watch(gdCoin, (v) => localStorage.setItem("gdCoin", v));
watch(goldCoin, (v) => localStorage.setItem("goldCoin", v));
watch(history, (v) => localStorage.setItem("gdHistory", JSON.stringify(v)), {
  deep: true,
});
</script>

<style scoped>
.game-container {
  max-width: 80%;
  width: 50%;
  padding: 16px;
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
}

.section {
  margin-bottom: 20px;
}

.wallet {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  background-color: #ffedd3;
}

.gd-coin {
  color: #134e8e;
  font-size: 16px;
}

.gold-coin {
  color: #c00707;
  font-size: 16px;
}

.row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ff4400;
  color: #ff4400;
  text-align: center;
  font-weight: 600;
}

.gd-input {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #134e8e;
  color: #134e8e;
  text-align: center;
  font-weight: 600;
}

button {
  background: #134e8e;
  border: #134e8e 2px solid;
  color: #ffffff;
}

.confirm-bet {
  background: #ff4400;
  border: #ff4400 2px solid;
}

.put-coin {
  color: #ff4400;
}

.clear {
  background: #c00707;
  border: #c00707 2px solid;
  color: #ffffff;
}

button,
.confirm-bet,
.clear {
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
}

button:disabled {
  background: #ccc;
}

.primary-btn {
  color: #ffffff;
  background: #ffb33f;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 5px;
  border: #ffb33f 2px solid;
}

.error {
  color: #b10000;
  font-size: 12px;
}

.highlight {
  font-weight: bold;
  color: #ff4400;
  font-size: 20px;
  margin-bottom: 4px;
}

.select-card {
  font-weight: bold;
  margin-bottom: 12px;
  color: #ffb33f;
}

.card-area {
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  justify-content: center;
}

.card-wrapper {
  width: 45%;
  perspective: 1000px;
}

.card {
  width: 100%;
  height: 180px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  color: #c00707;
}

.card.flipped {
  transform: rotateY(180deg);
}

.card .front,
.card .back {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  backface-visibility: hidden;
}

.front {
  background: #c00707;
  color: white;
}

.back {
  background: #ffb33f;
  color: #ffffff;
  transform: rotateY(180deg);
}

.result {
  text-align: center;
  margin-top: 20px;
}

.history {
  margin-top: 14px;
  font-size: 14px;
}

.history-item {
  border-bottom: 1px dashed #ccc;
  padding: 6px 0;
  text-align: left;
  font-size: 12px;
  color: #134e8e;
}

h1 {
  color: #c00707;
  font-size: 28px;
}

label {
  color: #134e8e;
}

.tooltip {
  background: #e9f4ff;
}

.tooltip-p {
  color: #134e8e;
  font-weight: 400;
  font-size: 14px;
}

.result-box {
  color: #c00707;
  background: #ffedd3;
}

.result-text {
  font-size: 12px;
}

.divider {
  width: 1px;
  background: #c00707;
  flex-shrink: 0;
}

@media (max-width: 767px) {
  .card-area {
    flex-wrap: wrap;
  }

  .card {
    height: 160px;
  }

  .game-container {
    max-width: 480px;
    width: 100%;
  }
}
</style>
