<template>
  <div>
    <h2>Checkout</h2>
    <form @submit.prevent="processPayment">
      <div>
        <label for="payment-method">วิธีการชำระเงิน</label>
        <select v-model="selectedPaymentMethod" id="payment-method">
          <option value="credit_card">บัตรเครดิต</option>
          <option value="promptpay">PromptPay</option>
        </select>
      </div>
      <div v-if="selectedPaymentMethod === 'credit_card'">
        <button @click="chargeWithCreditCard">ชำระด้วยบัตรเครดิต</button>
      </div>
      <div v-if="selectedPaymentMethod === 'promptpay'">
        <button @click="chargeWithPromptPay">ชำระด้วย PromptPay</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedPaymentMethod: 'credit_card',
    };
  },
  methods: {
    chargeWithCreditCard() {
      // ส่งข้อมูลไปยัง API ฝั่ง Backend สำหรับการชำระเงินผ่าน Omise
    },
    chargeWithPromptPay() {
      // ส่งข้อมูลไปยัง API ฝั่ง Backend สำหรับการชำระเงินผ่าน PromptPay
    },
    processPayment() {
      // ตรวจสอบวิธีการชำระเงินที่เลือก และดำเนินการต่อไป
    }
  }
};
</script>
