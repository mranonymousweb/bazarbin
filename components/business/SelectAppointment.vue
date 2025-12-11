<template>
  <div class="flex justify-center">
    <div class="flex justify-center bg-white rounded lg:w-1/2">
      <div class="appointment-select-appointment p-2 py-4 lg:p-8 lg:py-8">
        <div v-if="date">
          <div class="flex items-center pb-8 lg:pb-12 gap-2">
            <IconsReceipt class="w-5 h-5 text-blue-600"/>
            <span class="font-medium">نوبت دلخواه خود را انتخاب نمایید</span>
          </div>
          <div class="flex flex-wrap lg:w-1/2 justify-center mx-auto" dir="ltr">
            <div
              v-for="(item,index) in appointments"
              :key="item.id ? item.id : 'index-'+index"
              class="relative cursor-pointer"
              @mouseover="hoveredItem = index"
              @mouseleave="hoveredItem = null"
            >
              <span
                :class="[
                  'w-9 h-9 m-1 lg:w-14 lg:h-14 lg:m-2 flex items-center justify-center rounded',
                  selected === item
                      ? 'bg-blue-550 text-white'
                      : taken.find(x => x.id === item.id)
                          ? 'cursor-not-allowed bg-gray-50 text-red-550'
                          : 'cursor-pointer bg-gray-50 hover:bg-blue-100'
                ]"
                @click="selectItem(item)"
              >{{ index + 1 }}</span>
              <div
                class=" absolute right-6 top-6 bg-white shadow rounded p-4 text-sm mt-2 mr-2"
                :class="[hoveredItem === index && ! taken.find(x => x.id === item.id) ? 'hidden lg:block' : 'hidden']"
                dir="rtl"
                style="min-width: 240px"
              >
                <div class="border-cyan-250 border-b flex justify-between whitespace-nowrap pb-2 mb-2">
                  <span class="ml-8">نوبت:</span>
                  <span class="font-medium">{{ item.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="ml-8">توضیحات:</span>
                  <span class="font-medium">{{ item.description }}</span>
                </div>
              </div>
            </div>
          </div>
          <div
            class="px-4 lg:hidden"
            v-for="(item,index) in appointments"
            :key="item.id ? item.id : 'index-'+index"
          >
            <div
              class=""
              :class="[hoveredItem === index && ! taken.find(x => x.id === item.id) ? 'pt-12' : 'hidden']"
              dir="rtl"
            >
              <div class="border-cyan-250 border-b flex justify-between whitespace-nowrap pb-2 mb-2">
                <span class="ml-8">نوبت:</span>
                <span class="font-medium">{{ item.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="ml-8">توضیحات:</span>
                <span class="font-medium">{{ item.description }}</span>
              </div>
            </div>
          </div>
          <div class="flex gap-6 pt-8">
            <button
              class="w-1/2 border border-blue-450 text-blue-450 rounded py-3"
              @click="$emit('cancel')"
            >
              بازگشت
            </button>
            <button
              class="w-1/2 bg-blue-450 text-white rounded py-3"
              @click="submit"
            >
              تکمیل سفارش
            </button>
          </div>
        </div>
        <div v-else class="">
          تاریخ به صورت صحیح انتخاب نشده است.
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import IconsReceipt from "../icons/receipt.vue";

export default {
  name: 'BusinessSelectAppointment',
  components: {IconsReceipt},
  props: {
    itemType: {
      type: String,
      required: true
    },
    itemId: {
      type: Number,
      required: true
    },
    date: {
      type: String,
      default: null
    },
    value: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      open: true,
      appointments: [],
      taken: [],
      hoveredItem: null,
      selected: null,
    }
  },
  async fetch() {
    await this.$axios.$get(`appointments-titles/${this.itemType}/${this.itemId}`)
      .then(response => {
        this.appointments = response
        this.loaded = true
      })
  },
  watch: {
    date(value) {
      if (value) {
        this.$axios.$get(`appointments-titles/${this.itemType}/${this.itemId}?status=taken&date=${value}`)
          .then(response => {
            this.taken = response
          })
      }
    },
    value(value) {
      this.selected = value && this.appointments.find(x => x.id === value)
    }
  },
  methods: {
    selectItem(item) {
      if (this.taken.find(x => x.id === item.id)) {
        return
      }
      this.selected = item
      this.$emit('input', this.selected.id)
    },
    submit() {
      if (!this.selected) {
        this.$store.commit('notification/error','ابتدا یک نوبت را انتخاب نمایید.')
        return
      }
      this.$emit('submit')
    }
  }
}

</script>

<style lang="scss">

.appointment-select-appointment {
  width: 20.5rem;
}

@media (min-width: 1024px) {
  .appointment-select-date {
    width: 31.5rem;
  }
}

</style>
