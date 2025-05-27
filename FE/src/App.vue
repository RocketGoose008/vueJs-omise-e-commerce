<template>
  <div id="app">
    <!-- เชื่อม ref="cart" -->
    <ShoppingCart ref="cart" />

    <main style="display: flex;">
      <div style="flex: 1;">
        <!-- รับ event ใส่ตะกร้าจากทุกที่ -->
        <router-view @add-to-cart="handleAddToCart" />
      </div>
    </main>
  </div>
</template>

<script>
import ShoppingCart from '@/components/ShoppingCart.vue';

export default {
  components: {
    ShoppingCart
  },
  methods: {
    handleAddToCart(item) {
      this.$refs.cart.addToCart(item); // เรียกฟังก์ชันใน ShoppingCart.vue
    }
  }
}
</script>
