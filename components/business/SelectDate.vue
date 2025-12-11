<template>
  <div class="flex justify-center">
    <div class="flex justify-center bg-white p-2 py-4 lg:p-8 lg:py-8 rounded lg:w-1/2">

      <div class="appointment-select-date">
        <div class="flex items-center pb-8 lg:pb-12 gap-2">
          <IconsCalendar class="w-5 h-5 text-blue-600"/>
          <span class="font-medium">تاریخ مراجعه را انتخاب نمایید</span>
        </div>

        <div class="flex flex-wrap mx-auto justify-end px-2">
          <select v-model="month" class="mx-4 border-blue-450 text-sm lg:text-base rounded w-28 lg:w-36">
            <option v-for="(m,i) in months" :key="m" :value="i+1" :disabled="year === thisYear && i+1 < thisMonth">{{ m }}</option>
          </select>
          <select v-model="year" class="border-blue-450 rounded text-sm lg:text-base w-28 lg:w-36">
            <option :value="thisYear">{{ thisYear }}</option>
            <option v-if="thisMonth >= 11" :value="thisYear + 1">{{ thisYear + 1 }}</option>
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
            class="w-9 h-9 m-1 lg:w-14 lg:h-14 lg:m-2 flex items-center justify-center rounded relative"
            :class="[
              isHoliday(i) ? 'text-red-550' : '',
              selectedDay === i && selectedMonth === month && selectedYear === year
                 ? 'bg-blue-550 text-white'
                 : today > i && thisMonth === month && thisYear === year
                     ? 'cursor-not-allowed bg-gray-50 opacity-50'
                     : isHoliday(i)
                         ? 'cursor-not-allowed bg-gray-50 text-red-550'
                         : 'cursor-pointer bg-gray-50 hover:bg-blue-100'
            ]"
            @click="selectDate(i)"
          >
            {{ i }}
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
            ادامه
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script>

import IconsCalendar from "../icons/calendar.vue";
import moment from "../../mixins/moment";

export default {
  name: 'BusinessSelectDate',
  components: {IconsCalendar},
  mixins: [moment],
  props: {
    itemType: {
      type: String,
      required: true
    },
    itemId: {
      type: Number,
      required: true
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loaded: false,
      holidays: [],
      selectedDate: this.value,
      selectedDay: null,
      selectedMonth: null,
      selectedYear: null,
      month: +this.formatDate(new Date(), 'jM'),
      year: +this.formatDate(new Date(), 'jYYYY'),
      today: +this.formatDate(new Date(), 'jD'),
      thisMonth: +this.formatDate(new Date(), 'jM'),
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
    await this.$axios.$get(`holidays/${this.itemType}/${this.itemId}`)
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
  watch: {
    value(value) {
      if (value) {
        const d = this.moment(new Date(value))
        this.selectedDate = this.value
        this.selectedDay = +d.format('jD')
        this.month = +d.format('jM')
        this.year = +d.format('jYYYY')
        this.selectedMonth = this.month
        this.selectedYear = this.year
      } else {
        this.selectedDate = null
        this.selectedDay = null
        this.selectedMonth = null
        this.selectedYear = null
        this.month = this.thisMonth
        this.year = this.thisYear
      }
    }
  },
  methods: {
    isHoliday(i) {
      const date = this.moment(`${this.year}/${this.month}/${i}`, 'jYYYY/jM/jD').format('YYYY-MM-DD')
      return this.holidays.findIndex(x => x === date) >= 0
    },
    selectDate(i) {
      if ( this.thisYear > this.year ) {
        return
      }

      if ( this.thisYear === this.year && this.thisMonth > this.month ) {
        return
      }

      if ( this.thisYear === this.year && this.thisMonth === this.month && this.today > i ) {
        return
      }

      if (this.isHoliday(i)) {
        this.$store.commit('notification/error','تاریخ انتخابی تعطیل می باشد.')
        return
      }

      this.selectedDay = +i
      this.selectedMonth = this.month
      this.selectedYear = this.year
      this.selectedDate = this.moment(`${this.year}/${this.month}/${i}`, 'jYYYY/jM/jD').format('YYYY-MM-DD')
      this.$emit('input', this.selectedDate)
    },
    submit() {
      if (!this.selectedDay) {
        this.$store.commit('notification/error','ابتدا یک تاریخ را انتخاب نمایید.')
        return
      }
      this.$emit('submit')
    }
  }
}

</script>

<style lang="scss">

.appointment-select-date {
  width: 20.5rem;

  .week-day {
    font-size: 10px;
  }
}

@media (min-width: 1024px) {
  .appointment-select-date {
    width: 31.5rem;

    .week-day {
      font-size: 14px;
    }
  }
}

</style>
