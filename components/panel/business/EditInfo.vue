<template>
  <div class="bg-white rounded p-3 lg:p-6">

    <div class="flex items-center">
      <i class="text-base flaticon-032-briefcase ml-2"></i>
      <span class="flex-grow lg:text-gray-500 font-bold">اطلاعات حساب</span>
      <span class="cursor-pointer text-blue-450" @click="open = !open">
        <i v-if="!open" class="flaticon-043-plus"></i>
        <span>{{ open ? 'بستن' : 'ویرایش اطلاعات' }}</span>
      </span>
    </div>

    <slide-down :open="open">

      <div class="flex flex-wrap items-end lg:flex-nowrap p-1 mb-4 pt-4">
        <div v-if="isAdmin" class="w-full lg:w-5/12 lg:pl-4 mb-4 lg:mb-0">
          <searchable-select
            v-model="form.owner_id"
            :items="users"
            label="صاحب"
            @input="$emit('input', formData)"
          />
        </div>

        <div class="w-full lg:w-5/12">
          <Input
            v-model="form.link"
            label="لینک صفحه کسب و کار"
            input-class="h-11 md:h-12 text-left pl-36 md:pl-44 dir-ltr"
            @input="checkLink"
            :disabled="!isAdmin && !value.editable_link"
          >
            <template #icon>
              <div class="absolute left-0 top-0 py-3 pl-1.5 md:pl-4 text-gray-500" dir="ltr">
                https://bazarbin.com/
              </div>
            </template>
          </Input>
          <span v-if="linkIsValid === 'checking'" class="text-xs">درحال بررسی ...</span>
          <span v-else-if="linkIsValid === true" class="text-xs text-emerald-500">قابل ثبت می باشد.</span>
          <span v-else class="text-xs text-red-500">{{ linkIsValid }}</span>
        </div>
        <div v-if="isAdmin" class="w-full lg:w-2/12 pr-4 pb-4">
          <div class="flex gap-2 items-center">
            <input
              id="form-editable_link-checkbox"
              v-model="form.editable_link"
              type="checkbox"
              class="h-4 w-4 text-cyan-250 focus:ring-cyan-250 border-gray-300 rounded cursor-pointer"
              @input="$emit('input', formData)"
            >
            <label for="form-editable_link-checkbox" class="block cursor-pointer">
              لینک قابل ویرایش
            </label>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap lg:flex-nowrap p-1">
        <div class="w-full lg:w-5/12 mb-4 lg:mb-0">
          <Input v-model="form.name" label="نام کسب و کار" input-class="h-12"  @input="$emit('input', formData)"/>
        </div>

        <div class="lg:px-4 w-full lg:w-5/12">
          <searchable-select
            v-model="form.guild_id"
            :items="$store.state.guild.list"
            label="صنف کسب و کار"
            @input="$emit('input', formData)"
          />
        </div>
      </div>

      <div class="mt-4 p-1">
        <Input
          v-model="form.description"
          type="textarea"
          label="شرح فعالیت"
          rows="5"
          @input="$emit('input', formData)"
        />
      </div>

      <div class="mt-4 p-1">
        <label class="block pb-2">امکانات</label>
        <tags-input
          v-model="form.services"
          placeholder="امکانات را تایپ کنید و برای ثبت کلید افزودن یا Enter را بزنید"
          @input="$emit('input', formData)"
        />
      </div>

      <div class="flex justify-center mt-4 p-1">
        <submit-btn
          v-if="exist"
          @click="submit"
        />
      </div>

    </slide-down>

    <table v-if="!open && false" class="w-full text-sm">
      <tbody>
      <tr class="hidden lg:table-row">
        <th v-if="isAdmin" class="text-right p-2 bg-gray-50 border">صاحب کسب و کار</th>
        <td v-if="isAdmin" class="p-2 border">{{ users.length && users.find(x => x.id === form.owner_id).name }}</td>
        <th class="text-right p-2 bg-gray-50 border">لینک صفحه کسب و کار</th>
        <td :colspan="isAdmin ? 1 : 3" class="p-2 border" dir="ltr">
          <a :href="`https://bazarbin.com/${form.link}`" class="text-blue-450">
            https://bazarbin.com/{{ form.link }}
          </a>
        </td>
      </tr>
      <tr class="hidden lg:table-row">
        <th class="text-right p-2 bg-gray-50 border w-1/6">نام کسب و کار</th>
        <td class="p-2 border w-1/3">{{ form.name }}</td>
        <th class="text-right p-2 bg-gray-50 border w-1/6">صنف کسب و کار</th>
        <td class="p-2 border w-1/3">{{ guild && guild.name }}</td>
      </tr>

      <tr v-if="isAdmin" class="lg:hidden">
        <th class="text-right p-2 bg-gray-50 border">صاحب کسب و کار</th>
        <td colspan="3" class="p-2 border">{{ users.length && users.find(x => x.id === form.owner_id).name }}</td>
      </tr>
      <tr class="lg:hidden">
        <th class="text-right p-2 bg-gray-50 border">لینک صفحه کسب و کار</th>

        <td colspan="3" class="p-2 border" dir="ltr">
          <a :href="`https://bazarbin.com/${form.link}`" class="text-blue-450">
            https://bazarbin.com/{{ form.link }}
          </a>
        </td>
      </tr>
      <tr class="lg:hidden">
        <th class="text-right p-2 bg-gray-50 border">نام کسب و کار</th>
        <td colspan="3" class="p-2 border">{{ form.name }}</td>
      </tr>
      <tr class="lg:hidden">
        <th class="text-right p-2 bg-gray-50 border">صنف کسب و کار</th>
        <td colspan="3" class="p-2 border">{{ guild && guild.name }}</td>
      </tr>

      <tr>
        <th class="text-right p-2 bg-gray-50 border">شرح فعالیت</th>
        <td colspan="3" class="p-2 border">{{ form.description }}</td>
      </tr>

      <tr>
        <th class="text-right p-2 bg-gray-50 border">امکانات</th>
        <td colspan="3" class="p-2 border">{{ form.services }}</td>
      </tr>

      </tbody>
    </table>

  </div>
