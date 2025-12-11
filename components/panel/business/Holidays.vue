<template>
  <div class="holiday-select-date -mx-1">
    <div>
      <i class="flaticon-163-calendar"></i>
      <span>تعیین روزهای تعطیل</span>
    </div>
    <div class="flex flex-wrap mx-auto justify-end px-2 pt-4 lg:pt-0">
      <select v-model="month" class="mx-4 border-blue-450 rounded w-28 lg:w-36 text-sm lg:text-base">
        <option v-for="(m,i) in months" :key="m" :value="i+1">{{ m }}</option>
      </select>
      <select v-model="year" class="border-blue-450 rounded w-28 lg:w-36 text-sm lg:text-base">
        <option :value="thisYear - 1">{{ thisYear - 1 }}</option>
        <option :value="thisYear">{{ thisYear }}</option>
        <option :value="thisYear + 1">{{ thisYear + 1 }}</option>
      </select>
    </div>
    <div v-if="loaded" class="flex flex-wrap mx-auto mt-6">
      <div v-for="(d) in weekDays" :key="d" class="week-day w-9 m-1 lg:w-14 lg:m-2 text-center">{{ d }}</div>
      <template v-if="monthFirstDay">
        <div v-for="i in monthFirstDay" :key="'e'+i" class="w-9 h-9 m-1 lg:w-14 lg:h-14 lg:m-2"></div>
      </template>
      <div
        v-for="i in monthLastDay"
        :key="i"
        class="bg-gray-50 w-9 h-9 m-1 lg:w-14 lg:h-14 lg:m-2 flex items-center justify-center cursor-pointer rounded relative"
        :class="isHoliday(i) ? 'text-red-550' : ''"
        @click="toggleHoliday(i)"
      >
        {{ i }}
        <span class="absolute right-0.5 bottom-0.5 lg:right-1 lg:bottom-1 mr-px mb-px rounded border border-gray-300 w-3 lg:w-4 h-3 lg:h-4"></span>
        <i v-if="isHoliday(i)" class="absolute right-2 bottom-1 flaticon-151-check text-xs font-bold"></i>
      </div>
    </div>
  </div>
</template>

<script>

import moment from "../../../mixins/moment";

export default {
  name: 'PanelBusinessHolidays',
  mixins: [moment],
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loaded: false,
      holidays: [],
      month: +this.formatDate(new Date(), 'jM'),
      year: +this.formatDate(new Date(), 'jYYYY'),
      thisYear: +this.formatDate(new Date(), 'jYYYY'),
      months: [
        'فروردین',
        'اردیبهشت',
        'خرداد',
        'تیر',
        'مرداد',
        'شهریور',
        'مهر',
        'آبان',
        'آذر',
        'دی',
        'بهمن',
        'اسفند',
      ],
      weekDays: [
        'شنبه',
        'یکشنبه',
        'دوشنبه',
        'سه‌شنبه',
        'چهارشنبه',
        'پنج‌شنبه',
        'جمعه'
      ]
    }
  },
  async fetch() {
    await this.$axios.$get('holidays/product/' + this.product.id)
      .then(response => {
        this.holidays = response
        this.loaded = true
      })
  },
  computed: {
    monthFirstDay() {
      const d = this.moment(`${this.year}/${this.month}/1`, 'jYYYY/jM/jD').day()
      return d === 6 ? 0 : d+1
    },
    monthLastDay() {
      return this.moment.jDaysInMonth(+this.year, +this.month - 1)
    }
  },
  methods: {
    isHoliday(i) {
      const date = this.moment(`${this.year}/${this.month}/${i}`, 'jYYYY/jM/jD').format('YYYY-MM-DD')
      return this.holidays.findIndex(x => x === date) >= 0
    },
    toggleHoliday(i) {
      const date = this.moment(`${this.year}/${this.month}/${i}`, 'jYYYY/jM/jD')
      const gDate = date.format('YYYY-MM-DD')
      const index = this.holidays.findIndex(x => x === gDate)
      index === -1 ? this.addHoliday(date) : this.removeHoliday(date, index)
    },
    addHoliday(date) {
      const gDate = date.format('YYYY-MM-DD')
      this.$axios.$post(`home/holidays/product/${this.product.id}`,{date: gDate})
        .then(() => {
          this.holidays.push(gDate)
          this.$store.commit(
            'notification/success',
            `تعطیلی روز ${date.format('jYYYY/jM/jD')} ثبت شد`
          )
        })
    },
    removeHoliday(date, index) {
      this.$axios.$delete(`home/holidays/product/${this.product.id}/${date.format('YYYY-MM-DD')}`)
        .then(() => {
          this.holidays.splice(index,1)
          this.$store.commit(
            'notification/success',
            `تعطیلی روز ${date.format('jYYYY/jM/jD')} لغو شد`
          )
        })
    }
  }
}

</script>

<style lang="scss">

.holiday-select-date {
  width: 19.5rem;

  .week-day {
    font-size: 10px;
  }
}

@media (min-width: 1024px) {
  .holiday-select-date {
    width: 31.5rem;

    .week-day {
      font-size: 14px;
    }
  }
}

</style>
