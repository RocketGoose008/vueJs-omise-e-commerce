<template>
  <div class="product-all">

    <h1> รวมสินค้าทั้งหมด </h1>

    <!-- เรียกคอมโพเนนต์ย่อย -->
    <section>
      <ProductTree :hideTitle="true" @add-to-cart="addToCart" />
    </section>

    <section>
      <ProductCat :hideTitle="true" @add-to-cart="addToCart" />
    </section>

    <section>
      <ProductToys :hideTitle="true" @add-to-cart="addToCart" />
    </section>

    <!-- Modal ตะกร้าสินค้า -->
    <div v-if="showCart" class="all-cart-modal-overlay" @click.self="closeCart">
      <div class="all-cart-modal-content">

        <!-- ปุ่มกากบาทมุมขวาบน -->
        <button class="cart-close-modal-btn" @click="closeCart">&times;</button>

        <h2 align="center"> ตะกร้าสินค้า </h2>

        <!-- แสดงรายการสินค้าในตะกร้า -->
        <ul>
          <li v-for="(item, index) in cart" :key="index" class="all-cart-item">

            <img :src="item.img" class="all-cart-item-img" />
            
            <div class="all-cart-item-detail">
              <!-- ชื่อสินค้า -->
              <div class="all-cart-item-name">{{ item.name }}</div>

              <div class="all-cart-item-meta">
                <!-- ราคาสินค้า -->
                <div class="product-price-menu"> 
                  ฿ {{ item.price }}
                </div>

                <!-- ปุ่มเพิ่ม/ลดจำนวน -->
                <div class="all-cart-qty-controls">
                  <button @click="decreaseQty(index)">−</button>
                  <span>{{ item.qty }}</span>
                  <button @click="increaseQty(index)">＋</button>
                </div>
              </div>

              <!-- ปุ่มลบ -->
              <div align="right">
                <button class="all-cart-item-remove" @click="removeFromCart(index)"> ลบ </button>
              </div>
            </div>
            
          </li>
        </ul>

        <!-- แสดงยอดรวม -->
        <div class="all-cart-total">
          <strong> ยอดรวม: </strong>
          <div class="product-price-menu"> ฿ {{ totalPrice }} </div>
        </div>

        <!-- ปุ่มเลือกวิธีการชำระเงิน -->
        <div v-if="!isCheckout" class="payment-option-container">
          <button class="cart-button" @click="choosePaymentMethod">เลือกวิธีการชำระเงิน</button>
        </div>

        <!-- ตัวเลือกการจ่ายเงิน -->
        <div v-if="showPaymentOptions" class="payment-option-container">
          <div class="payment-option" @click="selectPaymentMethod('creditCard')">
            <h3>จ่ายผ่านบัตรเครดิต</h3>
          </div>
          <div class="payment-option" @click="selectPaymentMethod('qrCode')">
            <h3>จ่ายผ่าน QR Code</h3>
          </div>
        </div>

         <!-- ฟอร์มการชำระเงินแบบ Credit Card -->
        <div v-if="paymentMethod === 'creditCard'" class="credit-card-form">
          <div id="credit-card-form"></div>
        </div>

        <!-- แสดง QR Code -->
        <div v-if="paymentMethod === 'qrCode'" class="qr-code">
          <div id="qrcode"></div>
        </div>

      </div>
    </div>


  </div>
</template>

