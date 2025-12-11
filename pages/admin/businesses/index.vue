<template>
  <div class="rounded bg-white">
    <Tabs
      :tabs="tabs"
      :active="tab"
      @click="tab = $event"
    >
      <template #afterTabs>
        <nuxt-link to="/admin/businesses/new" class="float-left text-sm text-blue-450 ml-4 mt-4">
          <i class="flaticon-043-plus w-7 font-bold text-xs"></i>
          افزودن کسب و کار جدید
        </nuxt-link>
      </template>
    </Tabs>

    <div>

      <admin-businesses-list
        v-if="tab === 'businesses'"
        key="businesses"
        ref="businesses"
        list="all"
        @load-pagination="businessesCount = $event.totalItems"
      />

      <admin-businesses-list
        v-if="tab === 'edited'"
        key="edited"
        ref="edited"
        list="edited"
        @load-pagination="editedCount = $event.totalItems"
      />

      <admin-businesses-list
        v-if="tab === 'new'"
        key="new"
        ref="new"
        list="new"
        @load-pagination="newCount = $event.totalItems"
      />

      <admin-businesses-list
        v-if="tab === 'disabled'"
        key="disabled"
        ref="disabled"
        list="disabled"
        @load-pagination="disabledCount = $event.totalItems"
      />

      <admin-businesses-list
        v-if="tab === 'suspended'"
        key="suspended"
        ref="suspended"
        list="suspended"
        @load-pagination="suspendedCount = $event.totalItems"
      />
    </div>

  </div>
</template>

<script>
import Tabs from "../../../components/Tabs";
import AdminBusinessesList from "../../../components/admin/businesses/List";

definePageMeta({
  layout: 'admin'
})

export default {
  components: {AdminBusinessesList, Tabs},
  data() {
    return {
      tab: 'businesses',
      businessesCount: null,
      editedCount: null,
      newCount: null,
      disabledCount: null,
      suspendedCount: null,
    }
  },
  computed: {
    tabs() {
      return [
        {name: 'businesses', label: 'لیست کسب و کار', icon: 'flaticon-032-briefcase', counter: this.businessesCount || 0},
        {name: 'edited', label: 'ویرایش شده', counter: this.editedCount || 0},
        {name: 'new', label: 'ثبت نام شده', counter: this.newCount || 0},
        {name: 'disabled', label: 'غیرفعال کاربر', counter: this.disabledCount || 0},
        {name: 'suspended', label: 'غیرفعال من', counter: this.suspendedCount || 0},
      ]
    }
  },
}
</script>
