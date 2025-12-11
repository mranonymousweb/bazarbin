<template>
  <div class="rounded bg-white">
    <Tabs
      :tabs="tabs"
      :active="tab"
      @click="tab = $event"
    />

    <AdminReportsList
      v-if="tab === 'new'"
      key="new"
      ref="new"
      list="new"
    />

    <AdminReportsList
      v-if="tab === 'accepted'"
      key="accepted"
      ref="accepted"
      list="accepted"
    />

    <AdminReportsList
      v-if="tab === 'rejected'"
      key="rejected"
      ref="rejected"
      list="rejected"
    />

  </div>
</template>

<script>

import Tabs from "../../components/Tabs.vue";
import AdminReportsList from "../../components/admin/reports/list.vue";

definePageMeta({
  layout: 'admin'
})

export default {
  components: {AdminReportsList, Tabs},
  data() {
    return {
      tab: 'new',
      tabs: [
        {name: 'new', label: 'بررسی نشده'},
        {name: 'accepted', label: 'قبول شده'},
        {name: 'rejected', label: 'رد شده'},
      ],
    }
  }
}

</script>
