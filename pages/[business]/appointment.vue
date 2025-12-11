<template>
  <div>
    <front-header class="mb-8"/>
    <div v-if="loaded">
      <front-business-header
        id="business-header"
        :item="item"
        @change-liked="item.liked = !item.liked"
        @change-bookmarked="item.bookmarked = !item.bookmarked"
      />
      <div class="mt-8 flex justify-center">
        <div v-if="step === 1" class="bg-white py-20 px-40 rounded w-auto">
          <div class="flex items-center mb-12">
            <icons-calendar class="text-blue-450 ml-2 w-6"/>
            <span class="font-medium">تاریخ مراجعه را انتخاب کنید</span>
          </div>
          <div class="flex flex-wrap mx-auto justify-end px-2" style="width: 31.5rem">
            <select v-model="month" class="mx-4 border-blue-450 rounded w-36">
              <option value="1" :disabled="+year === thisYear && +today.month > 1">فروردین</option>
              <option value="2" :disabled="+year === thisYear && +today.month > 2">اردیبهشت</option>
              <option value="3" :disabled="+year === thisYear && +today.month > 3">خرداد</option>
              <option value="4" :disabled="+year === thisYear && +today.month > 4">تیر</option>
              <option value="5" :disabled="+year === thisYear && +today.month > 5">مرداد</option>
              <option value="6" :disabled="+year === thisYear && +today.month > 6">شهریور</option>
              <option value="7" :disabled="+year === thisYear && +today.month > 7">مهر</option>
              <option value="8" :disabled="+year === thisYear && +today.month > 8">آبان</option>
              <option value="9" :disabled="+year === thisYear && +today.month > 9">آذر</option>
              <option value="10" :disabled="+year === thisYear && +today.month > 10">دی</option>
              <option value="11" :disabled="+year === thisYear && +today.month > 11">بهمن</option>
              <option value="12">اسفند</option>
            </select>
            <select v-model="year" class="border-blue-450 rounded w-36">
              <option :value="thisYear">{{ thisYear }}</option>
              <option :value="thisYear + 1">{{ thisYear + 1 }}</option>
            </select>
          </div>
          <div class="flex flex-wrap mx-auto mt-6" style="width: 31.5rem">
            <div class="w-14 m-2 text-center text-sm">شنبه</div>
            <div class="w-14 m-2 text-center text-sm">یکشنبه</div>
            <div class="w-14 m-2 text-center text-sm">دوشنبه</div>
            <div class="w-14 m-2 text-center text-sm">سه شنبه</div>
            <div class="w-14 m-2 text-center text-sm">چهارشنبه</div>
            <div class="w-14 m-2 text-center text-sm">پنجشنبه</div>
            <div class="w-14 m-2 text-center text-sm">جمعه</div>
            <template v-if="monthFirstDay">
              <div v-for="i in monthFirstDay" :key="'e'+i" class="w-14 h-14 m-2"></div>
            </template>
            <div
              v-for="i in monthLastDay"
              :key="i"
              class="w-14 h-14 m-2 flex items-center justify-center rounded"
              :class="[
                isHoliday(i) ? 'text-red-550 cursor-not-allowed' : 'cursor-pointer',
                isSelected(i) ? 'bg-blue-450 text-white' : 'bg-gray-50',
                past(i) ? 'calendar-disabled-day' : ''
              ]"
              @click="select(i)"
            >
              {{ i }}
            </div>
          </div>
          <div class="flex justify-center mt-20">
            <button
              class="flex items-center justify-center border border-blue-450 text-blue-450 w-52 rounded py-3 px-12 ml-4"
              @click="$router.back()"
            >
              بازگشت
            </button>
            <button
              :class="[
                'flex items-center justify-center text-white w-52 rounded py-3 px-12 mr-4',
                selected.day ? 'bg-blue-450' : 'bg-gray-300 cursor-not-allowed'
              ]"
              @click="step = 2"
              :disabled="!selected.day"
            >
              انتخاب نوبت
            </button>
          </div>
        </div>
        <div v-if="step === 2" class="bg-white py-20 px-40 rounded w-auto">
          <div class="flex items-center mb-12">
            <icons-receipt class="text-blue-450 ml-2 w-6"/>
            <span class="font-medium">نوبت دلخواه خود را انتخاب کنید</span>
          </div>
          <div class="flex flex-wrap mx-auto mt-6" style="width: 31.5rem">
            <div
              v-for="(value, index) in item.business_appointments"
              :key="value.id"
              :class="[
                'm-2 rounded cursor-pointer',
                appointment === value.id ? 'bg-blue-450 text-white' : 'bg-gray-50',
              ]"
              @click="appointment = value.id"
            >
              <popover left="-19rem" top="2rem" :open-on-hover="true">
                <template #activator>
                  <div class="w-14 h-14 flex items-center justify-center">{{ index+1 }}</div>
                </template>
                <div dir="rtl" class="bg-white p-6 rounded shadow border persian-number w-80">
                  <div class="pb-3 mb-3 border-b border-cyan-250 flex justify-between">
                    <span class="text-gray-500">عنوان :</span>
                    <span class="font-medium">{{ value.name }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">توضیحات :</span>
                    <span class="font-medium">{{ value.description }}</span>
                  </div>
                </div>
              </popover>
            </div>
          </div>
          <div v-if="appointment" class="mt-8">
            <div class="mb-2 text-cyan-250">نوبت انتخاب شده:</div>
            <div class="mb-1">
              <span class="text-gray-500">تاریخ :</span>
              <span class="font-medium">{{ selectedDate.format('dddd jYYYY/jMM/jDD')  }}</span>
            </div>
            <div class="mb-1">
              <span class="text-gray-500">عنوان :</span>
              <span class="font-medium">{{ selectedAppointment.name }}</span>
            </div>
            <div class="mb-1">
              <span class="text-gray-500">توضیحات :</span>
              <span class="font-medium">{{ selectedAppointment.description }}</span>
            </div>
          </div>
          <div class="flex justify-center mt-20 whitespace-nowrap">
            <button
              class="flex items-center justify-center border border-blue-450 text-blue-450 w-52 rounded py-3 px-12 ml-4"
              @click="step = 1"
            >
              بازگشت
            </button>
            <button
              :class="[
                'flex items-center justify-center text-white w-52 rounded py-3 px-12 mr-4',
                appointment ? 'bg-blue-450' : 'bg-gray-300 cursor-not-allowed'
              ]"
              @click="submit"
            >
              افزودن به سبد خرید
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "../../mixins/moment";
import IconsReceipt from "../../components/icons/receipt";
import IconsCalendar from "../../components/icons/calendar";
import Popover from "../../components/popover";

