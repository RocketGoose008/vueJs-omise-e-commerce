<template>
  <div v-if="cart.length > 0" class="cart-container">
    <div class="cart-header" @click="toggleCart">
      🛒 ตะกร้าสินค้า ({{ cart.length }})
    </div>

    <div v-if="showCart" class="cart-modal">
      <ul>
        <li v-for="(item, index) in cart" :key="index">
          <img :src="item.img" alt="product image" />
          <div>
            <div>{{ item.name }}</div>
            <div>฿{{ item.price }}</div>
            <div>{{ item.qty }} x</div>
          </div>
          <button @click="removeFromCart(index)">ลบ</button>
        </li>
      </ul>
      <div class="total-price">
        <strong>Total:</strong> ฿{{ totalPrice }}
      </div>
      <button @click="checkout">ชำระเงิน</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  data() {
    return {
      showCart: false,
      cart: JSON.parse(localStorage.getItem('cart')) || [],
    };
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    },
  },
  methods: {
    toggleCart() {
      this.showCart = !this.showCart;
    },
    removeFromCart(index) {
      this.cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    checkout() {
      this.$router.push({ name: 'checkout' });
    },
  },
};
</script>

<style scoped>
.cart-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #fff;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}
.cart-modal {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
}
</style>
