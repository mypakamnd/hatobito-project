<template>
  <div class="game-container">
    <h1 class="text-xl font-bold">GIRLS KNOW</h1>
    <h1 class="text-xl font-bold mb-4">♦ GAME ♦</h1>

    <!-- Top Up -->
    <div class="section mt-4 mb-4">
      <label class="block font-semibold">TOP UP G-D COIN</label>
      <div class="row">
        <input type="number" class="gd-input" v-model.number="topUpAmount" min="1" placeholder="G-D! COIN" />
        <small class="error" v-if="topUpError">{{ topUpError }}</small>
        <div v-if="topUpAmount > 0" class="notice rounded-xl text-center py-4 px-4">
          <p class="notice-p">ⓘ {{ formatPrice(topUpAmount * 50) }}</p>
        </div>
        <button @click="handleTopUp">TOP UP</button>
      </div>
    </div>

    <!-- Wallet -->
    <div class="wallet rounded-xl text-center py-5 px-5 mb-4">
      <div class="gd-coin-wallet">
        <div class="text-sm font-semibold text-white">G-D! COIN WALLET</div>
        <div class="text-3xl font-bold pt-2 pb-2 text-white">{{ gdCoin }}</div>
      </div>
    </div>

    <!-- Phase 1: Bet -->
    <div class="section mb-4">
      <label class="put-coin block font-semibold">BET 1-5 G-D! COIN</label>
      <div class="row">
        <input type="number" v-model.number="betAmount" min="1" max="5" placeholder="1-5 G-D! COIN" />
        <small class="error" v-if="betError">{{ betError }}</small>
        <button class="confirm-bet" @click="confirmBet" :disabled="!canConfirmBet">CONFIRM BET</button>
      </div>
    </div>

    <!-- Phase 2: Draw -->
    <div class="section mb-4">
      <p class="highlight">◉ ALREADY BET {{ currentBet }} G-D COIN ◉</p>
      <div class="card-area-wrapper">
        <div v-if="!canPickCard" class="card-lock">
          <p>CLICK PLAY AGAIN AND CONFIRM BET</p>
        </div>
        <div class="card-area">
          <div v-for="(card, index) in cards" :key="index" class="card-wrapper" @click="pickCard(card)">
            <div class="card" :class="{ flipped: card.flipped }">
              <div class="front">?</div>
              <div class="back">{{ card.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Result -->
    <div v-if="gameState === 'result'" class="result">
      <div class="result-box rounded-xl text-center py-4 px-4 mb-4">
        <h2 class="result-message">{{ titleCard }} : {{ resultMessage }}</h2>
        <h2 class="result-text">{{ resultText }}</h2>
      </div>
      <button @click="resetGame" class="primary-btn">PLAY AGAIN</button>
    </div>

    <!-- History -->
    <div class="history">
      <label class="block text-lg font-semibold mb-2">• HISHORY BET •</label>
      <div class="all-coin rounded-xl text-center py-5 px-5 mb-2">
        <div class="gd-coin-topup">
          <div class="text-sm font-semibold">G-D! COIN</div>
          <div class="text-3xl font-bold pt-2 pb-2">{{ totalTopUp.toLocaleString() }}</div>
          <div class="text-xs font-semibold">( ALL TOP UP )</div>
        </div>
        <div class="divider"></div>
        <div class="gold-coin-received">
          <div class="text-sm font-semibold">GOLD COIN</div>
          <div class="text-3xl font-bold pt-2 pb-2">{{ goldCoin }}</div>
          <div class="text-xs font-semibold">( ALL RECEIVED )</div>
        </div>
      </div>
      <div v-for="(h, index) in history.slice(0, 100)" :key="index" class="history-item">BET {{ h.bet }} COIN → {{ h.card }} : {{ h.result }}</div>
    </div>

    <button class="clear mt-4" @click="clearGameData">CLEAR ALL GAME</button>

    <GameRulesModal :show="showRules" @close="showRules = false" />

    <button class="mt-2" @click="showRules = true">HOW TO PLAY</button>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import GameRulesModal from "./GameRulesModal.vue";

// ── Constants ──────────────────────────────────────────────
const APP_VERSION = "1.0.6";
const STORAGE_KEY_VERSION = "app_version";
const STORAGE_KEY_GD_COIN = "gdCoin";
const STORAGE_KEY_GOLD_COIN = "goldCoin";
const STORAGE_KEY_HISTORY = "gdHistory";
const STORAGE_KEY_TOTAL_TOPUP = "totalTopUp";

const MAIN_DECK = ["G-D!", "JOKER"];
const ITEM_DECK = ["TREASURE", "APPLE", "RAINBOW", "BOMB"];

// ── State ──────────────────────────────────────────────────
const gdCoin = ref(0);
const goldCoin = ref(0);
const betAmount = ref(1);
const currentBet = ref(0);
const topUpAmount = ref(null);
const betError = ref("");
const topUpError = ref("");
const titleCard = ref("");
const resultMessage = ref("");
const resultText = ref("");
const cards = ref([]);
const history = ref([]);
const totalTopUp = ref(0);
const showRules = ref(false);
const gameState = ref("bet"); // bet | draw | result

// ── Lifecycle ──────────────────────────────────────────────
onMounted(() => {
  const savedVersion = localStorage.getItem(STORAGE_KEY_VERSION);
  if (savedVersion !== APP_VERSION) {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEY_VERSION, APP_VERSION);
  }

  gdCoin.value = Number(localStorage.getItem(STORAGE_KEY_GD_COIN)) || 0;
  goldCoin.value = Number(localStorage.getItem(STORAGE_KEY_GOLD_COIN)) || 0;
  history.value = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY)) || [];
  totalTopUp.value = Number(localStorage.getItem(STORAGE_KEY_TOTAL_TOPUP)) || 0;

  initCards();
});

