<template>
  <div class="bg-white rounded p-3 lg:p-6">
    <div class="flex items-center">
      <i class="text-base flaticon-044-file ml-2"></i>
      <span class="flex-grow lg:text-gray-500 font-bold">فرم سفارش</span>
      <span class="cursor-pointer text-blue-450" @click="open = !open">
        <i v-if="!open" class="flaticon-043-plus"></i>
        <span>{{ open ? 'بستن' : 'ویرایش اطلاعات' }}</span>
      </span>
    </div>

    <slide-down :open="open">

      <div class="pt-4">
        <searchable-select
          v-model="form.form_id"
          :items="forms"
          @input="$emit('input', form)"
        />

        <div v-if="selectedForm && selectedForm.dateable" class="p-1">

          <div v-if="selectedForm.show_in_index">
            <div class="text-red-500 text-center py-8 leading-8">
              این نوع فرم در حال حاضر فعال نمی باشد.
              <br>
              لطفا فرم دیگری را انتخاب نمایید.
            </div>
          </div>
          <div v-else class="text-orange-500 text-center py-8">
            برای تنظیم نوبت ها از صفحه
            <NuxtLink :to="`/panel/businesses/${$route.params.id}/products`" class="font-medium underline">محصولات</NuxtLink>
            اقدام نمایید
          </div>
          <div v-if="false">
            <div class="mt-8 mb-4">
              <span class="font-medium">نوبت ها را تنظیم کنید</span>
              <button class="text-blue-450 text-sm mr-12" @click="addNewAppointment">
                <i class="flaticon-043-plus"></i>
                <span>افزودن نوبت جدید</span>
              </button>
            </div>

            <div class="space-y-2">
              <div v-for="(item, index) in notSavedAppointments" :key="index" class="flex">
                <Input
                  v-model="item.name"
                  placeholder="عنوان"
                  class="w-1/3"
                />
                <Input
                  v-model="item.description"
                  placeholder="توضحیات"
                  class="w-1/3 mx-4"
                />
                <button class="mr-12" @click="notSavedAppointments.splice(index,1)">
                  <i class="flaticon-133-trash text-base text-red-550"></i>
                </button>
              </div>
            </div>

            <div v-if="notSavedAppointments.length" class="my-4 pt-4 border-t flex justify-center">
              <submit-btn
                label="افزودن"
                icon="flaticon-043-plus"
                @click="saveAppointments"
              />
            </div>

            <div v-if="editingItemIndex !== null" class="flex my-4">
              <Input
                v-model="editingItemName"
                placeholder="عنوان"
                class="w-1/3"
              />
              <Input
                v-model="editingItemDescription"
                placeholder="توضحیات"
                class="w-1/3 mx-4"
              />
              <button class="mr-12" @click="saveEdit">
                <i class="flaticon-151-check font-bold text-lg text-blue-450"></i>
              </button>
            </div>

            <div class="flex flex-wrap w-1/2 justify-center mx-auto" dir="ltr">
              <div
                v-for="(item,index) in form.appointments"
                :key="item.id ? item.id : 'index-'+index"
                class="relative"
                @mouseover="hoveredItem = index"
                @mouseleave="hoveredItem = null"
              >
                <span class="bg-gray-50 w-12 h-12 m-1 flex items-center justify-center">{{ index + 1 }}</span>
                <div
                  class="absolute right-6 top-6 bg-white shadow rounded p-4 text-sm mt-2 mr-2"
                  :class="[hoveredItem === index ? '' : 'hidden']"
                  dir="rtl"
                  style="min-width: 280px"
                >
                  <div class="border-cyan-250 border-b flex justify-between whitespace-nowrap pb-2 mb-2">
                    <span class="ml-8">{{ item.name }}</span>
                    <span>{{ item.description }}</span>
                  </div>
                  <div class="flex justify-between">
                    <button @click="editItem(index)">
                      <i class="flaticon-162-edit text-base"></i>
                    </button>
                    <button @click="removeAppointment(index)">
                      <i class="flaticon-133-trash text-base text-red-550"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="my-24">
              <div>
                <i class="flaticon-163-calendar"></i>
                <span>تعیین روزهای تعطیل</span>
              </div>
              <div class="flex flex-wrap mx-auto justify-end px-2" style="width: 31.5rem">
                <select v-model="month" class="mx-4 border-blue-450 rounded w-36">
                  <option value="1">فروردین</option>
                  <option value="2">اردیبهشت</option>
                  <option value="3">خرداد</option>
                  <option value="4">تیر</option>
                  <option value="5">مرداد</option>
                  <option value="6">شهریور</option>
                  <option value="7">مهر</option>
                  <option value="8">آبان</option>
                  <option value="9">آذر</option>
                  <option value="10">دی</option>
                  <option value="11">بهمن</option>
                  <option value="12">اسفند</option>
                </select>
                <select v-model="year" class="border-blue-450 rounded w-36">
                  <option :value="thisYear - 1">{{ thisYear - 1 }}</option>
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
                  class="bg-gray-50 w-14 h-14 m-2 flex items-center justify-center cursor-pointer rounded relative"
                  :class="isHoliday(i) ? 'text-red-550' : ''"
                  @click="toggleHoliday(i)"
                >
                  {{ i }}
                  <span class="absolute right-1 bottom-1 mr-px mb-px rounded border border-gray-300 w-4 h-4"></span>
                  <i v-if="isHoliday(i)" class="absolute right-2 bottom-1 flaticon-151-check text-xs font-bold"></i>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div v-else class="mb-12 mt-8">
          <div class="mb-4">
            <span class="text-xs">فیلد های مورد نظر را به قسمت خالی سمت چپ بکشید</span>
          </div>

          <div class="flex justify-between">

            <div class="w-1/2 md:w-1/3 not-used-fields ml-1.5 md:ml-0" @drop="drop" @dragover="allowDrop">
              <ul>
                <li
                  v-for="(field, index) in notSelectedFields"
                  :key="field.name"
                  class="bg-gray-50 rounded py-2 px-4 cursor-move mb-3 md:mb-4"
                  draggable="true"
                  :data-index="index"
                  data-list="notUsedFields"
                  @dragstart="drag"
                  @touchstart="touch"
                  @touchend="touchend"
                  @touchmove="touchmove"
                  @touchcancel="touchcancel"
                >
                  {{ field.title }}
                </li>
              </ul>
            </div>

            <div class="w-1/2 md:w-2/3 mr-1.5 md:mr-0 flex justify-around used-fields pb-12" @drop="drop" @dragover="allowDrop">
              <ul class="w-full md:w-1/2">
                <li
                  v-for="(field, index) in form.required_fields"
                  :key="field"
                  class="bg-gray-50 rounded py-2 px-4 cursor-move mb-3 md:mb-4"
                  draggable="true"
                  :data-index="index"
                  data-list="usedFields"
                  @dragstart="drag"
                  @touchstart="touch"
                  @touchend="touchend"
                  @touchmove="touchmove"
                  @touchcancel="touchcancel"
                >
                  {{ selectedForm && selectedForm.fields.find(x => x.id === +field).title }}
                </li>
              </ul>
            </div>

          </div>

        </div>

        <div class="flex justify-end p-1 mt-5">
          <div class="flex flex-col items-end">
            <div class="flex items-center">
              <input
                id="send-reminder-input"
                v-model="form.send_reminder"
                type="checkbox"
                class="h-4 w-4 ml-2 text-cyan-250 focus:ring-cyan-250 border-gray-300 rounded cursor-pointer"
                @input="$emit('input', form)"
              >
              <label for="send-reminder-input" class="block cursor-pointer">
                سفارشات را از طریق پیامک متوجه شوم
              </label>
            </div>
            <Input
              value="0"
              class="mt-4 w-1/2 justify-self-end"
              disabled="disabled"
            />
          </div>
        </div>

        <div class="flex justify-center mt-4 p-1">
          <submit-btn
            @click="submit"
          />
        </div>
      </div>

    </slide-down>

  </div>
