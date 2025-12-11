<template>
  <div>
    <Table :cols="cols" class="hidden md:table">
      <tr
        v-for="(price, index) in prices"
        :key="index"
        :class="['h-12 border-trueGray-200', index + 1 < prices.length ? 'border-b-2' : '']"
      >
        <td class="px-2">{{ price.title }}</td>
        <td class="px-2">{{ price.price.toLocaleString() }}</td>
        <td v-if="!dateable" class="px-2">{{ price.inventory }}</td>
        <td v-if="price.discount" class="px-2">
          {{ price.discount }}% تا
          {{ formatDate(price.discount_expire, 'jYYYY/jMM/jDD') }}
        </td>
        <td v-else class="px-2">-</td>
        <td class="px-2">
          <edit-button label="ویرایش" class="ml-2" @click="$emit('click-edit-btn', index)"/>
          <delete-button label="حذف" @click="$emit('click-delete-btn', index)"/>
        </td>
      </tr>
    </Table>

    <div class="md:hidden border-t">
      <div v-for="(price, index) in prices" :key="index" class="border-b py-3">
        <div class="flex justify-between pb-4">
          <div class="px-2">{{ price.title }}</div>
          <div class="px-2">{{ (+price.price).toLocaleString() }} تومان</div>
          <div v-if="!dateable" class="px-2">{{ price.inventory }}</div>
        </div>
        <div class="flex justify-between">
          <div class="flex-grow">
            <div v-if="price.discount">{{ price.discount }}% تخفیف تا {{ formatDate(price.discount_expire, 'jYYYY/jMM/jDD') }}</div>
          </div>
          <div class="px-2">
            <edit-button label="ویرایش" class="ml-4" @click="$emit('click-edit-btn', index)"/>
            <delete-button label="حذف" @click="$emit('click-delete-btn', index)"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Table from "../../Table.vue";
import EditButton from "../../EditButton.vue";
import DeleteButton from "../../DeleteButton.vue";
import moment from "../../../mixins/moment";

export default {
  name: 'PanelBusinessPricesTable',
  components: {EditButton, Table, DeleteButton},
  mixins: [moment],
  props: {
    prices: {
      type: Array,
      required: true
    },
    dateable: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      cols: [
        {label: 'عنوان'},
        {label: 'قیمت'},
        ... this.dateable ? [] : [{label: 'موجودی'}],
        {label: 'تخفیف'},
        {label: 'عملیات'},
      ]
    }
  }
}
</script>