watch(gdCoin, (v) => localStorage.setItem(STORAGE_KEY_GD_COIN, v));
watch(goldCoin, (v) => localStorage.setItem(STORAGE_KEY_GOLD_COIN, v));
watch(history, (v) => localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(v)), { deep: true });
watch(totalTopUp, (v) => localStorage.setItem(STORAGE_KEY_TOTAL_TOPUP, v));

// ── Helpers ────────────────────────────────────────────────
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function formatPrice(price) {
  return `${Number(price).toLocaleString()} BAHT`;
}

function initCards() {
  const drawn = [...shuffle(MAIN_DECK).slice(0, 2), ...shuffle(ITEM_DECK).slice(0, 2)];
  cards.value = shuffle(drawn).map((c) => ({ name: c, flipped: false }));
}

function resetState() {
  currentBet.value = 0;
  resultMessage.value = "";
  resultText.value = "";
}

// ── Computed ───────────────────────────────────────────────
const canConfirmBet = computed(() => gameState.value === "bet");
const canPickCard = computed(() => gameState.value === "draw");
const totalBetCoins = computed(() => history.value.reduce((sum, h) => sum + (h.bet || 0), 0));

// ── Top Up ─────────────────────────────────────────────────
function validateTopUp() {
  if (!topUpAmount.value || topUpAmount.value <= 0) {
    topUpError.value = "Please specify a G-D! Coin amount greater than 0";
    return false;
  }
  topUpError.value = "";
  return true;
}

function handleTopUp() {
  if (!validateTopUp()) return;
  gdCoin.value += topUpAmount.value;
  totalTopUp.value += topUpAmount.value;
  topUpAmount.value = null;
}

// ── Bet ────────────────────────────────────────────────────
function confirmBet() {
  betError.value = "";

  if (!betAmount.value || betAmount.value <= 0) {
    betError.value = "Please specify a G-D! Coin amount greater than 0";
    return;
  }
  if (betAmount.value > gdCoin.value) {
    betError.value = "Insufficient G-D! Coin";
    return;
  }

  currentBet.value = betAmount.value;
  gdCoin.value -= currentBet.value;
  initCards();
  gameState.value = "draw";
}

// ── Draw ───────────────────────────────────────────────────
function pickCard(cardObj) {
  if (!canPickCard.value) return;

  cardObj.flipped = true;

  const bet = currentBet.value;
  const card = cardObj.name;
  let title = "";
  let message = "";
  let resultDetail = "";

  switch (card) {
    case "G-D!":
      goldCoin.value += bet * 2;
      title = "G-D!";
      message = "WIN";
      resultDetail = `Received ${bet * 2} Gold Coin`;
      break;

    case "JOKER":
      title = "JOKER";
      message = "LOST";
      resultDetail = "Lost all G-D! Coin";
      break;

    case "TREASURE":
      goldCoin.value += bet * 2;
      gdCoin.value += bet;
      title = "TREASURE";
      message = "SUPER WIN";
      resultDetail = `Received ${bet * 2} Gold Coin + Received ${bet} G-D! Coin`;
      break;

    case "APPLE": {
      const penalty = Math.ceil(bet / 2);
      gdCoin.value += bet - penalty;
      title = "APPLE";
      message = "PENALTY";
      resultDetail = `Spent ${penalty} G-D! Coin (Half of Bet) the Dealer`;
      break;
    }

    case "RAINBOW": {
      const dealerShare = Math.ceil(bet / 2);
      const nextPlayerShare = bet - dealerShare;
      title = "RAINBOW";
      message = "SHARE";
      resultDetail = `Spent ${bet} G-D! Coin → Dealer : ${dealerShare} / Next Player : ${nextPlayerShare}`;
      break;
    }

    case "BOMB":
      title = "BOMB";
      message = "BOMB";
      resultDetail = "Lost all G-D! Coin";
      break;
  }

  titleCard.value = title;
  resultMessage.value = message;
  resultText.value = resultDetail;

  history.value.unshift({ time: new Date().toLocaleTimeString(), bet, card, result: resultDetail });

  setTimeout(() => {
    cards.value.forEach((c) => (c.flipped = true));
    gameState.value = "result";
  }, 500);
}