</template>

<script>
import moment from "~/mixins/moment";
import errorParser from "~/mixins/error_parser";
export default {
  name: "PanelBusinessEditForm",
  mixins: [errorParser, moment],
  props: {
    value: {
      type: Object,
      required: true
    },
    exist: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      open: ! this.exist,
      forms: [],
      form: {
        form_id: -1,
        send_reminder: '',
        required_fields: [],
        holidays: [],
        appointments: [],
      },
      notSavedAppointments: [],
      editingItemIndex: null,
      editingItemName: '',
      editingItemDescription: '',
      hoveredItem: null,
      month: 1,
      year: 1400,
      thisYear: 1400,
    }
  },
  async fetch() {
    await this.$axios.$get('home/forms?all=1')
      .then(response => {
        this.forms = response
      })
      .catch(error => {
        this.showError(error)
      })
  },
  computed: {
    selectedForm() {
      return this.forms.length && this.forms.find(x => x.id === this.form.form_id)
    },
    notSelectedFields() {
      return this.selectedForm && this.selectedForm.fields.length &&
        this.selectedForm.fields.filter(x => !this.form.required_fields.find(y => x.id === y))
    },
    isAdmin() {
      return this.$store.state.user.data.roles.findIndex(x => x.name === 'super-admin') >= 0
    },
    url() {
      return this.isAdmin ? `admin/businesses/${this.$route.params.id}` : `home/business/${this.$route.params.id}`
    },
    monthFirstDay() {
      const d = this.moment(`${this.year}/${this.month}/1`, 'jYYYY/jM/jD').day()
      return d === 6 ? 0 : d+1
    },
    monthLastDay() {
      return this.moment.jDaysInMonth(+this.year, +this.month - 1)
    }
  },
  watch: {
    value() {
      this.form = this.value
    },
    forms(value) {
      if (value && !this.form.form_id) {
        const id = value.find(x => x.default)?.id
        id && (this.form.form_id = id)
      }
    },
    'form.form_id'(value, old) {
      if (this.exist && old !== -1) {
        this.$axios.$put(this.url,{form_id: this.form.form_id})
          .then(() => {
            this.$store.commit('notification/success', 'فرم با موفقیت بروزرسانی شد.')
            this.$emit('input', this.form)
          })
          .catch(error => {
            this.showError(error)
          })
      }
    }
  },
  created() {
    this.form = this.value
    this.month = this.moment().format('jM')
    this.year = this.moment().format('jYYYY')
    this.thisYear = +this.moment().format('jYYYY')
  },
  methods: {
    addNewAppointment() {
      this.notSavedAppointments.push({name: '', description: ''})
    },
    saveAppointments() {
      if (this.exist) {
        this.$axios.$post(`home/business/${this.$route.params.id}/appointments`, {appointments: this.notSavedAppointments})
          .then(response => {
            this.form.appointments = response.appointments
            this.notSavedAppointments = []
            this.$emit('input', this.form)
            this.$store.commit('notification/success', 'نوبت ها با موفقیت ذخیره شد.')
          })
          .catch(error => {
            this.showError(error)
          })
      } else {
        this.form.appointments.push(...this.notSavedAppointments)
        this.notSavedAppointments = []
        this.$emit('input', this.form)
      }
    },
    editItem(index) {
      this.editingItemIndex = index
      this.editingItemName = this.form.appointments[index].name
      this.editingItemDescription = this.form.appointments[index].description
    },
    saveEdit() {
      const appointment = this.form.appointments[this.editingItemIndex]
      if (appointment.id) {
        const data = {
          name: this.editingItemName,
          description: this.editingItemDescription
        }
        this.$axios.$put(`home/business/${this.$route.params.id}/appointments/${appointment.id}`, data)
          .then(response => {
            appointment.name = response.name
            appointment.description = response.description
            this.editingItemIndex = null
            this.$store.commit('notification/success', 'نوبت با موفقیت ویرایش شد.')
            this.$emit('input', this.form)
          })
          .catch(error => {
            this.showError(error)
          })
      } else {
        appointment.name = this.editingItemName
        appointment.description = this.editingItemDescription
        this.editingItemIndex = null
        this.$emit('input', this.form)
      }
    },
    removeAppointment(index) {
      const appointment = this.form.appointments[this.editingItemIndex]
      if (appointment.id) {
        this.$axios.$delete(`home/business/${this.$route.params.id}/appointments/${appointment.id}`)
          .then(() => {
            this.form.appointments.splice(index, 1)
            this.$emit('input', this.form)
            this.$store.commit('notification/success', 'نوبت با موفقیت حذف شد.')
          })
          .catch(error => {
            this.showError(error)
          })
      } else {
        this.form.appointments.splice(index, 1)
        this.$emit('input', this.form)
      }
    },
    isHoliday(i) {
      const date = this.moment(`${this.year}/${this.month}/${i}`, 'jYYYY/jM/jD').format('YYYY-MM-DD')
      return this.form.holidays.findIndex(x => x === date) >= 0
    },
    toggleHoliday(i) {
      const date = this.moment(`${this.year}/${this.month}/${i}`, 'jYYYY/jM/jD').format('YYYY-MM-DD')
      const index = this.form.holidays.findIndex(x => x === date)
      index === -1 ? this.form.holidays.push(date) : this.form.holidays.splice(index,1)
      this.$emit('input', this.form)
    },
    allowDrop(event) {
      event.preventDefault();
    },
    drag(event) {
      event.target.classList.remove('bg-gray-50')
      event.target.classList.add('bg-gray-200')
      event.dataTransfer.setData("text", `${event.target.dataset.list}|${event.target.dataset.index}`);
    },
    touch(event) {
      const rect = event.target.getBoundingClientRect()
      const node = event.target.cloneNode(true)
      node.id = 'touch-move-element-copy'
      node.style.opacity = '.5'
      event.target.classList.add('bg-gray-200')
      event.target.classList.remove('bg-gray-50')
      event.target.style.width = rect.width + 'px'
      event.target.style.height = rect.height + 'px'
      event.target.dataset.yoffset = (rect.top - event.targetTouches[0].clientY).toString()
      event.target.dataset.xoffset = (rect.left - event.targetTouches[0].clientX).toString()
      event.target.style.top = event.targetTouches[0].clientY + (rect.top - event.targetTouches[0].clientY) + 'px'
      event.target.style.left = event.targetTouches[0].clientX + (rect.left - event.targetTouches[0].clientX) + 'px'
      event.target.style.position = 'fixed'
      event.target.parentNode.insertBefore(node, event.target)
    },
    drop(event) {
      event.preventDefault();
      const data = event.dataTransfer.getData("text").split('|')
      const index = +data[1]
      const startList = data[0]
      const targetList = event.target.closest('.used-fields') ? 'usedFields' : 'notUsedFields'

      if (startList === 'usedFields') {
        if (targetList === 'notUsedFields') {
          this.form.required_fields.splice(index, 1)
        }
      }

      else if (startList === 'notUsedFields') {
        if (targetList === 'usedFields') {
          this.form.required_fields.push(this.notSelectedFields[index].id)
        }
      }
    },
    touchmove(event) {
      event.preventDefault()
      event.target.style.top = (event.targetTouches[0].clientY + +event.target.dataset.yoffset) + 'px'
      event.target.style.left = (event.targetTouches[0].clientX + +event.target.dataset.xoffset) + 'px'
    },
    touchcancel(event) {
      event.target.style.position = 'inherit'
      event.target.classList.add('bg-gray-50')
      event.target.classList.remove('bg-gray-200')
      document.getElementById('touch-move-element-copy').remove()
    },
    touchend(event) {
      event.target.style.position = 'inherit'
      event.target.classList.add('bg-gray-50')
      event.target.classList.remove('bg-gray-200')
      document.getElementById('touch-move-element-copy').remove()

      const changedTouch = event.changedTouches[0];
      const index = +event.target.dataset.index;
      const startList = event.target.dataset.list;
      const elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
      const targetList = elem.closest('.used-fields') ? 'usedFields' : 'notUsedFields';

      if (startList === 'usedFields' && targetList === 'notUsedFields') {
        this.form.required_fields.splice(index, 1)
      }

      else if (startList === 'notUsedFields' && targetList === 'usedFields') {
        this.form.required_fields.push(this.notSelectedFields[index].id)
      }
    },
    submit() {
      this.$emit('submit')
      /* if (this.exist) {

        const data = {
          holidays: this.form.holidays,
          send_reminder: this.form.send_reminder,
          required_fields: this.form.required_fields
        }

        this.$axios.$put(this.url,data)
          .then(() => {
            this.$store.commit('notification/success', 'اطلاعات فرم با موفقیت بروزرسانی شد.')
            this.$emit('input', this.form)
          })
          .catch(error => {
            this.showError(error)
          })
      } else {
        this.$emit('submit')
      } */
    }
  }
}
</script>
