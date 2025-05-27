<template>
  <div class="all-cart-header">

    <!-- ปุ่มตะกร้ากลมสวยๆ -->
    <div class="cart-icon-btn" @click="showCart = true">
      <i class="fas fa-shopping-cart"></i>
      <span v-if="cart.length" class="cart-count">{{ cart.length }}</span>

      <!-- ปุ่มซ่อนสำหรับ OmiseCard -->
      <button id="omise-card-btn" style="display: none;"></button>
    </div>

    <!-- Modal ตะกร้าสินค้า -->
    <div v-if="showCart" class="all-cart-modal-overlay" @click.self="closeCart">
      <div class="all-cart-modal-content">
        <button class="cart-close-modal-btn" @click="closeCart">&times;</button>

        <h2 align="center" style="font-size: 20px;">ตะกร้าสินค้า</h2>

        <hr>

        <!-- แสดงเมื่อ cart มีสินค้า -->
        <ul v-if="cart.length > 0">
          <li v-for="(item, index) in cart" :key="index" class="all-cart-item">
            <img :src="item.img" class="all-cart-item-img" />

            <div class="all-cart-item-detail">
              <div class="all-cart-item-name">{{ item.name }}</div>

              <div class="all-cart-item-meta">
                <span>฿{{ item.price.toLocaleString() }}</span>
                <div class="all-cart-qty-controls">
                  <button @click="decreaseQty(index)">−</button>
                  <span>{{ item.qty }}</span>
                  <button @click="increaseQty(index)">＋</button>
                </div>
              </div>

              <div align="right">
                <button class="all-cart-item-remove" @click="removeFromCart(index)">ลบ</button>
              </div>
            </div>
          </li>
        </ul>

        <!-- แสดงเมื่อ cart ว่าง -->
        <div v-else class="empty-cart" :style="{ backgroundImage: `url(${bgCartImage})` }">
          <div class="empty-cart-txt">ตะกร้าของคุณว่างอยู่</div>
        </div>

        <div class="all-cart-total">
          <strong>ยอดรวม:</strong> ฿{{ totalPrice.toLocaleString() }}
        </div>

        <div v-if="!isCheckout && cart.length > 0" class="payment-option-container">
          <button class="cart-button" @click="choosePaymentMethod">เลือกวิธีการชำระเงิน</button>
        </div>

        <!-- ตัวเลือกการชำระเงิน -->
        <div v-if="showPaymentOptions" class="payment-option-container">
          <div class="payment-option" @click="selectPaymentMethod('creditCard')">
            <h3>จ่ายผ่านบัตรเครดิต</h3>
          </div>
          <div class="payment-option" @click="selectPaymentMethod('qrCode')">
            <h3>จ่ายผ่าน QR Code</h3>
          </div>
        </div>

        <!-- ฟอร์มจ่ายเงิน -->
        <div v-if="paymentMethod === 'creditCard'" class="credit-card-form">
          <div id="credit-card-form"></div>
        </div>

        <!-- เรียก Popup QR Code -->
        <QrPromptPayPopup
          :visible="showQrPopup"
          :qr-uri="qrUri"
          @close="showQrPopup = false"
        />
      </div>

      <div v-if="isLoading" class="loading-overlay">
        <i class="fas fa-spinner fa-spin fa-3x"></i>
      </div>

    </div>
  </div>
</template>