export default {
  name: "AppointmentPage",
  components: {Popover, IconsCalendar, IconsReceipt},
  mixins: [moment],
  data() {
    return {
      item: null,
      loaded: false,
      step: 1,
      month: 1,
      year: 1400,
      thisYear: 1400,
      selected: {
        year: null,
        month: null,
        day: null,
      },
      today: {
        year: null,
        month: null,
        day: null,
      },
      appointment: null,
      baseUrl: process.env.storagePath,
    }
  },
  async fetch() {
    await this.$axios.$get('business/' + this.$route.params.business + '?page=appointment')
      .then(response => {
        this.item = response.data
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
    },
    selectedAppointment() {
      return this.appointment ? this.item.business_appointments.find(x => x.id === this.appointment) : null
    },
    selectedDate() {
      return this.selected.day
        ? this.moment(`${this.selected.year}/${this.selected.month}/${this.selected.day}`, 'jYYYY/jM/jD')
        : null
    }
  },
  created() {
    this.today = {
      year: this.moment().format('jYYYY'),
      month: this.moment().format('jM'),
      day: this.moment().format('jD'),
    }
    this.month = this.today.month
    this.year = this.today.year
    this.thisYear = +this.today.year
  },
  methods: {
    select(i) {
      if (this.isHoliday(i)) return

      this.selected = {
        year: this.year,
        month: this.month,
        day: i
      }
    },
    isSelected(i) {
      return this.selected.year === this.year && this.selected.month === this.month && this.selected.day === i
    },
    past(i) {
      const today = +`${this.today.year}${this.today.month > 9 ? this.today.month : '0'+this.today.month}${this.today.day > 9 ? this.today.day : '0'+this.today.day}`
      const day = +`${this.year}${this.month > 9 ? this.month : '0'+this.month}${i > 9 ? i : '0'+i}`
      return today > day
    },
    isHoliday(i) {
      const date = this.moment(`${this.year}/${this.month}/${i}`, 'jYYYY/jM/jD').format('YYYY-MM-DD')
      return this.item.holidays.findIndex(x => x === date) >= 0
    },
    submit() {
      this.$store.commit('cart/add', {type: 'appointment', appointment_id: this.appointment, date: this.selectedDate.format('YYYY-MM-DD')})
      this.$store.commit('notification/success', 'محصول به سبد خرید شما اضافه شد.')
      this.$router.push('/cart')
    }
  }
}
</script>

<style>
.calendar-disabled-day {
  color: #c1c1c1;
  background: #faf9ff;
  cursor: not-allowed;
}
</style>
