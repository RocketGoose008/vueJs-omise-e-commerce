<template>
  <div class="product-all">

    <!-- แถบตะกร้าสินค้า -->
    <div class="all-cart-header">
      <div class="top-cart-button" @click="showCart = true">
        🛒 ตะกร้าสินค้า ({{ cart.length }})
      </div>
    </div>

    <h1> รวมสินค้าทั้งหมด </h1>

    <!-- เรียกคอมโพเนนต์สินค้า -->
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

        <!-- ปุ่มปิด modal -->
        <button class="cart-close-modal-btn" @click="closeCart">&times;</button>

        <h2 align="center"> ตะกร้าสินค้า </h2>

        <!-- แสดงรายการสินค้าในตะกร้า -->
        <ul>
          <li v-for="(item, index) in cart" :key="index" class="all-cart-item">
            <CartItem
              :item="item"
              :index="index"
              @increase-qty="increaseQty"
              @decrease-qty="decreaseQty"
              @remove-item="removeFromCart"
            />
          </li>
        </ul>

        <!-- สรุปยอดรวม -->
        <CartSummary :totalPrice="totalPrice" />

        <!-- ปุ่มเลือกวิธีการชำระเงิน -->
        <div v-if="!isCheckout" class="payment-option-container">
          <button class="cart-button" @click="choosePaymentMethod">เลือกวิธีการชำระเงิน</button>
        </div>

        <!-- ตัวเลือกวิธีชำระเงิน -->
        <div v-if="showPaymentOptions">
          <PaymentOptions @select-method="selectPaymentMethod" />
        </div>

        <!-- ฟอร์มบัตรเครดิต -->
        <div v-if="paymentMethod === 'creditCard'">
          <CreditCardPayment />
        </div>

        <!-- QR Code -->
        <div v-if="paymentMethod === 'qrCode'">
          <QRCodeDisplay />
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import ProductTree from '@/components/ProductCategories/ProductTree.vue';
import ProductCat from '@/components/ProductCategories/ProductCat.vue';
import ProductToys from '@/components/ProductCategories/ProductToys.vue';

import CartItem from '@/components/Cart/CartItem.vue';
import CartSummary from '@/components/Cart/CartSummary.vue';

import PaymentOptions from '@/components/Payments/PaymentOptions.vue';
import CreditCardPayment from '@/components/Payments/CreditCardPayment.vue';
import QRCodeDisplay from '@/components/Payments/QRCodeDisplay.vue';

import QRCode from 'qrcode';

export default {
  name: 'ProductAll',
  components: {
    ProductTree,
    ProductCat,
    ProductToys,
    CartItem,
    CartSummary,
    PaymentOptions,
    CreditCardPayment,
    QRCodeDisplay
  },
  data() {
    return {
      cart: JSON.parse(localStorage.getItem('cart')) || [],
      showCart: false,
      isCheckout: false,
      paymentMethod: '',
      showPaymentOptions: false,
      omiseCardReady: false
    };
  },
  computed: {
    totalPrice() {
      const total = this.cart.reduce((acc, item) => acc + item.price * item.qty, 0);
      return total.toFixed(2);
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
    removeFromCart(index) {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      this.loadCart();
    },
    loadCart() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      this.cart = cart;
    },
    increaseQty(index) {
      this.cart[index].qty += 1;
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    decreaseQty(index) {
      if (this.cart[index].qty > 1) {
        this.cart[index].qty -= 1;
        localStorage.setItem('cart', JSON.stringify(this.cart));
      } else {
        this.removeFromCart(index);
      }
    },
    closeCart() {
      this.isCheckout = false;
      this.paymentMethod = '';
      this.showCart = false;
    },
    choosePaymentMethod() {
      this.isCheckout = true;
      this.showPaymentOptions = true;
    },
    selectPaymentMethod(method) {
      this.paymentMethod = method;
      if (method === 'creditCard') {
        this.openOmiseCard();
      } else if (method === 'qrCode') {
        this.generateQRCode();
      }
    },
    loadOmiseScript() {
      if (!window.OmiseCard) {
        const script = document.createElement('script');
        script.src = process.env.VUE_APP_OMISE_LIBRARY;
        script.async = true;
        script.onload = () => {
          console.log('✅ OmiseCard loaded');
          this.omiseCardReady = true;
        };
        document.head.appendChild(script);
      } else {
        this.omiseCardReady = true;
      }
    },
    openOmiseCard() {
      if (!window.OmiseCard || !this.omiseCardReady) {
        console.error('OmiseCard not ready');
        return;
      }

      window.OmiseCard.configure({
        publicKey: process.env.VUE_APP_OMISE_PUBLIC_KEY,
        defaultPaymentMethod: 'credit_card'
      });

      window.OmiseCard.open({
        amount: this.totalPrice * 100,
        onCreateTokenSuccess: (token) => {
          console.log('Token from Omise:', token);
          // TODO: ส่ง token ไปที่ backend
        },
        onFormClosed: () => {
          console.log('OmiseCard form closed');
        }
      });
    },
    generateQRCode() {
      const el = document.getElementById('qrcode');
      const url = `http://localhost:8080/create-charge?amount=${encodeURIComponent(this.totalPrice)}`;

      if (el) {
        el.innerHTML = '';
        QRCode.toCanvas(el, url, (err) => {
          if (err) console.error('QR Code error', err);
          else console.log('✅ QR Code generated');
        });
      }
    }
  }
};
</script>
