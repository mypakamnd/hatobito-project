<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="overlay" @click.self="$emit('close')">
        <div class="modal">
          <!-- Header -->
          <div class="modal-header">
            <div class="header-content">
              <h2 class="subtitle-main">♦ GIRLS KNOW GAME RULES ♦</h2>
            </div>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <!-- How to Play -->
            <section class="section">
              <h3 class="section-title">วิธีการเล่น <span>(How to Play)</span></h3>
              <ol class="how-to-list">
                <li>ลงเดิมพัน : เลือกใช้ <strong>1 - 5 G-D! Coin</strong></li>
                <li>สุ่มการ์ด : เมมเบอร์สุ่มการ์ด 4 ใบ <em>(กองหลัก 2 ใบ + กองไอเทม 2 ใบ)</em></li>
                <li>เปิดดวง : แฟนคลับเลือกการ์ด 1 ใบ เพื่อรับรางวัล!</li>
              </ol>
            </section>

            <!-- Rewards Table -->
            <section class="section">
              <h3 class="section-title">Rewards &amp; Penalties</h3>
              <div class="table-wrap">
                <table class="rules-table">
                  <thead>
                    <tr>
                      <th>CARD</th>
                      <th>RESULT</th>
                      <th>DETAILS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="rule in rules" :key="rule.card">
                      <td class="card-name">
                        {{ rule.card }}
                        <span class="deck-tag">{{ rule.deck }}</span>
                      </td>
                      <td>
                        <span class="result-badge" :class="rule.resultClass">{{ rule.result }}</span>
                      </td>
                      <td class="detail-td">{{ rule.detail }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <!-- Double or Nothing -->
            <section class="section">
              <h3 class="section-title">Double or Nothing</h3>
              <ul class="don-list">
                <li>หากชนะรอบแรก สามารถเล่นต่อได้โดย</li>
                <li>เดิมพัน: ใช้รางวัลทั้งหมดจากรอบที่แล้วเป็นเดิมพันเท่านั้น <em>(Gold Coin)</em></li>
                <li>เพิ่มระดับความยาก: เพิ่มการ์ด Joker 1 ใบ <em>(รวมเป็น 5 ใบให้สุ่ม)</em></li>
                <li>ข้อจำกัด: เล่นต่อกันได้ครั้งเดียวเท่านั้น!</li>
              </ul>
            </section>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <div class="corner-suit bottom-left">♠</div>
            <p class="footer-note">1 G-D! Coin = 50 Baht &nbsp;|&nbsp; ไม่สามารถแลกกลับคืนเป็นเงินสดได้ แต่สามารถเก็บไว้ใช้ได้ตลอดในกิจกรรมภายหน้า</p>
            <div class="corner-suit bottom-right">♣</div>
          </div>

          <!-- Close -->
          <button class="close-btn" @click="$emit('close')" aria-label="Close">✕</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({ show: Boolean });
defineEmits(["close"]);

const rules = [
  { card: "G_D!", deck: "กองหลัก", result: "WIN!", resultClass: "win", detail: "รับ Gold Coin x2 จากเดิมพัน" },
  { card: "Joker", deck: "กองหลัก", result: "LOSE", resultClass: "lose", detail: "เสียเดิมพันทั้งหมด!" },
  { card: "Treasure", deck: "กองไอเทม", result: "SUPER WIN!", resultClass: "superwin", detail: "รับ Gold Coin x2 จากเดิมพัน + คืน Coin ที่ใช้เดิมพัน" },
  { card: "Apple", deck: "กองไอเทม", result: "PENALTY", resultClass: "penalty", detail: "เสีย Coin ครึ่งนึงของเดิมพัน (เศษปัดขึ้น)" },
  { card: "Rainbow", deck: "กองไอเทม", result: "SHARE", resultClass: "share", detail: "เสีย Coin ที่ใช้เดิมพัน โดยแบ่งให้เมมเบอร์และผู้เล่นถัดไปคนละครึ่ง (เศษปัดขึ้น)" },
  { card: "Bomb", deck: "กองไอเทม", result: "LOSE", resultClass: "lose", detail: "เสียเดิมพันทั้งหมด!" },
];
</script>

<style scoped>
/* ── Variables ───────────────────────────────────────────── */
:root {
  --red: #c00707;
  --dark: #1a0000;
  --gold: #b8860b;
  --cream: #fff8f0;
  --navy: #134e8e;
}

/* ── Overlay ─────────────────────────────────────────────── */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 9999;
  padding: 0;
}

