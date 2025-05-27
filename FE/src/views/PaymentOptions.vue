<template>
  <div class="payment-option-container">
    <button class="cart-button" @click="selectPaymentMethod('creditCard')">จ่ายผ่านบัตรเครดิต</button>
    <button class="cart-button" @click="selectPaymentMethod('qrCode')">จ่ายผ่าน QR Code</button>
  </div>
</template>

<script>
export default {
  methods: {
    selectPaymentMethod(method) {
      this.$emit('select-payment-method', method);
    }
  }
};
</script>
