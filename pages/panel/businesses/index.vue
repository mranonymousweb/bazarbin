<template>
  <div>
    <div v-if="loading" class="text-center py-20">
      <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mx-auto mb-4" style="border-top-color: #737cff;"></div>
      <p class="text-gray-500">در حال بارگذاری...</p>
    </div>

    <template v-else>
      <panel-business-list
        v-if="items.length"
        :items="items"
        @click-remove-btn="removeItem"
      />

      <nuxt-link
        v-else
        to="/panel/businesses/new"
        class="add-first-business bg-white p-4 lg:px-16 lg:py-12 rounded w-full text-right text-blue-450 flex items-center"
      >
        <i class="flaticon-032-briefcase text-coolGray-750"></i>
        <span class="text-2xl pl-3 pr-4 lg:pr-6">+</span>
        <span class="lg:text-lg font-semibold">افزودن کسب و کار</span>
      </nuxt-link>
    </template>
  </div>
</template>

<script>
import PanelBusinessList from "~/components/panel/business/list";

definePageMeta({
  layout: 'panel'
})

export default {
  components: {PanelBusinessList},
  data() {
    return {
      items: [],
      loading: false
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const { $axios } = useNuxtApp()
        const response = await $axios.$get('home/businesses')
        console.log('Businesses response:', response)
        // بررسی ساختار response
        if (Array.isArray(response)) {
          this.items = response
        } else if (response && Array.isArray(response.data)) {
          this.items = response.data
        } else {
          this.items = []
        }
        console.log('Businesses items:', this.items)
      } catch (error) {
        console.error('Error loading businesses:', error)
        this.items = []
      } finally {
        this.loading = false
      }
    },
    removeItem(item) {
      console.log(item)
    }
  }
}
</script>

<style scoped>
.add-first-business i {
  font-size: 1.5rem;
}

.loader {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (min-width: 1024px) {
  .add-first-business i {
    font-size: 2.25rem;
  }
}
</style>
