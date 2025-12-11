<template>
  <div>
    <admin-list
      v-if="city"
      icon="flaticon-097-pin"
      icon-class=""
      title="لیست خیابان ها"
      :cols="cols"
      :pagination="pagination"
      @select-page="loadNewPage"
    >
      <template #after-title>
        <nuxt-link :to="`/admin/cities/${city}/streets/new`" class="float-left text-sm text-blue-450">
          <i class="flaticon-043-plus w-7 font-bold text-xs"></i>
          افزودن خیابان جدید
        </nuxt-link>
      </template>
      <template #tbody>
        <tr v-if="!items || !items.data || !items.data.length">
          <td colspan="4" class="text-center py-4">هیچ خیابانی تعریف نشده است</td>
        </tr>
        <tr
          v-for="(item, index) in items.data"
          :key="item.id"
          :class="{
            'h-12 border-trueGray-200':true,
            'border-b-2': index + 1 < items.length
          }"
        >
          <td class="px-2" v-text="item.name"></td>
          <td class="px-2" v-text="item.city.name"></td>
          <td class="px-2">
            <EnableDisableButton
              :status="item.status"
              @enable="enableItem(item)"
              @disable="disableItem(item)"
            />
          </td>
          <td class="px-2">
            <EditButton
              label="ویرایش خیابان"
              @click="$router.push(`/admin/cities/${city}/streets/${item.id}/edit`)"
            />
            <DeleteButton
              label="حذف خیابان" class="mr-2"
              @click="removeRequest(index)"
            />
          </td>
        </tr>
      </template>
    </admin-list>

    <div v-else class="rounded p-4 bg-white">
      <h3 class="mb-4">
        <i class="flaticon-097-pin"></i>
        <span class="font-semibold text-sm">لیست خیابان ها</span>
      </h3>
      <div class="text-center text-gray-500 my-20">
        یک شهر را انتخاب نمایید
      </div>
    </div>

    <delete-confirmation-modal
      :show="deleteModal"
      @close="deleteModal = false"
      @confirm="removeConfirm(items.data[removeIndex])"
    />

  </div>
</template>

<script>
export default {
  name: "AdminCitiesStreetsList",
  props: {
    city: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      deleteModal: false,
      removeIndex: null,
      items: [],
      cols: [
        {label: 'نام', class: 'w-5/12 lg:w-5/12'},
        {label: 'شهر', class: 'w-3/12 lg:w-3/12'},
        {label: 'وضعیت', class: 'w-2/12 lg:w-2/12'},
        {label: 'عملیات', class: 'w-2/12'},
      ],
      pagination: {
      currentPage: 1,
        lastPage: 2,
        fromItem: 1,
        toItem: 1,
        totalItems: 1,
        perPage: 15,
        path: null
    }
    }
  },
  async fetch() {
    if (!this.city)
      return;
    const url = this.pagination.path
      ? this.pagination.path + '?page=' + this.pagination.currentPage
      : 'admin/city/streets/' + this.city
    await this.$axios.$get(url)
      .then(response => {
        this.items = response
        this.pagination.currentPage = response.current_page
        this.pagination.lastPage = response.last_page
        this.pagination.fromItem = response.from
        this.pagination.toItem = response.to
        this.pagination.totalItems = response.total
        this.pagination.perPage = response.per_page
        this.pagination.path = response.path
        this.loading = false
      })
  },
  watch: {
    city() {
      this.$fetch()
    }
  },
  methods: {
    loadNewPage(page) {
      this.pagination.currentPage = page
      this.loading = true
      this.$fetch()
    },
    enableItem(item) {
      this.$store.commit('notification/closeAll')
      const data = {...item}
      data.status = 1
      this.$axios.$put(`admin/streets/${item.id}`, data)
        .then(() => {
          this.$store.commit('notification/success', 'خیابان ' + `<b>${item.name}</b>` + ' فعال شد.')
          this.$fetch()
        })
    },
    disableItem(item) {
      this.$store.commit('notification/closeAll')
      const data = {...item}
      data.status = 0
      this.$axios.$put(`admin/streets/${item.id}`, data)
        .then(() => {
          this.$store.commit('notification/success', 'خیابان ' + `<b>${item.name}</b>` + ' غیر فعال شد.')
          this.$fetch()
        })
    },
    removeRequest(index) {
      this.removeIndex = index
      this.deleteModal = true
    },
    removeConfirm(item) {
      this.deleteModal = false
      this.$store.commit('notification/closeAll')
      this.$axios.$delete(`admin/streets/${item.id}`)
        .then(() => {
          this.$store.commit('notification/success', 'خیابان ' + `<b>${item.name}</b>` + ' حذف شد.')
          this.$fetch()
        })
    }
  }
}
</script>
