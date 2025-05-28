<template>
  <div class="product-body">

    <div class="row-product-grid">
      <div v-for="(product, index) in products" :key="index" class="product-card">
        <div class="cart-image-container-p">
          <img class="box-product" :src="product.defaultImg" width="150px" />
          
          <!-- ตะกร้าบนสินค้า -->
          <div @click="openModal(product)" class="cart-icon-btn-p">
            <i class="fas fa-shopping-cart"></i>
          </div>

          <!-- ชื่อสินค้า -->
          <strong class="product-name">{{ product.name }}</strong><br>

          <!-- ราคาสินค้า -->
          <strong align="left" class="product-price-menu">
            ฿ {{ Number(product.options[0].price).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
          </strong>
        </div>
      </div>
    </div>

    <!-- MODAL -->
    <div v-if="selectedProduct" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>{{ selectedProduct.name }}</h2>

        <!-- รูปสินค้าแบบเลือก -->
        <div class="option-images">
          <img
            v-for="(option, index) in selectedProduct.options"
            :key="index"
            :src="option.img"
            @click="selectOption(option)"
            :class="{ selected: selectedOption === option }"
          />
        </div>

        <!-- แสดงชื่อและราคา -->
        <div v-if="selectedOption" style="margin-top: 10px;">
          <strong class="modal-product-name"> {{ selectedOption.name }} </strong><br>
          <span class="modal-product-price"> ฿ {{ selectedOption.price.toLocaleString() }} </span>
        </div>

        <!-- จำนวนสินค้า -->
        <div class="quantity-section">
          <button @click="decreaseQty">-</button>
          <input type="number" v-model.number="quantity" min="1" />
          <button @click="increaseQty">+</button>
        </div>

        <!-- ปุ่มกด -->
        <div style="margin-top: 15px;">
          <button class="cart-button" @click="emitAddToCart"> ใส่ตะกร้า </button>
          <button class="cart-button-close" @click="closeModal" style="margin-left: 10px;"> ปิด </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import catProducts from '../../data/catProducts.js';

  export default {
    name: 'ProductCat',
    props: {
      hideTitle: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        selectedProduct: null,
        selectedOption: null,
        quantity: 1,
        products: catProducts
      };
    },
    methods: {
      openModal(product) {
        this.selectedProduct = product;
        this.selectedOption = product.options[0];
        this.quantity = 1; // รีเซ็ตทุกครั้งที่เปิด
      },
      selectOption(option) {
        this.selectedOption = option;
      },
      increaseQty() {
        this.quantity++;
      },
      decreaseQty() {
        if (this.quantity > 1) this.quantity--;
      },
      emitAddToCart() {
        if (!this.selectedOption) return;

        this.$emit('add-to-cart', {
          id: `${this.selectedProduct.name}-${this.selectedOption.name}`, 
          name: `${this.selectedProduct.name} (${this.selectedOption.name})`,
          price: this.selectedOption.price,
          qty: this.quantity,
          img: this.selectedOption.img || this.selectedProduct.defaultImg
        });

        this.closeModal(); // ปิด modal หลังใส่ตะกร้า
      },
      closeModal() {
        this.selectedProduct = null;
        this.selectedOption = null;
        this.quantity = 1;
      }
    }
  };
</script>