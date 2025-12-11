<template>
  <div class="bg-white rounded p-3 lg:p-6">
    <div class="flex items-center">
      <i class="text-base flaticon-167-wall-clock ml-2"></i>
      <span class="flex-grow lg:text-gray-500 font-bold">ساعت کاری</span>
      <span class="cursor-pointer text-blue-450" @click="open = !open">
        <i v-if="!open" class="flaticon-043-plus"></i>
        <span>{{ open ? 'بستن' : 'ویرایش اطلاعات' }}</span>
      </span>
    </div>

    <SlideDown :open="open">
      <div v-if="false" class="p-1 pt-4">
        <div class="flex items-end">
          <searchable-select
            v-model="form.day"
            :items="days"
            label="روز"
            class="w-44 sm:w-56"
          />
          <button class="text-blue-450 mr-4 sm:mr-8 mb-3" @click="addTime">
            <i class="flaticon-043-plus"></i>
            <span>افزودن ساعت</span>
          </button>
        </div>
        <div class="mt-8 space-y-2 md:space-y-4">
          <div v-for="(time, index) in form.times" :key="index" class="flex items-end">
            <searchable-select
              v-model="time.period"
              :items="periods"
              :label="index === 0 ? 'زمان' : ''"
              class="flex-shrink-0 w-24 sm:w-56 ml-2 sm:ml-0"
            />
            <span class="hidden sm:inline px-2 md:px-8 pb-2">:</span>
            <Input
              v-model="time.from"
              :label="index === 0 ? 'از ساعت' : ''"
              input-class="h-12"
            />
            <span class="px-2 md:px-4 pb-2">الی</span>
            <Input
              v-model="time.to"
              :label="index === 0 ? 'تا ساعت' : ''"
              input-class="h-12"
            />
            <button class="mr-4 md:mr-12 mb-2" @click="form.times.splice(index,1)">
              <i class="flaticon-133-trash text-base text-red-550"></i>
            </button>
          </div>
        </div>

        <div v-if="form.times.length" class="my-4 pt-4 border-t flex justify-center">
          <submit-btn
            label="افزودن"
            icon="flaticon-043-plus"
            @click="save"
          />
        </div>

      </div>
      <div class="p-1 pt-4">
        <Input v-model="times" type="textarea" rows="5"/>
      </div>
      <div class="w-full flex justify-center mt-5 p-1">
        <submit-btn
          v-if="exist"
          @click="save"
        />
      </div>
    </SlideDown>

    <SlideDown :open="!open && false">
      <div class="p-1">{{ times }}</div>
    </SlideDown>

    <table v-if="false" class="w-full text-xs md:text-sm">
      <thead>
      <tr class="bg-gray-50 h-12">
        <th class="text-right px-2 sm:w-32">روز</th>
        <th class="text-right px-2">ساعت</th>
        <th class="text-right px-2 sm:w-32">عملیات</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="(time, index) in times" :key="index">
        <td class="p-2">{{ days.find(x => x.id === time.day).name }}</td>
        <td class="p-2">
          <span>{{ periods.find(x => x.id === time.period).name }}</span>
          از ساعت
          <span>{{ time.from }}</span>
          تا
          <span>{{ time.to }}</span>
        </td>
        <td class="p-2">
          <button @click="remove(index)">
            <i class="flaticon-133-trash text-base text-red-550"></i>
          </button>
        </td>
      </tr>
      </tbody>

    </table>

  </div>
</template>

<script>
import SearchableSelect from "../../SearchableSelect";
import Input from "../../Input";
import SubmitBtn from "../../SubmitBtn";
import errorParser from "~/mixins/error_parser";

export default {
  name: "PanelBusinessEditWorkTimes",
  components: {SubmitBtn, Input, SearchableSelect},
  mixins: [errorParser],
  props: {
    value: {
      type: String,
      default: null
    },
    exist: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      open: !this.exist,
      form: {
        day: '',
        times: []
      },
      days: [
        {id: 'all_days', name: 'هر روز'},
        {id: 'sat', name: 'شنبه'},
        {id: 'sun', name: 'یکشنبه'},
        {id: 'mon', name: 'دوشنبه'},
        {id: 'tue', name: 'سه شنبه'},
        {id: 'wed', name: 'چهارشنبه'},
        {id: 'thu', name: 'پنج شنبه'},
        {id: 'fri', name: 'جمعه'},
        {id: 'sat_wed', name: 'شنبه تا چهارشنبه'},
        {id: 'sat_thu', name: 'شنبه تا پنج شنبه'},
        {id: 'thu_fri', name: 'پنج شنبه و جمعه'},
        {id: 'workdays', name: 'روزهای کاری'},
        {id: 'holidays', name: 'روزهای تعطیل'},
      ],
      periods: [
        {id: 'all_day', name: 'یکسره'},
        {id: 'morning', name: 'صبح ها'},
        {id: 'evening', name: 'عصر ها'},
        {id: 'night', name: 'شب ها'},
      ],
      times: ''
    }
  },
  computed: {
    isAdmin() {
      return this.$store.state.user.data.roles.findIndex(x => x.name === 'super-admin') >= 0
    },
    url() {
      return this.isAdmin ? `admin/businesses/${this.$route.params.id}` : `home/business/${this.$route.params.id}`
    },
  },
  watch: {
    value() {
      this.times = this.value
    },
    times(value) {
      this.$emit('input', value)
    }
  },
  created() {
    this.times = this.value
  },
  methods: {
    addTime() {
      this.form.times.push({
        period: '',
        from: '',
        to: '',
      })
    },
    save() {
      if (this.exist) {
        this.$axios.$put(this.url,{active_hour: this.times})
          .then(() => {
            this.$store.commit('notification/success', 'ساعت کاری با موفقیت بروزرسانی شد.')
            this.$emit('input', this.times)
          })
          .catch(error => this.showError(error))
      } else {
        this.$emit('input', this.times)
      }
      this.$emit('input', this.times)
    },
    remove(index) {
      this.times.splice(index,1)
      if (this.exist) {
        this.$axios.$put(this.url,{active_hour: this.times})
          .then(() => {
            this.$store.commit('notification/success', 'ساعت کاری با موفقیت بروزرسانی شد.')
            this.$emit('input', this.times)
          })
      } else {
        this.$emit('input', this.times)
      }
    }
  }
}
</script>
