<template>

  <div class="rounded p-4 bg-white">

    <h3 class="mb-4 flex items-center justify-between">
      <span>
        <i v-if="icon" :class="icon + ' pl-2 ' + iconClass"></i>
        <span class="font-semibold text-sm" v-text="title"></span>
      </span>
      <slot name="after-title"/>
    </h3>

    <table class="w-full text-sm">

      <thead>
      <tr class="bg-gray-50 h-12">
        <th
          v-for="col in cols"
          :key="col.label"
          :class="'text-right px-2 ' + col.class"
          v-text="col.label"
        ></th>
      </tr>
      </thead>

      <tbody>
      <slot name="tbody"/>
      </tbody>

    </table>

    <Pagination
      v-if="pagination && pagination.lastPage > 1"
      :current-page="pagination.currentPage"
      :last-page="pagination.lastPage"
      :from-item="pagination.fromItem"
      :to-item="pagination.toItem"
      :total-items="pagination.totalItems"
      @select-page="$emit('select-page', $event)"
    />

  </div>

</template>

<script>
export default {
  name: "AdminList",
  props: {
    title: {
      type: String,
      required: true
    },
    cols: {
      type: Array,
      required: true,
    },
    icon: {
      type: String,
      default: null
    },
    iconClass: {
      type: String,
      default: null
    },
    pagination: {
      type: Object,
      default: null,
    }
  }
}
</script>
