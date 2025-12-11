<template>

  <div class="rounded bg-white">

    <Tabs
      :tabs="tabs"
      :active="tab"
      @click="tab = $event"
    >
      <template #afterTabs>
        <nuxt-link to="/admin/products/new" class="float-left text-sm text-blue-450 ml-4 mt-4">
          <i class="flaticon-043-plus w-7 font-bold text-xs"></i>
          افزودن محصول جدید
        </nuxt-link>
      </template>
    </Tabs>

    <div>
      <admin-products-list v-if="tab === 'products'" key="products"/>
      <admin-products-requests v-if="tab === 'requests'" key="requests"/>
    </div>

  </div>

</template>

<script>

import AdminProductsList from "../../../components/admin/products/List";
import AdminProductsRequests from "../../../components/admin/products/Requests";
import Tabs from "../../../components/Tabs";

definePageMeta({
  layout: 'admin'
})

export default {
  name: "AdminProductsPage",
  components: {Tabs, AdminProductsRequests, AdminProductsList},
  data() {
    return {
      tab: 'products',
      tabs: [
        {name: 'products', label: 'لیست محصولات', icon: 'flaticon-063-picture'},
        {name: 'requests', label: 'محصولات ثبت شده'}
      ],
    }
  }
}
</script>

<style>
.admin-products ul li{
  border-bottom-color: #000;
}
</style>