/* ── Modal ───────────────────────────────────────────────── */
.modal {
  position: relative;
  background: #0d0000;
  width: 100%;
  max-height: 92dvh;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ── Header ──────────────────────────────────────────────── */
.modal-header {
  position: relative;
  background: #0d0000;
  padding: 28px 20px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(192, 7, 7, 0.4);
  flex-shrink: 0;
}

.corner-suit {
  position: absolute;
  font-size: 22px;
  color: #c00707;
  line-height: 1;
}
.top-left {
  top: 12px;
  left: 16px;
}
.top-right {
  top: 12px;
  right: 16px;
}
.bottom-left {
  bottom: 14px;
  left: 16px;
}
.bottom-right {
  bottom: 14px;
  right: 16px;
}

.debut-label {
  font-size: 11px;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 4px;
  text-transform: uppercase;
}

.title-script {
  font-size: clamp(28px, 8vw, 42px);
  color: #ffffff;
  line-height: 1.1;
  margin: 0;
  text-shadow: 0 0 30px rgba(192, 7, 7, 0.6);
}

.subtitle-eng {
  font-size: clamp(9px, 2.5vw, 13px);
  letter-spacing: 4px;
  color: rgba(255, 255, 255, 0.6);
  margin: 6px 0 4px;
}

.subtitle-main {
  font-size: clamp(14px, 4vw, 20px);
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 2px;
  margin: 0;
}

/* ── Body ────────────────────────────────────────────────── */
.modal-body {
  overflow-y: auto;
  padding: 20px 16px;
  flex: 1;
  background: #0d0000;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 14px;
  font-weight: 700;
  color: #c00707;
  letter-spacing: 1px;
  border-left: 3px solid #c00707;
  padding-left: 10px;
  margin-bottom: 12px;
}
.section-title span {
  font-weight: 400;
  color: #ffffff;
  font-size: 14px;
  letter-spacing: 0;
}

/* ── How to Play ─────────────────────────────────────────── */
.how-to-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  counter-reset: steps;
}
.how-to-list li {
  counter-increment: steps;
  font-size: 14px;
  font-weight: 400;
  color: #fff;
  padding-left: 32px;
  position: relative;
  line-height: 1.5;
}
.how-to-list li::before {
  content: counter(steps);
  position: absolute;
  left: 0;
  top: 0;
  width: 22px;
  height: 22px;
  background: #c00707;
  color: #fff;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.how-to-list strong {
  color: #ffb33f;
}
.how-to-list em {
  color: #ffffff;
  font-size: 14px;
}

/* ── Table ───────────────────────────────────────────────── */
.table-wrap {
  overflow-x: auto;
  border-radius: 10px;
}

.rules-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 320px;
}

.rules-table th {
  font-size: 11px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(192, 7, 7, 0.15);
  padding: 8px 10px;
  text-align: center;
  border-bottom: 1px solid rgba(192, 7, 7, 0.3);
}

.rules-table td {
  font-size: 12px;
  font-weight: 400;
  color: #fff;
  padding: 9px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  vertical-align: middle;
  text-align: center;
}

.rules-table tbody tr:last-child td {
  border-bottom: none;
}
.rules-table tbody tr:hover {
  background: rgba(192, 7, 7, 0.06);
}

.card-name {
  font-weight: 600;
  font-size: 16px;
  color: #fff;
  white-space: nowrap;
}
.deck-tag {
  display: block;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.35);
  font-weight: 400;
  margin-top: 2px;
}

.detail-td {
  text-align: left;
  color: rgba(255, 255, 255, 0.65);
  font-size: 12px;
}

/* Result badges */
.result-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  white-space: nowrap;
}
.win {
  background: rgba(19, 78, 142, 0.25);
  color: #6fb3ff;
  border: 1px solid rgba(111, 179, 255, 0.3);
}
.superwin {
  background: rgba(255, 179, 63, 0.2);
  color: #ffb33f;
  border: 1px solid rgba(255, 179, 63, 0.4);
}
.lose {
  background: rgba(192, 7, 7, 0.2);
  color: #ff6b6b;
  border: 1px solid rgba(192, 7, 7, 0.4);
}
.penalty {
  background: rgba(150, 50, 0, 0.25);
  color: #ff9560;
  border: 1px solid rgba(255, 149, 96, 0.3);
}
.share {
  background: rgba(80, 140, 80, 0.2);
  color: #7dd87d;
  border: 1px solid rgba(125, 216, 125, 0.3);
}

/* ── Double or Nothing ───────────────────────────────────── */
.don-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.don-list li {
  font-size: 14px;
  font-weight: 400;
  color: #fff;
  padding-left: 16px;
  position: relative;
  line-height: 1.6;
}
.don-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #c00707;
  font-weight: 700;
}
.don-list em {
  font-size: 14px;
  font-weight: 400;
  color: #fff;
}

/* ── Footer ──────────────────────────────────────────────── */
.modal-footer {
  position: relative;
  background: #c00707;
  padding: 12px 40px;
  flex-shrink: 0;
}
.footer-note {
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  line-height: 1.6;
  margin: 0;
}

/* ── Close Button ────────────────────────────────────────── */
.close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.5s;
  z-index: 10;
}
.close-btn:hover {
  background: rgba(192, 7, 7, 0.5);
  color: #fff;
}

/* ── Transition ──────────────────────────────────────────── */
.modal-enter-active {
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s ease;
}
.modal-leave-active {
  transition: transform 0.25s ease, opacity 0.2s ease;
}
.modal-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.modal-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* ── Desktop ─────────────────────────────────────────────── */
@media (min-width: 640px) {
  .overlay {
    align-items: center;
    padding: 20px;
  }
  .modal {
    width: 100%;
    max-width: 600px;
    max-height: 88dvh;
    border-radius: 20px;
  }
  .modal-enter-from,
  .modal-leave-to {
    transform: translateY(20px) scale(0.97);
    opacity: 0;
  }
  .rules-table td {
    font-size: 14px;
  }
  .detail-td {
    font-size: 13px;
  }
}
</style>
