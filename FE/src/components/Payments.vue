<template>
  <div class="payment-container">
    <div v-if="!paymentMethod">
      <button class="cart-button" @click="choosePaymentMethod">เลือกวิธีการชำระเงิน</button>
    </div>

    <div v-if="showPaymentOptions">
      <div class="payment-option" @click="selectPaymentMethod('creditCard')">
        <h3>จ่ายผ่านบัตรเครดิต</h3>
      </div>
      <div class="payment-option" @click="selectPaymentMethod('qrCode')">
        <h3>จ่ายผ่าน QR Code</h3>
      </div>
    </div>

    <div v-if="paymentMethod === 'creditCard'" class="credit-card-form">
      <div id="credit-card-form"></div>
    </div>

    <div v-if="paymentMethod === 'qrCode'" class="qr-code">
      <div id="qrcode"></div>
    </div>

    <!-- QR Code Modal -->
    <div v-show="showQRCodeModal" class="qr-modal-overlay" @click.self="closeQRCodeModal">
      <div class="qr-modal-content">
        <button class="qr-close-modal-btn" @click="closeQRCodeModal">&times;</button>
        <h3>จ่ายผ่าน QR Code</h3>
        <div id="qrcode"></div>
      </div>
    </div>
  </div>
</template>


<script>
    import QRCode from 'qrcode';

    export default {
    name: 'PaymentComponent',
    props: {
        totalPrice: {
          type: Number,
          required: true,
        },
    },
    data() {
        return {
        paymentMethod: '',
        showPaymentOptions: false,
        omiseCardReady: false,
        showQRCodeModal: false,
        };
    },
    mounted() {
        this.loadOmiseScript();
    },
    methods: {
        choosePaymentMethod() {
        this.showPaymentOptions = true;
        },
        selectPaymentMethod(method) {
        if (!this.omiseCardReady) {
            console.error('OmiseCard not ready');
            return;
        }
        this.paymentMethod = method;
        if (method === 'creditCard') {
            this.openOmiseCard();
        } else if (method === 'qrCode') {
            this.openQRCodeModal();
        }
        },
        loadOmiseScript() {
        if (!window.OmiseCard) {
            const script = document.createElement('script');
            script.src = process.env.VUE_APP_OMISE_LIBRARY;
            script.async = true;
            script.onload = () => {
            console.log('✅ OmiseCard script loaded');
            this.omiseCardReady = true;
            };
            document.head.appendChild(script);
        } else {
            this.omiseCardReady = true;
        }
        },
        openOmiseCard() {
        window.OmiseCard.configure({
            publicKey: process.env.VUE_APP_OMISE_PUBLIC_KEY,
            frameLabel: 'My Shop',
            submitLabel: 'ชำระเงิน',
            buttonLabel: 'จ่ายด้วยบัตร',
            currency: 'THB',
            defaultPaymentMethod: 'credit_card',
            otherPaymentMethods: [],
        });

        window.OmiseCard.open({
            amount: this.totalPrice * 100,
            onCreateTokenSuccess: (token) => {
            console.log('✅ Token ได้แล้ว', token);
            this.$emit('token-created', token); // ส่ง token กลับไปให้ ShoppingCart.vue
            },
            onFormClosed: () => {
            console.log('❎ ผู้ใช้ปิดฟอร์ม Omise');
            },
        });
        },
        generateQRCode() {
        const el = document.getElementById('qrcode');
        const amount = this.totalPrice;

        if (!amount || isNaN(amount)) {
            console.error('Invalid amount for QR');
            return;
        }

        const url = process.env.VUE_APP_FE_BASE_URL`/create-charge?amount=${encodeURIComponent(amount)}`;
        console.log('QR Code URL:', url);

        if (el) {
            el.innerHTML = '';
            QRCode.toCanvas(el, url, (err) => {
            if (err) {
                console.error('Error generating QR code:', err);
            } else {
                console.log('✅ สร้าง QR สำเร็จ');
            }
            });
        }
        },
        openQRCodeModal() {
        console.log('เปิด QR Code Modal');
        this.showQRCodeModal = true;
        this.generateQRCode();
        },
        closeQRCodeModal() {
        this.showQRCodeModal = false;
        },
    }
};
</script>
