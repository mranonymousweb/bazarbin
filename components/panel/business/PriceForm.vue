<template>
  <div>

    <div class="flex flex-wrap md:flex-nowrap md:mb-8">

      <Input
        v-model="title"
        label="عنوان قیمت"
        input-class="text-sm md:text-base"
        class="w-full md:w-80 md:pl-3 mb-3 md:mb-0 flex-grow"
      />

      <div class="w-1/2 md:w-56 pl-2 md:px-3 mb-3 md:mb-0 flex-grow">
        <Input
          v-model="price"
          label="قیمت"
          input-class="text-sm md:text-base"
          class="w-full"
          type="number"
        />
        <div v-if="price" class="text-xs text-gray-500 mt-1">
          {{ priceToStr(+price) }}
        </div>
      </div>

      <Input
        v-if="!dateable"
        v-model="inventory"
        label="موجودی"
        input-class="text-sm md:text-base"
        class="w-1/2 md:w-36 pr-2 md:px-3 mb-3 md:mb-0 flex-grow"
        type="number"
      />

      <Input
        v-model="discount"
        label="تخفیف"
        input-class="text-sm md:text-base"
        class="w-1/2 md:w-36 pl-2 md:px-3 mb-3 md:mb-0 flex-grow"
        type="number"
      />

      <div class="w-1/2 md:w-56 pr-2 md:pr-3 mb-3 md:mb-0">
        <label class="block pb-2">اعتبار تخفیف</label>
        <div>
          <input
            class="block bg-gray-50 rounded w-full p-2 border-none focus:outline-none focus:ring-2 focus:ring-blue-450 datePicker-input"
            @focus="$refs.datePicker.focus()"
          />
        </div>
      </div>

      <data-picker
        ref="datePicker"
        v-model="discount_expire"
        custom-input=".datePicker-input"
        type="datetime"
        format="YYYY/MM/DD HH:mm"
        display-format="jYYYY/jMM/jDD HH:mm"
      />
    </div>

    <Input
      v-model="description"
      label="توضیح قیمت"
      type="textarea"
      rows="3"
      class="mb-3 md:mb-12"
    />

    <div class="mb-8">
      <SubmitBtn
        :label="item ? 'بروزرسانی قیمت' : 'افزودن قیمت'"
        :icon="item ? '' : 'flaticon-043-plus'"
        :label-class="item ? 'pr-8' : ''"
        class="mx-auto"
        @click="submit"
      />
    </div>

  </div>
</template>

<script>

import Input from "~/components/Input";
import SubmitBtn from "~/components/SubmitBtn";
import pts from "~/mixins/priceToStr";

export default {
  name: 'PanelBusinessPriceForm',
  components: {Input, SubmitBtn},
  mixins: [pts],
  props: {
    item: {
      type: Object,
      default: null
    },
    dateable: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '',
      price: '',
      inventory: '',
      discount: '',
      discount_expire: '',
      description: '',
    }
  },
  watch: {
    item() {
      this.parseValue()
    }
  },
  created() {
    this.parseValue()
  },
  methods: {
    parseValue() {
      this.title = this.item?.title || ''
      this.price = this.item?.price?.toString() || ''
      this.inventory = this.item?.inventory?.toString() || ''
      this.discount = this.item?.discount ? this.item.discount.toString() : ''
      this.discount_expire = this.item?.discount ? this.item.discount_expire : ''
      this.description = this.item?.description || ''
    },
    submit() {
      this.$emit('submit', {
        title: this.title,
        price: this.price,
        inventory: this.inventory,
        discount: this.discount,
        discount_expire: this.discount_expire,
        description: this.description,
      })
    }
  }
}
</script>
