<template>
  <div v-if="showCart" class="all-cart-modal-overlay" @click.self="closeCart">
    <div class="all-cart-modal-content">
      <button class="cart-close-modal-btn" @click="closeCart">&times;</button>
      <h2 align="center"> ตะกร้าสินค้า </h2>
      <ul>
        <li v-for="(item, index) in cart" :key="index" class="all-cart-item">
          <img :src="item.img" class="all-cart-item-img" />
          <div class="all-cart-item-detail">
            <div class="all-cart-item-name">{{ item.name }}</div>
            <div class="all-cart-item-meta">
              <div class="product-price-menu"> ฿ {{ item.price.toLocaleString() }} </div>
              <div class="all-cart-qty-controls">
                <button @click="decreaseQty(index)">−</button>
                <span>{{ item.qty }}</span>
                <button @click="increaseQty(index)">＋</button>
              </div>
            </div>
            <div align="right">
              <button class="all-cart-item-remove" @click="removeFromCart(index)"> ลบ </button>
            </div>
          </div>
        </li>
      </ul>
      <div class="all-cart-total">
        <strong> ยอดรวม: </strong>
        <span> ฿ {{ totalPrice }} </span>
      </div>
      <PaymentOptions v-if="!isCheckout" @choose-payment-method="choosePaymentMethod" />
      <PaymentMethod v-if="isCheckout" :paymentMethod="paymentMethod" :totalPrice="totalPrice" />
    </div>
  </div>
</template>

<script>
import PaymentOptions from './PaymentOptions.vue';
import PaymentMethod from './PaymentMethod.vue';

export default {
  props: ['showCart', 'cart', 'isCheckout', 'paymentMethod', 'totalPrice'],
  methods: {
    closeCart() {
      this.$emit('close-cart');
    },
    increaseQty(index) {
      this.$emit('increase-qty', index);
    },
    decreaseQty(index) {
      this.$emit('decrease-qty', index);
    },
    removeFromCart(index) {
      this.$emit('remove-from-cart', index);
    },
    choosePaymentMethod() {
      this.$emit('choose-payment-method');
    }
  },
  components: {
    PaymentOptions,
    PaymentMethod
  }
};
</script>