</template>

<script>
import Input from "../../Input";
import errorParser from "~/mixins/error_parser";

export default {
  name: "PanelBusinessEditInfo",
  components: {Input},
  mixins: [errorParser],
  props: {
    value: {
      type: Object,
      required: true
    },
    exist: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      open: !this.exist,
      users: [],
      form: {
        owner_id: '',
        name: '',
        guild_id: '',
        description: '',
        services: '',
        link: '',
        editable_link: true
      },
      link: '',
      linkIsValid: '',
      timeout: null
    }
  },
  async fetch() {
    await this.$store.dispatch('guild/load')

    if (!this.isAdmin) {
      return
    }
    await this.$axios.$get('admin/users?all=1')
      .then(response => {
        this.users = response.map(x => ({
          id: x.id, name: x.phone
        }))
      })
  },
  computed: {
    isAdmin() {
      return this.$store.state.user.data.roles.findIndex(x => x.name === 'super-admin') >= 0
    },
    url() {
      return this.isAdmin ? `admin/businesses/${this.$route.params.id}` : `home/business/${this.$route.params.id}`
    },
    guild() {
      return this.form.guild_id ? this.$store.state.guild.list.find(x => x.id === this.form.guild_id) : null
    },
    formData() {
      return this.isAdmin
        ? {
          owner_id: this.form.owner_id,
          name: this.form.name,
          guild_id: this.form.guild_id,
          description: this.form.description,
          services: this.form.services,
          link: this.form.link,
          editable_link: this.form.editable_link,
        }
        : {
          name: this.form.name,
          guild_id: this.form.guild_id,
          description: this.form.description,
          services: this.form.services,
          link: this.form.link
        }
    }
  },
  watch: {
    value() {
      this.parseValue()
    }
  },
  created() {
    this.parseValue()
  },
  methods: {
    parseValue() {
      if (this.isAdmin) {
        this.form.owner_id = this.value.owner_id
        this.form.editable_link = this.value.editable_link
      }
      this.form.name = this.value.name
      this.form.guild_id = this.value.guild_id
      this.form.description = this.value.description
      this.form.services = this.value.services
      this.form.link = this.value.link
      this.link = this.value.link
    },
    checkLink() {
      this.$emit('input', this.formData)

      if (this.form.link && this.form.link !== this.link) {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.linkIsValid = 'checking'
        this.timeout = setTimeout(() => {
            this.$axios.$post('home/check-business-link',{link: this.form.link, id: this.$route.params?.id})
              .then(response => {
                this.linkIsValid = true
              })
              .catch(error => {
                if (error.response.status === 422) {
                  this.linkIsValid = error.response.data.errors.link[0]
                }
              })
          },
          2000
        )
      }
    },
    submit() {
      this.$axios.$put(this.url, this.formData)
        .then(() => {
          this.$store.commit('notification/success', 'اطلاعات کسب و کار با موفقیت بروزرسانی شد.')
        })
        .catch(error => this.showError(error))
    }
  }
}
</script>