<script>
  import ProductTree from '@/components/ProductCategories/ProductTree.vue';
  import ProductCat from '@/components/ProductCategories/ProductCat.vue';
  import ProductToys from '@/components/ProductCategories/ProductToys.vue';

  import QRCode from 'qrcode';
  import OmiseCard from 'omise';

  export default {
    name: 'ProductAll',
    components: {
      ProductTree,
      ProductCat,
      ProductToys
    },

    data() {
      return {
        cart: JSON.parse(localStorage.getItem('cart')) || [],
        showCart: false,
        isCheckout: false, // ใช้สำหรับแสดง/ซ่อนตัวเลือกการชำระเงิน
        paymentMethod: '', // ตัวแปรเพื่อเก็บวิธีการชำระเงินที่เลือก
        qrcodeScriptLoaded: false, // ตัวแปรบอกว่า QRCode.js โหลดเสร็จแล้ว
        showPaymentOptions: false, // ตัวแปรใหม่เพื่อควบคุมการแสดงตัวเลือกวิธีการชำระเงิน
      };
    },

    computed: {
      // คำนวณราคาทั้งหมดในตะกร้า
      totalPrice() {
        const total = this.cart.reduce((acc, item) => acc + item.price * item.qty, 0);
        return total.toFixed(2);
      }
    },

    mounted() {
      this.loadCart();
      this.loadOmiseScript();
      this.generateQRCode();

      // ตรวจสอบว่า OmiseCard ถูกโหลดแล้ว
      if (typeof OmiseCard === 'undefined') {
        console.error('OmiseCard is not available!');
        this.errorMessage = 'OmiseCard is not available';
      }
    },

    methods: {
      // ------------ ตะกร้า ------------
      // ฟังก์ชันเพิ่มสินค้าในตะกร้า
      addToCart(item) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(item); // เพิ่มสินค้าลงในตะกร้า
        localStorage.setItem('cart', JSON.stringify(cart)); // บันทึกข้อมูลใน localStorage
        this.loadCart(); // โหลดตะกร้าใหม่
      },
      // ฟังก์ชันลบสินค้าออกจากตะกร้า
      removeFromCart(index) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1); // ลบสินค้าตาม index
        localStorage.setItem('cart', JSON.stringify(cart)); // อัปเดตข้อมูลใน localStorage
        this.loadCart(); // โหลดตะกร้าใหม่
      },
      // ฟังก์ชันโหลดข้อมูลตะกร้าจาก localStorage
      loadCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.cart = cart; // อัปเดตข้อมูลใน component
      },
      // เพิ่มจำนวนสินค้า
      increaseQty(index) {
        this.cart[index].qty += 1;
        localStorage.setItem('cart', JSON.stringify(this.cart));
      },
      // ลดจำนวนสินค้า
      decreaseQty(index) {
        if (this.cart[index].qty > 1) {
          this.cart[index].qty -= 1;
          localStorage.setItem('cart', JSON.stringify(this.cart));
        } else {
          this.removeFromCart(index);
        }
      },
      // ปิด modal ตะกร้าสินค้า
      closeCart() {
        this.isCheckout = false;
        this.currentStep = 1; // กลับไปที่ขั้นตอนเลือกสินค้า
        this.showCart = false;
      },

      // ------------ จ่ายเงิน ------------
      // ฟังก์ชันที่โหลด OmiseCard และเปิดการชำระเงินผ่านบัตรเครดิต
      loadOmiseScript() {
        if (!window.OmiseCard) {
          const script = document.createElement('script');
          script.src = process.env.VUE_APP_OMISE_LIBRARY;
          script.async = true;
          script.onload = () => {
            console.log('✅ OmiseCard script loaded');
            this.omiseCardReady = true;  // ตั้งค่าสถานะว่า OmiseCard โหลดเสร็จแล้ว
          };
          document.head.appendChild(script);
        } else {
          console.log('OmiseCard script already loaded');
          this.omiseCardReady = true;
        }
      },

      // เลือกวิธีการชำระเงิน (QR Code หรือ Credit Card)
      selectPaymentMethod(method) {
        // ตรวจสอบว่า OmiseCard โหลดเสร็จแล้วหรือยัง
        if (!this.omiseCardReady) {
          console.log('OmiseCard is not ready');
          return;
        }
        // เลือกวิธีการชำระเงิน
        this.paymentMethod = method;
        if (!window.OmiseCard) {
          console.error('OmiseCard SDK not loaded');
          return;
        }
        // เปิด OmiseCard
        if (method === 'creditCard') {
          window.OmiseCard.configure({
            defaultPaymentMethod: 'credit_card',
          });

          // ตรวจสอบว่า OmiseCard ถูกโหลดและ iframe สามารถใช้งานได้
          window.OmiseCard.open({
            amount: this.totalPrice * 100,
            onCreateTokenSuccess: (token) => {
              console.log('✅ Token:', token);
            },
            onFormClosed: () => {
              // ลบ overlay และ iframe ที่เกี่ยวข้องกับ OmiseCard ออกให้หมด
              const overlay = document.querySelector('.omise-overlay');
              if (overlay) {
                overlay.remove();
              }

              const iframe = document.querySelector('iframe[src*="omise.co/pay"]');
              if (iframe) {
                iframe.remove();
              }

              // ลบคลาส dim ที่อาจจะทำให้หน้าจอมืด
              const modalOverlay = document.querySelector('.all-cart-modal-overlay');
              if (modalOverlay) {
                modalOverlay.classList.remove('dim');
              }

              // ลบคลาส dim ออกจาก body ถ้ามี
              const body = document.querySelector('body');
              if (body && body.classList.contains('dim')) {
                body.classList.remove('dim');
              }

              // ตรวจสอบให้มั่นใจว่า modal ตะกร้าสินค้าไม่ถูกปิด
              if (this.showCart) {
                const cartModalOverlay = document.querySelector('.all-cart-modal-overlay');
                if (cartModalOverlay) {
                  cartModalOverlay.classList.remove('dim');
                }
              }

              // รอให้ DOM อัปเดตก่อนทำการแก้ไข
              this.$nextTick(() => {
                // ลบ dim ออกจาก body
                const body = document.querySelector('body');
                if (body && body.classList.contains('dim')) {
                  body.classList.remove('dim');
                }
              });
            }
          });
        } else if (method === 'qrCode') {
          this.generateQRCode();
        }
      },

      // ฟังก์ชันที่ใช้เลือกวิธีการชำระเงิน
      choosePaymentMethod() {
        this.isCheckout = true;
        this.currentStep = 2; // เปลี่ยนขั้นตอนเป็น "เลือกวิธีการชำระเงิน"
        this.showPaymentOptions = true; // แสดงตัวเลือกวิธีการชำระเงิน
      },

      // ฟังก์ชันสร้าง QR Code สำหรับการชำระเงิน
      generateQRCode() {
        const el = document.getElementById('qrcode');
        const amount = this.totalPrice; // ค่าราคาทั้งหมดจากตะกร้า
        
        // ตรวจสอบว่า amount เป็นค่าที่ถูกต้อง
        console.log('Amount:', amount);
        
        if (!amount || isNaN(amount)) {
          console.error('Invalid amount value:', amount);
          return;
        }

        if (!this.paymentMethod) {
          console.error('Payment method is not selected');
          return;
        }

        // สร้าง URL สำหรับ QR Code
        const url = `http://localhost:8080/create-charge?amount=${encodeURIComponent(amount)}`;

        // ตรวจสอบว่า URL ที่สร้างขึ้นถูกต้อง
        console.log('QR Code URL:', url);

        // สร้าง QR Code
        if (el) {
          el.innerHTML = ''; // ล้าง content เก่าออกก่อน
          QRCode.toCanvas(el, url, (err) => {
            if (err) {
              console.error('Error generating QR code:', err);
            } else {
              console.log('QR code generated successfully');
            }
          });
        }
      },

      // ฟังก์ชันลบ overlay ที่เกี่ยวข้องกับ OmiseCard
      clearOmiseCardOverlay() {
        const overlay = document.querySelector('.omise-overlay');
        if (overlay) {
          overlay.remove();
        }

        const iframe = document.querySelector('iframe[src*="omise.co/pay"]');
        if (iframe) {
          iframe.remove();
        }

        // ลบคลาส dim ที่อาจจะทำให้หน้าจอมืด
        const modalOverlay = document.querySelector('.all-cart-modal-overlay');
        if (modalOverlay) {
          modalOverlay.classList.remove('dim');
        }

        // ลบคลาส dim ออกจาก body ถ้ามี
        const body = document.querySelector('body');
        if (body && body.classList.contains('dim')) {
          body.classList.remove('dim');
        }

        // ตรวจสอบให้มั่นใจว่า modal ตะกร้าสินค้าไม่ถูกปิด
        if (this.showCart) {
          const cartModalOverlay = document.querySelector('.all-cart-modal-overlay');
          if (cartModalOverlay) {
            cartModalOverlay.classList.remove('dim');
          }
        }

        // รอให้ DOM อัปเดตก่อนทำการแก้ไข
        this.$nextTick(() => {
          // ลบ dim ออกจาก body
          const body = document.querySelector('body');
          if (body && body.classList.contains('dim')) {
            body.classList.remove('dim');
          }
        });
      },

      openOmiseCard() {
        if (!window.OmiseCard) {
          console.error('OmiseCard library not loaded');
          return;
        }

        window.OmiseCard.configure({
          publicKey: process.env.VUE_APP_OMISE_PUBLIC_KEY, // <-- ใส่ public key ของคุณที่นี่
          frameLabel: 'My Shop',
          submitLabel: 'Pay Now',
          buttonLabel: 'Pay with Credit Card',
          currency: 'THB',
          defaultPaymentMethod: 'credit_card',
          otherPaymentMethods: []
        });

        window.OmiseCard.open({
          amount: this.totalPrice * 100, // Omise ใช้หน่วยเป็น 'สตางค์'
          onCreateTokenSuccess: (token) => {
            console.log('Got token from Omise:', token);

            // ส่ง token นี้ไปที่ backend ของคุณ เพื่อชำระเงินจริง
            this.sendToBackend(token);
          },
          onFormClosed: () => {
            console.log('Omise form closed');
          }
        });
      },

      // ฟังก์ชันการจ่ายเงิน
      checkout() {
        this.isCheckout = true;
        this.currentStep = 2; // เปลี่ยนขั้นตอนเป็น "เลือกวิธีการชำระเงิน"
      }
      
    }
  };
</script>
