import { createRouter, createWebHistory } from 'vue-router';

// ----- Pages ----- //
import MenuBar from '../views/MenuBar.vue';
import ProductAll from '../views/ProductAll.vue';

// ----- Components ----- //
import TreePage from '@/components/ProductCategories/ProductTree.vue';
import CatPage from '@/components/ProductCategories/ProductCat.vue';
import ToysPage from '@/components/ProductCategories/ProductToys.vue';
import AllProducts from '@/components/AllProducts.vue'

const routes = [
  {
    path: '/',
    name: 'MenuBar',
    component: MenuBar 
  },
  {
    path: '/all-product',
    name: 'AllProduct',
    component: AllProducts 
  },
  {
    path: '/product-all',
    name: 'ProductAll',
    component: ProductAll 
  },
  {
    path: '/product-tree',
    name: 'ProductTree',
    component: TreePage 
  },
  {
    path: '/product-cat',
    name: 'ProductCat',
    component: CatPage 
  },
  {
    path: '/product-toys',
    name: 'ProductToys',
    component: ToysPage 
  }
];

// สร้าง router
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