<script>
  import PopupAlert from 'sweetalert2';
  import bgCartImage from '@/assets/bg-cart.png';
  import QrPromptPayPopup from '@/components/QrPromptPayPopup.vue';

  export default {
    name: 'ShoppingCart',
    components: {
      QrPromptPayPopup,
    },
    data() {
      return {
        cart: JSON.parse(localStorage.getItem('cart')) || [],
        showCart: false,
        isCheckout: false,
        paymentMethod: '',
        showPaymentOptions: false,
        omiseCardReady: false,
        bgCartImage,
        qrUri: '',
        isLoading: false,
        showQrPopup: false,
        isQrLoading: false,    
        pollingInterval: null,
      };
    },
    computed: {
      totalPrice() {
        return this.cart.reduce((acc, item) => acc + item.price * item.qty, 0);
      }
    },
    mounted() {
      this.loadCart();
      this.loadOmiseScript();
    },
    methods: {
      addToCart(item) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        this.loadCart();
      },
      loadCart() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.isLoading = false; 
      },
      removeFromCart(index) {
        this.cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        
        if (this.cart.length === 0) {
          this.isCheckout = false;
          this.showPaymentOptions = false;
          this.paymentMethod = '';
        }
      },
      increaseQty(index) {
        this.cart[index].qty += 1;
        localStorage.setItem('cart', JSON.stringify(this.cart));
      },
      decreaseQty(index) {
        if (this.cart[index].qty > 1) {
          this.cart[index].qty -= 1;
        } else {
          this.cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(this.cart));

        if (this.cart.length === 0) {
          this.isCheckout = false;
          this.showPaymentOptions = false;
          this.paymentMethod = '';
        }
      },
      closeCart() {
        this.showCart = false;
        this.isCheckout = false;
        this.showPaymentOptions = false;
        this.paymentMethod = '';
        if (this.pollingInterval) {
          clearInterval(this.pollingInterval);
          this.pollingInterval = null;
        }
        this.showQrPopup = false;
        this.isQrLoading = false;
      },
      choosePaymentMethod() {
        this.isCheckout = true;
        this.showPaymentOptions = true;
      },
      selectPaymentMethod(method) {
        this.paymentMethod = method;
        this.isLoading = true;

        this.$nextTick(async () => {
          if (method === 'qrCode') {
            await this.createPromptPaySource(); 
          } else if (method === 'creditCard') {
            this.openOmiseCard(); 
          }

          this.isLoading = false;
        });
      },
      async createPromptPaySource() {
        try {
          this.isQrLoading = true;   // เริ่ม loading

          const sourceRes = await fetch(`${process.env.VUE_APP_BE_BASE_URL}/api/payment/create-promptpay-source`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: this.totalPrice * 100,
              currency: 'THB',
            }),
          });

          const sourceResult = await sourceRes.json();

          if (sourceResult.code == 200 && sourceResult.status === 'success') {
            const sourceId = sourceResult.source.id;

            const chargeRes = await fetch(`${process.env.VUE_APP_BE_BASE_URL}/api/payment/create-charge`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                amount: this.totalPrice * 100,
                currency: 'THB',
                source: sourceId,
              }),
            });

            const chargeResult = await chargeRes.json();

            const qrUri = chargeResult?.data?.source?.scannable_code?.image?.download_uri;

            if (chargeRes.ok && chargeResult.status === 'success' && qrUri) {
              this.qrUri = qrUri;
              this.showQrPopup = true;
              this.startPolling(chargeResult.data.id);
            } else {
              console.error('สร้าง charge ไม่สำเร็จ หรือไม่ได้รับ QR Code:', chargeResult);
            }
          } else {
            console.error('สร้าง PromptPay Source ไม่สำเร็จ:', sourceResult);
          }
        } catch (err) {
          console.error('เกิดปัญหาในการเชื่อมต่อเซิร์ฟเวอร์: ', err);
        } finally {
          this.isQrLoading = false;  // ปิด loading
        }
      },
      startPolling(chargeId) {
        console.log("startPolling-chargeId ", chargeId);

        this.isQrLoading = true; // เริ่ม loading

        this.pollingInterval = setInterval(async () => {
          const res = await fetch(`${process.env.VUE_APP_BE_BASE_URL}/api/payment/check-status/${chargeId}`);
          const result = await res.json();

          if (result.data?.paid && result.data.status === 'successful') {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;

            this.isLoading = true;

            setTimeout(() => {
              this.isQrLoading = false; // ปิด loading
              this.showQrPopup = false;

              PopupAlert.fire({
                icon: 'success',
                title: 'ชำระเงินสำเร็จ!',
                text: 'ขอบคุณสำหรับการสั่งซื้อ 🎉',
                confirmButtonText: 'ตกลง',
              });

              this.clearCart();
              this.closeCart();
            }, 3000);
          }
        }, 5000);
      },
      loadOmiseScript() {
        if (!window.OmiseCard) {
          const script = document.createElement('script');
          script.src = process.env.VUE_APP_OMISE_LIBRARY;
          script.async = true;
          script.onload = () => {
            this.omiseCardReady = true;
            console.log('✅ OmiseCard script loaded');
          };
          document.head.appendChild(script);
        } else {
          this.omiseCardReady = true;
        }
      },
      openOmiseCard() {
        if (!window.OmiseCard) {
          console.error('OmiseCard not loaded');
          return;
        }

        window.OmiseCard.configure({
          publicKey: process.env.VUE_APP_OMISE_PUBLIC_KEY, 
          currency: 'THB',
          frameLabel: 'My Shop',
          submitLabel: 'Pay Now',
          buttonLabel: 'Pay with Credit Card'
        });

        // 🟢 Attach ให้ OmiseCard ทำงานร่วมกับปุ่ม (แม้จะเป็นปุ่มซ่อน)
        window.OmiseCard.attach();
          
        window.OmiseCard.open({
          amount: this.totalPrice * 100,
          onCreateTokenSuccess: async (token) => {

            try {
              const response = await fetch(`${process.env.VUE_APP_BE_BASE_URL}/api/payment/create-charge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  card: token,
                  amount: this.totalPrice * 100
                })
              });

              const result = await response.json();

              if (response.ok && result.status === 'success') {
                PopupAlert.fire({
                  icon: 'success',
                  title: 'ชำระเงินสำเร็จ!',
                  text: 'ขอบคุณสำหรับการสั่งซื้อ 🎉',
                  confirmButtonText: 'ตกลง',
                });
                this.clearCart();
              } else {
                PopupAlert.fire({
                  icon: 'error',
                  title: 'ชำระเงินไม่สำเร็จ',
                  text: 'กรุณาลองใหม่อีกครั้ง',
                });
              }
            } catch (err) {
              PopupAlert.fire({
                icon: 'error',
                title: 'เกิดปัญหาในการเชื่อมต่อเซิร์ฟเวอร์',
                text: err,
              });
            }
          },
          onFormClosed: () => {
            console.log('Omise form closed');
          }
        });
      },
      clearCart() {
        this.cart = [];
        localStorage.removeItem('cart');
        this.showCart = false;
      }
    }
  };
</script>