// ── Reset ──────────────────────────────────────────────────
function resetGame() {
  resetState();
  initCards();
  gameState.value = "bet";
}

function clearGameData() {
  if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลเกมทั้งหมด?")) return;

  localStorage.removeItem(STORAGE_KEY_GD_COIN);
  localStorage.removeItem(STORAGE_KEY_GOLD_COIN);
  localStorage.removeItem(STORAGE_KEY_HISTORY);

  gdCoin.value = 0;
  goldCoin.value = 0;
  history.value = [];
  gameState.value = "bet";
  totalTopUp.value = 0;
  resetState();
}
</script>

<style scoped>
/* ── Layout ──────────────────────────────────────────────── */
.game-container {
  max-width: 80%;
  width: 50%;
  padding: 15px 0;
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ── Wallet ──────────────────────────────────────────────── */
.wallet {
  font-weight: bold;
  background: #000000;
  background: linear-gradient(90deg, rgba(0, 0, 0, 1) 40%, rgba(192, 7, 7, 1) 100%);
}

.gd-coin {
  color: #134e8e;
  font-size: 16px;
}
.gold-coin {
  color: #c00707;
  font-size: 16px;
}

.gd-coin-wallet {
  color: #134e8e;
}

.divider {
  width: 1px;
  background: #ffffff;
  flex-shrink: 0;
}

/* ── Typography ──────────────────────────────────────────── */
h1 {
  color: #c00707;
  font-size: 28px;
}
label {
  color: #000000;
}
.put-coin {
  color: #c00707;
}
.highlight {
  font-weight: bold;
  color: #c00707;
  font-size: 18px;
  margin-bottom: 4px;
}
.error {
  color: #b10000;
  font-size: 14px;
  font-weight: 400;
}

/* ── Inputs ──────────────────────────────────────────────── */
input {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #c00707;
  color: #c00707;
  text-align: center;
  font-weight: 600;
}
input:focus {
  outline: none;
}

.gd-input {
  border-color: #000000;
  color: #000000;
}

/* ── Buttons ─────────────────────────────────────────────── */
button,
.confirm-bet,
.clear {
  padding: 10px 20px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  color: #fff;
}

button {
  background: #000000;
  border: 2px solid #000000;
}
.confirm-bet {
  background: #c00707;
  border: 2px solid #c00707;
}
.clear {
  background: #c00707;
  border: 2px solid #c00707;
}
.primary-btn {
  background: #000000;
  border: 2px solid #000000;
  border-radius: 5px;
}

button:disabled {
  background: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
}

/* ── Cards ───────────────────────────────────────────────── */
.card-area-wrapper {
  position: relative;
  margin-top: 20px;
}

.card-area {
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  justify-content: center;
}

.card-wrapper {
  width: calc(50% - 12px);
  max-width: 140px;
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

.front,
.back {
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
  background: #000000;
  color: #fff;
}
.back {
  background: #c00707;
  color: #fff;
  transform: rotateY(180deg);
}

/* ── Card Lock Overlay ───────────────────────────────────── */
.card-lock {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.318);
  backdrop-filter: blur(1px);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  z-index: 10;
  text-align: center;
  padding: 2px;
  animation: fadeIn 0.3s ease;
}
.card-lock p {
  background: #fff;
  color: #c00707;
  padding: 12px 18px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ── Result ──────────────────────────────────────────────── */
.result {
  text-align: center;
  font-weight: 600;
}
.result-box {
  color: #c00707;
  background: #ffefef;
}
.result-text {
  font-size: 12px;
  font-weight: 400;
}

/* ── ALL COIN ──────────────────────────────────────────────── */

.all-coin {
  display: flex;
  justify-content: center;
  background: #c00707;
  background: linear-gradient(90deg, rgba(192, 7, 7, 1) 40%, rgba(0, 0, 0, 1) 100%);
  gap: 20px;
}

.gd-coin-topup {
  color: #fff;
}

.gold-coin-received {
  color: #fff;
}

/* ── History ─────────────────────────────────────────────── */
.history {
  margin: 20px 0;
  font-size: 16px;
}
.history-item {
  border-bottom: 1px dashed #ccc;
  padding: 6px 0;
  text-align: left;
  font-size: 14px;
  font-weight: 400;
  color: #000000;
}

/* ── Notice ──────────────────────────────────────────────── */
.notice {
  background: #ffefef;
}
.notice-p {
  color: #c00707;
  font-weight: 400;
  font-size: 14px;
}

/* ── Mobile ──────────────────────────────────────────────── */
@media (max-width: 767px) {
  .game-container {
    max-width: 480px;
    width: 100%;
  }
  .card-area {
    flex-wrap: wrap;
  }
  .card {
    height: 160px;
  }
}
</style>
