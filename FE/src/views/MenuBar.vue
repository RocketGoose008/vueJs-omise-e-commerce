<template>
  <div class="container" :class="{ 'sidebar-layout': isSidebar }">
    
    <!-- Navbar -->
    <nav class="navbar">
      <a href="#" @click.prevent="show('all')">All</a>
      <a href="#" @click.prevent="show('tree')">Succulents</a>
      <a href="#" @click.prevent="show('cat')">Cats</a>
      <a href="#" @click.prevent="show('toys')">Art toys</a>
    </nav>

    <!-- เนื้อหา -->
    <div class="main-content">
      <transition>
        <component 
          :is="currentComponent" 
          v-if="currentComponent" 
          @add-to-cart="$emit('add-to-cart', $event)" 
        />
      </transition>
    </div>

  </div>
</template>

<script>
  import ProductTree from '@/components/ProductCategories/ProductTree.vue';
  import ProductCat from '@/components/ProductCategories/ProductCat.vue';
  import ProductToys from '@/components/ProductCategories/ProductToys.vue';
  import AllProducts from '@/components/AllProducts.vue';
  import ShoppingCart from '@/components/ShoppingCart.vue';

  import ProductAll from './ProductAll.vue';
  import SiteFooter from './SiteFooter.vue';

  export default {
    name: 'MenuBar',
    components: {
      ProductAll,
      AllProducts,
      ProductTree,
      ProductCat,
      ProductToys,
      SiteFooter,
      ShoppingCart
    },
    data() {
      return {
        // ตั้งค่าเริ่มต้นให้แสดงหน้า "ทั้งหมด" (AllProducts)
        currentComponent: 'AllProducts',
        isSidebar: false
      };
    },
    mounted() {
    this.checkWindowSize();
      window.addEventListener('resize', this.checkWindowSize);
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.checkWindowSize);
    },
    methods: {
      show(type) {
        if (type === 'all') this.currentComponent = 'AllProducts';
        else if (type === 'tree') this.currentComponent = 'ProductTree';
        else if (type === 'cat') this.currentComponent = 'ProductCat';
        else if (type === 'toys') this.currentComponent = 'ProductToys';
      },
      handleAddToCart(item) {
        this.$emit('add-to-cart', item);
      },
      checkWindowSize() {
        this.isSidebar = window.innerWidth <= 1200;
      }
    }
  };
</script>
