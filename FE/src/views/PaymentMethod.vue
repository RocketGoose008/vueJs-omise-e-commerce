<template>
  <div>
    <div v-if="paymentMethod === 'creditCard'">
      <div id="credit-card-form"></div>
    </div>
    <div v-if="paymentMethod === 'qrCode'">
      <div id="qrcode"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['paymentMethod', 'totalPrice'],
  watch: {
    paymentMethod(newValue) {
      if (newValue === 'qrCode') {
        this.generateQRCode();
      }
    }
  },
  methods: {
    generateQRCode() {
      const el = document.getElementById('qrcode');
      const amount = this.totalPrice;
      const url = `http://localhost:8080/create-charge?amount=${encodeURIComponent(amount)}`;
      QRCode.toCanvas(el, url, (err) => {
        if (err) {
          console.error('Error generating QR code:', err);
        } else {
          console.log('QR code generated successfully');
        }
      });
    }
  }
};
</script>
